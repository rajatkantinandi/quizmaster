import { Category, Quiz } from '../types';
import Papa from 'papaparse';
import { getRandomId } from './dataCreator';
import { useStore } from '../useStore';
import { track } from './track';
import { TrackingEvent } from '../constants';

export const getCSVExportContentForQuiz = (quiz: Quiz) => {
  const fileName = `${quiz.name}.csv`;
  let fileContents = '';

  for (let category of quiz.categories) {
    fileContents += `"Category name","${category.categoryName}"\n""\n`;

    for (let [idx, question] of category.questions.entries()) {
      fileContents += `"Question ${idx + 1}","Points",${question.options
        .map((o, i) => `"Option ${i + 1} ${o.isCorrect ? ' ✅' : ''}"`)
        .join(',')}
"${question.text}","${question.points}",${question.options.map((o) => `"${o.text}"`).join(',')}\n""\n`;
    }

    fileContents += '""\n';
  }

  return { fileContents, fileName };
};

export const downloadQuiz = (quiz: Quiz) => {
  const { fileContents, fileName } = getCSVExportContentForQuiz(quiz);

  track(TrackingEvent.DOWNLOAD_QUIZ, {
    quizName: quiz.name,
    isAddedFromCatalog: !!quiz.isAddedFromCatalog,
    numOfCategories: quiz.categories.length,
    numOfQuestions: quiz.categories.reduce((sum, curr) => sum + curr.questions.length, 0),
  });

  const blob = new Blob([fileContents], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
  link.remove();
};

const addParsedCsvDataToMyQuizzes = async (csvArray: string[][], name: string) => {
  const { createOrUpdateQuiz, getQuizzes, showAlert } = useStore.getState();
  let quiz: Omit<Quiz, 'quizId'>;

  try {
    quiz = getQuizFromCsv(csvArray, name);
  } catch (e) {
    showAlert({ message: 'Invalid file format. Please check the file and try again.', type: 'error' });
    return;
  }

  if (quiz.categories.length > 0) {
    const savedQuiz = await createOrUpdateQuiz(quiz);
    getQuizzes(); // Update state
    return savedQuiz.quizId;
  }
};

export const importQuizzes = (files: File[]) => {
  for (let file of files) {
    if (file.name.endsWith('.csv')) {
      Papa.parse<string[]>(file as any, {
        complete: async (results) => {
          await addParsedCsvDataToMyQuizzes(results.data, file.name.split('.')[0]);
        },
      });
    } else if (file.name.endsWith('.json')) {
      const fileReader = new FileReader();
      fileReader.onload = async (ev) => {
        const text = ev.target?.result;

        if (text && typeof text === 'string') {
          const { createOrUpdateQuiz, getQuizzes, showAlert } = useStore.getState();

          try {
            const json = JSON.parse(text);
            const quiz = getQuizFromJSON(json);

            if (quiz.categories.length > 0) {
              const savedQuiz = await createOrUpdateQuiz(quiz);
              getQuizzes(); // Update state
              return savedQuiz.quizId;
            }
          } catch (err: any) {
            showAlert({ message: 'Invalid json file. Please check the file and try again.', type: 'error' });
          }
        }
      };
      fileReader.readAsText(file);
    }
  }
};

const getQuizFromCsv = (csvArray: string[][], name: string) => {
  const quiz: Omit<Quiz, 'quizId'> = {
    name,
    categories: [],
    createDate: new Date().toISOString(),
    updateDate: new Date().toISOString(),
  };
  let currentCategory: Category | null = null;

  for (let [index, csvRow] of csvArray.entries()) {
    if (csvRow[0] === 'Category name') {
      currentCategory = {
        categoryName: csvRow[1],
        categoryId: getRandomId(),
        questions: [],
      };
      quiz.categories.push(currentCategory);
    } else if (csvRow[0].startsWith('Question') && !!currentCategory) {
      const questionArray = csvArray[index + 1];
      const question = {
        text: questionArray[0],
        points: parseInt(questionArray[1]),
        options: questionArray
          .slice(2)
          .map((o, idx) => ({ optionId: getRandomId(), text: o, isCorrect: csvRow[2 + idx].includes('✅') })),
        questionId: getRandomId(),
        categoryId: currentCategory.categoryId,
      };
      currentCategory.questions.push(question);
    }
  }

  return quiz;
};

type QuizJSON = {
  title: string;
  questions: {
    id: number;
    text: string;
    options: string[];
    correctAnswer: string;
    points: number;
  }[];
};

const getQuizFromJSON = (quizJson: QuizJSON) => {
  const quiz: Omit<Quiz, 'quizId'> = {
    name: quizJson.title,
    categories: [
      {
        categoryName: 'Default',
        categoryId: getRandomId(),
        questions: [],
      },
    ],
    createDate: new Date().toISOString(),
    updateDate: new Date().toISOString(),
  };

  for (let question of quizJson.questions) {
    const questionToAdd = {
      text: question.text,
      points: question.points,
      options: question.options.map((o, idx) => ({
        optionId: getRandomId(),
        text: o,
        isCorrect: o === question.correctAnswer,
      })),
      questionId: getRandomId(),
      categoryId: quiz.categories[0].categoryId,
    };

    quiz.categories[0].questions.push(questionToAdd);
  }

  return quiz;
};

export const getQuizFromCatalog = (name: string): Promise<Omit<Quiz, 'quizId'>> => {
  return new Promise((resolve) => {
    const url = process.env.REACT_APP_CATALOG_BASE_URL + encodeURIComponent(name) + '.csv';

    Papa.parse<string[]>(url, {
      download: true,
      complete: async (results) => {
        const quiz = getQuizFromCsv(results.data, name);
        resolve({ ...quiz, isAddedFromCatalog: true });
      },
    });
  });
};

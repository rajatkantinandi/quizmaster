import { Category, Quiz } from '../types';
import Papa from 'papaparse';
import { getRandomId } from './dataCreator';
import { useStore } from '../useStore';

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

  const blob = new Blob([fileContents], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
  link.remove();
};

export const importQuizzes = (files: File[]) => {
  const { createOrUpdateQuiz, getQuizzes } = useStore.getState();

  for (let file of files) {
    Papa.parse<string[]>(file as any, {
      complete: async (results) => {
        const quiz = getQuizFromCsv(results.data, file.name.split('.')[0]);

        await createOrUpdateQuiz(quiz);
        getQuizzes(); // Update state
      },
    });
  }
};

const getQuizFromCsv = (csvArray: string[][], name: string) => {
  const quiz: Quiz = {
    name,
    categories: [],
    quizId: getRandomId(),
    createDate: new Date().toISOString(),
    updateDate: new Date().toISOString(),
  };
  let currentCategory: Category = {
    categoryName: '',
    categoryId: getRandomId(),
    questions: [],
  };

  for (let [index, csvRow] of csvArray.entries()) {
    if (csvRow[0] === 'Category name') {
      currentCategory.categoryId = getRandomId();
      currentCategory.categoryName = csvRow[1];
      quiz.categories.push(currentCategory);
    } else if (csvRow[0].startsWith('Question')) {
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

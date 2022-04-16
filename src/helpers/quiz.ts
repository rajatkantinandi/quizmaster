import { Quiz, Category } from '../types';
import db from './db';

const quizzesC = db.collection('quizzes');
const quizRun = db.collection('quizRun');

export const saveQuiz = async ({ name, categories, id, isDraft, userName }: Quiz) => {
  const existing = await quizzesC.findOne({ _id: id });

  if (existing) {
    await quizzesC.update({ _id: id }, { name, categories, isDraft, userName });
  } else {
    await quizzesC.insert({ name, categories, _id: id, isDraft, userName });
  }
};

// export const getQuizzes = async (userName: string): Promise<Quiz[]> => {
//   const quizzes = (await quizzesC.find({}).toArray()).map(({ _id, ...q }: any) => ({ ...q, id: _id }));
//   const updatedQuizzes = await addMissingUserNameToQuizzes(userName, quizzes);

//   return updatedQuizzes.filter(q => q.userName === userName);
// }

export const getQuiz = async (_id: string) => {
  return quizzesC.findOne({ _id });
};

export const saveGame = async (
  _id: string,
  {
    attemptedQuestions,
    quizId,
    quizName,
    isComplete,
    currentTeamId,
    teams,
    questionTimer,
    questionSelectionTimer,
  }: {
    attemptedQuestions: {
      id: string;
      isCorrect: boolean;
    }[];
    quizId: string;
    quizName: string;
    isComplete: boolean;
    currentTeamId: string;
    teams: {
      name: string;
      id: string;
      score: number;
    }[];
    questionTimer: number;
    questionSelectionTimer: number;
  },
) => {
  const existing = await quizRun.findOne({ _id });

  if (existing) {
    await quizRun.update(
      { _id },
      {
        attemptedQuestions,
        quizId,
        quizName,
        isComplete,
        currentTeamId,
        teams,
        questionTimer,
        questionSelectionTimer,
      },
    );
  } else {
    await quizRun.insert({
      attemptedQuestions,
      quizId,
      quizName,
      isComplete,
      currentTeamId,
      teams,
      questionTimer,
      questionSelectionTimer,
      _id,
    });
  }
};

export const getQuizRun = async (quizId: string) => {
  return quizRun.findOne({
    quizId,
    isComplete: false,
  });
};

// const addMissingUserNameToQuizzes = async (userName: string, quizzes: Quiz[]) => {
//   return Promise.all(quizzes.map(async quiz => {
//     if (!quiz.userName) {
//       quiz = { ...quiz, userName };
//       await quizzesC.update({ _id: quiz.id }, quiz);
//     }

//     return quiz;
//   }));
// }

export const formatQuizzesData = (quizzes: any[]) => {
  const data: any[] = [];

  quizzes.forEach((quiz: any) => {
    const index = data.findIndex((x: any) => x.id === quiz.QuizId);
    const option = {
      optionId: quiz.OptionId,
      text: quiz.OptionText || '',
      isCorrect: quiz.IsCorrect,
    };
    const options = quiz.OptionId ? [option] : [];
    const question = {
      id: quiz.QuestionId,
      points: quiz.Points,
      text: quiz.Text,
      options,
    };
    const category = {
      categoryId: quiz.CategoryId,
      name: quiz.CategoryName || '',
      questions: [question],
    };
    const quizData = {
      id: quiz.QuizId,
      name: quiz.Name,
      isDraft: quiz.IsDraft,
      categories: [category],
    };

    if (index < 0) {
      data.push(quizData);
    } else {
      const { categories } = data[index];
      const catIndex = categories.findIndex((x: any) => x.categoryId === quiz.CategoryId);

      if (catIndex < 0) {
        categories.push(category);
      } else {
        const { questions } = categories[catIndex];
        const qIndex = questions.findIndex((x: any) => x.id === quiz.QuestionId);

        if (qIndex < 0) {
          questions.push(question);
        } else {
          const { options } = categories[catIndex].questions[qIndex];
          const oIndex = options.findIndex((x: any) => x.optionId === quiz.OptionId);

          if (oIndex < 0) {
            options.push(option);
          }
        }
      }
    }
  });

  return data;
};

export const formatGameData = (gameData: any) => {
  const data: any = gameData.reduce((acc: any, game: any) => {
    const team = {
      teamId: game.TeamId,
      name: game.TeamName,
      score: game.Score,
      selectedOptions: game.SelectedOptionId
        ? {
            [game.QuestionId]: game.SelectedOptionId,
          }
        : {},
    };

    if (Object.keys(acc).length === 0) {
      return {
        gameId: game.GameId,
        winnerTeamId: game.WinnerTeamId,
        currentTeamId: game.CurrentTeamId,
        timeLimit: game.TimeLimit,
        selectionTimeLimit: game.SelectionTimeLimit,
        isComplete: game.IsComplete,
        teams: [team],
      };
    } else {
      const index = acc.teams.findIndex((team: any) => team.teamId === game.TeamId);

      if (index < 0) {
        acc.teams.push(team);
      } else if (game.SelectedOptionId) {
        acc.teams[index].selectedOptions[game.QuestionId] = game.SelectedOptionId;
      }

      return acc;
    }
  }, {});

  data.quiz = formatQuizzesData(gameData)[0];

  return data;
};

export const formatCategoryInfo = (categories: Category[], categoryIds: (string | number)[]) => {
  return categoryIds.reduce((acc, id) => {
    const category = categories.find((cat) => cat.categoryId === id);

    if (category) {
      acc[id] = category;
    }

    return acc;
  }, {} as { [key: string]: Category });
};

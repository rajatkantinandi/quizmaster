import {
  getQuizzes,
  post,
  get as getReq,
  formatQuizzesData,
  saveQuizzes,
  getQuiz,
  saveQuiz,
  postBeaconReq,
  saveQuestion,
  addGame,
  getGame,
  formatGameData,
  saveGame,
  updateGame,
  unDraftQuiz,
  isGuestUser,
  fixQuizData,
  deleteQuizzes,
  publishQuizzes,
  getInCompletedGameByQuizId,
  markGameCompleted,
} from '../helpers';
import { GameData, PreviewQuiz, Quiz } from '../types';

export const getQuizStore = (set: Function, get: Function) => ({
  quizzes: [],
  searchQuery: '',
  catalogList: null as CatalogListItem[] | null,
  getQuizzes: async () => {
    if (isGuestUser()) {
      const response: any = await getQuizzes(-1);
      const sortedData = response.sort(
        (quiz1, quiz2) => new Date(quiz2.updateDate).getTime() - new Date(quiz1.updateDate).getTime(),
      );

      set((state: QuizState) => {
        state.quizzes = sortedData;
      });

      return sortedData;
    } else {
      const response = await getReq('quiz/userQuizzes');
      const data = formatQuizzesData(response);
      const sortedData = data.sort(
        (quiz1, quiz2) => new Date(quiz2.updateDate).getTime() - new Date(quiz1.updateDate).getTime(),
      );

      await saveQuizzes(sortedData);
      set((state: QuizState) => {
        state.quizzes = sortedData;
      });

      return sortedData;
    }
  },
  getQuiz: async (quizId: number | string, isPreview: boolean) => {
    if (isPreview) {
      return get().previewQuiz;
    }

    const quizIdNum = parseInt(quizId.toString());

    if (isGuestUser()) {
      return getQuizFromLocalDB(quizIdNum);
    } else {
      try {
        const response = await getReq('quiz/data', { quizId: quizIdNum });
        const data = formatQuizzesData(response)[0];

        await saveQuiz(data);
        return fixQuizData(data);
      } catch (err) {
        return getQuizFromLocalDB(quizIdNum);
      }
    }
  },
  createOrUpdateQuiz: async (data) => {
    if (data.isPreview) {
      set((state: QuizState) => {
        state.previewQuiz = data;
      });
    } else if (isGuestUser()) {
      const response: any = await saveQuizInLocalDB(data);

      return response;
    } else {
      const response = await post('quiz/createOrUpdate', data);
      await saveQuiz(response);

      return response;
    }
  },
  updateQuizName: async (data) => {
    if (data.isPreview) {
      set((state: QuizState) => {
        state.previewQuiz = data;
      });
    } else if (isGuestUser()) {
      const response: any = await saveQuizInLocalDB(data);
      return response;
    } else {
      await post('quiz/edit', data);
      data.updateDate = new Date().toISOString();
      await saveQuiz(data);

      return data;
    }
  },
  sendBeaconPost: async (data) => {
    if (isGuestUser()) {
      const response: any = await saveQuizInLocalDB(data);

      return response;
    } else {
      if ('sendBeacon' in navigator) {
        await postBeaconReq('quiz/createOrUpdate', data);

        data.updateDate = new Date().toISOString();
        await saveQuiz(data);
      } else {
        const response = await post('quiz/createOrUpdate', data);
        await saveQuiz(response);

        return response;
      }
    }
  },
  editQuestion: async (data, quizId: string | number) => {
    if (isGuestUser()) {
      await saveQuestion(data, quizId);
    } else {
      const response = await post('question/edit', data);

      await saveQuestion(
        {
          questionId: response.QuestionId,
          text: response.Text,
          points: response.Points,
          options: response.Options,
          categoryId: data.categoryId,
        },
        quizId,
      );
    }
  },
  addGame: async (data) => {
    if (isGuestUser()) {
      data.isComplete = false;
      const response = await addGame(data);

      return response;
    } else {
      const response = await post('game/add', data);
      response.teams.forEach((x) => {
        x.selectedOptions = [];
      });

      await addGame(response);

      return response;
    }
  },
  getGameData: async (gameId: number) => {
    try {
      const response = await getGame(gameId);

      return response;
    } catch (err) {
      const response = await getReq('game/data', { gameId });
      const data = formatGameData(response);
      await saveGame(data);

      return data;
    }
  },
  updateGame: async (data: GameData) => {
    if (isGuestUser()) {
      const response = await updateGame(data);

      return response;
    } else {
      const response = await post('game/edit', data);

      await updateGame(data);
      return response;
    }
  },
  markGameCompleted: async (gameId: number) => {
    if (!isGuestUser()) {
      await post('game/markgamecompleted', { gameId });
    }

    await markGameCompleted(gameId);
  },
  unDraftQuiz: async (quizId: string | number) => {
    if (!isGuestUser()) {
      await post('quiz/unDraft', { quizId });
    }

    await unDraftQuiz(quizId);
  },
  searchQuiz: (queryString: string) => {
    set((state: QuizState) => {
      state.searchQuery = queryString;
    });
  },
  clearSearch: () => {
    set((state: QuizState) => {
      state.searchQuery = '';
    });
  },
  deleteQuizzes: async (quizIds) => {
    if (!isGuestUser()) {
      await post('quiz/delete', { quizIds });
    }

    await deleteQuizzes(quizIds);
    set((state: QuizState) => {
      state.quizzes = state.quizzes.filter((quiz) => !quizIds.includes(quiz.quizId));
    });
  },
  publishQuizzes: async (quizIds) => {
    if (!isGuestUser()) {
      await post('quiz/publish', { quizIds });
    }

    await publishQuizzes(quizIds);
    set((state: QuizState) => {
      state.quizzes = state.quizzes.map((quiz) => {
        if (quizIds.includes(quiz.quizId)) {
          quiz.isPublished = true;
        }

        return quiz;
      });
    });
  },
  sortQuizzes: (sortBy) => {
    set((state: QuizState) => {
      state.quizzes = getSortedQuizzes(sortBy, state.quizzes);
    });
  },
  sortCatalogQuizzes: (sortBy) => {
    set((state: QuizState) => {
      state.catalogList = getSortedQuizzes(sortBy, state.catalogList || []);
    });
  },
  getInCompletedGame: async (quizId) => {
    if (isGuestUser()) {
      const response = await getInCompletedGameByQuizId(quizId);

      return response;
    } else {
      const response = await getReq('game/getincompletedgamebyquizid', { quizId });

      return response;
    }
  },
  getCatalogList: async () => {
    if (!get().catalogList) {
      const catalogList = await fetchCatalogList();

      set((state: QuizState) => {
        state.catalogList = catalogList;
      });
    }
  },
  previewQuiz: null as PreviewQuiz | null,
  updatePreviewQuiz: (data: PreviewQuiz | null) => {
    set((state: QuizState) => {
      state.previewQuiz = data;
    });
  },
});

function getSortedQuizzes(sortBy, data) {
  switch (sortBy) {
    case 'createDate':
      return data.sort((quiz1, quiz2) => new Date(quiz2.createDate).valueOf() - new Date(quiz1.createDate).valueOf());
    case 'name':
      return data.sort((quiz1, quiz2) => quiz1.name.localeCompare(quiz2.name));
    case 'recency':
    default:
      return data.sort((quiz1, quiz2) => new Date(quiz2.updateDate).valueOf() - new Date(quiz1.updateDate).valueOf());
  }
}

async function getQuizFromLocalDB(quizId) {
  const response = await getQuiz(quizId);

  return fixQuizData(response);
}

async function saveQuizInLocalDB(data) {
  data.userId = -1;
  data.updateDate = new Date().toISOString();

  if (data.quizId) {
    data.quizId = parseInt(data.quizId.toString(), 10);
  }

  const response: any = await saveQuiz(data);

  return response;
}

export interface QuizState extends Omit<ReturnType<typeof getQuizStore>, 'quizzes'> {
  quizzes: Quiz[];
  searchQuery: string;
}

const CATALOG_LIST_FILE_NAME = 'catalogList.json';
const CATALOG_LIST_URL = `${process.env.REACT_APP_CATALOG_BASE_URL}${CATALOG_LIST_FILE_NAME}`;

const fetchCatalogList = async () => {
  const response = await fetch(CATALOG_LIST_URL);
  const data = await response.json();
  return data;
};

export type CatalogListItem = {
  name: string;
  numOfCategories: number;
  numOfQuestions: number;
  createDate: string;
  quizId: number;
};

import zango from 'zangodb';

export default new zango.Db('quizDB', 2, {
  quizzes: ['name', 'categories', 'isDraft', 'userId', 'numberOfQuestionsPerCategory', 'quizId'],
  games: ['gameId', 'quizId', 'timeLimit', 'selectionTimeLimit', 'teams'],
});

import zango from 'zangodb';

export default new zango.Db('quizDB', 2, {
  users: ['userId', 'passwordHash', 'salt'],
  quizzes: ['name', 'categories', 'isDraft', 'userId', 'numberOfQuestionsPerCategory'],
  games: ['gameId', 'quizId', 'timeLimit', 'selectionTimeLimit', 'teams'],
});

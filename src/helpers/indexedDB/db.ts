import zango from 'zangodb';

export default new zango.Db('quizDB', 2, {
  quizzes: ['name', 'categories', 'isDraft', 'userId', 'quizId', 'createDate', 'isPublished', 'updateDate'],
  games: ['gameId', 'quizId', 'timeLimit', 'selectionTimeLimit', 'teams'],
});

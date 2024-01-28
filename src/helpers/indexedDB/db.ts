import zango from 'zangodb';

const dbInstance = new zango.Db('quizDB', 2, {
  quizzes: ['name', 'categories', 'isDraft', 'userId', 'quizId', 'createDate', 'isPublished', 'updateDate'],
  games: ['gameId', 'quizId', 'timeLimit', 'selectionTimeLimit', 'teams'],
});

export default dbInstance;

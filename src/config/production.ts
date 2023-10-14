import { IConfig } from './types';

const config: IConfig = {
  env: 'production',
  productName: 'Quiz Master',
  productUrl: 'https://web.quizmasterapp.in',
  backendUrl: 'https://api.quizmasterapp.in',
  // TODO: change branch name to main when deployed to production
  catalogDataBaseUrl: 'https://raw.githubusercontent.com/rajatkantinandi/quizmaster/v2/data/',
};

export default config;

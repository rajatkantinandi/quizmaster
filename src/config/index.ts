import local from './local';
import production from './production';
import { IConfig } from './types';

function getConfig(): IConfig {
  if (window.location.hostname === 'localhost') {
    return local;
  } else {
    return production;
  }
}

export default getConfig();

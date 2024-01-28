import local from './local';
import production from './production';
import staging from './staging';
import { IConfig } from './types';

function getConfig(): IConfig {
  if (window.location.hostname === 'localhost') {
    return local;
  } else if (window.location.hostname.includes('web.quizmasterapp')) {
    return production;
  } else {
    return staging;
  }
}

export default getConfig();

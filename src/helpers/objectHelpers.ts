import { toCamelCaseFromPascalCase } from './textHelpers';

export const getParamsInCamelCase = (json: any): any => {
  if (json && typeof json === 'object') {
    if (Array.isArray(json)) {
      return json.map((item) => getParamsInCamelCase(item));
    } else {
      const keys = Object.keys(json);
      const convertedObj: { [key: string]: any } = {};

      keys.forEach((key) => {
        convertedObj[toCamelCaseFromPascalCase(key)] = getParamsInCamelCase(json[key]);
      });

      return convertedObj;
    }
  } else {
    return json;
  }
};

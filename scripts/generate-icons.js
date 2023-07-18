const fs = require('fs');

const fileNames = fs.readdirSync('src/images/icons');

const iconsWithoutExtensions = fileNames
  .filter(name => name.endsWith('.svg'))
  .map(name => name.split('.').slice(0, -1).join('.'));

let iconsImportsString = `/**
 * 
 * This is a auto-generated file. Do not edit this manually.
 * To add new icon add the svg file to the app/images/icons folder 
 * and run 'npm run generate-icons' to generate this file.
 * 
 * */
`;
let iconsExportString = `

/* eslint-disable @typescript-eslint/naming-convention */
const icons = {`;

iconsWithoutExtensions.forEach(i => {
  iconsImportsString += `
import { ReactComponent as ${i}} from '../../images/icons/${i}.svg';`;
  iconsExportString += `
  ${i},`;
});

iconsExportString += '\n};\n\nexport default icons;';

fs.writeFileSync('src/components/Icon/icons.tsx', iconsImportsString + iconsExportString);
console.log('Updated icons file successfully!');
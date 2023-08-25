/**
 * Export a json quiz from a file to csv quiz file, pass file name as argument
 * @example npx ts-node convertQuizToCSV.ts ~/Downloads/quiz.json
 * This will create a csv file in the same directory as the quiz.json file
 * with file name = <the quiz name in the json>.csv
 */
const { getCSVExportContentForQuiz } = require('../src/helpers/importExport');
const fs = require('fs');

const inputFileName = process.argv[2];
const inputDirectory = inputFileName.split('/').slice(0, -1).join('/');

fs.readFile(inputFileName, 'utf8', (err: any, data: any) => {
  if (err) throw err;

  try {
    const parsedData = JSON.parse(data);
    const { fileName, fileContents } = getCSVExportContentForQuiz(parsedData);

    fs.writeFile(inputDirectory + '/' + fileName, fileContents, (err: any) => {
      if (err) throw err;
      console.log(`File ${fileName} saved!`);
    });
  } catch (err) {
    console.log('Invalid input file');
  }
});

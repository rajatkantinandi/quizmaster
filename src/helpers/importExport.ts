import { Quiz } from '../types';

export const getCSVExportContentForQuiz = (quiz: Quiz) => {
  const fileName = `${quiz.name}.csv`;
  let fileContents = '';

  for (let category of quiz.categories) {
    fileContents += `"Category name","${category.categoryName}"\n""\n`;

    for (let [idx, question] of category.questions.entries()) {
      fileContents += `"Question ${idx + 1}","Points",${question.options
        .map((o, i) => `"Option ${i + 1} ${o.isCorrect ? ' ✅' : ''}"`)
        .join(',')}
"${question.text}","${question.points}",${question.options.map((o) => `"${o.text}"`).join(',')}\n""\n`;
    }

    fileContents += '""\n';
  }

  return { fileContents, fileName };
};

export const downloadQuiz = (quiz: Quiz) => {
  const { fileContents, fileName } = getCSVExportContentForQuiz(quiz);

  const blob = new Blob([fileContents], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
  link.remove();
};

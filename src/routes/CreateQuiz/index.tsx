import { nanoid } from 'nanoid';
import React, { useState } from 'react';
import Question from '../../components/Question';
import QuizGrid from '../../components/QuizGrid';
import { generateEmptyQuestions } from '../../helpers/question';
import { useLoginCheck } from '../../hooks/useLoginCheck';
import { Question as IQuestion } from '../../types';
import ConfigureQuiz from './ConfigureQuiz';

export default function CreateQuiz() {
  useLoginCheck();
  const [name, setName] = useState('');
  const [numberOfQuestionsPerCategory, setNumberOfQuestionsPerCategory] = useState(5);
  const [categoriesInfo, setCategoriesInfo] = useState([
    { name: '', id: nanoid(), questions: generateEmptyQuestions(numberOfQuestionsPerCategory) },
    { name: '', id: nanoid(), questions: generateEmptyQuestions(numberOfQuestionsPerCategory) },
    { name: '', id: nanoid(), questions: generateEmptyQuestions(numberOfQuestionsPerCategory) },
  ]);
  const [isConfigured, setIsConfigured] = useState(false);
  const [isQuestionGridExpanded, setIsQuestionGridExpanded] = useState(true);
  const [selectedQuestion, setSelectedQuestion] = useState<IQuestion | null>(null);

  return (
    <>
      {!isConfigured && (
        <ConfigureQuiz
          categoriesInfo={categoriesInfo}
          setCategoriesInfo={setCategoriesInfo}
          setIsConfigured={setIsConfigured}
          setName={setName}
          name={name}
          setNumberOfQuestionsPerCategory={setNumberOfQuestionsPerCategory}
          numberOfQuestionsPerCategory={numberOfQuestionsPerCategory}
        />
      )}
      {isConfigured && (
        <div className="flex">
          <QuizGrid
            categoriesInfo={categoriesInfo}
            showQuestion={(id, categoryId) => {
              const category = categoriesInfo.find((category) => category.id === categoryId);

              if (category) {
                const question = category.questions.find((q) => q.id === id);

                setSelectedQuestion(question || null);
                setIsQuestionGridExpanded(false);
              }
            }}
            isExpanded={isQuestionGridExpanded}
            quizName={name}
            setIsExpanded={setIsQuestionGridExpanded}
            selectedQuestionId={selectedQuestion?.id || ''}
          />
          {!isQuestionGridExpanded && !!selectedQuestion && (
            <Question text={selectedQuestion.text} options={selectedQuestion.options} />
          )}
        </div>
      )}
    </>
  );
}

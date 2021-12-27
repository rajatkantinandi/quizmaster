import { nanoid } from 'nanoid';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Button, Divider } from 'semantic-ui-react';
import QuestionEdit from '../../components/QuestionEdit';
import QuizGrid from '../../components/QuizGrid';
import { generateEmptyQuestions } from '../../helpers/question';
import { getQuiz, saveQuiz } from '../../helpers/quiz';
import { useLoginCheckAndPageTitle } from '../../hooks/useLoginCheckAndPageTitle';
import { Question as IQuestion, Question } from '../../types';
import ConfigureQuiz from './ConfigureQuiz';

export default function AddEditQuiz() {
  const { id, userName } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  useLoginCheckAndPageTitle(name);
  const [quizId] = useState(id || nanoid());
  const [numberOfQuestionsPerCategory, setNumberOfQuestionsPerCategory] = useState(5);
  const [categoriesInfo, setCategoriesInfo] = useState([
    { name: '', id: nanoid(), questions: generateEmptyQuestions(numberOfQuestionsPerCategory) },
    { name: '', id: nanoid(), questions: generateEmptyQuestions(numberOfQuestionsPerCategory) },
    { name: '', id: nanoid(), questions: generateEmptyQuestions(numberOfQuestionsPerCategory) },
  ]);
  const [isConfigured, setIsConfigured] = useState(false);
  const [isQuestionGridExpanded, setIsQuestionGridExpanded] = useState(true);
  const [selectedQuestion, setSelectedQuestion] = useState<IQuestion | null>(null);

  useEffect(() => {
    if (id) {
      getQuiz(id).then((quiz: any) => {
        setName(quiz.name);

        if (quiz.categories && quiz.categories.length > 0) {
          setCategoriesInfo(quiz.categories);
          setNumberOfQuestionsPerCategory(quiz.categories[0].questions.length);
        }
      });
    }
  }, [id]);

  useEffect(() => {
    if (name && categoriesInfo.length >= 2 && quizId) {
      saveQuiz({ name, categories: categoriesInfo, id: quizId, isDraft: true });
    }
  }, [categoriesInfo, name, quizId]);

  async function finishQuiz() {
    if (name && categoriesInfo.length >= 2 && quizId) {
      await saveQuiz({ name, categories: categoriesInfo, id: quizId, isDraft: false });
      alert('Quiz save. Lets play now!');
      navigate(`/quizzes/${userName}`);
    }
  }

  function saveQuestion(questionId: string, { text, options, correctOptionId, point }: any) {
    const correctOption = options.find((o: any) => o.id === correctOptionId);

    if (correctOption) {
      const correctOptionHash = btoa(correctOption.optionText);
      setCategoriesInfo(
        categoriesInfo.map((category) => {
          if (category.questions.some((q) => q.id === questionId)) {
            return {
              ...category,
              questions: category.questions.map((q) => {
                if (q.id === questionId) {
                  return { text, id: questionId, correctOptionHash, options, point: point || q.point };
                } else {
                  return q;
                }
              }),
            };
          } else {
            return category;
          }
        }),
      );
    }
  }

  function getSavedQuestionIds() {
    const allQuestions = categoriesInfo.reduce((acc, curr) => [...acc, ...curr.questions], [] as Question[]);

    return allQuestions.filter((q) => !!q.correctOptionHash && q.options.length >= 2 && !!q.text).map((q) => q.id);
  }

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
        <div className="flex justifyCenter">
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
            savedQuestionIds={getSavedQuestionIds()}
          />
          {!isQuestionGridExpanded && !!selectedQuestion && (
            <QuestionEdit
              key={selectedQuestion.id}
              saveQuestion={(data: any) => saveQuestion(selectedQuestion.id, data)}
              text={selectedQuestion.text}
              options={selectedQuestion.options}
              correctOptionId={
                selectedQuestion.options.find((o) => o.optionText === atob(selectedQuestion.correctOptionHash))?.id
              }
              point={selectedQuestion.point}
            />
          )}
        </div>
      )}
      {isConfigured && (
        <>
          <Divider />
          <div className="flex justifyCenter">
            <Button color="blue" className="mr-xl" size="large" onClick={() => setIsConfigured(false)}>
              Configure Quiz
            </Button>
            <Button color="youtube" size="large" onClick={finishQuiz}>
              Finish Quiz
            </Button>
          </div>
        </>
      )}
    </>
  );
}

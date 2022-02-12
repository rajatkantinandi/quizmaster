import { nanoid } from 'nanoid';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Button, Divider } from 'semantic-ui-react';
import QuestionEdit from '../../components/QuestionEdit';
import QuizGrid from '../../components/QuizGrid';
import { generateEmptyQuestions } from '../../helpers/question';
import { getQuiz, saveQuiz } from '../../helpers/quiz';
import { useLoginCheckAndPageTitle } from '../../hooks/useLoginCheckAndPageTitle';
import { Category, Question as IQuestion, Question } from '../../types';
import { useAppStore } from '../../useAppStore';
import ConfigureQuiz from './ConfigureQuiz';

export default function AddEditQuiz() {
  const { id, userName = 'guest' } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  useLoginCheckAndPageTitle(name);
  const [quizId] = useState(id || nanoid());
  const [numberOfQuestionsPerCategory, setNumberOfQuestionsPerCategory] = useState(5);
  const [categoriesInfo, setCategoriesInfo] = useState([
    { name: '', id: nanoid(), questions: generateEmptyQuestions(5) },
    { name: '', id: nanoid(), questions: generateEmptyQuestions(5) },
    { name: '', id: nanoid(), questions: generateEmptyQuestions(5) },
  ]);
  const [isConfigured, setIsConfigured] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<IQuestion | null>(null);
  const { showAlertModal, setConfirmationModal } = useAppStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isLoading) {
      if (id) {
        getQuiz(id).then((quiz: any) => {
          setName(quiz.name);

          if (quiz.categories && quiz.categories.length > 0) {
            setCategoriesInfo(quiz.categories);
            setNumberOfQuestionsPerCategory(quiz.categories[0].questions.length);
            const isAnyQuestionSaved = quiz.categories.some((category: Category) =>
              category.questions.some((q) => q.text.trim().length > 0),
            );
            setIsConfigured(isAnyQuestionSaved);
          }
          setIsLoading(false);
        });
      } else {
        setIsLoading(false);
        navigate(window.location.pathname + `/${quizId}`);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, quizId, isLoading]);

  useEffect(() => {
    if (name && categoriesInfo.length >= 2 && quizId) {
      saveQuiz({ name, categories: categoriesInfo, id: quizId, isDraft: true, userName });
    }
  }, [categoriesInfo, name, quizId, userName]);

  function handleFinishQuiz() {
    const totalQuestions = numberOfQuestionsPerCategory * categoriesInfo.length;
    const savedQuestionsCount = getSavedQuestionIds().length;
    const unSavedQuestionsCount = totalQuestions - savedQuestionsCount;

    if (unSavedQuestionsCount > 0) {
      setConfirmationModal({
        title: 'Finish incomplete quiz!',
        body: `There ${
          unSavedQuestionsCount > 1 ? `are ${unSavedQuestionsCount} empty questions` : 'is an empty question'
        }. 
        Do you want to finish the quiz with empty questions or cancel and and complete those questions first?`,
        okCallback: finishQuiz,
        okText: 'Finish quiz',
        cancelText: 'Cancel and complete questions',
      });
    } else {
      finishQuiz();
    }
  }

  async function finishQuiz() {
    if (name && categoriesInfo.length >= 2 && quizId) {
      await saveQuiz({ name, categories: categoriesInfo, id: quizId, isDraft: false, userName });
      showAlertModal({ title: 'Quiz saved!', message: 'Lets play now!' });
      navigate(`/quizzes/${userName}`);
    }
  }

  function saveQuestion(questionId: string, { text, options, correctOptionId, point, isWithoutOptions }: any) {
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
                  return {
                    text,
                    id: questionId,
                    correctOptionHash,
                    options,
                    point: point || q.point,
                    isWithoutOptions,
                  };
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

    return allQuestions.filter((q) => !!q.correctOptionHash && q.options.length >= 1 && !!q.text).map((q) => q.id);
  }

  return isLoading ? (
    <></>
  ) : (
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
              }
            }}
            isExpanded={!selectedQuestion}
            quizName={name}
            setIsExpanded={(expanded: boolean) => {
              if (expanded) {
                setSelectedQuestion(null);
              }
            }}
            selectedQuestionId={selectedQuestion?.id || ''}
            savedQuestionIds={getSavedQuestionIds()}
          />
          {!!selectedQuestion && (
            <QuestionEdit
              key={selectedQuestion.id}
              saveQuestion={(data: any) => saveQuestion(selectedQuestion.id, data)}
              text={selectedQuestion.text}
              options={selectedQuestion.options}
              correctOptionId={
                selectedQuestion.options.find((o) => o.optionText === atob(selectedQuestion.correctOptionHash))?.id
              }
              point={selectedQuestion.point}
              onClose={() => {
                setSelectedQuestion(null);
              }}
              withoutOptions={selectedQuestion.isWithoutOptions}
            />
          )}
        </div>
      )}
      {isConfigured && (
        <>
          <Divider />
          <div className="flex justifyCenter">
            <Button
              color="blue"
              className="mr-xl"
              size="large"
              onClick={() => {
                setIsConfigured(false);
                setSelectedQuestion(null);
              }}>
              Configure Quiz
            </Button>
            <Button color="youtube" size="large" onClick={handleFinishQuiz}>
              Finish Quiz
            </Button>
          </div>
        </>
      )}
    </>
  );
}

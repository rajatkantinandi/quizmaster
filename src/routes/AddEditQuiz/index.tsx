import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Button, Divider } from 'semantic-ui-react';
import QuestionEdit from '../../components/QuestionEdit';
import QuizGrid from '../../components/QuizGrid';
import { useLoginCheckAndPageTitle } from '../../hooks/useLoginCheckAndPageTitle';
import { Category, Question as IQuestion, QuizInfo } from '../../types';
import { useAppStore } from '../../useAppStore';
import { formatCategoryInfo } from '../../helpers/quiz';

export default function AddEditQuiz() {
  const { id, userName = 'guest' } = useParams();
  const navigate = useNavigate();
  const [quizInfo, setQuizInfo] = useState<QuizInfo>({
    quizId: '',
    name: '',
    categoryIds: [],
  });
  const [categoriesInfo, setCategoriesInfo] = useState<{ [key: string]: Category }>({});
  const [selectedQuestion, setSelectedQuestion] = useState<IQuestion | null>(null);
  const { showAlertModal, setConfirmationModal, getQuiz, editQuestion } = useAppStore();
  const [isLoading, setIsLoading] = useState(true);
  useLoginCheckAndPageTitle(quizInfo.name);

  useEffect(() => {
    if (isLoading) {
      setIsLoading(false);

      if (id) {
        getQuiz(parseInt(id)).then((quiz: any) => {
          const categoryIds = quiz.categories.map((category: any) => category.categoryId);

          setQuizInfo({
            quizId: quiz.id,
            name: quiz.name,
            categoryIds,
          });
          setCategoriesInfo(formatCategoryInfo(quiz.categories, categoryIds));
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isLoading]);

  function handleFinishQuiz() {
    const totalQuestions = Object.values(categoriesInfo).reduce((count, categoryData) => {
      return count + categoryData.questions.length;
    }, 0);
    const savedQuestionsCount = getSavedQuestionIds().length;
    const unSavedQuestionsCount = totalQuestions - savedQuestionsCount;

    if (unSavedQuestionsCount > 0) {
      setConfirmationModal({
        title: 'Finish incomplete quiz!',
        body: `There ${
          unSavedQuestionsCount > 1 ? `are ${unSavedQuestionsCount} empty questions` : 'is an empty question'
        }. 
        Do you want to finish the quiz with empty questions or cancel and and complete those questions first?`,
        cancelText: 'Cancel and complete questions',
      });
    } else {
      showAlertModal({ title: 'Quiz saved!', message: 'Lets play now!' });
      navigate(`/quizzes/${userName}`);
    }
  }

  async function saveQuestion(questionId: string, { text, options, points }: any) {
    try {
      await editQuestion({
        questionId,
        text,
        options: options.map((newOption: any) => {
          newOption.questionId = questionId;
          if (!selectedQuestion?.options.find((option) => option.optionId === newOption.optionId)) {
            delete newOption.optionId;
          }

          return newOption;
        }),
        points,
      });

      const categoryId = quizInfo.categoryIds.find((id) =>
        categoriesInfo[id].questions.find((question) => question.id === questionId),
      );

      if (categoryId) {
        const { questions } = categoriesInfo[categoryId];
        const clonedQuestions = [...questions];
        const index = questions.findIndex((question) => question.id === questionId);

        clonedQuestions[index] = {
          ...clonedQuestions[index],
          text,
          options,
          points,
        };

        setCategoriesInfo({
          ...categoriesInfo,
          [categoryId]: {
            ...categoriesInfo[categoryId],
            questions: clonedQuestions,
          },
        });
      }
    } catch (err) {
      console.log(err);
    }
  }

  function getSavedQuestionIds() {
    const allQuestions: IQuestion[] = Object.values(categoriesInfo).reduce(
      (acc: any, curr: any) => [...acc, ...curr.questions],
      [] as IQuestion[],
    );

    return allQuestions.filter((q: any) => isValidQuestion(q)).map((q: any) => q.id);
  }

  function isValidQuestion(question: IQuestion) {
    const { options } = question;
    console.log(
      'questionquestion',
      question,
      !!question.text,
      options.length > 0,
      options.some((option) => option.isCorrect),
      !options.some((option) => !option.text),
    );

    return (
      !!question.text &&
      options.length > 0 &&
      options.some((option) => option.isCorrect) &&
      !options.some((option) => !option.text)
    );
  }

  return isLoading ? (
    <></>
  ) : (
    <>
      <div className="flex justifyCenter">
        <QuizGrid
          categoriesInfo={categoriesInfo}
          showQuestion={(id, categoryId) => {
            const question = categoriesInfo[categoryId].questions.find((q: IQuestion) => q.id === id);

            setSelectedQuestion(question || null);
          }}
          isExpanded={!selectedQuestion}
          quizInfo={quizInfo}
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
            selectedQuestion={selectedQuestion}
            onClose={() => {
              setSelectedQuestion(null);
            }}
          />
        )}
      </div>
      <Divider />
      <div className="flex justifyCenter">
        <Button
          color="blue"
          className="mr-xl"
          size="large"
          onClick={() => {
            navigate(`/configure-quiz/${userName}/${quizInfo.quizId}`);
            setSelectedQuestion(null);
          }}>
          Configure Quiz
        </Button>
        <Button color="youtube" size="large" onClick={handleFinishQuiz}>
          Finish Quiz
        </Button>
      </div>
    </>
  );
}

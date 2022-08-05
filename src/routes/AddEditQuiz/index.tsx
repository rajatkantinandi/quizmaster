import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Button, Divider } from 'semantic-ui-react';
import QuestionEdit from '../../components/QuestionEdit';
import QuizGrid from '../../components/QuizGrid';
import { Category, Question as IQuestion, QuizInfo, Quiz, Option, Question } from '../../types';
import { useStore } from '../../useStore';
import { formatCategoryInfo, isInt, plural } from '../../helpers';
import { Helmet } from 'react-helmet';

export default function AddEditQuiz() {
  const { quizId, userName = 'guest' } = useParams();
  const navigate = useNavigate();
  const [quizInfo, setQuizInfo] = useState<QuizInfo>({
    quizId: '',
    name: '',
    categoryIds: [],
    numberOfQuestionsPerCategory: 5,
  });
  const [categoriesInfo, setCategoriesInfo] = useState<{ [key: string]: Category }>({});
  const [selectedQuestion, setSelectedQuestion] = useState<IQuestion | null>(null);
  const { showAlertModal, setConfirmationModal, getQuiz, editQuestion, unDraftQuiz } = useStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isLoading) {
      setIsLoading(false);

      if (quizId) {
        getQuiz(parseInt(quizId)).then((quiz: Quiz) => {
          const categoryIds = quiz.categories.map((category: Category) => category.categoryId);

          setQuizInfo({
            quizId: quiz.quizId,
            name: quiz.name,
            categoryIds,
            numberOfQuestionsPerCategory: quiz.numberOfQuestionsPerCategory,
          });
          setCategoriesInfo(formatCategoryInfo(quiz.categories, categoryIds));
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizId, isLoading]);

  async function handleFinishQuiz() {
    const totalQuestions = Object.values(categoriesInfo).reduce((count, categoryData) => {
      return count + categoryData.questions.length;
    }, 0);
    const savedQuestionsCount = getSavedQuestionIds().length;
    const unSavedQuestionsCount = totalQuestions - savedQuestionsCount;

    if (unSavedQuestionsCount > 0) {
      setConfirmationModal({
        title: 'Finish incomplete quiz!',
        body: plural(
          unSavedQuestionsCount,
          'There is an empty question. Please complete those questions first.',
          'There are %count empty questions. Please complete those questions first.',
        ),
        okText: 'Cancel and complete questions',
        cancelText: '',
      });
    } else {
      await unDraftQuiz(quizInfo.quizId);
      showAlertModal({
        title: 'Quiz saved!',
        message: 'Lets play now!',
        okCallback: () => navigate(`/quizzes/${userName}`),
      });
    }
  }

  async function saveQuestion(selectedQuestion: Question, { text, options, points }: IQuestion) {
    try {
      await editQuestion(
        {
          ...selectedQuestion,
          text,
          options: options.map((option: Option) => {
            const clonedOption: any = { ...option };
            clonedOption.questionId = selectedQuestion.questionId;

            if (!isInt(option.optionId)) {
              delete clonedOption.optionId;
            }

            return clonedOption;
          }),
          points,
        },
        quizInfo.quizId,
      );

      const categoryId = quizInfo.categoryIds.find((id) =>
        categoriesInfo[id].questions.find((question) => question.questionId === selectedQuestion.questionId),
      );

      if (categoryId) {
        const { questions } = categoriesInfo[categoryId];
        const clonedQuestions = [...questions];
        const index = questions.findIndex((question) => question.questionId === selectedQuestion.questionId);

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
      (acc: IQuestion[], curr: Category) => [...acc, ...curr.questions],
      [] as IQuestion[],
    );

    return allQuestions.filter((q: IQuestion) => isValidQuestion(q)).map((q: IQuestion) => q.questionId);
  }

  function isValidQuestion(question: IQuestion) {
    const { options } = question;

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
      <Helmet>
        <title>Add Question to Quiz</title>
      </Helmet>
      <div className="flex justifyCenter">
        <QuizGrid
          categoriesInfo={categoriesInfo}
          showQuestion={(questionId, categoryId) => {
            const question = categoriesInfo[categoryId].questions.find((q: IQuestion) => q.questionId === questionId);

            setSelectedQuestion(question ? { ...question, categoryId } : null);
          }}
          isExpanded={!selectedQuestion}
          quizInfo={quizInfo}
          setIsExpanded={(expanded: boolean) => {
            if (expanded) {
              setSelectedQuestion(null);
            }
          }}
          selectedQuestionId={selectedQuestion?.questionId || ''}
          savedQuestionIds={getSavedQuestionIds()}
          mode="edit"
        />
        {!!selectedQuestion && (
          <QuestionEdit
            key={selectedQuestion.questionId}
            saveQuestion={(data: IQuestion) => saveQuestion(selectedQuestion, data)}
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

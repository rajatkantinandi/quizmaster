import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../../useStore';
import { useForm, useFieldArray } from 'react-hook-form';
import { FormInput } from '../../components/FormInputs';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem as Radio } from '@/components/ui/radio-group';
import Icon from '../../components/Icon';
import { cn } from '@/lib/utils';
import { plural } from '../../helpers/textHelpers';
import AddOrUpdateQuizName from '../../components/AddOrUpdateQuizName';
import { useNavigate } from 'react-router';
import QuestionsListPanel from './QuestionsListPanel';
import { track } from '../../helpers/track';
import { TrackingEvent } from '../../constants';
import MoveQuestionModal from '../../components/MoveQuestionModal';
import { useSearchParams } from 'react-router-dom';
import PageLoader from '../../components/PageLoader';
import { getEmptyCategory, getEmptyQuestion } from '@/helpers';
import Modal from '../../components/Modal';
import QuestionEdit from '../../components/QuestionEdit';
import { Category, Question } from '../../types';

export type ConfigureQuizFormValues = {
  categories: Category[];
};

export default function ConfigureQuiz({
  quizId,
  userName = 'guest',
}: {
  quizId: string;
  userName: string | undefined;
}) {
  const [quizName, setQuizName] = useState('');
  const [searchParams] = useSearchParams();
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number | null>(null);
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [expandedQuestionIndex, setExpandedQuestionIndex] = useState<number | null | 'all'>(null);
  const [rearrangeMode, setRearrangeMode] = useState(false);
  const [moveQuestionModalState, setMoveQuestionModalState] = useState<{
    show: boolean;
    questionId: Question['questionId'] | null;
  }>({
    show: false,
    questionId: null,
  });
  const {
    createOrUpdateQuiz,
    getQuiz,
    sendBeaconPost,
    showAlert,
    showModal,
    updateQuizName,
    updatePreviewQuiz,
    updateQuestionCategory,
    saveCatalogQuizForPreview,
  } = useStore();
  const navigate = useNavigate();
  const {
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    control,
  } = useForm<ConfigureQuizFormValues>({
    defaultValues: {
      categories: [],
    },
  });
  const { append, remove, update } = useFieldArray({
    control,
    name: 'categories',
  });
  const categories = watch('categories');
  const activeCategory = categories[activeCategoryIndex];
  const activeQuestions = activeCategory?.questions || [];
  const questionEditRef = useRef<HTMLFormElement>(null);
  const categoriesRef = useRef<Category[]>([]);
  const quizNameRef = useRef('');
  const isDraftRef = useRef(true);
  const isQuizAlreadySaved = useRef(false);
  const hasLoadedQuizRef = useRef(false);
  categoriesRef.current = categories;
  quizNameRef.current = quizName;
  const isPreview = quizId === 'preview';
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (isPreview) {
        const quizName = searchParams.get('quizName');

        if (quizName) {
          await saveCatalogQuizForPreview(quizName);
        }
      }

      const quiz = await getQuiz(quizId, isPreview);

      if (!quiz) {
        navigate(`/my-quizzes`);
        return;
      }

      setQuizName(quiz.name);
      isDraftRef.current = !!quiz.isDraft;
      let activeQuestionIndex: number | null = null;
      const activeCategoryIndex = quiz.categories.findIndex((category) => {
        const idx = category.questions.findIndex((question) => !isValidQuestion(question));
        activeQuestionIndex = idx >= 0 ? idx : null;

        return idx >= 0;
      });

      const index = Math.max(activeCategoryIndex, 0);
      setActiveCategoryIndex(index);
      setActiveQuestionIndex(activeQuestionIndex);
      setValue('categories', quiz.categories);
      setIsLoading(false);
      categoriesRef.current = quiz.categories;
      quizNameRef.current = quiz.name;
      hasLoadedQuizRef.current = true;
    })();

    return () => {
      if (!hasLoadedQuizRef.current || isQuizAlreadySaved.current || isPreview) {
        return;
      }

      console.log('unmount');
      sendBeaconPost({
        name: quizNameRef.current,
        quizId,
        categories: categoriesRef.current,
        isDraft: isDraftRef.current,
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (categories.length > 0 && categories.length < activeCategoryIndex + 1) {
      setActiveCategory(categories.length - 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories, activeCategoryIndex]);

  useEffect(() => {
    if (!isPreview && hasLoadedQuizRef.current) {
      window.onbeforeunload = function () {
        sendBeaconPost({
          name: quizName,
          quizId,
          categories,
          isDraft: isDraftRef.current,
        });
      };
    }

    return () => {
      window.onbeforeunload = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories, quizName, quizId]);

  async function onFormSubmit(formData: ConfigureQuizFormValues) {
    let invalidCategoryIndex = formData.categories.findIndex((category) =>
      category.questions.some((question) => !isValidQuestion(question)),
    );

    if (invalidCategoryIndex >= 0) {
      showAlert({
        message: 'Some questions are not completed. Either complete them or remove them.',
        type: 'error',
      });
      setActiveCategory(invalidCategoryIndex);

      return;
    }

    invalidCategoryIndex = formData.categories.findIndex((category) => category.questions.length === 0);

    if (invalidCategoryIndex >= 0) {
      showAlert({
        message: 'All categories must have atleast 1 question',
        type: 'error',
      });
      setActiveCategory(invalidCategoryIndex);

      return;
    }

    try {
      isDraftRef.current = false;
      isQuizAlreadySaved.current = true;
      await createOrUpdateQuiz({
        categories: formData.categories,
        quizId: isPreview ? undefined : quizId,
        name: quizName,
        isDraft: false,
        isAddedFromCatalog: isPreview,
      });
      track(TrackingEvent.QUIZ_CREATED, {
        quizName,
        isAddedFromCatalog: isPreview,
        numOfCategories: formData.categories.length,
        numOfQuestions: formData.categories.reduce((sum, curr) => sum + curr.questions.length, 0),
      });

      showAlert({
        message: 'Quiz has been saved successfully.',
        type: 'success',
      });

      if (isPreview) {
        updatePreviewQuiz(null);
      }

      navigate(`/my-quizzes`);
    } catch (err) {
      showAlert({
        message: 'Something went wrong while saving the quiz data. Please try again later.',
        type: 'error',
      });
    }
  }

  const confirmRemoveCategory = (index: number, hasQuestion: boolean) => {
    if (hasQuestion) {
      showModal({
        title: 'Delete Category',
        body: 'This category has questions. Are you sure you want to delete it?',
        okCallback: () => remove(index),
        okText: 'Delete Category',
        cancelText: 'Cancel',
      });
    } else {
      remove(index);
    }
  };

  const setActiveCategory = (value: string | number) => {
    const index = parseInt(`${value}`, 10);
    setActiveCategoryIndex(index);
    setActiveQuestionIndex(null);
    setExpandedQuestionIndex(null);
  };

  function isValidQuestion(question: Question) {
    const { options, text, points } = question;

    return (
      !!text &&
      Number(points) > 0 &&
      options.length > 0 &&
      options.some((option) => option.isCorrect) &&
      !options.some((option) => !option.text)
    );
  }

  function changeQuizName() {
    showModal({
      title: 'Edit quiz name',
      body: (
        <AddOrUpdateQuizName
          name={quizName}
          hideSubmitButton
          handleFormSubmit={(data) => handleQuizName(data, quizId)}
        />
      ),
      okCallback: () => {
        document.getElementById('btnUpdateQuizNameForm')?.click();
      },
      okText: 'Update',
      cancelText: 'Cancel',
    });
  }

  function handleRearrangeQuestions() {
    if (activeQuestionIndex !== null) {
      showAlert({
        message: 'Please save all the questions before rearrange',
        type: 'warning',
      });
    } else {
      setRearrangeMode(!rearrangeMode);
      setExpandedQuestionIndex(null);
    }
  }

  async function handleQuizName(data: { name: string }, quizId: string) {
    await updateQuizName({ ...data, quizId, isPreview });
    setQuizName(data.name);
  }

  const updateQuizData = (updatedQuestions?: Question[]) => {
    const updatedCategories = updatedQuestions
      ? categories.map((category, idx) =>
          idx === activeCategoryIndex ? { ...category, questions: updatedQuestions } : category,
        )
      : categories;

    return createOrUpdateQuiz({
      categories: updatedCategories,
      quizId,
      name: quizName,
      isDraft: isDraftRef.current,
      isPreview,
    });
  };

  const openAddQuestionModal = () => {
    setActiveQuestionIndex(activeQuestions.length);
    setExpandedQuestionIndex(null);
    setIsAddingQuestion(true);
  };

  const openEditQuestionModal = (idx: number) => {
    setIsAddingQuestion(false);
    setActiveQuestionIndex(idx);
  };

  const closeQuestionModal = () => {
    setIsAddingQuestion(false);
    setActiveQuestionIndex(null);
  };

  async function handleSaveQuestion(question: Question) {
    if (!activeCategory) {
      return;
    }

    const savedQuestionIndex = isAddingQuestion ? activeQuestions.length : activeQuestionIndex;
    const updatedQuestions = isAddingQuestion
      ? [...activeQuestions, question]
      : activeQuestions.map((item, idx) => (idx === activeQuestionIndex ? question : item));

    update(activeCategoryIndex, {
      ...activeCategory,
      questions: updatedQuestions,
    });

    await updateQuizData(updatedQuestions);
    closeQuestionModal();

    if (savedQuestionIndex !== null) {
      setExpandedQuestionIndex(savedQuestionIndex);
    }

    showAlert({
      message: 'Question has been saved successfully.',
      type: 'success',
    });
  }

  function openMoveQuestionModal(questionId: Question['questionId']): void {
    if (categories.length === 1) {
      showAlert({
        message: 'There is no other category to move question.',
        type: 'warning',
      });
    } else {
      setMoveQuestionModalState({
        show: true,
        questionId,
      });
    }
  }

  function handleMoveQuestions(categoryIndex: number) {
    if (!isPreview) {
      updateQuestionCategory({ categoryIndex, questionId: moveQuestionModalState.questionId }, parseInt(quizId));
    }

    let movingQuestion: Question | undefined;
    let movingFromCategoryIndex = 0;
    for (const category of categories) {
      movingQuestion = category.questions.find((question) => question.questionId === moveQuestionModalState.questionId);

      if (movingQuestion) {
        break;
      } else {
        movingFromCategoryIndex++;
      }
    }

    if (movingQuestion) {
      update(categoryIndex, {
        ...categories[categoryIndex],
        questions: [...categories[categoryIndex].questions, movingQuestion],
      });
      update(movingFromCategoryIndex, {
        ...categories[movingFromCategoryIndex],
        questions: categories[movingFromCategoryIndex].questions.filter(
          (x) => x.questionId !== moveQuestionModalState.questionId,
        ),
      });
    }
    setMoveQuestionModalState({ show: false, questionId: null });
  }

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <>
      <Helmet>
        <title>Create Quiz</title>
      </Helmet>

      <form onSubmit={handleSubmit(onFormSubmit)}>
        <div className="flex w-full flex-row items-start">
          <div className="max-w-[470px] flex-1">
            <div className="flex items-center pb-lg mb-xl">
              <h2 className="text-2xl font-bold">{quizName}</h2>
              <Button size="icon" variant="ghost" className="ml-2" onClick={changeQuizName}>
                <Icon name="pencil" width={20} />
              </Button>
            </div>
            <h4 className="mb-3 text-lg font-semibold">Categories</h4>
            <RadioGroup
              className="flex flex-col"
              name="activeCategory"
              value={`${activeCategoryIndex}`}
              onValueChange={setActiveCategory}>
              {categories.map((item, idx) => (
                <Card
                  shadow={idx === activeCategoryIndex ? 'sm' : undefined}
                  className={cn(
                    'bg-[var(--primary-card-bg)] w-full flex gap-4 px-4 py-2 border-0 shadow-none',
                    {
                      'z-[1]': idx === activeCategoryIndex,
                      'bg-white': idx !== activeCategoryIndex,
                      border: idx === activeCategoryIndex,
                      'border-r-0': idx === activeCategoryIndex,
                      'rounded-lg': idx === activeCategoryIndex,
                    },
                    'ml-[1px] items-center rounded-r-none',
                  )}
                  key={item.categoryId || idx}>
                  <Radio id={`category-${idx}`} value={`${idx}`} className="self-start mt-4" />
                  <label htmlFor={`category-${idx}`} className="flex flex-1 gap-1 cursor-pointer items-start pt-3">
                    <span className="font-bold mr-md">{idx + 1}.</span>
                    <div className="flex flex-col flex-1 gap-1">
                      {idx === activeCategoryIndex ? (
                        <FormInput
                          name={`categories.${idx}.categoryName`}
                          id={`categories.${idx}.categoryName`}
                          rules={{ required: 'Please enter category name' }}
                          type="text"
                          placeholder="Enter category name"
                          variant={'filled'}
                          size="md"
                          autoFocus
                          className="[&_input]:mr-[27px] [&_input]:mt-[-10px] [&_input]:font-bold"
                          control={control}
                        />
                      ) : (
                        <p className="text-md font-bold">{item.categoryName}</p>
                      )}
                      {!errors.categories?.[idx]?.categoryName?.message && (
                        <p
                          className={cn('font-bold text-gray-500 text-left text-xs', {
                            'mt-md': idx === activeCategoryIndex,
                          })}>
                          {item.questions.length > 0 && (
                            <span className="mr-sm">
                              {plural(item.questions.length, '%count question', '%count questions')}
                            </span>
                          )}
                          {(item.questions.length === 0 ||
                            item.questions.some((question) => !isValidQuestion(question))) &&
                            idx !== activeCategoryIndex && (
                              <Badge variant="destructive" className="mt-sm">
                                Incomplete
                              </Badge>
                            )}
                        </p>
                      )}
                    </div>
                  </label>
                  {categories.length > 1 && (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="ml-md shrink-0 self-start"
                      onClick={() => confirmRemoveCategory(idx, item.questions.length > 0)}>
                      <Icon width={20} name="trash" />
                    </Button>
                  )}
                </Card>
              ))}
            </RadioGroup>
            <Button
              className="mt-xl rounded-xl"
              onClick={() => {
                setActiveCategoryIndex(categories.length);
                setActiveQuestionIndex(null);
                setExpandedQuestionIndex(null);
                append(getEmptyCategory());
              }}
              variant="default"
              leftIcon={<Icon name="plus" width={18} />}>
              Add Category
            </Button>
          </div>
          <QuestionsListPanel
            activeCategory={activeCategory}
            activeCategoryIndex={activeCategoryIndex}
            activeQuestionIndex={activeQuestionIndex}
            expandedQuestionIndex={expandedQuestionIndex}
            control={control}
            setActiveQuestionIndex={setActiveQuestionIndex}
            isValidQuestion={isValidQuestion}
            setExpandedQuestionIndex={setExpandedQuestionIndex}
            handleRearrangeQuestions={handleRearrangeQuestions}
            rearrangeMode={rearrangeMode}
            handleMoveQuestions={openMoveQuestionModal}
            onAddQuestion={openAddQuestionModal}
            onEditQuestion={openEditQuestionModal}
          />
        </div>
        <div className="grid grid-cols-24">
          <div className="col-span-10 col-start-6 py-xl flex items-center gap-5">
            {isPreview && (
              <Button
                variant="outline"
                size="xl"
                className="rounded-full w-5/12"
                onClick={() => {
                  track(TrackingEvent.CATALOG_QUIZ_NOT_SAVED, {
                    quizName,
                    isAddedFromCatalog: true,
                    numOfCategories: categories.length,
                    numOfQuestions: categories.reduce((sum, curr) => sum + curr.questions.length, 0),
                  });
                  navigate(`/catalog/${userName}`);
                }}>
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              variant="filled"
              size="xl"
              className="w-7/12 rounded-full"
              leftIcon={<Icon name="done" color="#ffffff" />}>
              {isPreview ? 'Add to my quizzes' : 'Complete quiz'}
            </Button>
          </div>
        </div>
      </form>
      {moveQuestionModalState.show && (
        <MoveQuestionModal
          categories={categories}
          activeCategoryIndex={activeCategoryIndex}
          okCallback={handleMoveQuestions}
          onClose={() => setMoveQuestionModalState({ show: false, questionId: null })}
        />
      )}
      {typeof activeQuestionIndex === 'number' && !!activeCategory?.categoryId && (
        <Modal
          modalProps={{
            title: isAddingQuestion ? 'Add new question' : 'Edit question',
            body: (
              <QuestionEdit
                questionNum={activeQuestionIndex + 1}
                question={activeQuestions[activeQuestionIndex] || getEmptyQuestion(activeCategory.categoryId)}
                saveQuestion={handleSaveQuestion}
                ref={questionEditRef}
              />
            ),
            okText: 'Save',
            size: 'xl',
            cancelCallback: closeQuestionModal,
            okCallback: () => questionEditRef.current?.requestSubmit(),
            closeOnOkClick: false,
          }}
        />
      )}
    </>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../../useStore';
import { useForm, FieldValues, useFieldArray } from 'react-hook-form';
import { FormInput } from '../../components/FormInputs';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem as Radio } from '@/components/ui/radio-group';
import styles from './styles.module.css';
import Icon from '../../components/Icon';
import classNames from 'classnames';
import { plural } from '../../helpers/textHelpers';
import AddOrUpdateQuizName from '../../components/AddOrUpdateQuizName';
import { useNavigate } from 'react-router';
import QuestionsListPanel from './QuestionsListPanel';
import { track } from '../../helpers/track';
import { TrackingEvent } from '../../constants';
import MoveQuestionModal from '../../components/MoveQuestionModal';
import { useSearchParams } from 'react-router-dom';
import PageLoader from '../../components/PageLoader';

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
  const [activeCategoryName, setActiveCategoryName] = useState('');
  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number | null>(null);
  const [expandedQuestionIndex, setExpandedQuestionIndex] = useState<number | null | 'all'>(null);
  const [rearrangeMode, setRearrangeMode] = useState(false);
  const [moveQuestionModalState, setMoveQuestionModalState] = useState({
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
  } = useForm();
  const { append, remove, update } = useFieldArray({
    control,
    name: 'categories',
  });
  const categories = watch('categories') || [];
  const categoriesRef = useRef([]);
  const quizNameRef = useRef('');
  const isDraftRef = useRef(true);
  const isQuizAlreadySaved = useRef(false);
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
      let activeQuestionIndex: any = null;
      const activeCategoryIndex = quiz.categories.findIndex((category) => {
        const idx = category.questions.findIndex((question) => !isValidQuestion(question));
        activeQuestionIndex = idx >= 0 ? idx : null;

        return idx >= 0;
      });

      const index = Math.max(activeCategoryIndex, 0);
      setActiveCategoryIndex(index);
      setActiveCategoryName(quiz.categories[index].categoryName);
      setActiveQuestionIndex(activeQuestionIndex);
      setValue('', quiz);
      setValue('categories', quiz.categories);
      setIsLoading(false);
    })();

    return () => {
      if (!isQuizAlreadySaved.current && !isPreview) {
        sendBeaconPost({
          name: quizNameRef.current,
          quizId,
          categories: categoriesRef.current,
          isDraft: isDraftRef.current,
        });
      }
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
    if (!isPreview) {
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

  async function onFormSubmit(formData: FieldValues) {
    let invalidQuestionIndex = formData.categories.findIndex((category) =>
      category.questions.some((question) => !isValidQuestion(question)),
    );

    if (invalidQuestionIndex >= 0) {
      showAlert({
        message: 'Some questions are not completed. Either complete them or remove them.',
        type: 'error',
      });
      setActiveCategory(invalidQuestionIndex);

      return;
    }

    invalidQuestionIndex = formData.categories.findIndex((category) => category.questions.length === 0);

    if (invalidQuestionIndex >= 0) {
      showAlert({
        message: 'All categories must have atleast 1 question',
        type: 'error',
      });
      setActiveCategory(invalidQuestionIndex);

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

  const confirmRemoveCategory = (index, hasQuestion) => {
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

  const setActiveCategory = (value) => {
    const index = parseInt(value);
    setActiveCategoryIndex(index);
    setActiveCategoryName(categories[index].categoryName);
    setActiveQuestionIndex(null);
    setExpandedQuestionIndex(null);
  };

  function isValidQuestion(question) {
    const { options, text, points } = question;

    return (
      !!text &&
      parseInt(points) > 0 &&
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

  async function handleQuizName(data, quizId) {
    await updateQuizName({ ...data, quizId, isPreview });
    setQuizName(data.name);
  }

  const submitQuizForm = () => {
    document.getElementById('btnQuizFormSubmit')?.click();
  };

  function openMoveQuestionModal(questionId): void {
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

  function handleMoveQuestions(categoryIndex) {
    if (!isPreview) {
      updateQuestionCategory({ categoryIndex, questionId: moveQuestionModalState.questionId }, parseInt(quizId));
    }

    let movingQuestion;
    let movingFromCategoryIndex = 0;
    for (const category of categories) {
      movingQuestion = category.questions.find((question) => question.questionId === moveQuestionModalState.questionId);

      if (movingQuestion) {
        break;
      } else {
        movingFromCategoryIndex++;
      }
    }

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
      <div className={styles.wrapper}>
        <div className={styles.categoriesList}>
          <form onSubmit={handleSubmit(onFormSubmit)}>
            <div className="flex items-end pb-lg mb-xl">
              <h2 className="text-2xl font-bold flex items-end">
                {quizName}
                <Button size="icon" variant="ghost" className="ml-2 mt-md" onClick={changeQuizName}>
                  <Icon name="pencil" width={22} />
                </Button>
              </h2>
            </div>
            <h4 className="text-lg font-semibold">Categories</h4>
            <RadioGroup
              className="flex flex-col gap-2"
              name="activeCategory"
              value={`${activeCategoryIndex}`}
              onValueChange={setActiveCategory}
            >
              {categories.map((item: any, idx: number) => (
                <Card
                  shadow={idx === activeCategoryIndex ? 'sm' : undefined}
                  className={classNames({
                    [styles.activeCategory]: idx === activeCategoryIndex,
                    [styles.nonActiveCard]: idx !== activeCategoryIndex,
                    primaryCard: true,
                    fullWidth: true,
                    border: idx === activeCategoryIndex,
                  })}
                  key={item.categoryId || idx}
                >
                  <div className="flex items-center gap-2">
                    <Radio value={`${idx}`} className={styles.radio} />
                    <div className="flex fullWidth">
                      <span className="font-bold mr-md">{idx + 1}.</span>
                      <div className="flex-grow">
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
                            onChange={(ev) => setActiveCategoryName(ev.target.value)}
                            className={styles.categoryNameInput}
                            control={control}
                          />
                        ) : (
                          <p className="text-md font-bold">{item.categoryName}</p>
                        )}
                        {!errors.categories?.[idx]?.categoryName?.message && (
                          <p
                            className={classNames('font-bold text-gray-500 text-left text-xs', {
                              'mt-md': idx === activeCategoryIndex,
                            })}
                          >
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
                      {categories.length > 1 && (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="ml-md"
                          onClick={() => confirmRemoveCategory(idx, item.questions.length > 0)}
                        >
                          <Icon width={20} name="trash" />
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </RadioGroup>
            <Button
              className="mt-xl"
              onClick={() => {
                setActiveCategoryIndex(categories.length);
                setActiveCategoryName('');
                setActiveQuestionIndex(null);
                setExpandedQuestionIndex(null);
                append({
                  categoryName: '',
                  questions: [],
                });
              }}
              variant="default"
              leftIcon={<Icon name="plus" width={18} />}
            >
              Add Category
            </Button>
            <button className="displayNone" id="btnQuizFormSubmit" type="submit">
              Submit
            </button>
          </form>
        </div>
        <QuestionsListPanel
          isPreview={isPreview}
          activeCategoryName={activeCategoryName}
          questions={(categories[activeCategoryIndex] as any)?.questions || []}
          activeCategoryIndex={activeCategoryIndex}
          activeCategoryId={categories[activeCategoryIndex]?.id}
          activeQuestionIndex={activeQuestionIndex}
          expandedQuestionIndex={expandedQuestionIndex}
          control={control}
          setActiveQuestionIndex={setActiveQuestionIndex}
          isValidQuestion={isValidQuestion}
          quizId={quizId}
          setExpandedQuestionIndex={setExpandedQuestionIndex}
          handleRearrangeQuestions={handleRearrangeQuestions}
          rearrangeMode={rearrangeMode}
          handleMoveQuestions={openMoveQuestionModal}
          updateQuizData={() => {
            createOrUpdateQuiz({
              categories,
              quizId,
              name: quizName,
              isDraft: isDraftRef.current,
              isPreview,
            });
          }}
        />
      </div>
      <div className="grid grid-cols-24">
        <div className="col-span-10 col-start-8 py-xl flex">
          {isPreview && (
            <Button
              variant="outline"
              size="lg"
              className="w-full rounded-full mr-lg"
              onClick={() => {
                track(TrackingEvent.CATALOG_QUIZ_NOT_SAVED, {
                  quizName,
                  isAddedFromCatalog: true,
                  numOfCategories: categories.length,
                  numOfQuestions: categories.reduce((sum, curr) => sum + curr.questions.length, 0),
                });
                navigate(`/catalog/${userName}`);
              }}
            >
              Cancel
            </Button>
          )}
          <Button
            variant="default"
            size="lg"
            className="w-full rounded-full"
            leftIcon={<Icon name="done" color="#ffffff" />}
            onClick={submitQuizForm}
          >
            {isPreview ? 'Add to my quizzes' : 'Complete quiz'}
          </Button>
        </div>
      </div>
      {moveQuestionModalState.show && (
        <MoveQuestionModal
          categories={categories}
          activeCategoryIndex={activeCategoryIndex}
          okCallback={handleMoveQuestions}
          onClose={() => setMoveQuestionModalState({ show: false, questionId: null })}
        />
      )}
    </>
  );
}

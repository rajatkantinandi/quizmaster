import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../../useStore';
import { useForm, FieldValues, useFieldArray } from 'react-hook-form';
import { FormInput } from '../../components/FormInputs';
import { Quiz } from '../../types';
import { Helmet } from 'react-helmet';
import { Title, Card, Grid, Button, ActionIcon, Text, Radio, Badge, Checkbox } from '@mantine/core';
import styles from './styles.module.css';
import Icon from '../../components/Icon';
import classNames from 'classnames';
import { plural } from '../../helpers/textHelpers';
import AddOrUpdateQuizName from '../../components/AddOrUpdateQuizName';
import { useNavigate } from 'react-router';
import QuestionsListPanel from './QuestionsListPanel';
import { track } from '../../helpers/track';
import { TrackingEvent } from '../../constants';

export default function ConfigureQuiz({
  quizId,
  userName = 'guest',
}: {
  quizId: string;
  userName: string | undefined;
}) {
  const [quizName, setQuizName] = useState('');
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const [activeCategoryName, setActiveCategoryName] = useState('');
  const [categoryToMove, setCategoryToMove] = useState('');
  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number | null>(null);
  const [expandedQuestionIndex, setExpandedQuestionIndex] = useState<number | null | 'all'>(null);
  const [rearrangeMode, setRearrangeMode] = useState(false);
  const { createOrUpdateQuiz, getQuiz, sendBeaconPost, showAlert, showModal, updateQuizName, updatePreviewQuiz } =
    useStore();
  const navigate = useNavigate();
  const {
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    control,
  } = useForm();
  const { append, remove, replace } = useFieldArray({
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

  useEffect(() => {
    getQuiz(quizId, isPreview).then((quiz: Quiz) => {
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
      replace(quiz.categories);
      setTimeout(() => reset(quiz), 0);
    });

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
    let index = formData.categories.findIndex((category) =>
      category.questions.some((question) => !isValidQuestion(question)),
    );

    if (index >= 0) {
      showAlert({
        message: 'Some questions are not completed. Either complete them or remove them.',
        type: 'error',
      });
      setActiveCategory(index);

      return;
    }

    index = formData.categories.findIndex((category) => category.questions.length === 0);

    if (index >= 0) {
      showAlert({
        message: 'All categories must have atleast 1 question',
        type: 'error',
      });
      setActiveCategory(index);

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
        // Reset preview quiz
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

  function handleMoveQuestions(question): void {
    const otherCategories = categories.filter((category, index) => index !== activeCategoryIndex);

    if (otherCategories.length === 0) {
      showAlert({
        message: 'There is no other category to move question.',
        type: 'warning',
      });
    } else {
      showModal({
        title: 'Move question',
        body: (
          <Radio.Group value={categoryToMove} onChange={setCategoryToMove}>
            <Radio value="react" label="React" />
            <Radio value="svelte" label="Svelte" />
            <Radio value="ng" label="Angular" />
            <Radio value="vue" label="Vue" />
            {otherCategories.map((category, idx) => (
              <Radio value="vue" label="Vue" />
            ))}
          </Radio.Group>
        ),
        okCallback: () => {
          console.log(question, categoryToMove);
        },
        okText: 'Move',
        cancelText: 'Cancel',
      });
    }
  }

  return (
    <>
      <Helmet>
        <title>Create Quiz</title>
      </Helmet>
      <div className={styles.wrapper}>
        <div className={styles.categoriesList}>
          <form onSubmit={handleSubmit(onFormSubmit)}>
            <Title order={2} mb="xl" pb="lg" className="flex" align="end">
              {quizName}
              <ActionIcon ml="sm" className="mt-md" onClick={changeQuizName}>
                <Icon name="pencil" width={22} />
              </ActionIcon>
            </Title>
            <Title order={4}>Categories</Title>
            <Radio.Group
              className="flexCol"
              name="activeCategory"
              value={`${activeCategoryIndex}`}
              onChange={setActiveCategory}>
              {categories.map((item: any, idx: number) => (
                <Card
                  shadow={idx === activeCategoryIndex ? 'sm' : ''}
                  withBorder={idx === activeCategoryIndex}
                  key={item.categoryId || idx}
                  className={classNames({
                    [styles.activeCategory]: idx === activeCategoryIndex,
                    [styles.nonActiveCard]: idx !== activeCategoryIndex,
                    primaryCard: true,
                    fullWidth: true,
                  })}>
                  <Radio
                    mr="md"
                    value={`${idx}`}
                    className={styles.radio}
                    label={
                      <div className="flex fullWidth">
                        <Text weight="bold" mr="md">
                          {idx + 1}.
                        </Text>
                        <div className="noShrink grow">
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
                            <Text size="md" weight="bold">
                              {item.categoryName}
                            </Text>
                          )}
                          {!errors.categories?.[idx]?.categoryName?.message && (
                            <Text
                              weight="bold"
                              color="dimmed"
                              align="left"
                              size="xs"
                              className={classNames({
                                'mt-md': idx === activeCategoryIndex,
                              })}>
                              {item.questions.length > 0 && (
                                <Text component="span" mr="sm">
                                  {plural(item.questions.length, '%count question', '%count questions')}
                                </Text>
                              )}
                              {(item.questions.length === 0 ||
                                item.questions.some((question) => !isValidQuestion(question))) &&
                                idx !== activeCategoryIndex && (
                                  <Badge color="red" variant="filled" mt="sm">
                                    Incomplete
                                  </Badge>
                                )}
                            </Text>
                          )}
                        </div>
                        {categories.length > 1 && (
                          <ActionIcon
                            variant="transparent"
                            ml="md"
                            onClick={() => confirmRemoveCategory(idx, item.questions.length > 0)}>
                            <Icon width={20} name="trash" />
                          </ActionIcon>
                        )}
                      </div>
                    }
                  />
                </Card>
              ))}
            </Radio.Group>
            <Button
              mt="xl"
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
              leftIcon={<Icon name="plus" width={18} />}>
              Add Category
            </Button>
            <button className="displayNone" id="btnQuizFormSubmit" type="submit">
              Submit
            </button>
          </form>
          <QuestionsListPanel
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
            handleMoveQuestions={handleMoveQuestions}
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
      </div>
      <Grid columns={24} className={styles.btnCompleteQuiz}>
        <Grid.Col span={10} offset={7} py="xl" className="flex">
          {isPreview && (
            <Button
              variant="outline"
              size="lg"
              fullWidth
              radius="xl"
              mr="lg"
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
            variant="gradient"
            size="lg"
            fullWidth
            radius="xl"
            leftIcon={<Icon name="done" color="#ffffff" />}
            onClick={submitQuizForm}>
            {isPreview ? 'Add to my quizzes' : 'Complete quiz'}
          </Button>
        </Grid.Col>
      </Grid>
    </>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../../useStore';
import { useForm, FieldValues } from 'react-hook-form';
import { FormInput } from '../../components/FormInputs';
import { Quiz, Category, Question as IQuestion } from '../../types';
import { nanoid } from 'nanoid';
import { getEmptyQuestion, isInt } from '../../helpers';
import { Helmet } from 'react-helmet';
import { Title, Card, Grid, Button, ActionIcon, Text, Radio, Badge } from '@mantine/core';
import styles from './styles.module.css';
import Icon from '../../components/Icon';
import classNames from 'classnames';
import QuestionEdit from '../../components/QuestionEdit';
import QuestionPreview from '../../components/QuestionPreview';
import { plural } from '../../helpers/textHelpers';
import UpdateQuizName from '../../components/UpdateQuizName';

export default function ConfigureQuiz({ quizId }: { quizId: string }) {
  const [quizName, setQuizName] = useState('');
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number | null>(null);
  const [expandedPreviewQuestionIndex, setExpandedPreviewQuestionIndex] = useState<number | null>(null);
  const { createOrUpdateQuiz, getQuiz, sendBeaconPost, showAlert, showModal } = useStore();
  const [refresh, setRefresh] = useState(0);
  const {
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
    setValue,
    register,
    watch,
  } = useForm();
  const watchCategories = watch('categories') || [];

  useEffect(() => {
    if (isInt(quizId)) {
      getQuiz(parseInt(`${quizId}`)).then((quiz: Quiz) => {
        setQuizName(quiz.name);
        let activeQuestionIndex: any = null;
        const activeCategoryIndex = quiz.categories.findIndex((category) => {
          const idx = category.questions.findIndex((question) => !isValidQuestion(question));
          activeQuestionIndex = idx >= 0 ? idx : null;

          return idx >= 0;
        });

        setActiveCategoryIndex(Math.max(activeCategoryIndex, 0));
        setActiveQuestionIndex(activeQuestionIndex);
        setTimeout(() => reset(quiz), 0);
      });
    }

    return () => {
      window.onbeforeunload = null;
    };
  }, []);

  useEffect(() => {
    if (watchCategories.length > 0 && watchCategories.length < activeCategoryIndex + 1) {
      setActiveCategory(watchCategories.length - 1);
    }

    window.onbeforeunload = function () {
      sendBeaconPost({
        name: quizName,
        quizId,
        categories: watchCategories,
        isDraft: true,
      });
    };
  }, [watchCategories, quizName]);

  function onQuestionChange(data) {
    const categories = getValues('categories');

    categories[activeCategoryIndex].questions[activeQuestionIndex as number] = data;
    setValue('categories', categories);
  }

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
      const response = await createOrUpdateQuiz({
        categories: formData.categories,
        quizId,
        name: quizName,
        isDraft: false,
      });

      showAlert({
        message: 'Quiz has been saved successfully.',
        type: 'success',
      });
    } catch (err) {
      showAlert({
        message: 'Something went wrong while saving the quiz data. Please try again later.',
        type: 'error',
      });
    }

    // navigate(`/edit-quiz/${userName}/${response.quizId}`);
  }

  const addCategory = () => {
    const newCategory = {
      categoryId: nanoid(),
      categoryName: '',
      questions: [],
    };
    const categories = getValues('categories');

    categories.push(newCategory);
    setValue('categories', categories);
    setRefresh(Math.random());
  };

  const confirmRemoveCategory = (index, hasQuestion) => {
    if (hasQuestion) {
      showModal({
        title: 'Delete Category',
        body: 'This category has questions. Are you sure you want to delete it?',
        okCallback: () => removeCategory(index),
        okText: 'Delete Category',
        cancelText: 'Cancel',
      });
    } else {
      removeCategory(index);
    }
  };

  const removeCategory = (index) => {
    const categories = getValues('categories');

    categories.splice(index, 1);
    setValue('categories', categories);
    setRefresh(Math.random());
  };

  const setActiveCategory = (value) => {
    setActiveCategoryIndex(parseInt(value));
    setActiveQuestionIndex(null);
    setExpandedPreviewQuestionIndex(null);
  };

  const addQuestion = () => {
    const question = getEmptyQuestion(watchCategories[activeCategoryIndex].categoryId);
    const categories = getValues('categories');
    categories[activeCategoryIndex].questions.push(question);
    setValue('categories', categories);

    const length = categories[activeCategoryIndex].questions.length;
    setActiveQuestionIndex(length - 1);
  };

  function isValidQuestion(question) {
    const { options, text, points } = question;

    return (
      !!text &&
      points > 0 &&
      options.length > 0 &&
      options.some((option) => option.isCorrect) &&
      !options.some((option) => !option.text)
    );
  }

  function deleteQuestion(index: number) {
    const questionIndex = index >= 0 ? index : (activeQuestionIndex as number);
    const categories = getValues('categories');
    const question = categories[activeCategoryIndex].questions[questionIndex];

    if (isValidQuestion(question)) {
      showModal({
        title: 'Delete Question',
        body: 'Are you sure you want to delete this question?',
        okCallback: () => removeQuestion(questionIndex),
        okText: 'Delete Question',
        cancelText: 'Cancel',
      });
    } else {
      removeQuestion(questionIndex);
    }
  }

  function removeQuestion(questionIndex) {
    const categories = getValues('categories');

    delete categories[activeCategoryIndex].questions[questionIndex];
    setValue('categories', categories);

    if (questionIndex === activeQuestionIndex) {
      setActiveQuestionIndex(null);
    } else {
      setRefresh(Math.random());
    }
  }

  function changeQuizName() {
    showModal({
      title: 'Edit quiz name',
      body: <UpdateQuizName name={quizName} quizId={quizId} callback={setQuizName} />,
      okCallback: () => {
        document.getElementById('btnUpdateQuizNameForm')?.click();
      },
      okText: 'Update',
      cancelText: 'Cancel',
    });
  }

  const submitQuizForm = () => {
    document.getElementById('btnQuizFormSubmit')?.click();
  };

  return (
    <>
      <Helmet>
        <title>Create Quiz</title>
      </Helmet>
      <Grid columns={24} gutter={0} className={styles.wrapper}>
        <Grid.Col span={7}>
          <form onSubmit={handleSubmit(onFormSubmit)}>
            <Title order={2} mb="xl" pb="lg" className="flex" align="end">
              {quizName}
              <ActionIcon ml="sm" className="mt-md" onClick={changeQuizName}>
                <Icon name="pencil" width={16} />
              </ActionIcon>
            </Title>
            <Title order={4}>Categories</Title>
            <Radio.Group
              className={styles.scrollAble}
              name="activeCategory"
              value={`${activeCategoryIndex}`}
              onChange={setActiveCategory}>
              {watchCategories.map((category: Category, idx: number) => (
                <Card
                  shadow={idx === activeCategoryIndex ? 'sm' : ''}
                  withBorder={idx === activeCategoryIndex}
                  key={category.categoryId}
                  className={classNames({
                    [styles.activeCategory]: idx === activeCategoryIndex,
                    [styles.nonActiveCard]: idx !== activeCategoryIndex,
                    primaryCard: true,
                  })}>
                  <Radio
                    mr="md"
                    value={`${idx}`}
                    label={
                      <div className="flex alignCenter">
                        <Text weight="bold" mr="md">
                          {idx + 1}.
                        </Text>
                        <div>
                          <FormInput
                            name={`categories[${idx}].categoryName`}
                            id={`categories${idx}categoryName`}
                            rules={{ required: 'Please enter category name' }}
                            errorMessage={errors.categories?.[idx]?.categoryName?.message || ''}
                            type="text"
                            placeholder="Enter category name"
                            variant={idx === activeCategoryIndex ? 'filled' : 'unstyled'}
                            size="md"
                            readOnly={idx !== activeCategoryIndex}
                            radius="md"
                            onClick={() => {
                              if (idx !== activeCategoryIndex) {
                                setActiveCategory(idx);
                              }
                            }}
                            className={classNames({
                              [styles.categoryNameInput]: idx !== activeCategoryIndex,
                            })}
                            register={register}
                          />
                          {!errors.categories?.[idx]?.categoryName?.message && (
                            <Text
                              weight="bold"
                              color="dimmed"
                              align="left"
                              size="xs"
                              className={classNames({
                                absolute: true,
                                'mt-md': idx === activeCategoryIndex,
                              })}>
                              {category.questions.length > 0 && (
                                <Text component="span" mr="sm">
                                  {plural(category.questions.length, '%count question', '%count questions')}
                                </Text>
                              )}
                              {(category.questions.length === 0 ||
                                category.questions.some((question) => !isValidQuestion(question))) &&
                                idx !== activeCategoryIndex && (
                                  <Badge color="red" variant="filled">
                                    Incomplete
                                  </Badge>
                                )}
                            </Text>
                          )}
                        </div>
                        {watchCategories.length > 1 && (
                          <ActionIcon
                            variant="transparent"
                            ml="md"
                            onClick={() => confirmRemoveCategory(idx, category.questions.length > 0)}>
                            <Icon width={20} name="trash" />
                          </ActionIcon>
                        )}
                      </div>
                    }
                  />
                </Card>
              ))}
            </Radio.Group>
            <Button mt="xl" onClick={addCategory} radius="sm" variant="default">
              + Add Category
            </Button>
            <button className="displayNone" id="btnQuizFormSubmit" type="submit">
              Submit
            </button>
          </form>
        </Grid.Col>
        <Grid.Col span={14}>
          <Card shadow="sm" withBorder className={`fullHeight primaryCard ${styles.questionsCard}`}>
            <Title order={5} mb="xl">
              {watchCategories[activeCategoryIndex]?.categoryName || 'Unnamed Category'}
            </Title>
            {(watchCategories[activeCategoryIndex]?.questions || []).map((question: IQuestion, idx) =>
              activeQuestionIndex === idx ? (
                <QuestionEdit
                  questionNum={idx + 1}
                  question={question}
                  key={question.questionId}
                  saveQuestion={() => {
                    setActiveQuestionIndex(null);
                    setExpandedPreviewQuestionIndex(idx);
                  }}
                  onQuestionChange={onQuestionChange}
                  deleteQuestion={deleteQuestion}
                />
              ) : (
                <QuestionPreview
                  questionNum={idx + 1}
                  question={question}
                  key={question.questionId}
                  isValidQuestion={isValidQuestion(question)}
                  setActiveQuestion={(ev) => setActiveQuestionIndex(idx)}
                  deleteQuestion={() => deleteQuestion(idx)}
                  expandedPreviewQuestionIndex={expandedPreviewQuestionIndex === idx}
                  setExpandedPreviewQuestionIndex={setExpandedPreviewQuestionIndex}
                />
              ),
            )}
            <Button mt="xl" onClick={addQuestion} radius="sm" variant="default">
              + Add Question
            </Button>
          </Card>
        </Grid.Col>
      </Grid>
      <Grid columns={24} className={styles.btnCompleteQuiz}>
        <Grid.Col span={10} offset={7} py="xl">
          <Button variant="gradient" size="lg" fullWidth radius="md" onClick={submitQuizForm}>
            Complete Quiz
          </Button>
        </Grid.Col>
      </Grid>
    </>
  );
}

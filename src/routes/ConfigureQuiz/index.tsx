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
import QuestionView from '../../components/QuestionView';
import { plural } from '../../helpers/textHelpers';
import AddOrUpdateQuizName from '../../components/AddOrUpdateQuizName';
import { useNavigate, useParams } from 'react-router';

export default function ConfigureQuiz({ quizId }: { quizId: string }) {
  const { userName = 'guest' } = useParams();
  const [quizName, setQuizName] = useState('');
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const [activeCategoryName, setActiveCategoryName] = useState('');
  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number | null>(null);
  const [expandedQuestionIndex, setExpandedQuestionIndex] = useState<number | null>(null);
  const [previewQuestionIndex, setPreviewQuestionIndex] = useState<number | null>(null);
  const { createOrUpdateQuiz, getQuiz, sendBeaconPost, showAlert, showModal, updateQuizName } = useStore();
  const [, setRefresh] = useState(0);
  const navigate = useNavigate();
  const {
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
    setValue,
    register,
    watch,
  } = useForm();
  const categories = watch('categories') || [];
  const categoriesRef = useRef([]);
  const quizNameRef = useRef('');
  const isDraftRef = useRef(true);
  categoriesRef.current = categories;
  quizNameRef.current = quizName;

  useEffect(() => {
    if (isInt(quizId)) {
      getQuiz(parseInt(`${quizId}`)).then((quiz: Quiz) => {
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
        setTimeout(() => reset(quiz), 0);
      });
    }

    return () => {
      window.onbeforeunload = null;
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

    window.onbeforeunload = function () {
      sendBeaconPost({
        name: quizName,
        quizId,
        categories,
        isDraft: isDraftRef.current,
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories, quizName]);

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
      isDraftRef.current = false;

      await createOrUpdateQuiz({
        categories: formData.categories,
        quizId,
        name: quizName,
        isDraft: false,
      });

      showAlert({
        message: 'Quiz has been saved successfully.',
        type: 'success',
      });

      navigate(`/quizzes/${userName}`);
    } catch (err) {
      showAlert({
        message: 'Something went wrong while saving the quiz data. Please try again later.',
        type: 'error',
      });
    }
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
    const index = parseInt(value);
    setActiveCategoryIndex(index);
    setActiveCategoryName(categories[index].categoryName);
    setActiveQuestionIndex(null);
    setExpandedQuestionIndex(null);
    setPreviewQuestionIndex(null);
  };

  const addQuestion = () => {
    const question = getEmptyQuestion(categories[activeCategoryIndex].categoryId);
    const categoriesData = getValues('categories');
    categoriesData[activeCategoryIndex].questions.push(question);
    setValue('categories', categoriesData);

    const length = categoriesData[activeCategoryIndex].questions.length;
    setActiveQuestionIndex(length - 1);
  };

  const resetQuestion = () => {
    if (activeQuestionIndex !== null && activeQuestionIndex >= 0) {
      getQuiz(parseInt(`${quizId}`)).then((quiz: Quiz) => {
        const categories = getValues('categories');
        const originalQuestion = quiz.categories[activeCategoryIndex].questions[activeQuestionIndex];

        if (originalQuestion) {
          categories[activeCategoryIndex].questions[activeQuestionIndex] = originalQuestion;
        } else {
          categories[activeCategoryIndex].questions.splice(activeQuestionIndex, 1);
        }

        setValue('categories', categories);
        setActiveQuestionIndex(null);
        setPreviewQuestionIndex(null);
      });
    }
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

  function handleDeleteQuestion(index: number) {
    const questionIndex = index >= 0 ? index : (activeQuestionIndex as number);
    const categories = getValues('categories');
    const question = categories[activeCategoryIndex].questions[questionIndex];

    if (isValidQuestion(question)) {
      showModal({
        title: 'Delete Question',
        body: 'Are you sure you want to delete this question?',
        okCallback: () => deleteQuestion(questionIndex),
        okText: 'Delete Question',
        cancelText: 'Cancel',
      });
    } else {
      deleteQuestion(questionIndex);
    }
  }

  function deleteQuestion(questionIndex) {
    const categories = getValues('categories');

    categories[activeCategoryIndex].questions.splice(questionIndex, 1);
    setValue('categories', categories);

    if (questionIndex === activeQuestionIndex) {
      setActiveQuestionIndex(null);
      setPreviewQuestionIndex(null);
    } else {
      setRefresh(Math.random());
    }
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

  async function handleSaveQuestion(idx) {
    await createOrUpdateQuiz({
      categories: categoriesRef.current,
      quizId,
      name: quizNameRef.current,
      isDraft: isDraftRef.current,
    });
    setActiveQuestionIndex(null);
    setExpandedQuestionIndex(null);
    setPreviewQuestionIndex(null);

    showAlert({
      message: 'Question has been saved successfully.',
      type: 'success',
    });
  }

  async function handleQuizName(data, quizId) {
    await updateQuizName({ ...data, quizId });
    setQuizName(data.name);
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
                <Icon name="pencil" width={22} />
              </ActionIcon>
            </Title>
            <Title order={4}>Categories</Title>
            <Radio.Group name="activeCategory" value={`${activeCategoryIndex}`} onChange={setActiveCategory}>
              {categories.map((category: Category, idx: number) => (
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
                            onKeyUp={(ev) => setActiveCategoryName((ev.target as any).value)}
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
                        {categories.length > 1 && (
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
            <Button
              mt="xl"
              onClick={addCategory}
              radius="md"
              variant="default"
              leftIcon={<Icon name="plus" width={18} />}>
              Add Category
            </Button>
            <button className="displayNone" id="btnQuizFormSubmit" type="submit">
              Submit
            </button>
          </form>
        </Grid.Col>
        <Grid.Col span={14}>
          <Card shadow="sm" withBorder className={`fullHeight primaryCard ${styles.questionsCard}`}>
            <Title order={5} mb="xl">
              {activeCategoryName || 'Unnamed Category'}
            </Title>
            {(categories[activeCategoryIndex]?.questions || []).map((question: IQuestion, idx) =>
              activeQuestionIndex === idx ? (
                <QuestionEdit
                  questionNum={idx + 1}
                  question={question}
                  key={question.questionId}
                  saveQuestion={() => handleSaveQuestion(idx)}
                  onQuestionChange={onQuestionChange}
                  deleteQuestion={handleDeleteQuestion}
                  resetQuestion={resetQuestion}
                  showPreview={() => {
                    setActiveQuestionIndex(null);
                    setExpandedQuestionIndex(idx);
                    setPreviewQuestionIndex(idx);
                  }}
                />
              ) : (
                <QuestionView
                  questionNum={idx + 1}
                  question={question}
                  key={question.questionId}
                  saveQuestion={() => handleSaveQuestion(idx)}
                  isValidQuestion={isValidQuestion(question)}
                  setActiveQuestion={(ev) => setActiveQuestionIndex(idx)}
                  deleteQuestion={() => handleDeleteQuestion(idx)}
                  isExpanded={expandedQuestionIndex === idx}
                  isPreview={previewQuestionIndex === idx}
                  setExpandedQuestionIndex={setExpandedQuestionIndex}
                />
              ),
            )}
            <Button
              mt="xl"
              onClick={addQuestion}
              radius="md"
              variant="default"
              leftIcon={<Icon name="plus" width={18} />}>
              Add Question
            </Button>
          </Card>
        </Grid.Col>
      </Grid>
      <Grid columns={24} className={styles.btnCompleteQuiz}>
        <Grid.Col span={10} offset={7} py="xl">
          <Button
            variant="gradient"
            size="lg"
            fullWidth
            radius="md"
            leftIcon={<Icon name="done" color="#ffffff" />}
            onClick={submitQuizForm}>
            Complete Quiz
          </Button>
        </Grid.Col>
      </Grid>
    </>
  );
}

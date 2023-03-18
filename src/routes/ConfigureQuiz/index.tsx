import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../../useStore';
import { useForm, FieldValues, useFieldArray } from 'react-hook-form';
import { FormInput } from '../../components/FormInputs';
import { Quiz } from '../../types';
import { Helmet } from 'react-helmet';
import { Title, Card, Grid, Button, ActionIcon, Text, Radio, Badge } from '@mantine/core';
import styles from './styles.module.css';
import Icon from '../../components/Icon';
import classNames from 'classnames';
import { plural } from '../../helpers/textHelpers';
import AddOrUpdateQuizName from '../../components/AddOrUpdateQuizName';
import { useNavigate } from 'react-router';
import QuestionCard from './QuestionCard';

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
  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number | null>(null);
  const [expandedQuestionIndex, setExpandedQuestionIndex] = useState<number | null>(null);
  const [previewQuestionIndex, setPreviewQuestionIndex] = useState<number | null>(null);
  const { createOrUpdateQuiz, getQuiz, sendBeaconPost, showAlert, showModal, updateQuizName } = useStore();
  const navigate = useNavigate();
  const {
    handleSubmit,
    formState: { errors },
    reset,
    register,
    watch,
    control,
  } = useForm();
  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: 'categories',
  });
  const categories = watch('categories') || [];
  const categoriesRef = useRef([]);
  const quizNameRef = useRef('');
  const isDraftRef = useRef(true);
  categoriesRef.current = categories;
  quizNameRef.current = quizName;

  useEffect(() => {
    getQuiz(quizId).then((quiz: Quiz) => {
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

      navigate(`/my-quizzes/${userName}`);
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
    setPreviewQuestionIndex(null);
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
              {fields.map((item: any, idx: number) => (
                <Card
                  shadow={idx === activeCategoryIndex ? 'sm' : ''}
                  withBorder={idx === activeCategoryIndex}
                  key={item.id}
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
                            name={`categories.${idx}.categoryName`}
                            id={`categories.${idx}.categoryName`}
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
                              {item.questions.length > 0 && (
                                <Text component="span" mr="sm">
                                  {plural(item.questions.length, '%count question', '%count questions')}
                                </Text>
                              )}
                              {(item.questions.length === 0 ||
                                item.questions.some((question) => !isValidQuestion(question))) &&
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
                append({
                  categoryName: '',
                  questions: [],
                });
              }}
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
          <QuestionCard
            activeCategoryName={activeCategoryName}
            questions={(fields[activeCategoryIndex] as any)?.questions || []}
            activeCategoryIndex={activeCategoryIndex}
            activeCategoryId={fields[activeCategoryIndex]?.id}
            activeQuestionIndex={activeQuestionIndex}
            expandedQuestionIndex={expandedQuestionIndex}
            previewQuestionIndex={previewQuestionIndex}
            control={control}
            setActiveQuestionIndex={setActiveQuestionIndex}
            isValidQuestion={isValidQuestion}
            setPreviewQuestionIndex={setPreviewQuestionIndex}
            quizId={quizId}
            setExpandedQuestionIndex={setExpandedQuestionIndex}
          />
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

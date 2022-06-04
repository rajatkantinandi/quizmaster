import React, { useState, useEffect } from 'react';
import { Button, Form } from 'semantic-ui-react';
import { useStore } from '../../useStore';
import { useForm, FieldValues } from 'react-hook-form';
import FormInput from '../../components/FormInput';
import { useNavigate, useParams } from 'react-router';
import { QuizInfo as IQuizInfo, Quiz, Category } from '../../types';
import { nanoid } from 'nanoid';
import { getEmptyQuestion, getEmptyCategory, isInt, insertCategoryAndQuestionsData } from '../../helpers';
import { Helmet } from 'react-helmet';

const getFormDefaultValues = (categoryIds: (string | number)[]) => {
  return {
    name: '',
    numberOfQuestionsPerCategory: '5',
    categories: categoryIds.map((categoryId) => ({
      categoryId,
      categoryName: '',
      questions: Array(5)
        .fill(1)
        .map((val, idx) => getEmptyQuestion(categoryId)),
    })),
  };
};

export default function ConfigureQuiz() {
  const { userName = 'guest', ...rest } = useParams();
  const navigate = useNavigate();
  const [quizInfo, setQuizInfo] = useState<IQuizInfo>({
    quizId: rest.quizId || nanoid(),
    categoryIds: [nanoid(), nanoid(), nanoid()],
    numberOfQuestionsPerCategory: 5,
  });
  const [refreshComponent, setRefreshComponent] = useState(0);
  const { createOrUpdateQuiz, getQuiz, sendBeaconPost } = useStore();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
    setValue,
  } = useForm({ defaultValues: getFormDefaultValues(quizInfo.categoryIds) });
  let saveQuizNameTimer: NodeJS.Timeout;

  useEffect(() => {
    if (isInt(quizInfo.quizId)) {
      getQuiz(parseInt(`${quizInfo.quizId}`)).then((quiz: Quiz) => {
        insertCategoryAndQuestionsData(quiz);
        const categoryIds = quiz.categories.map((category: Category) => category.categoryId);

        setQuizInfo({
          quizId: quiz.quizId,
          categoryIds,
        });
        setTimeout(() => {
          reset({
            name: quiz.name,
            numberOfQuestionsPerCategory: quiz.numberOfQuestionsPerCategory.toString(),
            categories: quiz.categories,
          });
        }, 0);
      });
    }

    return () => {
      window.onbeforeunload = null;
    };
  }, []);

  useEffect(() => {
    window.onbeforeunload = function () {
      const { quizId } = quizInfo;

      if (isInt(quizId)) {
        sendBeaconPost({
          name: getValues('name'),
          numberOfQuestionsPerCategory: parseInt(getValues('numberOfQuestionsPerCategory')),
          quizId,
          categories: getCategoryData(getValues()),
          isDraft: true,
        });
      }
    };
  }, [quizInfo]);

  async function onFormSubmit(formData: FieldValues) {
    const response = await createOrUpdateQuiz({
      categories: getCategoryData(formData),
      quizId: quizInfo.quizId,
      name: formData.name,
      isDraft: true,
      numberOfQuestionsPerCategory: parseInt(formData.numberOfQuestionsPerCategory),
    });

    navigate(`/edit-quiz/${userName}/${response.quizId}`);
  }

  const getCategoryData = (formData: FieldValues): Category[] => {
    return formData.categories
      .filter((category) => category.categoryName && quizInfo.categoryIds.includes(category.categoryId))
      .map((category) => {
        const categoryData: any = {
          categoryName: category.categoryName,
          questions: Array(parseInt(formData.numberOfQuestionsPerCategory))
            .fill(1)
            .map((val, index) => {
              const question = category.questions[index];
              const data: any = {
                points: question.points || 0,
                options: question.options || [],
              };

              if (isInt(question.questionId)) {
                data.questionId = question.questionId;
              } else if (isInt(question.categoryId)) {
                data.categoryId = question.categoryId;
              }

              return data;
            }),
        };

        if (isInt(category.categoryId)) {
          categoryData.categoryId = category.categoryId;
        }

        return categoryData;
      });
  };

  const addCategory = () => {
    const newCategory = getEmptyCategory(5);
    const categories = getValues('categories');
    categories.push(newCategory);
    setValue('categories', categories);
    setQuizInfo({
      ...quizInfo,
      categoryIds: [...quizInfo.categoryIds, newCategory.categoryId],
    });
  };

  function reRenderComponent() {
    setRefreshComponent(Math.random());
  }

  function getQuestionsForCategory(categoryId: string | number) {
    const categories = getValues('categories') || [];
    const questions = categories.find((category: Category) => category.categoryId === categoryId)?.questions || [];
    const numberOfQuestionsPerCategory = parseInt(getValues('numberOfQuestionsPerCategory')) || questions.length;

    return Array(numberOfQuestionsPerCategory)
      .fill(1)
      .map((val, index) => questions[index] || getEmptyQuestion(categoryId));
  }

  async function handleAddQuizName(ev: React.ChangeEvent, inputData: { value: string }) {
    if (saveQuizNameTimer) {
      clearTimeout(saveQuizNameTimer);
    }

    saveQuizNameTimer = setTimeout(async () => {
      const data: any = {
        name: inputData.value,
        categories: [],
        isDraft: true,
        numberOfQuestionsPerCategory: 5,
      };

      if (isInt(quizInfo.quizId)) {
        data.quizId = quizInfo.quizId;
      }

      const resp = await createOrUpdateQuiz(data);
      setQuizInfo({
        ...quizInfo,
        quizId: resp.quizId,
      });

      navigate(`/configure-quiz/${userName}/${resp.quizId}`);
    }, 1000);
  }

  const removeLastCategory = () => {
    setQuizInfo({
      ...quizInfo,
      categoryIds: quizInfo.categoryIds.slice(0, -1),
    });
  };

  return (
    <>
      <Helmet>
        <title>Create Quiz</title>
      </Helmet>
      <Form className="flex flexCol" onSubmit={handleSubmit(onFormSubmit)}>
        <div className="container-md">
          <FormInput
            name="name"
            id="name"
            control={control}
            rules={{ required: 'Please enter quiz name' }}
            errorMessage={errors.name?.message || ''}
            label="Quiz name"
            inputProps={{
              type: 'text',
              onChange: handleAddQuizName,
            }}
          />
          <FormInput
            name="numberOfQuestionsPerCategory"
            id="numberOfQuestionsPerCategory"
            control={control}
            rules={{
              required: 'Please enter number of questions per category',
            }}
            errorMessage={errors.numberOfQuestionsPerCategory?.message || ''}
            label="Number of questions per category"
            inputProps={{
              type: 'number',
              min: 2,
              onChange: reRenderComponent,
            }}
          />
        </div>
        <hr />
        <div className="flex">
          <Button type="button" color="blue" onClick={addCategory} className="mr-lg">
            Add one more category
          </Button>
          {quizInfo.categoryIds.length > 2 && (
            <Button type="button" color="red" onClick={removeLastCategory}>
              Remove last category
            </Button>
          )}
        </div>
        <hr />
        <h2>Categories</h2>
        <div className="flex flexWrap">
          {quizInfo.categoryIds.map((categoryId: string | number, idx: number) => (
            <div className="flex flexCol mr-xl mb-xl" key={categoryId}>
              <h3>Category {idx + 1}</h3>
              <FormInput
                name={`categories[${idx}].categoryName`}
                id={`categories${idx}categoryName`}
                control={control}
                rules={{ required: 'Please enter category name' }}
                errorMessage={errors.categories?.[idx]?.categoryName?.message || ''}
                label="Name"
                inputProps={{
                  type: 'text',
                  className: 'fullWidth',
                  size: 'small',
                }}
              />
              <h4>Question points</h4>
              {getQuestionsForCategory(categoryId).map((q, index) => (
                <FormInput
                  key={q.questionId}
                  name={`categories[${idx}].questions[${index}].points`}
                  id={`categories${idx}questions${index}points`}
                  control={control}
                  rules={{ required: 'Please enter question pointes' }}
                  errorMessage={errors.categories?.[idx]?.questions?.[index]?.points?.message || ''}
                  label={`Q${index + 1} points`}
                  inputProps={{
                    type: 'number',
                    className: 'fullWidth',
                    size: 'small',
                  }}
                />
              ))}
            </div>
          ))}
        </div>
        <Button type="submit" color="orange" size="large">
          Continue
        </Button>
      </Form>
    </>
  );
}

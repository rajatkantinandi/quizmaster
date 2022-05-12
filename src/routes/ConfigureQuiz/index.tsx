import React, { useState, useEffect } from 'react';
import { Button, Form } from 'semantic-ui-react';
import { useAppStore } from '../../useAppStore';
import { useForm, FieldValues } from 'react-hook-form';
import FormInput from '../../components/FormInput';
import { useNavigate, useParams } from 'react-router';
import { QuizInfo as IQuizInfo, Quiz, Category } from '../../types';
import { nanoid } from 'nanoid';
import { getEmptyQuestion, getEmptyCategory } from '../../helpers/question';
import { isInt } from '../../helpers/objectHelper';

const getFormDefaultValues = (categoryIds: (string | number)[]) => {
  return {
    name: '',
    numberOfQuestionsPerCategory: '5',
    categories: categoryIds.map((categoryId) => getEmptyCategory(5)),
  };
};

export default function ConfigureQuiz() {
  const { userName = 'guest', ...rest } = useParams();
  const navigate = useNavigate();
  const [quizInfo, setQuizInfo] = useState({
    quizId: rest.quizId || nanoid(),
    categoryIds: [nanoid(), nanoid(), nanoid()],
    numberOfQuestionsPerCategory: 5,
  } as IQuizInfo);
  const [refreshComponent, setRefreshComponent] = useState(0);
  const { createOrUpdateQuiz, getQuiz, sendBeaconPost } = useAppStore();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
  } = useForm({ defaultValues: getFormDefaultValues(quizInfo.categoryIds) });
  let saveQuizNameTimer: any = 0;

  useEffect(() => {
    if (isInt(quizInfo.quizId)) {
      getQuiz(quizInfo.quizId as number).then((quiz: Quiz) => {
        const categoryIds = quiz.categories.map((category: Category) => category.categoryId);

        setQuizInfo({
          quizId: quiz.id,
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
    const { questions, categoryData, ...restProps } = await createOrUpdateQuiz({
      categories: getCategoryData(formData),
      quizId: quizInfo.quizId,
      name: formData.name,
      numberOfQuestionsPerCategory: parseInt(formData.numberOfQuestionsPerCategory),
    });

    navigate(`/edit-quiz/${userName}/${restProps.quizId}`);
  }

  const getCategoryData = (formData: FieldValues): Category[] => {
    return Object.values(formData.categories)
      .filter((category: any) => category.name)
      .map((category: any) => {
        const categoryData: any = {
          name: category.name,
          questions: Array(parseInt(formData.numberOfQuestionsPerCategory))
            .fill(1)
            .map((val, index) => {
              const question = category.questions[index];
              const data: any = {
                points: question.points || 0,
              };

              if (isInt(question.id)) {
                data.id = question.id;
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
    setQuizInfo({
      ...quizInfo,
      categoryIds: [...quizInfo.categoryIds, nanoid()],
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
      <Form className="flex flexCol" onSubmit={handleSubmit(onFormSubmit)}>
        <div className="container-md">
          <FormInput
            name="name"
            control={control}
            rules={{ required: 'Please enter quiz name' }}
            errorMessage={errors.name?.message || ''}
            inputProps={{
              type: 'text',
              label: 'Quiz name',
              onChange: handleAddQuizName,
            }}
          />
          <FormInput
            name="numberOfQuestionsPerCategory"
            control={control}
            rules={{
              required: 'Please enter number of questions per category',
            }}
            errorMessage={errors.numberOfQuestionsPerCategory?.message || ''}
            inputProps={{
              type: 'number',
              label: 'Number of questions per category',
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
                name={`categories[${idx}].name`}
                control={control}
                rules={{ required: 'Please enter category name' }}
                errorMessage={errors.categories?.[idx]?.name?.message || ''}
                inputProps={{
                  type: 'text',
                  label: 'Name',
                  className: 'fullWidth',
                  size: 'small',
                }}
              />
              <h4>Question points</h4>
              {getQuestionsForCategory(categoryId).map((q, index) => (
                <FormInput
                  key={q.id}
                  name={`categories[${idx}].questions[${index}].points`}
                  control={control}
                  rules={{ required: 'Please enter question pointes' }}
                  errorMessage={errors.categories?.[idx]?.questions?.[index]?.points?.message || ''}
                  inputProps={{
                    type: 'number',
                    label: `Q${index + 1} points`,
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

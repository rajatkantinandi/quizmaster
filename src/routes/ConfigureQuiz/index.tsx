import React, { useState, useEffect } from 'react';
import { Button, Form } from 'semantic-ui-react';
import { useAppStore } from '../../useAppStore';
import { useForm, FieldValues } from 'react-hook-form';
import FormInput from '../../components/FormInput';
import { useNavigate, useParams } from 'react-router';
import { Category, QuizInfo as IQuizInfo, Question } from '../../types';
import { nanoid } from 'nanoid';
import { generateEmptyQuestions } from '../../helpers/question';
import { formatCategoryInfo } from '../../helpers/quiz';

interface CategoryData {
  name: string;
  categoryId: number;
}

interface CategoryInfo {
  [key: string]: {
    name: string;
    categoryId: number;
    questions: Question[];
  };
}

export default function ConfigureQuiz() {
  const { userName = 'guest', quizId } = useParams();
  const navigate = useNavigate();
  const [quizInfo, setQuizInfo] = useState({
    quizId: nanoid(),
    name: '',
    categoryIds: [nanoid(), nanoid(), nanoid()],
  } as IQuizInfo);
  const [categoriesInfo, setCategoriesInfo] = useState(initCategoryInfo());
  const [numberOfQuestionsPerCategory, setNumberOfQuestionsPerCategory] = useState(5);
  const { createOrUpdateQuiz, getQuiz } = useAppStore();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    if (quizId) {
      getQuiz(parseInt(quizId)).then((quiz: any) => {
        const categoryIds = quiz.categories.map((category: any) => category.categoryId);

        setQuizInfo({
          quizId: quiz.id,
          name: quiz.name,
          categoryIds,
        });
        setNumberOfQuestionsPerCategory(quiz.categories[0].questions.length);
        setCategoriesInfo(formatCategoryInfo(quiz.categories, categoryIds));
        reset({
          name: quiz.name,
          numOfQuestionPerCategory: quiz.categories[0].questions?.length,
          categories: quiz.categories,
        });
      });
    }
  }, []);

  async function onFormSubmit(data: FieldValues) {
    data.categories = data.categories.filter((category: any) => category.name);
    data.categories = data.categories.map((category: any) => ({
      ...category,
      questions: category.questions.filter((question: any) => parseInt(question.points) >= 0),
    }));
    data.quizId = quizId;

    const { questions, categoryData, ...restProps } = await createOrUpdateQuiz(data);
    const categoryIds = categoryData.map((category: CategoryData) => category.categoryId);

    setCategoriesInfo(
      questions.reduce((categoryInfo: CategoryInfo, question: Question) => {
        const category = categoryData.find((category: CategoryData) => category.categoryId === question.categoryId) || {
          name: '',
        };

        if (!categoryInfo[question.categoryId]) {
          categoryInfo[question.categoryId] = {
            name: category.name,
            categoryId: question.categoryId,
            questions: [question],
          };
        } else {
          categoryInfo[question.categoryId].questions.push(question);
        }

        return categoryInfo;
      }, {} as CategoryInfo),
    );
    setQuizInfo({
      quizId: restProps.quizId,
      name: data.name,
      categoryIds,
    });
    navigate(`/edit-quiz/${userName}/${restProps.quizId}`);
  }

  const addCategory = () => {
    const id = nanoid();

    setQuizInfo({
      ...quizInfo,
      categoryIds: [...quizInfo.categoryIds, id],
    });
    setCategoriesInfo({
      ...categoriesInfo,
      [id]: {
        name: '',
        categoryId: id,
        questions: generateEmptyQuestions(numberOfQuestionsPerCategory, id),
      },
    });
  };

  function handleNumberOfQuestionsPerCategory(numQuestionsPerCategory: number) {
    setNumberOfQuestionsPerCategory(numQuestionsPerCategory);

    if (numQuestionsPerCategory) {
      const firstCategoryId = quizInfo.categoryIds[0];
      const currentQuestionsCount = categoriesInfo[firstCategoryId].questions.length;

      if (currentQuestionsCount > numQuestionsPerCategory) {
        setCategoriesInfo(
          quizInfo.categoryIds.reduce((data: { [key: string]: Category }, categoryId: string | number) => {
            const category = categoriesInfo[categoryId];

            data[categoryId] = {
              ...category,
              questions: category.questions.slice(0, numQuestionsPerCategory - currentQuestionsCount),
            };

            return data;
          }, {}),
        );
      } else if (numQuestionsPerCategory > currentQuestionsCount) {
        setCategoriesInfo(
          quizInfo.categoryIds.reduce((data: { [key: string]: Category }, categoryId: string | number) => {
            const category = categoriesInfo[categoryId];

            data[categoryId] = {
              ...category,
              questions: category.questions.concat(
                generateEmptyQuestions(
                  numQuestionsPerCategory - currentQuestionsCount,
                  categoryId,
                  currentQuestionsCount,
                ),
              ),
            };

            return data;
          }, {}),
        );
      }
    }
  }

  function initCategoryInfo(): { [key: string]: Category } {
    return quizInfo.categoryIds.reduce((acc: { [key: string]: Category }, categoryId) => {
      acc[categoryId] = {
        name: '',
        categoryId,
        questions: generateEmptyQuestions(5, categoryId),
      };

      return acc;
    }, {});
  }

  const removeLastCategory = () => {
    const lastCategoryId = quizInfo.categoryIds[quizInfo.categoryIds.length - 1];
    const categoriesInfoData = { ...categoriesInfo };
    delete categoriesInfoData[lastCategoryId];

    setQuizInfo({
      ...quizInfo,
      categoryIds: quizInfo.categoryIds.slice(0, -1),
    });
    setCategoriesInfo(categoriesInfoData);
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
            }}
          />
          <FormInput
            name="numOfQuestionPerCategory"
            control={control}
            rules={{
              required: 'Please enter number of questions per category',
            }}
            errorMessage={errors.numOfQuestionPerCategory?.message || ''}
            inputProps={{
              type: 'number',
              label: 'Number of questions per category',
              min: 2,
              onChange: (ev: any) => handleNumberOfQuestionsPerCategory(parseInt(ev.target.value, 10)),
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
          {quizInfo.categoryIds.map((categoryId: any, idx: number) => (
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
              {(categoriesInfo[categoryId]?.questions || []).map((q, index) => (
                <FormInput
                  key={q.id}
                  name={`categories[${idx}].questions[${index}].points`}
                  control={control}
                  rules={{ required: 'Please enter question pointes' }}
                  errorMessage={errors.categories?.[idx]?.questions[index]?.points?.message || ''}
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

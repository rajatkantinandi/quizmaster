import { nanoid } from 'nanoid';
import React, { useEffect } from 'react';
import { Button, Form, Input } from 'semantic-ui-react';
import { generateEmptyQuestions } from '../../../helpers/question';
import { Category } from '../../../types';

interface Props {
  categoriesInfo: Category[];
  setCategoriesInfo: Function;
  setIsConfigured: Function;
  setName: Function;
  name: string;
  numberOfQuestionsPerCategory: number;
  setNumberOfQuestionsPerCategory: Function;
}

export default function ConfigureQuiz({
  categoriesInfo,
  setCategoriesInfo,
  setIsConfigured,
  setName,
  name,
  numberOfQuestionsPerCategory,
  setNumberOfQuestionsPerCategory,
}: Props) {
  // When numberOfQuestionsPerCategory is changed then update categories array
  useEffect(() => {
    const currentQuestionsCount = categoriesInfo[0].questions.length;

    if (currentQuestionsCount > numberOfQuestionsPerCategory) {
      setCategoriesInfo(
        categoriesInfo.map((category) => ({
          ...category,
          questions: category.questions.slice(0, numberOfQuestionsPerCategory - currentQuestionsCount),
        })),
      );
    } else if (numberOfQuestionsPerCategory > currentQuestionsCount) {
      setCategoriesInfo(
        categoriesInfo.map((category) => ({
          ...category,
          questions: category.questions.concat(
            generateEmptyQuestions(numberOfQuestionsPerCategory - currentQuestionsCount, currentQuestionsCount),
          ),
        })),
      );
    }
    // eslint-disable-next-line
  }, [numberOfQuestionsPerCategory]);

  const handleCategoryNameChange = (ev: React.ChangeEvent<HTMLInputElement>, id: string) => {
    setCategoriesInfo(
      categoriesInfo.map((category) => {
        if (category.id === id) {
          return { ...category, name: ev.target.value };
        } else {
          return category;
        }
      }),
    );
  };

  const handleQuestionPointsChange = (ev: React.ChangeEvent<HTMLInputElement>, id: string) => {
    setCategoriesInfo(
      categoriesInfo.map((category) => {
        return {
          ...category,
          questions: category.questions.map((q) => {
            if (q.id === id) {
              q.point = parseInt(ev.target.value, 10);
            }

            return q;
          }),
        };
      }),
    );
  };

  const addCategory = () => {
    setCategoriesInfo(
      categoriesInfo.concat({
        name: '',
        id: nanoid(),
        questions: generateEmptyQuestions(numberOfQuestionsPerCategory),
      }),
    );
  };

  return (
    <Form
      className="flex flexCol"
      onSubmit={async (ev) => {
        ev.preventDefault();
        setIsConfigured(true);
      }}>
      <div className="container-md">
        <Input
          className="fullWidth"
          type="text"
          label="Quiz name"
          value={name}
          onChange={(ev) => setName(ev.target.value)}
        />
        <Input
          type="number"
          className="fullWidth"
          label="Number of questions per category"
          value={numberOfQuestionsPerCategory}
          onChange={(ev) => setNumberOfQuestionsPerCategory(parseInt(ev.target.value, 10))}
          min={2}
        />
      </div>
      <hr />
      <div className="flex">
        <Button type="button" color="blue" onClick={addCategory} className="mr-lg">
          Add one more category
        </Button>
        {categoriesInfo.length > 2 && (
          <Button type="button" color="red" onClick={() => setCategoriesInfo(categoriesInfo.slice(0, -1))}>
            Remove last category
          </Button>
        )}
      </div>
      <hr />
      <h2>Categories</h2>
      <div className="flex flexWrap">
        {categoriesInfo.map((category, idx) => (
          <div className="flex flexCol mr-xl mb-xl" key={category.id}>
            <h3>Category {idx + 1}</h3>
            <Input
              className="fullWidth"
              type="text"
              size="small"
              label="Name"
              value={category.name}
              onChange={(ev) => handleCategoryNameChange(ev, category.id)}
            />
            <h4>Question points</h4>
            {category.questions.map((q, idx) => (
              <Input
                type="number"
                key={q.id}
                label={`Q${idx + 1} points`}
                value={q.point}
                onChange={(ev) => handleQuestionPointsChange(ev, q.id)}
              />
            ))}
          </div>
        ))}
      </div>
      <Button type="submit" color="orange" size="large">
        Continue
      </Button>
    </Form>
  );
}

import React from 'react';
import { Button, Divider, Icon } from 'semantic-ui-react';
import { Category } from '../../types';
import classNames from 'classnames';
import styles from './styles.module.css';

interface Props {
  showQuestion: (id: string, categoryId: string) => void;
  isExpanded?: boolean;
  categoriesInfo: Category[];
  quizName: string;
  setIsExpanded: Function;
  selectedQuestionId: string;
  attemptedQuestions?: {
    id: string;
    isCorrect: boolean;
  }[];
  savedQuestionIds?: string[];
}

export default function QuizGrid({
  isExpanded = true,
  selectedQuestionId,
  setIsExpanded,
  showQuestion,
  categoriesInfo,
  quizName,
  attemptedQuestions = [], // for play mode
  savedQuestionIds = [], // for edit mode
}: Props) {
  return (
    <div className={classNames(styles.gridContainer, { [styles.isExpanded]: isExpanded })}>
      <h2>
        {quizName}
        <Button
          icon={<Icon name={isExpanded ? 'close' : 'expand'} />}
          basic
          className="ml-lg"
          onClick={() => setIsExpanded(!isExpanded)}
        />
      </h2>
      <Divider />
      <h3>Categories</h3>
      <div className={classNames('flex flexWrap justifyCenter', styles.gridButtons)}>
        {categoriesInfo.map((category) => (
          <div className={classNames('flex flexCol mr-xl mb-xl', styles.gridCol)} key={category.id}>
            <h4>{category.name}</h4>
            {category.questions.map((q) => {
              const attemptedQuestion = attemptedQuestions.find((ques) => ques.id === q.id);

              return (
                <Button
                  key={q.id}
                  onClick={() => showQuestion(q.id, category.id)}
                  color={
                    attemptedQuestion
                      ? attemptedQuestion.isCorrect
                        ? 'green'
                        : 'red'
                      : selectedQuestionId === q.id
                      ? 'black'
                      : savedQuestionIds.includes(q.id)
                      ? 'blue'
                      : undefined
                  }
                  disabled={!!attemptedQuestion}>
                  {q.point}
                </Button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

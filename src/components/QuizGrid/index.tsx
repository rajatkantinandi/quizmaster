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
  attemptedQuestionIds?: string[];
}

export default function QuizGrid({
  isExpanded = true,
  selectedQuestionId,
  setIsExpanded,
  showQuestion,
  categoriesInfo,
  quizName,
  attemptedQuestionIds = [],
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
        {categoriesInfo.map((category, idx) => (
          <div className={classNames('flex flexCol mr-xl mb-xl', styles.gridCol)} key={category.id}>
            <h4>{category.name}</h4>
            {category.questions.map((q) => (
              <Button
                key={q.id}
                onClick={() => showQuestion(q.id, category.id)}
                color={attemptedQuestionIds.includes(q.id) ? 'blue' : selectedQuestionId === q.id ? 'black' : undefined}
                disabled={attemptedQuestionIds.includes(q.id)}>
                {q.point}
              </Button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

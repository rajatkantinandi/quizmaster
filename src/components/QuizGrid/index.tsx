import React from 'react';
import { Button, Divider, Icon } from 'semantic-ui-react';
import { Category, QuizInfo, GameInfo } from '../../types';
import classNames from 'classnames';
import styles from './styles.module.css';

interface Props {
  showQuestion: (id: string | number, categoryId: string | number) => void;
  isExpanded?: boolean;
  categoriesInfo: { [key: string]: Category };
  quizInfo: QuizInfo;
  setIsExpanded: Function;
  selectedQuestionId: string;
  gameInfo?: any;
  savedQuestionIds?: string[];
}

export default function QuizGrid({
  isExpanded = true,
  selectedQuestionId,
  setIsExpanded,
  showQuestion,
  categoriesInfo,
  quizInfo,
  gameInfo = { teams: [] },
  savedQuestionIds = [], // for edit mode
}: Props) {
  const selectedOptionsData = gameInfo.teams.reduce((acc: any, team: any) => ({ ...acc, ...team.selectedOptions }), {});

  return (
    <div className={classNames(styles.gridContainer, { [styles.isExpanded]: isExpanded })}>
      <h2>
        {quizInfo.name}
        {!isExpanded && (
          <Button
            icon={<Icon name="expand" />}
            basic
            className="ml-lg"
            title="Expand"
            onClick={() => setIsExpanded(!isExpanded)}
          />
        )}
      </h2>
      <Divider />
      <h3>Categories</h3>
      <div className={classNames('flex flexWrap justifyCenter', styles.gridButtons)}>
        {quizInfo.categoryIds.map((categoryId) => (
          <div className={classNames('flex flexCol mr-xl mb-xl', styles.gridCol)} key={categoryId}>
            <h4>{categoriesInfo[categoryId]?.name || ''}</h4>
            {(categoriesInfo[categoryId]?.questions || []).map((q) => {
              const correctOption = q.options.find((o) => o.isCorrect);

              return (
                <Button
                  key={q.id}
                  onClick={() => showQuestion(q.id, categoryId)}
                  color={
                    selectedOptionsData[q.id]
                      ? selectedOptionsData[q.id] === correctOption?.optionId
                        ? 'green'
                        : 'red'
                      : selectedQuestionId === q.id
                      ? 'black'
                      : savedQuestionIds.includes(q.id)
                      ? 'blue'
                      : undefined
                  }
                  disabled={!!selectedOptionsData[q.id]}>
                  {q.points}
                </Button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

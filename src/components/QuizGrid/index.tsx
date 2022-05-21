import React from 'react';
import { Button, Divider, Icon } from 'semantic-ui-react';
import { Category, QuizInfo, GameInfo, Team, SelectedOptions } from '../../types';
import classNames from 'classnames';
import styles from './styles.module.css';

interface Props {
  showQuestion: (questionId: string | number, categoryId: string | number) => void;
  isExpanded?: boolean;
  categoriesInfo: { [key: string]: Category };
  quizInfo: QuizInfo;
  setIsExpanded: Function;
  selectedQuestionId: string;
  gameInfo?: GameInfo;
  savedQuestionIds?: string[];
}

export default function QuizGrid({
  isExpanded = true,
  selectedQuestionId,
  setIsExpanded,
  showQuestion,
  categoriesInfo,
  quizInfo,
  gameInfo = { teams: [], timeLimit: 0, selectionTimeLimit: 0, isQuestionPointsHidden: false },
  savedQuestionIds = [], // for edit mode
}: Props) {
  const selectedOptionsData = gameInfo.teams.reduce(
    (acc: SelectedOptions[], team: Team) => acc.concat(team.selectedOptions),
    [],
  );

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
        {quizInfo.categoryIds.map((categoryId, idx) => (
          <div className={classNames('flex flexCol mr-xl mb-xl', styles.gridCol)} key={categoryId}>
            <h4>{categoriesInfo[categoryId]?.categoryName || ''}</h4>
            {(categoriesInfo[categoryId]?.questions || []).map((q, index) => {
              const correctOption = q.options.find((o) => o.isCorrect);
              const selectedOption = selectedOptionsData.find(
                (data: SelectedOptions) => data.questionId === q.questionId,
              );

              return (
                <Button
                  key={q.questionId}
                  onClick={() => showQuestion(q.questionId, categoryId)}
                  color={
                    selectedOption
                      ? selectedOption.selectedOptionId === correctOption?.optionId
                        ? 'green'
                        : 'red'
                      : selectedQuestionId === q.questionId
                      ? 'black'
                      : savedQuestionIds.includes(q.questionId)
                      ? 'blue'
                      : undefined
                  }
                  disabled={!!selectedOption}>
                  {gameInfo.isQuestionPointsHidden && selectedQuestionId !== q.questionId
                    ? 'Q-' + (index + 1)
                    : q.points}
                </Button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

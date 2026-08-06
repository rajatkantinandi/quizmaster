import React from 'react';
import TeamAvatar from '../../components/TeamAvatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Question as IQuestion } from '../../types';
import { getPointsColor } from '../../helpers';

export default function QuestionsList({
  categories,
  selectedOptionsData,
  teams,
  attemptedQuestionIds,
  selectedQuestion,
  isQuestionPointsHidden,
  shouldEnableQuestion,
  showQuestion,
  minQuestionPoint,
  maxQuestionPoint,
}) {
  function getAvatarProps(question) {
    const team = teams.find((team) => team.selectedOptions.some((x) => x.questionId === question.questionId));
    const shouldShowAvatar = attemptedQuestionIds.includes(question.questionId) && !!team;

    return {
      shouldShowAvatar,
      size: 'small',
      team,
    };
  }

  function getQuestionBackgroundColor(question: IQuestion) {
    if (attemptedQuestionIds.includes(question.questionId)) {
      const correctOptionIds = question.options.filter((x) => x.isCorrect).map((x) => x.optionId);
      const selectedOptionIds = selectedOptionsData.find(
        (x) => x.questionId === question.questionId,
      )?.selectedOptionIds;

      return correctOptionIds.length === selectedOptionIds.length &&
        !correctOptionIds.some((x) => !selectedOptionIds.includes(x))
        ? 'var(--points-color-1)'
        : 'var(--points-color-5)';
    } else {
      return getPointsColor(question.points, minQuestionPoint, maxQuestionPoint).bgColor;
    }
  }

  function getQuestionColor(question: IQuestion) {
    if (attemptedQuestionIds.includes(question.questionId)) {
      return 'var(--off-white)';
    } else {
      return getPointsColor(question.points, minQuestionPoint, maxQuestionPoint).color;
    }
  }

  return (
    <>
      <div className="my-5 flex items-center">
        <span>Lowest point</span>
        <div className="mx-[10px] h-[35px] w-[200px] bg-[linear-gradient(to_right,var(--points-color-1),var(--points-color-2),var(--points-color-3),var(--points-color-4),var(--points-color-5))]" />
        <span>Highest point</span>
      </div>
      <Accordion
        type="multiple"
        defaultValue={categories.map((x) => `${x.categoryId}`)}
        className="grid grid-cols-1 justify-start gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {categories.map((category) => (
          <AccordionItem
            className="flex-1 border-0 bg-[#eceef1] px-5 pb-5"
            key={category.categoryId}
            value={`${category.categoryId}`}>
            <AccordionTrigger>
              <h6 className="text-base font-semibold">{category.categoryName}</h6>
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col gap-2">
                {category.questions.map((question) => (
                  <Button
                    key={question.questionId}
                    className="w-full hover:opacity-90 my-2"
                    style={{
                      display: 'inherit',
                      color: getQuestionColor(question),
                      backgroundColor: getQuestionBackgroundColor(question),
                    }}
                    disabled={!shouldEnableQuestion(question)}
                    variant={selectedQuestion?.questionId === question.questionId ? 'default' : 'light'}
                    onClick={() => showQuestion(question.questionId, category.categoryId)}>
                    <div className="flex justify-between items-center w-full">
                      {isQuestionPointsHidden &&
                      !attemptedQuestionIds.includes(question.questionId) &&
                      selectedQuestion?.questionId !== question.questionId ? (
                        <span>Question {question.questionNum}</span>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span>Question {question.questionNum}</span>
                          <Badge
                            variant="secondary"
                            className="font-bold uppercase text-white"
                            style={{
                              backgroundColor: attemptedQuestionIds.includes(question.questionId)
                                ? 'var(--gray-dark)'
                                : getPointsColor(question.points, minQuestionPoint, maxQuestionPoint).color,
                            }}>
                            {question.points} PTS
                          </Badge>
                        </div>
                      )}
                      <TeamAvatar {...getAvatarProps(question)} />
                    </div>
                  </Button>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </>
  );
}

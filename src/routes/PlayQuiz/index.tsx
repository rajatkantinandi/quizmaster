import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { useParams } from 'react-router';
import { Button } from 'semantic-ui-react';
import Question from '../../components/Question';
import QuizGrid from '../../components/QuizGrid';
import { Category, Question as IQuestion, QuizInfo, GameInfo, SelectedOptions } from '../../types';
import styles from './styles.module.css';
import Timer from '../../components/Timer';
import { useAppStore } from '../../useAppStore';
import { formatCategoryInfo } from '../../helpers/dataFormatter';

const defaultQuizInfo: QuizInfo = {
  quizId: '',
  name: '',
  categoryIds: [],
  numberOfQuestionsPerCategory: 5,
};

const defaultGameInfo: GameInfo = {
  teams: [],
  timeLimit: 0,
  currentTeamId: 0,
  selectionTimeLimit: 0,
  isComplete: false,
};

const defaultCategoryInfo: { [key: string]: Category } = {};
const defaultSelectedQuestion: IQuestion | null = null;

export default function PlayQuiz() {
  const { gameId } = useParams();
  const [quizInfo, setQuizInfo] = useState(defaultQuizInfo);
  const [gameInfo, setGameInfo] = useState(defaultGameInfo);
  // useLoginCheckAndPageTitle(quizInfo.name || '');
  const [categoriesInfo, setCategoriesInfo] = useState(defaultCategoryInfo);
  const [selectedQuestion, setSelectedQuestion] = useState(defaultSelectedQuestion);
  const { timeLimit, selectionTimeLimit } = gameInfo;
  const [isPlaying, setIsPlaying] = useState(false);
  const [winner, setWinner] = useState('');
  const selectedOptionsData = gameInfo.teams.reduce(
    (acc, team) => acc.concat(team.selectedOptions),
    [] as SelectedOptions[],
  );
  const attemptedQuestionIds = selectedOptionsData.map((x) => x.questionId);
  const isQuestionAttempted = !!selectedQuestion && attemptedQuestionIds.includes(selectedQuestion.questionId);
  const showQuestionTimer = !!timeLimit && !!selectedQuestion && !isQuestionAttempted;
  const { showAlertModal, getGameData, updateGame } = useAppStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (gameId) {
      getGameData(parseInt(gameId)).then((game: any) => {
        const { quiz, ...restData } = game;
        const quizData = quiz[0];
        const categoryIds = quizData.categories.map((category: any) => category.categoryId);
        setQuizInfo({
          quizId: quizData.quizId,
          name: quizData.name,
          categoryIds,
          numberOfQuestionsPerCategory: quizData.numberOfQuestionsPerCategory,
        });

        if (categoryIds.length > 0) {
          setCategoriesInfo(formatCategoryInfo(quizData.categories, categoryIds));
        }

        setGameInfo(restData);
        setIsLoading(false);
      });
    }
  }, [gameId]);

  function showWinner(teams: any[], callback?: Function) {
    const maxScore = Math.max(...teams.map((team) => team.score));
    const winners = teams.filter((team) => team.score === maxScore);
    const winnerIds = winners.map((winner) => winner.teamId).join(',');
    setWinner(winnerIds);

    if (winners.length > 1) {
      showAlertModal({ title: 'Match drawn!', message: 'Well played! It is a draw!', okCallback: callback });
    } else {
      showAlertModal({
        title: `Congrats ${winners[0].name}!`,
        message: `Team '${winners[0].name}' has won the game with ${winners[0].score} points.`,
        okCallback: callback,
      });
    }

    return winnerIds;
  }

  async function handleSubmitResponse(questionId: string, optionId?: string) {
    const allQuestions = quizInfo.categoryIds.reduce(
      (acc, catId) => acc.concat(categoriesInfo[catId].questions),
      [] as IQuestion[],
    );
    const question = allQuestions.find((q) => q.questionId === questionId);
    const attemptedQuestionsCount = selectedOptionsData.length;

    if (question) {
      const isCorrect = question.options.find((o: any) => o.optionId === optionId)?.isCorrect;
      const currentTeamIndex = gameInfo.teams.findIndex((t) => t.teamId === gameInfo.currentTeamId);
      const nextTeamIndex = (currentTeamIndex + 1) % gameInfo.teams.length;
      const clonedTeams = [...gameInfo.teams];

      if (currentTeamIndex >= 0) {
        const currentTeam = clonedTeams[currentTeamIndex];
        currentTeam.score += isCorrect ? question.points : 0;
        currentTeam.selectedOptions.push({
          questionId: question.questionId,
          selectedOptionId: optionId ? parseInt(optionId) : null,
        });

        setGameInfo({
          ...gameInfo,
          currentTeamId: (gameInfo.teams[nextTeamIndex].teamId as number) || 0,
          teams: clonedTeams,
        });
      }

      setIsPlaying(false);
      const isComplete = nextTeamIndex === 0 && allQuestions.length - attemptedQuestionsCount < gameInfo.teams.length;
      const winner = isComplete ? showWinner(clonedTeams) : null;

      await updateGame({
        gameId,
        isComplete,
        winnerTeamId: winner,
        nextTeamId: gameInfo.teams[nextTeamIndex].teamId,
        currentTeam: {
          score: clonedTeams[currentTeamIndex].score,
          selectedOptionId: optionId || null,
          questionId,
          teamId: clonedTeams[currentTeamIndex].teamId,
        },
      });
    }
  }

  function selectRandomQuestion() {
    const allQuestions = quizInfo.categoryIds.reduce(
      (acc, catId) => acc.concat(categoriesInfo[catId].questions),
      [] as IQuestion[],
    );

    const allUnattemptedQuestions = allQuestions.filter(
      (q) => !selectedOptionsData.find((x) => x.questionId === q.questionId),
    );

    if (allUnattemptedQuestions.length > 0) {
      setSelectedQuestion(allUnattemptedQuestions[Math.floor(Math.random() * allUnattemptedQuestions.length)]);
      setIsPlaying(true);
    }
  }

  function showQuestion(questionId: string | number, categoryId: string | number) {
    if (categoryId) {
      const question = categoriesInfo[categoryId].questions.find((q) => q.questionId === questionId);

      setSelectedQuestion(question || null);
      setIsPlaying(true);
    }
  }

  function shouldShowTimer() {
    return ((!selectedQuestion && !!selectionTimeLimit) || (selectedQuestion && showQuestionTimer)) && !winner;
  }

  return isLoading ? (
    <></>
  ) : (
    <>
      <div className="flex alignCenter">
        <h1>asda</h1>
      </div>
      <div className="flex justifyCenter">
        <QuizGrid
          categoriesInfo={categoriesInfo}
          showQuestion={showQuestion}
          gameInfo={gameInfo}
          isExpanded={!selectedQuestion}
          quizInfo={quizInfo}
          setIsExpanded={(expanded: boolean) => {
            // Upon expanding grid deselect question & resume play
            if (expanded) {
              setSelectedQuestion(null);
              setIsPlaying(!winner);
            }
          }}
          selectedQuestionId={selectedQuestion?.questionId || ''}
        />
        {!!selectedQuestion && (
          <Question
            submitResponse={(optionId: string) => handleSubmitResponse(selectedQuestion.questionId, optionId)}
            selectedQuestion={selectedQuestion}
            onClose={() => {
              setIsPlaying(!winner);
              setSelectedQuestion(null);
            }}
            isWithoutOptions={selectedQuestion.options.length === 1}
            pauseTimer={() => setIsPlaying(false)}
            selectedOptionId={
              selectedQuestion.questionId
                ? selectedOptionsData.find((x) => x.questionId === selectedQuestion.questionId)?.selectedOptionId
                : null
            }
          />
        )}
        <div className={classNames(styles.scoreContainer, 'ml-lg')}>
          {shouldShowTimer() && (
            <Timer
              duration={showQuestionTimer ? timeLimit : selectionTimeLimit}
              title={showQuestionTimer ? 'Timer' : 'Selection Timer'}
              handleTimeUp={() => {
                if (showQuestionTimer) {
                  handleSubmitResponse(selectedQuestion.questionId, '');
                } else if (selectionTimeLimit) {
                  selectRandomQuestion();
                }
              }}
              key={showQuestionTimer ? selectedQuestion.questionId : 'questionSelection'}
              running={isPlaying}
              setIsRunning={setIsPlaying}
              selectedQuestionId={selectedQuestion?.questionId}
            />
          )}
          <table className="mt-lg">
            <tbody>
              <tr>
                <th>Team</th>
                <th>Score</th>
              </tr>
              {gameInfo.teams.map((t: any) => (
                <tr key={t.teamId} className={classNames({ [styles.active]: t.teamId === gameInfo.currentTeamId })}>
                  <td>
                    {t.name}
                    {winner.includes(t.teamId) && <span title="winner"> 👑</span>}
                  </td>
                  <td>{t.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Button
            color="purple"
            className="mt-xl"
            onClick={async () => {
              const winnerTeamId = showWinner(gameInfo.teams, () => window.location.reload());

              await updateGame({
                gameId,
                isComplete: true,
                winnerTeamId,
                nextTeamId: gameInfo.currentTeamId,
              });
            }}>
            Start a new Game
          </Button>
        </div>
      </div>
    </>
  );
}

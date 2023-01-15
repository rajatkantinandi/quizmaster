import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { useNavigate, useParams } from 'react-router';
import { Button } from 'semantic-ui-react';
import Question from '../../components/Question1';
import QuizGrid from '../../components/QuizGrid';
import { Category, Question as IQuestion, QuizInfo, SelectedOptions, Team } from '../../types';
import styles from './styles.module.css';
import Timer from '../../components/Timer';
import { useStore } from '../../useStore';
import { formatCategoryInfo } from '../../helpers';
import { defaultGameInfo } from '../../constants';
import { Helmet } from 'react-helmet';

const defaultQuizInfo: QuizInfo = {
  quizId: '',
  name: '',
  categoryIds: [],
  numberOfQuestionsPerCategory: 5,
};

const defaultCategoryInfo: { [key: string]: Category } = {};
const defaultSelectedQuestion: IQuestion | null = null;

export default function PlayQuiz() {
  const { gameId, userName } = useParams();
  const [quizInfo, setQuizInfo] = useState(defaultQuizInfo);
  const [gameInfo, setGameInfo] = useState(defaultGameInfo);
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
  const { showModal, getGameData, updateGame } = useStore();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (gameId) {
      getGameData(parseInt(gameId)).then((game) => {
        const { quiz, ...restData } = game;
        const quizData = quiz[0];
        const categoryIds = quizData.categories.map((category) => category.categoryId);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameId]);

  function showWinner(teams: Team[], callback?: Function) {
    const winners = getWinners(teams);
    const winnerIds = winners.map((winner) => winner.teamId).join(',');
    setWinner(winnerIds);

    if (winners.length > 1) {
      showModal({ title: 'Match drawn!', body: 'Well played! It is a draw!', okCallback: callback });
    } else {
      showModal({
        title: `Congrats ${winners[0].name}!`,
        body: `Team '${winners[0].name}' has won the game with ${winners[0].score} points.`,
        okCallback: callback,
      });
    }

    return winnerIds;
  }

  function getWinners(teams: Team[]) {
    const maxScore = Math.max(...teams.map((team) => team.score));
    return teams.filter((team) => team.score === maxScore);
  }

  async function handleSubmitResponse(optionId?: string) {
    if (selectedQuestion) {
      const isCorrect = selectedQuestion.options.find((o) => o.optionId === optionId)?.isCorrect;
      const currentTeamIndex = gameInfo.teams.findIndex((t) => t.teamId === gameInfo.currentTeamId);
      const nextTeamIndex = (currentTeamIndex + 1) % gameInfo.teams.length;
      const clonedTeams = [...gameInfo.teams];
      const allQuestionCount = quizInfo.categoryIds.reduce((count: number, catId) => {
        count += categoriesInfo[catId].questions.length;

        return count;
      }, 0);

      if (currentTeamIndex >= 0) {
        const currentTeam = clonedTeams[currentTeamIndex];
        currentTeam.score += isCorrect ? selectedQuestion.points : 0;
        currentTeam.selectedOptions.push({
          questionId: selectedQuestion.questionId,
          selectedOptionId: optionId ? parseInt(optionId) : null,
        });

        setGameInfo({
          ...gameInfo,
          currentTeamId: parseInt(`${gameInfo.teams[nextTeamIndex].teamId}`),
          teams: clonedTeams,
        });
      }

      setIsPlaying(false);
      const isComplete = allQuestionCount === selectedOptionsData.length + 1;
      const winner = isComplete ? showWinner(clonedTeams) : null;

      await updateGame({
        gameId: parseInt(`${gameId}`),
        isComplete,
        winnerTeamId: winner,
        nextTeamId: parseInt(`${gameInfo.teams[nextTeamIndex].teamId}`),
        currentTeam: {
          score: clonedTeams[currentTeamIndex].score,
          selectedOptionId: optionId ? parseInt(optionId) : null,
          questionId: parseInt(selectedQuestion.questionId),
          teamId: parseInt(`${clonedTeams[currentTeamIndex].teamId}`),
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
      <Helmet>
        <title>Play Quiz</title>
      </Helmet>
      <div className="flex justifyCenter">
        <QuizGrid
          categoriesInfo={categoriesInfo}
          showQuestion={showQuestion}
          gameInfo={gameInfo}
          isExpanded={!selectedQuestion}
          quizInfo={quizInfo}
          mode="play"
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
            submitResponse={(optionId: string) => handleSubmitResponse(optionId)}
            selectedQuestion={selectedQuestion}
            onClose={() => {
              setIsPlaying(!winner);
              setSelectedQuestion(null);
            }}
            isWithoutOptions={selectedQuestion.options.length === 1}
            isAttempted={isQuestionAttempted}
            pauseTimer={() => setIsPlaying(false)}
            selectedOptionId={
              selectedOptionsData.find((x) => x.questionId === selectedQuestion.questionId)?.selectedOptionId
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
                  handleSubmitResponse('');
                } else if (selectionTimeLimit) {
                  selectRandomQuestion();
                }
              }}
              key={showQuestionTimer ? selectedQuestion?.questionId : 'questionSelection'}
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
              {gameInfo.teams.map((t: Team) => (
                <tr key={t.teamId} className={classNames({ [styles.active]: t.teamId === gameInfo.currentTeamId })}>
                  <td>
                    {t.name}
                    {t.teamId && winner.includes(`${t.teamId}`) && <span title="winner"> 👑</span>}
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
              const winners = getWinners(gameInfo.teams);

              await updateGame({
                gameId: parseInt(`${gameId}`),
                isComplete: true,
                winnerTeamId: winners.map((winner) => winner.teamId).join(','),
                nextTeamId: gameInfo.currentTeamId,
              });

              navigate(`/configure-game/${userName}/${quizInfo.quizId}`);
            }}>
            Start a new Game
          </Button>
        </div>
      </div>
    </>
  );
}

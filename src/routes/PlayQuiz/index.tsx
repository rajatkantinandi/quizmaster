import React, { useEffect, useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import QuestionPlay from '../../components/QuestionPlay';
import { Question as IQuestion, QuizInfo, SelectedOptions, Team } from '../../types';
import Timer from '../../components/Timer';
import { useStore } from '../../useStore';
import { defaultGameInfo, TrackingEvent } from '../../constants';
import { Helmet } from 'react-helmet';
import Scorecard from './Scorecard';
import QuestionsList from './QuestionsList';
import { useNavigate } from 'react-router';
import styles from './styles.module.css';
import classNames from 'classnames';
import Confetti from 'react-confetti-boom';
import { track } from '../../helpers/track';
import Icon from '../../components/Icon';

const defaultQuizInfo: QuizInfo = {
  quizId: '',
  name: '',
  categories: [],
  isAddedFromCatalog: false,
};

function getAllQuestions(categories): IQuestion[] {
  return categories.reduce((acc, category) => acc.concat(category.questions), [] as IQuestion[]);
}

export default function PlayQuiz({ gameId, userName }) {
  const [quizInfo, setQuizInfo] = useState(defaultQuizInfo);
  const [gameInfo, setGameInfo] = useState(defaultGameInfo);
  const [selectedQuestion, setSelectedQuestion] = useState<IQuestion | null>(null);
  const { timeLimit, selectionTimeLimit, isQuestionPointsHidden, negativePointsMultiplier = 0 } = gameInfo;
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [winnerIdsCsv, setWinnerIdsCsv] = useState('');
  const selectedOptionsData: any = gameInfo.teams.reduce(
    (acc, team) => acc.concat(team.selectedOptions || []),
    [] as SelectedOptions[],
  );
  const attemptedQuestionIds = selectedOptionsData.map((x) => x.questionId);
  const isQuestionAttempted = !!selectedQuestion && attemptedQuestionIds.includes(selectedQuestion.questionId);
  const showQuestionTimer = !!timeLimit && !!selectedQuestion && !isQuestionAttempted;
  const { showModal, getGameData, updateGame, markGameCompleted } = useStore();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { categories, name: quizName, isAddedFromCatalog, quizId } = quizInfo;
  const minQuestionPoint = useMemo(() => getMinOrMaxPoints(categories, Math.min), [categories]);
  const maxQuestionPoint = useMemo(() => getMinOrMaxPoints(categories, Math.max), [categories]);
  const allQuestions = useMemo(() => getAllQuestions(categories), [categories]);
  const [showExtraQuestionBanner, setShowExtraQuestionBanner] = useState(false);

  function getMinOrMaxPoints(categories, func) {
    return func(
      ...categories.map((category) => func(...category.questions.map((question) => parseInt(question.points)))),
    );
  }

  useEffect(() => {
    if (gameId) {
      getGameData(parseInt(gameId)).then((game) => {
        const { quiz, ...gameInfo } = game;
        const quizData = quiz[0];
        let questionNum = 1;
        let allQuestionsCount = 0;

        quizData.categories.forEach((category) => {
          category.questions.forEach((q) => {
            q.questionNum = questionNum;
            questionNum += 1;
            allQuestionsCount++;
          });
        });

        setQuizInfo(quizData);
        setGameInfo(gameInfo);
        setShowExtraQuestionBanner(allQuestionsCount % gameInfo.teams.length > 0);
        const attemptedQuestionsCount = gameInfo.teams.reduce((count, team) => {
          return count + team.selectedOptions.length;
        }, 0);
        const { isComplete } = getNextGameState(gameInfo, allQuestionsCount, attemptedQuestionsCount);

        if (isComplete) {
          setWinnerIds(gameInfo.teams);
        } else if (attemptedQuestionsCount > 0) {
          setSelectedQuestion(getLastAttemptedQuestion(gameInfo.teams, quizData.categories));
        }

        setIsGameStarted(attemptedQuestionsCount > 0 || !gameInfo.selectionTimeLimit);
        setIsLoading(false);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameId]);

  function startGame() {
    setIsTimerRunning(!!gameInfo.selectionTimeLimit);
    setIsGameStarted(true);
  }

  function getLastAttemptedQuestion(teams: Team[], categories) {
    const clonedTeams: Team[] = JSON.parse(JSON.stringify(teams));
    const maxAttemptedQuestions = Math.max(...clonedTeams.map((x) => x.selectedOptions.length));
    const teamsWithMaxAttemptedQuestion = clonedTeams.filter((x) => x.selectedOptions.length === maxAttemptedQuestions);
    const lastTeamWhoAttemptedQuestion = teamsWithMaxAttemptedQuestion.pop();
    const lastAttemptedQuestionOption = lastTeamWhoAttemptedQuestion?.selectedOptions.pop();
    const questionId = lastAttemptedQuestionOption?.questionId;

    return allQuestions.find((x) => x.questionId === questionId) || null;
  }

  function getWinners(teams: Team[]) {
    const maxScore = Math.max(...teams.map((team) => team.score));
    return teams.filter((team) => team.score === maxScore);
  }

  function setWinnerIds(teams: Team[]) {
    const winnerIdsCsv = getWinners(teams)
      .map((winner) => winner.teamId)
      .join(',');

    setWinnerIdsCsv(winnerIdsCsv);
    return winnerIdsCsv;
  }

  async function handleSubmitResponse(optionIds: number[]) {
    if (selectedQuestion) {
      setIsTimerRunning(false);
      const correctOptionIds = selectedQuestion.options.filter((o) => o.isCorrect).map((x) => x.optionId);
      const isCorrect =
        correctOptionIds.length === optionIds.length && !optionIds.some((x) => !correctOptionIds.includes(x));
      const { isComplete, clonedTeams, currentTeamIndex, nextTeamIndex } = getNextGameState(
        gameInfo,
        allQuestions.length,
        selectedOptionsData.length + 1,
      );

      if (currentTeamIndex >= 0) {
        const currentTeam = clonedTeams[currentTeamIndex];
        currentTeam.score =
          (currentTeam.score || 0) +
          (isCorrect
            ? parseInt(selectedQuestion.points.toString())
            : parseInt(selectedQuestion.points.toString()) * negativePointsMultiplier);
        currentTeam.selectedOptions.push({
          questionId: selectedQuestion.questionId,
          selectedOptionIds: optionIds,
        });

        setGameInfo({
          ...gameInfo,
          currentTeamId: isComplete ? 0 : parseInt(`${gameInfo.teams[nextTeamIndex].teamId}`),
          teams: clonedTeams,
        });
      }

      let winnerIdsCsv: string | null = null;

      if (isComplete) {
        setGameInfo({
          ...gameInfo,
          currentTeamId: 0,
          teams: clonedTeams,
        });
        track(TrackingEvent.COMPLETED_GAME, {
          quizName,
          isAddedFromCatalog: !!isAddedFromCatalog,
          numOfCategories: categories.length,
          numOfQuestions: categories.reduce((sum, curr) => sum + curr.questions.length, 0),
          scores: clonedTeams.map((x) => x.score),
          winnerScore: Math.max(...clonedTeams.map((x) => x.score)),
        });
        winnerIdsCsv = setWinnerIds(clonedTeams);
      }

      await updateGame({
        gameId: parseInt(`${gameId}`, 10),
        isComplete,
        winnerTeamId: winnerIdsCsv,
        nextTeamId: isComplete ? 0 : parseInt(`${gameInfo.teams[nextTeamIndex].teamId}`),
        currentTeam: {
          score: currentTeamIndex >= 0 ? clonedTeams[currentTeamIndex].score : 0,
          selectedOptionIds: optionIds,
          questionId: parseInt(selectedQuestion.questionId),
          teamId: gameInfo.currentTeamId,
        },
      });
    }
  }

  function getNextGameState(gameInfo, allQuestionCount: number, attemptedQuestionsCount: number) {
    const clonedTeams = gameInfo.teams.map((x) => ({ ...x }));
    const currentTeamIndex = clonedTeams.findIndex((t) => t.teamId === gameInfo.currentTeamId);
    const nextTeamIndex = (currentTeamIndex + 1) % clonedTeams.length;
    const remainingTeamsCount = clonedTeams.length - nextTeamIndex;
    const questionsRemaining = allQuestionCount - attemptedQuestionsCount;
    const isComplete = questionsRemaining < remainingTeamsCount;

    return { isComplete, clonedTeams, currentTeamIndex, nextTeamIndex };
  }

  function selectRandomQuestion() {
    const allUnattemptedQuestions = allQuestions.filter(
      (q) => !selectedOptionsData.find((x) => x.questionId === q.questionId),
    );

    if (allUnattemptedQuestions.length > 0) {
      setSelectedQuestion(allUnattemptedQuestions[Math.floor(Math.random() * allUnattemptedQuestions.length)]);
      setIsTimerRunning(true);
    }
  }

  function shouldShowTimer() {
    return !!(
      ((!selectedQuestion && !!selectionTimeLimit) || (selectedQuestion && !!showQuestionTimer)) &&
      !winnerIdsCsv &&
      isGameStarted
    );
  }

  function getSelectedOptionId(selectedQuestion): number[] | null {
    const selectedOptionData = selectedOptionsData.find((x) => x.questionId === selectedQuestion.questionId);

    if (selectedOptionData) {
      return selectedOptionData.selectedOptionIds;
    } else {
      return null;
    }
  }

  function getWinnerMessage() {
    const winners = getWinners(gameInfo.teams);

    if (winners.length === gameInfo.teams.length) {
      return 'Well played! It is a draw!';
    } else if (winners.length > 1) {
      const teamNames = winners
        .map((x) => x.name)
        .join(', ')
        .replace(/,(?=[^,]+$)/, ' and');
      return `${teamNames} have won the game`;
    } else {
      return winners.length === 1 ? `${winners[0].name} has won the game with ${winners[0].score} points.` : '';
    }
  }

  function shouldEnableQuestion(question) {
    if (isGameStarted) {
      if (shouldShowTimer()) {
        if (isTimerRunning) {
          return !!selectedQuestion ? isQuestionAttemptedOrSelected(question.questionId) : true;
        } else {
          return !!selectedQuestion
            ? isQuestionAttemptedOrSelected(question.questionId)
            : attemptedQuestionIds.includes(question.questionId);
        }
      } else {
        return !!selectedQuestion ? isQuestionAttemptedOrSelected(question.questionId) : true;
      }
    } else {
      return false;
    }
  }

  function isQuestionAttemptedOrSelected(questionId) {
    return attemptedQuestionIds.includes(questionId) || selectedQuestion?.questionId === questionId;
  }

  function showQuestion(questionId: string | number, categoryId: string | number) {
    const category = categories.find((x) => x.categoryId === categoryId);

    if (category) {
      const question = category.questions.find((q) => q.questionId === questionId);

      setSelectedQuestion(question || null);
      setIsTimerRunning(true);
    }
  }

  const isGameCompleted = () => !!winnerIdsCsv;

  function confirmCreateNewGame() {
    showModal({
      title: 'Are you sure you want to start a new game?',
      body: isGameCompleted() ? '' : 'Current game is incomplete and will be discarded.',
      okCallback: async () => {
        await markGameCompleted(parseInt(gameId));

        navigate(`/configure-game/${userName || 'guest'}/${quizId}`);
      },
      cancelText: 'Cancel',
    });
  }

  function openRateQuizModal() {
    showModal({
      title: '',
      body: (
        <iframe
          src={`https://docs.google.com/forms/d/e/1FAIpQLSdl3HBQdKbjvI34TqZY-U6UiV4npurnNU_IQZ1OSYksuedU_A/viewform?usp=pp_url&entry.1743219011=${quizName}`}
          width="100%"
          title="Rate this quiz"
          height="700"
          frameBorder="0"
          marginHeight={0}
          marginWidth={0}
        >
          Loading…
        </iframe>
      ),
      size: '70%',
      okCallback: () => {},
      cancelText: 'Cancel',
    });
  }

  return isLoading ? (
    <></>
  ) : (
    <>
      <Helmet>
        <title>Play Quiz</title>
      </Helmet>
      <div className="flex gap-2 mb-xl">
        {quizName && <h2 className="text-2xl font-bold">Play game for {quizName}</h2>}
        <Button onClick={confirmCreateNewGame} variant="outline">
          Start a new game
        </Button>
      </div>
      {isGameCompleted() ? (
        <h3 className={`py-3 my-lg text-white text-center ${styles.winnerMessage}`}>🎉 {getWinnerMessage()}</h3>
      ) : (
        showExtraQuestionBanner && (
          <h3 className={`py-3 my-md text-base text-center ${styles.extraQuestionsBanner}`}>
            Note: There are {allQuestions.length} questions but {gameInfo.teams.length} teams. So, the game will
            complete when each team answers equal number of questions with {allQuestions.length % gameInfo.teams.length}{' '}
            questions remaining.
            <Button className={styles.closeBtn} variant="outline" onClick={() => setShowExtraQuestionBanner(false)}>
              &#x2715;
            </Button>
          </h3>
        )
      )}
      <div className="flex grow">
        <div className={classNames('grow', { [styles.categoryGridContainer]: !selectedQuestion })}>
          {selectedQuestion ? (
            <QuestionPlay
              submitResponse={handleSubmitResponse}
              selectedQuestion={selectedQuestion}
              isAttempted={isQuestionAttempted}
              isTimerRunning={isTimerRunning}
              setIsTimerRunning={setIsTimerRunning}
              continueGame={() => {
                setSelectedQuestion(null);
                setIsTimerRunning(true);
              }}
              isGameCompleted={isGameCompleted()}
              selectedOptionIds={getSelectedOptionId(selectedQuestion)}
              negativePointsMultiplier={negativePointsMultiplier}
              minQuestionPoint={minQuestionPoint}
              maxQuestionPoint={maxQuestionPoint}
            />
          ) : (
            <>
              {!winnerIdsCsv && attemptedQuestionIds.length === 0 && !isGameStarted && (
                <div className="my-xl text-center">
                  <Button size="lg" onClick={startGame}>
                    Start Game
                  </Button>
                </div>
              )}
              <QuestionsList
                categories={categories}
                selectedOptionsData={selectedOptionsData}
                teams={gameInfo.teams}
                attemptedQuestionIds={attemptedQuestionIds}
                selectedQuestion={selectedQuestion}
                isQuestionPointsHidden={isQuestionPointsHidden}
                shouldEnableQuestion={shouldEnableQuestion}
                showQuestion={showQuestion}
                minQuestionPoint={minQuestionPoint}
                maxQuestionPoint={maxQuestionPoint}
              />
            </>
          )}
          {isGameCompleted() && (
            <div className="flex justify-center">
              {!!selectedQuestion && (
                <Button size="lg" className="my-lg mr-md" variant="outline" onClick={() => setSelectedQuestion(null)}>
                  Show question list
                </Button>
              )}
              <Button size="lg" className="my-lg" onClick={() => navigate(`/my-quizzes/${userName}`)}>
                Go to home
              </Button>
              {isAddedFromCatalog && (
                <Button
                  size="lg"
                  className="m-lg"
                  variant="default"
                  leftIcon={<Icon name="rating" width={24} height={24} />}
                  onClick={openRateQuizModal}
                >
                  Rate this Quiz
                </Button>
              )}
            </div>
          )}
        </div>
        <div className={styles.scoreAndTimer}>
          {shouldShowTimer() && (
            <>
              <div style={{ opacity: isTimerRunning ? 1 : 0, transition: 'opacity 0.5s ease-in-out' }}>
                {showQuestionTimer ? (
                  <h3 className="text-center text-gray-500">Answer the question before timer ends</h3>
                ) : (
                  <h3 className="text-center text-gray-500">Select a question before timer ends</h3>
                )}
              </div>
              <Timer
                duration={showQuestionTimer ? timeLimit : selectionTimeLimit}
                handleTimeUp={() => {
                  if (showQuestionTimer) {
                    handleSubmitResponse([]);
                  } else if (selectionTimeLimit) {
                    selectRandomQuestion();
                  }
                }}
                key={showQuestionTimer ? selectedQuestion?.questionId : 'questionSelection'}
                isTimerRunning={isTimerRunning}
                setIsTimerRunning={setIsTimerRunning}
                selectedQuestionId={selectedQuestion?.questionId}
              />
            </>
          )}
          <Scorecard teams={gameInfo.teams} currentTeamId={gameInfo.currentTeamId} winnerIdsCsv={winnerIdsCsv} />
        </div>
      </div>
      {!!winnerIdsCsv && (
        <>
          <Confetti
            x={0.1}
            y={1}
            particleCount={200}
            deg={270}
            shapeSize={20}
            spreadDeg={30}
            effectInterval={1000}
            launchSpeed={4}
            effectCount={2}
            colors={['#ff577f', '#ff884b', '#ffd384', '#fff9b0', '#3498db']}
          />
          <Confetti
            x={0.9}
            y={1}
            particleCount={200}
            deg={270}
            shapeSize={20}
            spreadDeg={30}
            effectInterval={1000}
            launchSpeed={4}
            effectCount={2}
            colors={['#ff577f', '#ff884b', '#ffd384', '#fff9b0', '#3498db']}
          />
        </>
      )}
    </>
  );
}

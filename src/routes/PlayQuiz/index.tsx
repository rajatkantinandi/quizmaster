import React, { useEffect, useState, useMemo } from 'react';
import { Button, Title, Container, Group } from '@mantine/core';
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

const defaultSelectedQuestion: IQuestion | null = null;

export default function PlayQuiz({ gameId }) {
  const [quizInfo, setQuizInfo] = useState(defaultQuizInfo);
  const [gameInfo, setGameInfo] = useState(defaultGameInfo);
  const [selectedQuestion, setSelectedQuestion] = useState(defaultSelectedQuestion);
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
  const { showModal, getGameData, updateGame, markGameCompleted, userData } = useStore();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { categories } = quizInfo;
  const minQuestionPoint = useMemo(() => getMinOrMaxPoints(categories, Math.min), [categories]);
  const maxQuestionPoint = useMemo(() => getMinOrMaxPoints(categories, Math.max), [categories]);

  function getMinOrMaxPoints(categories, func) {
    return func(
      ...categories.map((category) => func(...category.questions.map((question) => parseInt(question.points)))),
    );
  }

  useEffect(() => {
    if (gameId) {
      getGameData(parseInt(gameId)).then((game) => {
        const { quiz, ...restData } = game;
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
        setGameInfo(restData);
        const attemptedQuestionsCount = restData.teams.reduce((count, team) => {
          count += team.selectedOptions.length;
          return count;
        }, 0);
        const isCompleted = allQuestionsCount === attemptedQuestionsCount;

        if (isCompleted) {
          setWinnerIds(restData.teams);
        } else if (attemptedQuestionsCount > 0) {
          setSelectedQuestion(getLastAttemptedQuestion(restData.teams, quizData.categories));
        }

        setIsGameStarted(attemptedQuestionsCount > 0 || !restData.selectionTimeLimit);
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
    const allQuestions = getAllQuestions(categories);

    return allQuestions.find((x) => x.questionId === questionId);
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
      const correctOptionIds = selectedQuestion.options.filter((o) => o.isCorrect).map((x) => x.optionId);
      const isCorrect =
        correctOptionIds.length === optionIds.length && !optionIds.some((x) => !correctOptionIds.includes(x));
      const currentTeamIndex = gameInfo.teams.findIndex((t) => t.teamId === gameInfo.currentTeamId);
      const nextTeamIndex = (currentTeamIndex + 1) % gameInfo.teams.length;
      const clonedTeams = gameInfo.teams.map((x) => ({ ...x }));
      const allQuestionCount = getAllQuestions(quizInfo.categories).length;

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
          currentTeamId: parseInt(`${gameInfo.teams[nextTeamIndex].teamId}`),
          teams: clonedTeams,
        });
      }

      setIsTimerRunning(false);
      const isComplete = allQuestionCount === selectedOptionsData.length + 1;
      const winnerIdsCsv = isComplete ? setWinnerIds(clonedTeams) : null;

      await updateGame({
        gameId: parseInt(`${gameId}`, 10),
        isComplete,
        winnerTeamId: winnerIdsCsv,
        nextTeamId: parseInt(`${gameInfo.teams[nextTeamIndex].teamId}`),
        currentTeam: {
          score: clonedTeams[currentTeamIndex].score,
          selectedOptionIds: optionIds,
          questionId: parseInt(selectedQuestion.questionId),
          teamId: parseInt(`${clonedTeams[currentTeamIndex].teamId}`),
        },
      });

      if (isComplete) {
        track(TrackingEvent.COMPLETED_GAME, {
          quizName: quizInfo.name,
          isAddedFromCatalog: !!quizInfo.isAddedFromCatalog,
          numOfCategories: quizInfo.categories.length,
          numOfQuestions: quizInfo.categories.reduce((sum, curr) => sum + curr.questions.length, 0),
          scores: clonedTeams.map((x) => x.score),
          winnerScore: Math.max(...clonedTeams.map((x) => x.score)),
        });
      }
    }
  }

  function selectRandomQuestion() {
    const allQuestions = getAllQuestions(quizInfo.categories);

    const allUnattemptedQuestions = allQuestions.filter(
      (q) => !selectedOptionsData.find((x) => x.questionId === q.questionId),
    );

    if (allUnattemptedQuestions.length > 0) {
      setSelectedQuestion(allUnattemptedQuestions[Math.floor(Math.random() * allUnattemptedQuestions.length)]);
      setIsTimerRunning(true);
    }
  }

  function getAllQuestions(categories) {
    return categories.reduce((acc, category) => acc.concat(category.questions), [] as IQuestion[]);
  }

  function shouldShowTimer() {
    // show timer when game is running and
    // (question is selected and question timer exists) or
    // (question is not selected and question selection timer exists)
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
          // if user selected a question, enable only attempted or selected questions
          // else enable all questions
          return !!selectedQuestion ? isQuestionAttemptedOrSelected(question.questionId) : true;
        } else {
          // if timer is paused
          // 1. user already selected a question, enable only attempted or selected questions
          // 2. user not selected any question, enable only attempted questions only
          return !!selectedQuestion
            ? isQuestionAttemptedOrSelected(question.questionId)
            : attemptedQuestionIds.includes(question.questionId);
        }
      } else {
        // Same case when timer is running
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
    const category = quizInfo.categories.find((x) => x.categoryId === categoryId);

    if (category) {
      const question = category.questions.find((q) => q.questionId === questionId);

      setSelectedQuestion(question || null);
      setIsTimerRunning(true);
    }
  }

  const isGameCompleted = () => getAllQuestions(quizInfo.categories).length === selectedOptionsData.length;

  function confirmCreateNewGame() {
    showModal({
      title: 'Are you sure you want to start a new game?',
      body: isGameCompleted() ? '' : 'Current game is incomplete and will be discarded.',
      okCallback: async () => {
        await markGameCompleted(parseInt(gameId));

        navigate(`/configure-game/${userData.userName || 'guest'}/${quizInfo.quizId}`);
      },
      cancelText: 'Cancel',
    });
  }

  function openRateQuizModal() {
    showModal({
      title: '',
      body: (
        <iframe
          src={`https://docs.google.com/forms/d/e/1FAIpQLSdl3HBQdKbjvI34TqZY-U6UiV4npurnNU_IQZ1OSYksuedU_A/viewform?embedded=true&&quizId=${quizInfo.quizId}`}
          width="640"
          title="Rate this quiz"
          height="700"
          frameBorder="0"
          marginHeight={0}
          marginWidth={0}>
          Loading…
        </iframe>
      ),
      size: 'fullscreen',
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
      <Group mb="xl">
        {quizInfo.name && <Title order={2}>Play game for {quizInfo.name}</Title>}
        <Button onClick={confirmCreateNewGame} variant="outline">
          Start a new game
        </Button>
      </Group>
      {!!winnerIdsCsv && (
        <Title py="md" my="lg" color="white" className={styles.winnerMessage} align="center" order={3}>
          🎉 {getWinnerMessage()}
        </Title>
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
              isGameCompleted={!!winnerIdsCsv}
              selectedOptionIds={getSelectedOptionId(selectedQuestion)}
              negativePointsMultiplier={negativePointsMultiplier}
              minQuestionPoint={minQuestionPoint}
              maxQuestionPoint={maxQuestionPoint}
            />
          ) : (
            <>
              {!winnerIdsCsv && attemptedQuestionIds.length === 0 && !isGameStarted && (
                <Container my="xl" className="textAlignCenter">
                  <Button size="lg" variant="gradient" onClick={startGame}>
                    Start Game
                  </Button>
                </Container>
              )}
              <QuestionsList
                categories={quizInfo.categories}
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
          {getAllQuestions(quizInfo.categories).length === selectedOptionsData.length && (
            <div className="flex justifyCenter">
              {!!selectedQuestion && (
                <Button size="lg" my="lg" mr="md" variant="outline" onClick={() => setSelectedQuestion(null)}>
                  Show question list
                </Button>
              )}
              <Button size="lg" my="lg" onClick={() => navigate(`/my-quizzes/${userData.userName}`)}>
                Go to home
              </Button>
              <Button
                size="lg"
                m="lg"
                variant="gradient"
                leftIcon={<Icon name="rating" width={24} height={24} />}
                onClick={openRateQuizModal}>
                Rate this Quiz
              </Button>
            </div>
          )}
        </div>
        <div className={styles.scoreAndTimer}>
          {shouldShowTimer() && (
            <>
              <div style={{ opacity: isTimerRunning ? 1 : 0, transition: 'opacity 0.5s ease-in-out' }}>
                {showQuestionTimer ? (
                  <Title color="grey" align="center" order={3}>
                    Answer the question before timer ends
                  </Title>
                ) : (
                  <Title color="grey" align="center" order={3}>
                    Select a question before timer ends
                  </Title>
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

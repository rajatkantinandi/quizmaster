import React, { useEffect, useState } from 'react';
import { Button, Title, Container } from '@mantine/core';
import QuestionPlay from '../../components/QuestionPlay';
import { Question as IQuestion, QuizInfo, SelectedOptions, Team } from '../../types';
import Timer from '../../components/Timer';
import { useStore } from '../../useStore';
import { defaultGameInfo } from '../../constants';
import { Helmet } from 'react-helmet';
import { Panel, PanelGroup } from 'react-resizable-panels';
import ResizeHandle from './ResizeHandle';
import Scorecard from './Scorecard';
import QuestionsList from './QuestionsList';

const defaultQuizInfo: QuizInfo = {
  quizId: '',
  name: '',
  categories: [],
};

const defaultSelectedQuestion: IQuestion | null = null;

export default function PlayQuiz({ gameId }) {
  const [quizInfo, setQuizInfo] = useState(defaultQuizInfo);
  const [gameInfo, setGameInfo] = useState(defaultGameInfo);
  const [selectedQuestion, setSelectedQuestion] = useState(defaultSelectedQuestion);
  const { timeLimit, selectionTimeLimit, isQuestionPointsHidden } = gameInfo;
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [winner, setWinner] = useState('');
  const selectedOptionsData: any = gameInfo.teams.reduce(
    (acc, team) => acc.concat(team.selectedOptions || []),
    [] as SelectedOptions[],
  );
  const attemptedQuestionIds = selectedOptionsData.map((x) => x.questionId);
  const isQuestionAttempted = !!selectedQuestion && attemptedQuestionIds.includes(selectedQuestion.questionId);
  const showQuestionTimer = !!timeLimit && !!selectedQuestion && !isQuestionAttempted;
  const { showModal, getGameData, updateGame } = useStore();
  const [isLoading, setIsLoading] = useState(true);

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
          const winners = getWinners(restData.teams);
          const winnerIds = winners.map((winner) => winner.teamId).join(',');
          setWinner(winnerIds);
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

  function showWinner(teams: Team[], callback?: Function) {
    const winners = getWinners(teams);
    const winnerIds = winners.map((winner) => winner.teamId).join(',');
    setWinner(winnerIds);

    if (winners.length > 1) {
      showModal({ title: 'Match drawn!', body: 'Well played! It is a draw!', okCallback: callback });
    } else if (winners[0]) {
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

  async function handleSubmitResponse(optionId: number | null) {
    if (selectedQuestion) {
      const isCorrect = selectedQuestion.options.find((o) => o.optionId === optionId)?.isCorrect;
      const currentTeamIndex = gameInfo.teams.findIndex((t) => t.teamId === gameInfo.currentTeamId);
      const nextTeamIndex = (currentTeamIndex + 1) % gameInfo.teams.length;
      const clonedTeams = gameInfo.teams.map((x) => ({ ...x }));
      const allQuestionCount = getAllQuestions(quizInfo.categories).length;

      if (currentTeamIndex >= 0) {
        const currentTeam = clonedTeams[currentTeamIndex];
        currentTeam.score = (currentTeam.score || 0) + (isCorrect ? selectedQuestion.points : 0);
        currentTeam.selectedOptions.push({
          questionId: selectedQuestion.questionId,
          selectedOptionId: optionId,
        });

        setGameInfo({
          ...gameInfo,
          currentTeamId: parseInt(`${gameInfo.teams[nextTeamIndex].teamId}`),
          teams: clonedTeams,
        });
      }

      setIsTimerRunning(false);
      const isComplete = allQuestionCount === selectedOptionsData.length + 1;
      const winner = isComplete ? showWinner(clonedTeams) : null;

      await updateGame({
        gameId: parseInt(`${gameId}`),
        isComplete,
        winnerTeamId: winner,
        nextTeamId: parseInt(`${gameInfo.teams[nextTeamIndex].teamId}`),
        currentTeam: {
          score: clonedTeams[currentTeamIndex].score,
          selectedOptionId: optionId,
          questionId: parseInt(selectedQuestion.questionId),
          teamId: parseInt(`${clonedTeams[currentTeamIndex].teamId}`),
        },
      });
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
      !winner &&
      isGameStarted
    );
  }

  function getSelectedOptionId(selectedQuestion) {
    const selectedOptionData = selectedOptionsData.find((x) => x.questionId === selectedQuestion.questionId);

    if (selectedOptionData) {
      return selectedOptionData.selectedOptionId;
    } else {
      return '';
    }
  }

  function getWinnerMessage() {
    if (winner.split(',').length > 1) {
      const winnerTeams = gameInfo.teams.filter((x) => winner.includes(x.teamId.toString()));
      const teamNames = winnerTeams
        .map((x) => x.name)
        .join(', ')
        .replace(/,(?=[^,]+$)/, ' and');
      return `${teamNames} have won the game`;
    } else {
      const winnerTeam = gameInfo.teams.find((x) => x.teamId === parseInt(winner));
      return winnerTeam ? `${winnerTeam.name} has won the game with ${winnerTeam.score} points.` : '';
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

  return isLoading ? (
    <></>
  ) : (
    <>
      <Helmet>
        <title>Play Quiz</title>
      </Helmet>
      {quizInfo.name && (
        <Title order={2} mb="xl" pb="xl">
          Play game for {quizInfo.name}
        </Title>
      )}
      <PanelGroup autoSaveId="playQuizPanel" direction="horizontal">
        <Panel defaultSize={20} minSize={20}>
          <QuestionsList
            categories={quizInfo.categories}
            selectedOptionsData={selectedOptionsData}
            teams={gameInfo.teams}
            attemptedQuestionIds={attemptedQuestionIds}
            selectedQuestion={selectedQuestion}
            isQuestionPointsHidden={isQuestionPointsHidden}
            shouldEnableQuestion={shouldEnableQuestion}
            showQuestion={showQuestion}
          />
        </Panel>
        <ResizeHandle />
        <Panel defaultSize={60} maxSize={60}>
          {winner
            ? !selectedQuestion && (
                <Title pt="xl" mt="xl" color="grey" align="center" order={3}>
                  {getWinnerMessage()}
                </Title>
              )
            : shouldShowTimer() &&
              isTimerRunning &&
              (showQuestionTimer ? (
                <Title mb="lg" color="grey" align="center" order={3}>
                  Answer the question before timer ends
                </Title>
              ) : (
                <Title pt="xl" mt="xl" color="grey" align="center" order={3}>
                  Select a question before timer ends
                </Title>
              ))}
          {!!selectedQuestion ? (
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
              winner={winner}
              selectedOptionId={getSelectedOptionId(selectedQuestion)}
            />
          ) : (
            !winner &&
            attemptedQuestionIds.length === 0 &&
            !isGameStarted && (
              <Container mt="xl" pt="xl" className="textAlignCenter">
                <Button size="lg" variant="gradient" radius="md" onClick={startGame}>
                  Start Game
                </Button>
              </Container>
            )
          )}
        </Panel>
        <ResizeHandle />
        <Panel defaultSize={20} minSize={20}>
          {shouldShowTimer() && (
            <Timer
              duration={showQuestionTimer ? timeLimit : selectionTimeLimit}
              handleTimeUp={() => {
                if (showQuestionTimer) {
                  handleSubmitResponse(null);
                } else if (selectionTimeLimit) {
                  selectRandomQuestion();
                }
              }}
              key={showQuestionTimer ? selectedQuestion?.questionId : 'questionSelection'}
              isTimerRunning={isTimerRunning}
              setIsTimerRunning={setIsTimerRunning}
              selectedQuestionId={selectedQuestion?.questionId}
            />
          )}
          <Scorecard teams={gameInfo.teams} currentTeamId={gameInfo.currentTeamId} winner={winner} />
        </Panel>
      </PanelGroup>
    </>
  );
}

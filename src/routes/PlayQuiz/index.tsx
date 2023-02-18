import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { Button, Text, Grid, Accordion, Group, Badge, Title } from '@mantine/core';
import QuestionPlay from '../../components/QuestionPlay';
import { Question as IQuestion, QuizInfo, SelectedOptions, Team } from '../../types';
import styles from './styles.module.css';
import Timer from '../../components/Timer';
import { useStore } from '../../useStore';
import { defaultGameInfo } from '../../constants';
import { Helmet } from 'react-helmet';

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
  const { timeLimit, selectionTimeLimit } = gameInfo;
  const [isPlaying, setIsPlaying] = useState(false);
  const [winner, setWinner] = useState('');
  const selectedOptionsData = gameInfo.teams.reduce(
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
        } else {
          setIsPlaying(!!restData.selectionTimeLimit);
        }

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

  async function handleSubmitResponse(optionId: number | null) {
    if (selectedQuestion) {
      const isCorrect = selectedQuestion.options.find((o) => o.optionId === optionId)?.isCorrect;
      const currentTeamIndex = gameInfo.teams.findIndex((t) => t.teamId === gameInfo.currentTeamId);
      const nextTeamIndex = (currentTeamIndex + 1) % gameInfo.teams.length;
      const clonedTeams = [...gameInfo.teams];
      const allQuestionCount = quizInfo.categories.reduce((count: number, category) => {
        count += category.questions.length;

        return count;
      }, 0);

      if (currentTeamIndex >= 0) {
        const currentTeam = clonedTeams[currentTeamIndex];
        currentTeam.score += isCorrect ? selectedQuestion.points : 0;
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
          selectedOptionId: optionId,
          questionId: parseInt(selectedQuestion.questionId),
          teamId: parseInt(`${clonedTeams[currentTeamIndex].teamId}`),
        },
      });

      setSelectedQuestion(null);
      setIsPlaying(!!gameInfo.selectionTimeLimit && !winner);
    }
  }

  function selectRandomQuestion() {
    const allQuestions = quizInfo.categories.reduce(
      (acc, category) => acc.concat(category.questions),
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
    const category = quizInfo.categories.find((x) => x.categoryId === categoryId);

    if (category) {
      const question = category.questions.find((q) => q.questionId === questionId);

      setSelectedQuestion(question || null);
      setIsPlaying(true);
    }
  }

  function shouldShowTimer() {
    return ((!selectedQuestion && !!selectionTimeLimit) || (selectedQuestion && showQuestionTimer)) && !winner;
  }

  function getSelectedOptionId(selectedQuestion) {
    const selectedOptionData = selectedOptionsData.find((x) => x.questionId === selectedQuestion.questionId);

    if (selectedOptionData) {
      return selectedOptionData.selectedOptionId;
    } else {
      return '';
    }
  }

  function getQuestionColor(question: IQuestion): string {
    if (attemptedQuestionIds.includes(question.questionId)) {
      const correctOptionId = question.options.find((x) => x.isCorrect)?.optionId;
      const selectedOptionId = selectedOptionsData.find((x) => x.questionId === question.questionId)?.selectedOptionId;

      return correctOptionId === selectedOptionId ? 'green' : 'red';
    } else {
      return 'blue';
    }
  }

  function getNameInitials(name) {
    const arr = name.split(' ');

    return arr[0][0].toUpperCase() + (arr[1] ? arr[1][0].toUpperCase() : '');
  }

  function getTeamAvatar(question) {
    if (attemptedQuestionIds.includes(question.questionId)) {
      const team = gameInfo.teams.find((team) =>
        team.selectedOptions.some((x) => x.questionId === question.questionId),
      );

      return team ? (
        <div
          className={`flex justifyCenter alignCenter ${styles.small} ${styles.avatar}`}
          style={{ backgroundColor: team.avatarColor }}>
          {getNameInitials(team.name)}
        </div>
      ) : (
        <div className={`${styles.small} ${styles.avatar}`}></div>
      );
    } else {
      return <div className={`${styles.small} ${styles.avatar}`}></div>;
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
      <Grid columns={12}>
        <Grid.Col span="content" className={styles.categoryGrid}>
          <Accordion multiple defaultValue={quizInfo.categories.map((x) => `${x.categoryId}`)} variant="separated">
            {quizInfo.categories.map((category) => (
              <Accordion.Item key={category.categoryId} value={`${category.categoryId}`}>
                <Accordion.Control>
                  <Title order={6}>{category.categoryName}</Title>
                </Accordion.Control>
                <Accordion.Panel>
                  <Button.Group orientation="vertical">
                    {category.questions.map((question) => (
                      <Button
                        leftIcon={getTeamAvatar(question)}
                        my="sm"
                        radius="md"
                        variant={selectedQuestion?.questionId === question.questionId ? 'filled' : 'light'}
                        color={getQuestionColor(question)}
                        fullWidth
                        onClick={() => showQuestion(question.questionId, category.categoryId)}
                        key={question.questionId}>
                        <Group position="apart">
                          <Text>Question {question.questionNum}</Text>
                          <Badge variant="filled" color="red" size="sm">
                            Points {question.points}
                          </Badge>
                        </Group>
                      </Button>
                    ))}
                  </Button.Group>
                </Accordion.Panel>
              </Accordion.Item>
            ))}
          </Accordion>
        </Grid.Col>
        <Grid.Col span="auto">
          {!!selectedQuestion && (
            <QuestionPlay
              submitResponse={handleSubmitResponse}
              selectedQuestion={selectedQuestion}
              isAttempted={isQuestionAttempted}
              pauseTimer={() => setIsPlaying(false)}
              selectedOptionId={getSelectedOptionId(selectedQuestion)}
            />
          )}
        </Grid.Col>
        <Grid.Col span="content" className={styles.categoryGrid}>
          {shouldShowTimer() && (
            <>
              {showQuestionTimer ? (
                <Title order={6}>Answer the question before timer ends</Title>
              ) : (
                <Title order={6}>Select a question before timer ends</Title>
              )}
              <Timer
                duration={showQuestionTimer ? timeLimit : selectionTimeLimit}
                title={showQuestionTimer ? 'Timer' : 'Selection Timer'}
                handleTimeUp={() => {
                  if (showQuestionTimer) {
                    handleSubmitResponse(null);
                  } else if (selectionTimeLimit) {
                    selectRandomQuestion();
                  }
                }}
                key={showQuestionTimer ? selectedQuestion?.questionId : 'questionSelection'}
                running={isPlaying}
                setIsRunning={setIsPlaying}
                selectedQuestionId={selectedQuestion?.questionId}
              />
            </>
          )}
          <div>
            <Group position="apart" mt="xl" mx="xl" pt="xl">
              <Title order={4}>Team</Title>
              <Title order={4}>Score</Title>
            </Group>
            {gameInfo.teams.some((x) => x.players) ? (
              <Accordion multiple variant="separated">
                {gameInfo.teams.map((team) => (
                  <Accordion.Item key={team.teamId} value={`${team.teamId}`}>
                    <Accordion.Control>
                      <Text>{team.name}</Text>
                    </Accordion.Control>
                    <Accordion.Panel>
                      <ol>
                        {team.players.split(',').map((player) => (
                          <li key={player}>{player}</li>
                        ))}
                      </ol>
                    </Accordion.Panel>
                  </Accordion.Item>
                ))}
              </Accordion>
            ) : (
              gameInfo.teams.map((t: Team) => (
                <Group
                  position="apart"
                  my="xl"
                  mx="xl"
                  key={t.teamId}
                  className={classNames({
                    [styles.currentTeam]: t.teamId === gameInfo.currentTeamId,
                    [styles.team]: true,
                  })}>
                  <Group>
                    <div
                      className={`flex justifyCenter alignCenter ${styles.avatar}`}
                      style={{ backgroundColor: t.avatarColor }}>
                      {getNameInitials(t.name)}
                    </div>
                    <Text size="lg">{t.name}</Text>
                  </Group>
                  <div>
                    {t.score}
                    {t.teamId && winner.includes(`${t.teamId}`) && <span title="winner"> 👑</span>}
                  </div>
                </Group>
              ))
            )}
          </div>
        </Grid.Col>
      </Grid>
    </>
  );
}

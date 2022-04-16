import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { useNavigate, useParams } from 'react-router';
import { Button } from 'semantic-ui-react';
import Question from '../../components/Question';
import QuizGrid from '../../components/QuizGrid';
import { getQuizRun, saveGame } from '../../helpers/quiz';
import { useLoginCheckAndPageTitle } from '../../hooks/useLoginCheckAndPageTitle';
import { Category, Question as IQuestion, QuizInfo, GameInfo } from '../../types';
import styles from './styles.module.css';
import Timer from '../../components/Timer';
import { useAppStore } from '../../useAppStore';
import { formatCategoryInfo } from '../../helpers/quiz';

const defaultQuizInfo: QuizInfo = {
  quizId: '',
  name: '',
  categoryIds: [],
};

const defaultGameInfo: GameInfo = {
  teams: [],
  questionTimer: 0,
  currentTeamId: 0,
  timeLimit: 0,
  selectionTimeLimit: 0,
  isComplete: false,
};

const defaultCategoryInfo: { [key: string]: Category } = {};
const defaultSelectedQuestion: IQuestion | null = null;

export default function PlayQuiz() {
  const { gameId, userName } = useParams();
  const navigate = useNavigate();
  const [quizInfo, setQuizInfo] = useState(defaultQuizInfo);
  const [gameInfo, setGameInfo] = useState(defaultGameInfo);
  // useLoginCheckAndPageTitle(quizInfo.name || '');
  const [categoriesInfo, setCategoriesInfo] = useState(defaultCategoryInfo);
  const [selectedQuestion, setSelectedQuestion] = useState(defaultSelectedQuestion);
  const { questionTimer } = gameInfo;
  const [isPlaying, setIsPlaying] = useState(false);
  const [winner, setWinner] = useState('');
  const attemptedQuestionIds = gameInfo.teams.reduce(
    (acc, team) => acc.concat(Object.keys(team.selectedOptions)),
    [] as string[],
  );
  const isQuestionAttempted = !!selectedQuestion && attemptedQuestionIds.includes(selectedQuestion.id);
  const showQuestionTimer = !!questionTimer && !!selectedQuestion && !isQuestionAttempted;
  const { showAlertModal, getGameData } = useAppStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (gameId) {
      getGameData(parseInt(gameId)).then((game: any) => {
        console.log('gamegamegame', game);
        debugger;
        const { quiz, ...restData } = game;
        const categoryIds = quiz.categories.map((category: any) => category.categoryId);
        setQuizInfo({
          quizId: quiz.id,
          name: quiz.name,
          categoryIds,
        });

        if (categoryIds.length > 0) {
          console.log(formatCategoryInfo(quiz.categories, categoryIds));
          debugger;
          setCategoriesInfo(formatCategoryInfo(quiz.categories, categoryIds));
        }

        setGameInfo(restData);
        setIsLoading(false);
      });
    }
  }, [gameId]);

  // useEffect(() => {
  //   if (id && quizInfo.name) {
  //     getQuizRun(id).then((quizRun: any) => {
  //       if (quizRun) {
  //         setTeams(quizRun.teams);
  //         setAttemptedQuestions(quizRun.attemptedQuestions);
  //         setCurrentTeamId(quizRun.currentTeamId);
  //         setQuestionTimer(quizRun.questionTimer || 0);
  //         setQuestionSelectionTimer(quizRun.questionSelectionTimer || 0);

  //         if (quizRun.isComplete) {
  //           showWinner(quizRun.teams);
  //         }
  //       } else {
  //       }

  //       setIsLoading(false);
  //     });
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [quizInfo.name, id]);

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

  async function handleSubmitResponse(questionId: string, optionId: string) {
    const allQuestions = quizInfo.categoryIds.reduce(
      (acc, catId) => acc.concat(categoriesInfo[catId].questions),
      [] as IQuestion[],
    );
    const question = allQuestions.find((q) => q.id === questionId);
    const attemptedQuestionsCount = gameInfo.teams.reduce(
      (count, team) => count + Object.keys(team.selectedOptions).length,
      0,
    );

    if (question) {
      const isCorrect = question.options.find((o: any) => o.optionId === optionId)?.isCorrect;
      const currentTeamIndex = gameInfo.teams.findIndex((t) => t.teamId === gameInfo.currentTeamId);
      const nextTeamIndex = (currentTeamIndex + 1) % gameInfo.teams.length;
      const clonedTeams = [...gameInfo.teams];

      if (currentTeamIndex >= 0) {
        const currentTeam = clonedTeams[currentTeamIndex];
        currentTeam.score += isCorrect ? question.points : 0;
        currentTeam.selectedOptions = {
          ...currentTeam.selectedOptions,
          [question.id]: parseInt(optionId),
        };

        setGameInfo({
          ...gameInfo,
          currentTeamId: gameInfo.teams[nextTeamIndex].teamId || 0,
          teams: clonedTeams,
        });
      }

      setIsPlaying(false);
      const isComplete = nextTeamIndex === 0 && allQuestions.length - attemptedQuestionsCount < gameInfo.teams.length;
      const winner = isComplete ? showWinner(clonedTeams) : null;

      // await saveGameData({
      //   gameId,
      // });

      // await saveGame(gameId, {
      //   attemptedQuestions: attemptedQuestionsToSet,
      //   quizId: id || '',
      //   quizName: quizInfo.name,
      //   isComplete,
      //   currentTeamId: currentTeamIdToSet,
      //   teams: teamsToSet,
      //   questionTimer,
      //   questionSelectionTimer,
      // });
    }
  }

  function selectRandomQuestion() {
    const allQuestions = quizInfo.categoryIds.reduce(
      (acc, catId) => acc.concat(categoriesInfo[catId].questions),
      [] as IQuestion[],
    );

    const allUnattemptedQuestions = allQuestions.filter(
      (q) => !gameInfo.teams.some((team) => team.selectedOptions[q.id]),
    );
    if (allUnattemptedQuestions.length > 0) {
      setSelectedQuestion(allUnattemptedQuestions[Math.floor(Math.random() * allUnattemptedQuestions.length)]);
      setIsPlaying(true);
    }
  }

  function showQuestion(id: string | number, categoryId: string | number) {
    const catId = quizInfo.categoryIds.find((catId) => catId === categoryId);

    if (catId) {
      const question = categoriesInfo[catId].questions.find((q) => q.id === id);

      setSelectedQuestion(question || null);
      setIsPlaying(true);
    }
  }

  return isLoading ? (
    <></>
  ) : (
    <>
      <div className="flex alignCenter">
        <h1>asda</h1>
        {/* <Button
          onClick={() => navigate(`/edit-quiz/${userName}/${id}`)}
          basic
          color="blue"
          size="mini"
          className="mb-lg ml-xl">
          Edit Quiz
        </Button> */}
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
          selectedQuestionId={selectedQuestion?.id || ''}
        />
        {!!selectedQuestion && (
          <Question
            submitResponse={(optionId: string) => handleSubmitResponse(selectedQuestion.id, optionId)}
            selectedQuestion={selectedQuestion}
            onClose={() => {
              setIsPlaying(!winner);
              setSelectedQuestion(null);
            }}
            isWithoutOptions={selectedQuestion.options.length === 1}
            pauseTimer={() => setIsPlaying(false)}
            selectedOptionsData={gameInfo.teams.reduce(
              (acc: any, team: any) => ({ ...acc, ...team.selectedOptions }),
              {},
            )}
          />
        )}
        <div className={classNames(styles.scoreContainer, 'ml-lg')}>
          {(showQuestionTimer || !!gameInfo.selectionTimeLimit) && !winner && (
            <Timer
              duration={showQuestionTimer ? questionTimer : gameInfo.selectionTimeLimit}
              title={showQuestionTimer ? 'Timer' : 'Selection Timer'}
              handleTimeUp={() => {
                if (showQuestionTimer) {
                  handleSubmitResponse(selectedQuestion.id, '');
                } else if (gameInfo.selectionTimeLimit) {
                  selectRandomQuestion();
                }
              }}
              key={showQuestionTimer ? selectedQuestion.id : 'questionSelection'}
              running={isPlaying}
              setIsRunning={setIsPlaying}
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
          {/* <Button
            color="purple"
            className="mt-xl"
            onClick={async () => {
              await saveGame(gameId, {
                attemptedQuestions,
                quizId: id || '',
                isComplete: true,
                teams,
                quizName: quizInfo.name,
                currentTeamId,
                questionTimer,
                questionSelectionTimer,
              });
              showWinner(teams, () => window.location.reload());
            }}>
            Start a new Game
          </Button> */}
        </div>
      </div>
    </>
  );
}

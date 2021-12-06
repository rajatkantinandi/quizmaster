import classNames from 'classnames';
import { nanoid } from 'nanoid';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Button, Divider, Input } from 'semantic-ui-react';
import Question from '../../components/Question';
import QuizGrid from '../../components/QuizGrid';
import { getQuiz, getQuizRun, saveGame } from '../../helpers/quiz';
import { useLoginCheck } from '../../hooks/useLoginCheck';
import { Category, Question as IQuestion } from '../../types';
import ConfigureGame from './ConfigureGame';
import styles from './styles.module.css';

export default function PlayQuiz() {
  const { id, userName } = useParams();
  useLoginCheck();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [categoriesInfo, setCategoriesInfo] = useState<Category[]>([]);
  const [isConfigured, setIsConfigured] = useState(false);
  const [isQuestionGridExpanded, setIsQuestionGridExpanded] = useState(true);
  const [selectedQuestion, setSelectedQuestion] = useState<IQuestion | null>(null);
  const [teams, setTeams] = useState([
    {
      name: '',
      id: nanoid(),
      score: 0,
    },
    {
      name: '',
      id: nanoid(),
      score: 0,
    },
  ]);
  const [attemptedQuestions, setAttemptedQuestions] = useState<
    {
      id: string;
      isCorrect: boolean;
    }[]
  >([]);
  const [currentTeamId, setCurrentTeamId] = useState('');
  const [gameId, setGameId] = useState('');

  useEffect(() => {
    if (id) {
      getQuiz(id).then((quiz: any) => {
        setName(quiz.name);

        if (quiz.categories && quiz.categories.length > 0) {
          setCategoriesInfo(quiz.categories);
        }
      });
    }
  }, [id]);

  useEffect(() => {
    if (id && name) {
      getQuizRun(id).then((quizRun: any) => {
        if (quizRun) {
          setTeams(quizRun.teams);
          setAttemptedQuestions(quizRun.attemptedQuestions);
          setCurrentTeamId(quizRun.currentTeamId);

          if (quizRun.isComplete) {
            showWinner(quizRun.teams);
          }
          setGameId(quizRun._id);
          setIsConfigured(true);
        } else {
          setGameId(nanoid());
        }
      });
    }
  }, [name, id]);

  function showWinner(teams: any[]) {
    let winner = teams[0];
    let isDraw = false;

    teams.slice(1).forEach((t) => {
      if (t.score === winner.score) {
        isDraw = true;
      } else {
        isDraw = false;

        if (t.score > winner.score) {
          winner = t;
        }
      }
    });

    if (isDraw) {
      alert('Well played! It is a draw!');
    } else {
      alert(`Winner ${winner.name} with ${winner.score} points. Congrats!`);
    }
  }

  useEffect(() => {
    if (teams.length >= 2 && attemptedQuestions.length > 0 && currentTeamId) {
    }
  }, [teams, attemptedQuestions, currentTeamId]);

  async function handleSubmitResponse(questionId: string, optionId: string) {
    const allQuestions = categoriesInfo.reduce((acc, curr) => acc.concat(curr.questions), [] as IQuestion[]);
    const question = allQuestions.find((q) => q.id === questionId);

    if (question) {
      const isCorrect = question.options.some(
        (o) => o.id === optionId && btoa(o.optionText) === question.correctOptionHash,
      );
      const attemptedQuestionsToSet = attemptedQuestions.concat({
        id: questionId,
        isCorrect,
      });
      setAttemptedQuestions(attemptedQuestionsToSet);

      const teamsToSet = [...teams];
      const activeTeamIndex = teamsToSet.findIndex((t) => t.id === currentTeamId);
      let currentTeamIdToSet = currentTeamId;
      const nextTeamIndex = (activeTeamIndex + 1) % teamsToSet.length;

      if (activeTeamIndex !== -1) {
        teamsToSet[activeTeamIndex].score += isCorrect ? question.point : 0;
        setTeams(teamsToSet);
        currentTeamIdToSet = teamsToSet[nextTeamIndex]?.id;
        setCurrentTeamId(currentTeamIdToSet);
      }

      const isComplete = nextTeamIndex === 0 && allQuestions.length - attemptedQuestionsToSet.length < teams.length;

      await saveGame(gameId, {
        attemptedQuestions: attemptedQuestionsToSet,
        quizId: id || '',
        quizName: name,
        isComplete,
        currentTeamId: currentTeamIdToSet,
        teams: teamsToSet,
      });

      if (isComplete) {
        showWinner(teamsToSet);
      }
    }
  }

  return (
    <>
      <div className="flex alignCenter">
        <h1>{name}</h1>
        <Button
          onClick={() => navigate(`/edit-quiz/${userName}/${id}`)}
          basic
          color="blue"
          size="mini"
          className="mb-lg ml-xl">
          Edit Quiz
        </Button>
      </div>
      {!isConfigured && (
        <ConfigureGame
          teams={teams}
          setTeams={setTeams}
          setIsConfigured={setIsConfigured}
          setCurrentTeamId={setCurrentTeamId}
        />
      )}
      {isConfigured && (
        <div className="flex justifyCenter">
          <QuizGrid
            categoriesInfo={categoriesInfo}
            showQuestion={(id, categoryId) => {
              const category = categoriesInfo.find((category) => category.id === categoryId);

              if (category) {
                const question = category.questions.find((q) => q.id === id);

                setSelectedQuestion(question || null);
                setIsQuestionGridExpanded(false);
              }
            }}
            attemptedQuestions={attemptedQuestions}
            isExpanded={isQuestionGridExpanded}
            quizName={name}
            setIsExpanded={setIsQuestionGridExpanded}
            selectedQuestionId={selectedQuestion?.id || ''}
          />
          {!isQuestionGridExpanded && !!selectedQuestion && (
            <Question
              isAttempted={attemptedQuestions.some((q: any) => q.id === selectedQuestion.id)}
              isCorrect={attemptedQuestions.some((q: any) => q.id === selectedQuestion.id && q.isCorrect)}
              correctOptionHash={selectedQuestion.correctOptionHash}
              submitResponse={(optionId: string) => handleSubmitResponse(selectedQuestion.id, optionId)}
              key={selectedQuestion.id}
              text={selectedQuestion.text}
              options={selectedQuestion.options}
            />
          )}
          <div className={classNames(styles.scoreContainer, 'ml-lg')}>
            <table className="mt-lg">
              <tbody>
                <tr>
                  <th>Team</th>
                  <th>Score</th>
                </tr>
                {teams.map((t) => (
                  <tr key={t.id} className={classNames({ [styles.active]: t.id === currentTeamId })}>
                    <td>{t.name}</td>
                    <td>{t.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Button
              color="purple"
              className="mt-xl"
              onClick={async () => {
                await saveGame(gameId, {
                  attemptedQuestions,
                  quizId: id || '',
                  isComplete: true,
                  teams,
                  quizName: name,
                  currentTeamId,
                });
                showWinner(teams);
                window.location.reload();
              }}>
              Start a new Game
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

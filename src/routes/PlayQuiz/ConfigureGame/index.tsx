import classNames from 'classnames';
import { nanoid } from 'nanoid';
import { Button, Checkbox, Input } from 'semantic-ui-react';
import { useAppStore } from '../../../useAppStore';
import styles from './styles.module.css';

interface Props {
  teams: {
    name: string;
    id: string;
    score: number;
  }[];
  setTeams: Function;
  setIsConfigured: Function;
  setCurrentTeamId: Function;
  questionSelectionTimer: number;
  questionTimer: number;
  setQuestionTimer: Function;
  setQuestionSelectionTimer: Function;
}

export default function ConfigureGame({
  teams,
  setTeams,
  setIsConfigured,
  setCurrentTeamId,
  questionTimer,
  questionSelectionTimer,
  setQuestionTimer,
  setQuestionSelectionTimer,
}: Props) {
  const { showErrorModal } = useAppStore();

  function validateTeamNames(): boolean {
    if (teams.some((team) => team.name.trim().length === 0)) {
      showErrorModal({ message: 'Team names cannot be empty!' });
      return false;
    }

    return true;
  }

  return (
    <div className="flex flexCol">
      <div className="flex flexWrap">
        <fieldset className="container-md mr-xl mb-lg">
          <legend>Teams</legend>
          {teams.map((team, idx) => (
            <Input
              label={`Team ${idx + 1} name`}
              value={team.name}
              key={team.id}
              onChange={(ev) =>
                setTeams(
                  teams.map((p) => {
                    if (p.id === team.id) {
                      return { ...p, name: ev.target.value };
                    } else {
                      return p;
                    }
                  }),
                )
              }
            />
          ))}
          <div className="flex mb-lg">
            <Button
              onClick={() => setTeams(teams.concat({ id: nanoid(), name: '', score: 0 }))}
              color="blue"
              className="mr-lg">
              Add team
            </Button>
            {teams.length > 2 && (
              <Button onClick={() => setTeams(teams.slice(0, -1))} color="red">
                Remove last team
              </Button>
            )}
          </div>
        </fieldset>
        <fieldset className={classNames('container-md', styles.timing)}>
          <legend>Timing</legend>
          <div className="flex alignCenter">
            <Checkbox
              label="Limited time per question (in seconds)"
              checked={!!questionTimer}
              onChange={() => setQuestionTimer(questionTimer ? 0 : 120)}
            />
            <Input
              type="number"
              value={questionTimer}
              disabled={!questionTimer}
              onChange={(ev) => setQuestionTimer(parseInt(ev.target.value, 10))}
              size="mini"
              className={classNames('ml-lg', styles.timeInput)}
            />
          </div>
          <div className="flex alignCenter">
            <Checkbox
              label="Limited for choosing a question (in seconds)"
              checked={!!questionSelectionTimer}
              onChange={(ev) => {
                setQuestionSelectionTimer(questionSelectionTimer ? 0 : 120);
              }}
            />
            <Input
              type="number"
              value={questionSelectionTimer}
              disabled={!questionSelectionTimer}
              onChange={(ev) => setQuestionSelectionTimer(parseInt(ev.target.value, 10))}
              size="mini"
              className={classNames('ml-lg', styles.timeInput)}
            />
          </div>
        </fieldset>
      </div>
      <Button
        color="orange"
        className="mb-lg mt-xl ml-lg"
        size="huge"
        onClick={() => {
          if (!validateTeamNames()) {
            return;
          }

          setIsConfigured(true);
          setCurrentTeamId(teams[0].id);
        }}>
        Play
      </Button>
    </div>
  );
}

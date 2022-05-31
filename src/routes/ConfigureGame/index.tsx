import React, { useState } from 'react';
import classNames from 'classnames';
import { Button, Checkbox, Icon, Input } from 'semantic-ui-react';
import { useAppStore } from '../../useAppStore';
import styles from './styles.module.css';
import { useForm, FieldValues } from 'react-hook-form';
import FormInput from '../../components/FormInput';
import { useParams, useNavigate } from 'react-router';
import { Team } from '../../types';
import { getEmptyTeam } from '../../helpers';
import TeamGenerator from '../../components/TeamGenerator';

const formDefaultValues: { teams: Team[] } = {
  teams: [0, 1].map((index) => getEmptyTeam()),
};

export default function ConfigureGame() {
  const { quizId, userName } = useParams();
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
  } = useForm({ defaultValues: formDefaultValues });

  const [teamCount, setTeamCount] = useState(0);
  const [showTeamGenerator, setShowTeamGenerator] = useState(false);
  const [questionTimer, setQuestionTimer] = useState(0);
  const [questionSelectionTimer, setQuestionSelectionTimer] = useState(0);
  const [isQuestionPointsHidden, setIsQuestionPointsHidden] = useState(false);
  const teams = getValues('teams');
  const { addGame } = useAppStore();

  function addTeam() {
    setValue('teams', teams.concat(getEmptyTeam()));
    setTeamCount(teams.length + 1);
  }

  function removeTeam() {
    setValue('teams', teams.slice(0, -1));
    setTeamCount(teams.length - 1);
  }

  async function handleGameConfig(data: FieldValues) {
    if (quizId) {
      const { gameId } = await addGame({
        teams: data.teams.map((team: Team) => {
          delete team.teamId;
          return team;
        }),
        quizId: parseInt(quizId),
        timeLimit: questionTimer,
        selectionTimeLimit: questionSelectionTimer,
        isQuestionPointsHidden,
      });

      navigate(`/play-game/${userName}/${gameId}`);
    }
  }

  return (
    <form className="flex flexCol" onSubmit={handleSubmit(handleGameConfig)}>
      <div className="flex flexWrap">
        <fieldset className="container-md mr-xl mb-lg">
          <legend>Teams</legend>
          {teams.map((team, idx) => (
            <FormInput
              name={`teams[${idx}].name`}
              control={control}
              rules={{ required: 'Team names cannot be empty!' }}
              errorMessage={errors?.teams?.[idx]?.name?.message || ''}
              inputProps={{
                label: `Team ${idx + 1} name`,
              }}
              key={team.teamId}
            />
          ))}
          <div className="flex mb-lg">
            <Button onClick={addTeam} color="blue" className="mr-lg">
              Add team
            </Button>
            {teams.length > 2 && (
              <Button onClick={removeTeam} color="red">
                Remove last team
              </Button>
            )}
          </div>
          <Button className="mt-lg" size="large" onClick={() => setShowTeamGenerator(true)} color="facebook">
            <Icon name="random" /> Random team generator
          </Button>
        </fieldset>
        <fieldset className={classNames('container-md', styles.settings)}>
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
              className={classNames('ml-lg', styles.settingsInput)}
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
              className={classNames('ml-lg', styles.settingsInput)}
            />
          </div>
        </fieldset>
        <fieldset className={classNames('container-md mt-lg', styles.settings)}>
          <legend>Points</legend>
          <Checkbox
            label="Hide question points until revealed"
            checked={isQuestionPointsHidden}
            onChange={() => setIsQuestionPointsHidden(!isQuestionPointsHidden)}
          />
        </fieldset>
      </div>
      <Button color="orange" className="mb-lg mt-xl ml-lg" size="large" type="submit">
        Play
      </Button>
      {showTeamGenerator && (
        <TeamGenerator
          okCallback={(teams: any) => {
            setValue('teams', teams);
            setTeamCount(teams.length);
          }}
          numOfTeams={teams.length}
          hideModal={() => setShowTeamGenerator(false)}
        />
      )}
    </form>
  );
}

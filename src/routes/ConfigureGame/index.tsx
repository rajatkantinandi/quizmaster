import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useStore } from '../../useStore';
import { useForm, FieldValues, useFieldArray } from 'react-hook-form';
import { FormInput } from '../../components/FormInputs';
import { useNavigate } from 'react-router';
import { Team } from '../../types';
import { getEmptyTeam } from '../../helpers';
import TeamGenerator from '../../components/TeamGenerator';
import { Helmet } from 'react-helmet';
import Icon from '../../components/Icon';
import styles from './styles.module.css';
import classNames from 'classnames';
import { TrackingEvent } from '../../constants';
import { track } from '../../helpers/track';

interface DefaultValue {
  teams: Team[];
  timeLimit: null | number;
  selectionTimeLimit: null | number;
  isQuestionPointsHidden: boolean;
  negativePointsMultiplier: number;
  mode: 'manual' | 'automatic';
  players: string[];
}

const formDefaultValues: DefaultValue = {
  teams: [0, 1].map(() => getEmptyTeam()),
  timeLimit: null,
  selectionTimeLimit: null,
  isQuestionPointsHidden: false,
  negativePointsMultiplier: 0,
  mode: 'manual',
  players: [],
};

export default function ConfigureGame({ quizId, userName = 'guest' }) {
  const navigate = useNavigate();
  const { control, handleSubmit, setValue, watch } = useForm({ defaultValues: formDefaultValues });
  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: 'teams',
  });
  const [quizName, setQuizName] = useState('');
  const [numOfCategories, setNumOfCategories] = useState(0);
  const [numOfQuestions, setNumOfQuestions] = useState(0);
  const { teams, timeLimit, selectionTimeLimit, isQuestionPointsHidden, negativePointsMultiplier, mode, players } =
    watch();
  const { getQuiz, addGame, showModal } = useStore();

  useEffect(() => {
    getQuiz(quizId, false).then((x) => {
      setQuizName(x.name);
      setNumOfCategories(x.categories.length);
      setNumOfQuestions(x.categories.reduce((acc, category) => acc + category.questions.length, 0));
    });
  }, [getQuiz, quizId]);

  async function handleGameConfig(data: FieldValues) {
    if (quizId) {
      const { teams, timeLimit, selectionTimeLimit, isQuestionPointsHidden, negativePointsMultiplier } = data;
      const { gameId } = await addGame({
        teams: teams.map((x) => {
          x.players = x.players || '';

          return x;
        }),
        quizId: parseInt(quizId),
        timeLimit: timeLimit || 0,
        selectionTimeLimit: selectionTimeLimit || 0,
        isQuestionPointsHidden,
        negativePointsMultiplier,
      });
      track(TrackingEvent.START_GAME, {
        quizName,
        usedRandomTeamGenerator: mode === 'automatic',
        timeLimit: timeLimit || 0,
        selectionTimeLimit: selectionTimeLimit || 0,
        isQuestionPointsHidden,
        negativePointsMultiplier,
        numOfCategories,
        numOfQuestions,
        numOfTeams: teams.length,
        numOfPlayers: players.length,
      });

      navigate(`/play-game/${userName}/${gameId}`);
    }
  }

  function submitGameForm() {
    document.getElementById('btnGameFormSubmit')?.click();
  }

  function showTeamGenerator() {
    showModal({
      title: 'Generate team randomly',
      body: (
        <TeamGenerator
          players={players.length > 0 ? players.join(',').replaceAll(',', '\n') : ''}
          teams={teams}
          teamCount={teams.length > 0 ? teams.length : 2}
          createTeams={({ teams, players, mode }) => {
            setValue('players', players);
            setValue('mode', mode);
            replace([]); // Removing empty teams data
            replace(
              teams.map((x) => ({
                ...getEmptyTeam(),
                ...x,
              })),
            ); // Adding new teams data
            showModal(null);

            track(TrackingEvent.USED_RANDOM_TEAM_GENERATOR, {
              quizName,
              numOfCategories,
              numOfQuestions,
              numOfTeams: teams.length,
              numOfPlayers: players.reduce((sum, curr) => sum + curr.split(',').length, 0),
            });
          }}
        />
      ),
      disableOkButton: true,
      okText: 'Continue',
      closeOnOkClick: false,
      okCallback: () => document.getElementById('teamNameFormSubmit')?.click(),
    });

    track(TrackingEvent.OPENED_RANDOM_TEAM_GENERATOR, {
      quizName,
      numOfCategories,
      numOfQuestions,
    });
  }

  const shouldBeMoreThanZero = (value: number) => {
    return value === null || value > 0 || 'Should be more than 0';
  };

  return (
    <div className="grid grid-cols-12">
      <Helmet>
        <title>Create Game</title>
      </Helmet>
      <div className={classNames('fullWidth', styles.scrollable)}>
        <div className="col-span-6 col-start-3 lg:col-span-6 md:col-span-8 sm:col-span-10 px-lg mx-lg mb-xl">
          {quizName && <h2 className="text-2xl font-bold mb-xl pb-lg flex items-end">Configure game for {quizName}</h2>}
          <form onSubmit={handleSubmit(handleGameConfig)}>
            <h4 className="text-lg font-semibold">Team names</h4>
            {fields.map((team, idx) => (
              <div className={`flex items-center gap-2 grow mb-md ${styles.teamInputWrapper}`}>
                <span className={`font-bold ${styles.teamInputCount}`}>{idx + 1}.</span>
                <FormInput
                  name={`teams.${idx}.name`}
                  id={`teams.${idx}.name`}
                  rules={{ required: 'Please enter team name' }}
                  type="text"
                  variant="filled"
                  placeholder="Enter team name"
                  className={classNames({
                    [styles.teamInput]: true,
                    [styles.inputWithPlayerNames]: mode === 'automatic',
                  })}
                  size="md"
                  control={control}
                  my="md"
                />
                {mode === 'automatic' && (
                  <span className={`text-sm text-gray-500 ${styles.playerNames}`}>{players[idx]}</span>
                )}
                {fields.length > 2 ? (
                  <Button size="icon" variant="ghost" className={styles.teamInputCount} onClick={() => remove(idx)}>
                    <Icon width={20} name="trash" />
                  </Button>
                ) : (
                  <div className={styles.teamInputCount}></div>
                )}
              </div>
            ))}
            <div className="my-xl">
              {mode !== 'automatic' && (
                <>
                  <Button
                    onClick={() => append(getEmptyTeam())}
                    className={styles.button}
                    variant="default"
                    leftIcon={<Icon name="plus" width={18} />}
                  >
                    Add team
                  </Button>
                  <Separator className="my-xl" />
                  <p className="text-center font-bold text-lg my-xl">OR</p>
                </>
              )}
              <Button
                variant="default"
                className={styles.button}
                leftIcon={<Icon color="white" name="randomTeam" width={20} />}
                onClick={showTeamGenerator}
              >
                Random team generator
              </Button>
            </div>
            <h4 className="text-lg font-semibold pt-xl mb-sm">Points</h4>
            <div className="flex items-center gap-2 mb-xl ml-md">
              <Checkbox
                id="isQuestionPointsHidden"
                checked={isQuestionPointsHidden}
                onCheckedChange={() => {
                  setValue('isQuestionPointsHidden', !isQuestionPointsHidden);
                }}
              />
              <label htmlFor="isQuestionPointsHidden">Hide points until the question is revealed</label>
            </div>
            <div className="flex justify-between items-center mb-xl">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="negativePoints"
                  checked={negativePointsMultiplier !== 0}
                  onCheckedChange={() => {
                    if (negativePointsMultiplier === 0) {
                      setValue('negativePointsMultiplier', -0.25);
                    } else {
                      setValue('negativePointsMultiplier', 0);
                    }
                  }}
                />
                <label htmlFor="negativePoints">Allow negative points for incorrect response</label>
              </div>
              <Select
                value={negativePointsMultiplier.toString()}
                onValueChange={(value) => {
                  setValue('negativePointsMultiplier', parseFloat(value || '-0.25'));
                }}
                disabled={negativePointsMultiplier === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Negative points" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="-0.25">1/4 of question points</SelectItem>
                  <SelectItem value="-0.33">1/3 of question points</SelectItem>
                  <SelectItem value="-0.5">1/2 of question points</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <h4 className="text-lg font-semibold pt-xl mb-sm">Time limits</h4>
            <div className="flex justify-between items-center mb-xl">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="timeLimit"
                  checked={timeLimit !== null}
                  onCheckedChange={() => {
                    if (timeLimit === null) {
                      setValue('timeLimit', 30);
                    } else {
                      setValue('timeLimit', null);
                    }
                  }}
                />
                <label htmlFor="timeLimit">Time limit per question (in seconds)</label>
              </div>
              <FormInput
                name="timeLimit"
                id="timeLimit"
                disabled={timeLimit === null}
                rules={{
                  validate: shouldBeMoreThanZero,
                }}
                type="number"
                size="md"
                className={styles.timeInput}
                control={control}
              />
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="selectionTimeLimit"
                  checked={selectionTimeLimit !== null}
                  onCheckedChange={() => {
                    if (selectionTimeLimit === null) {
                      setValue('selectionTimeLimit', 30);
                    } else {
                      setValue('selectionTimeLimit', null);
                    }
                  }}
                />
                <label htmlFor="selectionTimeLimit">Time limit to choose a question (in seconds)</label>
              </div>
              <FormInput
                name="selectionTimeLimit"
                id="selectionTimeLimit"
                disabled={selectionTimeLimit === null}
                rules={{
                  validate: shouldBeMoreThanZero,
                }}
                type="number"
                size="md"
                className={styles.timeInput}
                control={control}
              />
            </div>
            <button className="displayNone" id="btnGameFormSubmit" type="submit">
              Submit
            </button>
          </form>
        </div>
      </div>
      <div className="col-span-6 col-start-4 mt-md">
        <Button
          onClick={submitGameForm}
          variant="default"
          size="lg"
          className="w-full"
          leftIcon={<Icon name="done" color="#ffffff" />}
        >
          Play Game
        </Button>
      </div>
    </div>
  );
}

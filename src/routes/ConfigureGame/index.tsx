import React, { useState, useEffect } from 'react';
import { Title, Divider, Button, ActionIcon, Text, Checkbox, Grid, Group, Container, Select } from '@mantine/core';
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

interface DefaultValue {
  teams: Team[];
  timeLimit: null | number;
  selectionTimeLimit: null | number;
  isQuestionPointsHidden: boolean;
  negativePointsMultiplier: number;
  mode: string;
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
  const { teams, timeLimit, selectionTimeLimit, isQuestionPointsHidden, negativePointsMultiplier, mode, players } =
    watch();
  const { getQuiz, addGame, showModal } = useStore();

  useEffect(() => {
    getQuiz(quizId, false).then((x) => {
      setQuizName(x.name);
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
          }}
        />
      ),
      disableOkButton: true,
      okText: 'Continue',
      closeOnOkClick: false,
      okCallback: () => document.getElementById('teamNameFormSubmit')?.click(),
    });
  }

  const shouldBeMoreThanZero = (value: number) => {
    return value === null || value > 0 || 'Should be more than 0';
  };

  return (
    <Grid columns={12}>
      <Helmet>
        <title>Create Game</title>
      </Helmet>
      <Grid.Col lg={6} md={8} sm={10} px="lg" mx="lg" pb="xl" mb="xl">
        {quizName && (
          <Title order={2} mb="xl">
            Configure game for {quizName}
          </Title>
        )}
        <form onSubmit={handleSubmit(handleGameConfig)}>
          <Title order={4}>Team names</Title>
          {fields.map((team, idx) => (
            <Group position="left" grow key={idx} className={styles.teamInputWrapper}>
              <Text weight="bold" className={styles.teamInputCount}>
                {idx + 1}.
              </Text>
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
                <Text color="dimmed" size="sm" className={styles.playerNames}>
                  {players[idx]}
                </Text>
              )}
              {fields.length > 2 ? (
                <ActionIcon variant="transparent" className={styles.teamInputCount} onClick={() => remove(idx)}>
                  <Icon width={20} name="trash" />
                </ActionIcon>
              ) : (
                <div className={styles.teamInputCount}></div>
              )}
            </Group>
          ))}
          <Container my="xl">
            {mode !== 'automatic' && (
              <>
                <Button
                  mt="xl"
                  onClick={() => append(getEmptyTeam())}
                  className={styles.button}
                  variant="default"
                  leftIcon={<Icon name="plus" width={18} />}>
                  Add team
                </Button>
                <Divider
                  my="xl"
                  labelProps={{ weight: 'bold', size: 'md' }}
                  label="OR"
                  labelPosition="center"
                  color="black"
                />
              </>
            )}
            <Button
              variant="filled"
              className={styles.button}
              leftIcon={<Icon color="white" name="randomTeam" width={20} />}
              onClick={showTeamGenerator}>
              Random team generator
            </Button>
          </Container>
          <Title pt="xl" mb="sm" order={4}>
            Points
          </Title>
          <Checkbox
            radius="xl"
            size="md"
            mb="xl"
            ml="md"
            name="isQuestionPointsHidden"
            checked={isQuestionPointsHidden}
            label="Hide points until the question is revealed"
            onChange={() => {
              setValue('isQuestionPointsHidden', !isQuestionPointsHidden);
            }}
          />
          <Group position="apart" mb="xl">
            <Checkbox
              radius="xl"
              size="md"
              mb="xs"
              ml="md"
              label="Allow negative points for incorrect response"
              checked={negativePointsMultiplier !== 0}
              onChange={() => {
                if (negativePointsMultiplier === 0) {
                  setValue('negativePointsMultiplier', -0.25);
                } else {
                  setValue('negativePointsMultiplier', 0);
                }
              }}
            />
            <Select
              placeholder="Negative points"
              data={[
                {
                  value: '-0.25',
                  label: '1/4 of question points',
                },
                {
                  value: '-0.33',
                  label: '1/3 of question points',
                },
                {
                  value: '-0.5',
                  label: '1/2 of question points',
                },
              ]}
              value={negativePointsMultiplier.toString()}
              id="negativePointsMultiplier"
              disabled={negativePointsMultiplier === 0}
              onChange={(value) => {
                setValue('negativePointsMultiplier', parseFloat(value || '-0.25'));
              }}
            />
          </Group>
          <Title pt="xl" mb="sm" order={4}>
            Time limits
          </Title>
          <Group position="apart" mb="xl">
            <Checkbox
              radius="xl"
              size="md"
              mb="xs"
              ml="md"
              label="Time limit per question (in seconds)"
              checked={timeLimit !== null}
              onChange={() => {
                if (timeLimit === null) {
                  setValue('timeLimit', 30);
                } else {
                  setValue('timeLimit', null);
                }
              }}
            />
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
          </Group>
          <Group position="apart">
            <Checkbox
              radius="xl"
              size="md"
              mb="xs"
              ml="md"
              label="Time limit to choose a question (in seconds)"
              checked={selectionTimeLimit !== null}
              onChange={() => {
                if (selectionTimeLimit === null) {
                  setValue('selectionTimeLimit', 30);
                } else {
                  setValue('selectionTimeLimit', null);
                }
              }}
            />
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
          </Group>
          <button className="displayNone" id="btnGameFormSubmit" type="submit">
            Submit
          </button>
        </form>
      </Grid.Col>
      <Grid.Col span={6} offset={3} mt="xl" pt="xl">
        <Button
          onClick={submitGameForm}
          variant="gradient"
          size="lg"
          fullWidth
          leftIcon={<Icon name="done" color="#ffffff" />}>
          Play Game
        </Button>
      </Grid.Col>
    </Grid>
  );
}

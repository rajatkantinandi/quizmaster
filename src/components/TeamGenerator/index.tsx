import React, { useState } from 'react';
import { Divider, Button, Text, Checkbox, Group } from '@mantine/core';
import { getCommaSeparatedStringWithAndBeforeTheLastItem } from '../../helpers';
import { FormTextArea, FormInput } from '../FormInputs';
import { useForm } from 'react-hook-form';
import Icon from '../../components/Icon';
import styles from './styles.module.css';
import { useStore } from '../../useStore';

export default function TeamGenerator({ createTeams, ...rest }) {
  const [editTeams, setEditTeams] = useState(!!rest.players);
  const [showTeams, setShowTeams] = useState(!!rest.players);
  const [players, setPlayers] = useState<string[]>(rest.teams.map((x) => x.players));
  const { showAlert } = useStore();
  const [, setRefresh] = useState(0);
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({
    defaultValues: {
      playerNames: rest.players,
      teamCount: rest.teamCount,
    },
  });
  const teamsForm = useForm({
    defaultValues: {
      teams:
        rest.teams.length > 0
          ? rest.teams
              .map((x) => x.name)
              .join(',')
              .replaceAll(',', '\n')
          : '',
    },
  });
  const teamList = teamsForm
    .getValues('teams')
    .split('\n')
    .filter((x) => !!x);

  function generateTeams(data) {
    const { teamCount, playerNames } = data;
    const count = parseInt(teamCount);
    const teamsPlayers = new Array<string[]>(count);

    let validPlayerNames = playerNames
      .split('\n')
      .map((name) => name.trim())
      .filter((name) => !!name);

    if (validPlayerNames.length < count) {
      showAlert({
        message: 'Players count should not be less than number of teams',
        type: 'error',
      });

      return;
    }
    const minPlayersPerTeam = Math.floor(validPlayerNames.length / count);

    for (let i = 0; i < teamsPlayers.length; i++) {
      teamsPlayers[i] = [];

      while (teamsPlayers[i].length < minPlayersPerTeam) {
        const playerIndex = Math.floor(Math.random() * validPlayerNames.length);
        const playerName = validPlayerNames[playerIndex];
        teamsPlayers[i].push(playerName);
        validPlayerNames.splice(playerIndex, 1);
      }
    }
    // Push remaining players
    for (let i = 0; i < validPlayerNames.length; i++) {
      teamsPlayers[i].push(validPlayerNames[i]);
    }

    teamsForm.setValue(
      'teams',
      teamsPlayers.map((playerNames) => getCommaSeparatedStringWithAndBeforeTheLastItem(playerNames)).join('\n'),
    );
    setPlayers(teamsPlayers.map((playerList) => playerList.join(',')));
    setShowTeams(true);
  }

  function submitTeamNamesForm({ teams }) {
    createTeams({
      teams: teams.split('\n').map((name, idx) => ({
        name,
        players: players[idx],
        avatarColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      })),
      players,
      mode: 'automatic',
    });
  }

  const shouldBeMoreThanOne = (value: number) => value >= 2 || 'Should be more than 1';
  const validateNumberOfTeams = (value: string) =>
    value.split('\n').length === parseInt(getValues('teamCount').toString()) ||
    `Number of teams should not be more than ${getValues('teamCount')}`;

  return (
    <>
      <form
        onSubmit={handleSubmit(generateTeams)}
        onChange={() => {
          if (showTeams) {
            setShowTeams(false);
          }
        }}>
        <Text mt="lg" mb="md">
          Enter one player name in each line or paste names from a spreadsheet column (Excel, Google sheet, etc.).
        </Text>
        <FormTextArea
          placeholder="Enter player names"
          rules={{ required: 'Please enter player names' }}
          name="playerNames"
          id="playerNames"
          variant="filled"
          size="md"
          radius="md"
          minRows={7}
          register={register}
          errorMessage={errors.playerNames?.message || ''}
        />
        <Group position="apart" my="xl" py="sm">
          <Group mb="xl">
            <Text weight="bolder">Number of teams</Text>
            <FormInput
              name="teamCount"
              id="teamCount"
              className={styles.teamsInput}
              rules={{
                required: 'Please enter team count',
                validate: shouldBeMoreThanOne,
              }}
              errorMessage={errors.teamCount?.message || ''}
              type="number"
              variant="filled"
              size="md"
              radius="md"
              min={2}
              register={register}
            />
          </Group>
          <Button mb="xl" type="submit" radius="md" variant="default" leftIcon={<Icon name="plus" width={18} />}>
            Generate team
          </Button>
        </Group>
      </form>
      {showTeams && (
        <>
          <Checkbox
            radius="xl"
            size="md"
            mb="xl"
            checked={editTeams}
            label="Edit team names?"
            onChange={() => setEditTeams(!editTeams)}
          />
          <Text my="xl">
            Edit team names one team per line or paste team names from a spreadsheet column (Excel, Google sheet, etc.).
          </Text>
          <form onSubmit={teamsForm.handleSubmit(submitTeamNamesForm)} onChange={() => setRefresh(Math.random())}>
            <FormTextArea
              placeholder="Enter team names"
              rules={{
                required: 'Please enter team names',
                validate: validateNumberOfTeams,
              }}
              name="teams"
              id="teams"
              variant="filled"
              disabled={!editTeams}
              size="md"
              radius="md"
              minRows={5}
              register={teamsForm.register}
              errorMessage={teamsForm.formState.errors.teams?.message || ''}
            />
            <button className="displayNone" id="teamNameFormSubmit" type="submit">
              Submit
            </button>
          </form>
          {teamList.length > 0 && (
            <>
              <Divider my="xl" />
              <Text>Teams</Text>
              <ol>
                {teamsForm
                  .getValues('teams')
                  .split('\n')
                  .filter((x) => !!x)
                  .map((team, idx) => (
                    <li key={idx}>
                      {team} {players[idx] ? `(${players[idx]})` : ''}
                    </li>
                  ))}
              </ol>
            </>
          )}
        </>
      )}
    </>
  );
}

import React, { useState, useEffect } from 'react';
import { Divider, Button, Text, Checkbox, Group } from '@mantine/core';
import {
  getCommaSeparatedStringWithAndBeforeTheLastItem,
  getRandomColor,
  getValidValuesFromColumns,
} from '../../helpers';
import { FormTextArea, FormInput } from '../FormInputs';
import { useForm } from 'react-hook-form';
import Icon from '../../components/Icon';
import styles from './styles.module.css';
import { useStore } from '../../useStore';
import { Team } from '../../types';

interface Props {
  createTeams: Function;
  players: string;
  teams: Team[];
  teamCount: number;
}

export default function TeamGenerator({ createTeams, ...rest }: Props) {
  const [isEditingTeams, setIsEditingTeams] = useState(!!rest.players);
  const [shouldShowTeams, setShouldShowTeams] = useState(!!rest.players);
  const [players, setPlayers] = useState<string[]>(rest.teams.map((x) => x.players));
  const { showAlert, enableOkButton, disableOkButton } = useStore();
  const { control, handleSubmit, watch } = useForm({
    defaultValues: {
      playerNames: rest.players,
      teamCount: rest.teamCount,
    },
  });
  const { playerNames, teamCount } = watch();
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
  const teamsData = teamsForm.watch('teams');
  const teamList = getValidValuesFromColumns(teamsData);

  useEffect(() => {
    if (shouldShowTeams) {
      setShouldShowTeams(false);
      setIsEditingTeams(false);
      disableOkButton();
    }
  }, [playerNames, teamCount]);

  function generateTeams(data) {
    const { teamCount, playerNames } = data;
    const count = parseInt(teamCount);
    const teamsPlayers = new Array<string[]>(count);

    let validPlayerNames = getValidValuesFromColumns(playerNames);

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
    setShouldShowTeams(true);
    enableOkButton();
  }

  function submitTeamNamesForm({ teams }) {
    createTeams({
      teams: teams.split('\n').map((name, idx) => ({
        name,
        players: players[idx],
        avatarColor: getRandomColor(),
      })),
      players,
      mode: 'automatic',
    });
  }

  const shouldBeMoreThanOne = (value: number) => value >= 2 || 'Should be more than 1';
  const validateNumberOfTeams = (value: string) =>
    value.split('\n').length === parseInt(`${teamCount}`) || `Number of teams should not be more than ${teamCount}`;

  return (
    <>
      <form onSubmit={handleSubmit(generateTeams)}>
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
          minRows={7}
          control={control}
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
              type="number"
              variant="filled"
              size="md"
              min={2}
              control={control}
            />
          </Group>
          <Button
            disabled={isEditingTeams}
            mb="xl"
            type="submit"
            variant="default"
            leftIcon={<Icon name="team" width={20} />}>
            Generate team
          </Button>
        </Group>
      </form>
      {shouldShowTeams && (
        <>
          <Checkbox
            radius="xl"
            size="md"
            mb="xl"
            checked={isEditingTeams}
            label="Edit team names?"
            onChange={() => setIsEditingTeams(!isEditingTeams)}
          />
          <Text my="xl">
            Edit team names one team per line or paste team names from a spreadsheet column (Excel, Google sheet, etc.).
          </Text>
          <form onSubmit={teamsForm.handleSubmit(submitTeamNamesForm)}>
            <FormTextArea
              placeholder="Enter team names"
              rules={{
                required: 'Please enter team names',
                validate: validateNumberOfTeams,
              }}
              name="teams"
              id="teams"
              variant="filled"
              disabled={!isEditingTeams}
              size="md"
              minRows={5}
              control={teamsForm.control}
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
                {getValidValuesFromColumns(teamsData).map((team, idx) => (
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

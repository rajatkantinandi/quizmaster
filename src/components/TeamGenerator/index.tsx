import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import {
  getCommaSeparatedStringWithAndBeforeTheLastItem,
  getRandomColor,
  getValidValuesFromColumns,
} from '../../helpers';
import { FormTextArea, FormInput } from '../FormInputs';
import { useForm } from 'react-hook-form';
import Icon from '../../components/Icon';
import { useStore } from '../../useStore';
import { Team } from '../../types';

interface Props {
  createTeams: (params: {
    players: string[];
    teams: {
      name: string;
      players: string;
      avatarColor: string;
    }[];
    mode: 'manual' | 'automatic';
  }) => void;
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
  }, [playerNames, teamCount, shouldShowTeams, disableOkButton]);

  function generateTeams(data: { teamCount: number; playerNames: string }) {
    const count = data.teamCount;

    let validPlayerNames = getValidValuesFromColumns(data.playerNames);

    if (validPlayerNames.length < count) {
      showAlert({
        message: 'Players count should not be less than number of teams',
        type: 'error',
      });

      return;
    }
    const minPlayersPerTeam = Math.floor(validPlayerNames.length / count);
    const teamsPlayers: string[][] = new Array(count);

    for (let i = 0; i < teamsPlayers.length; i++) {
      teamsPlayers[i] = [];

      while (teamsPlayers[i].length < minPlayersPerTeam) {
        const playerIndex = Math.floor(Math.random() * validPlayerNames.length);
        const playerName = validPlayerNames[playerIndex];
        teamsPlayers[i].push(playerName);
        validPlayerNames.splice(playerIndex, 1);
      }
    }
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

  function submitTeamNamesForm({ teams: teamsValue }: { teams: string }) {
    createTeams({
      teams: teamsValue.split('\n').map((name, idx) => ({
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
        <p className="mt-4 mb-4">
          Enter one player name in each line or paste names from a spreadsheet column (Excel, Google sheet, etc.).
        </p>
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
        <div className="flex justify-between items-center my-6 py-2">
          <div className="flex items-center gap-2 mb-4">
            <span className="font-bold">Number of teams</span>
            <FormInput
              name="teamCount"
              id="teamCount"
              className="w-[15%]"
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
          </div>
          <Button
            disabled={isEditingTeams}
            mb-4
            type="submit"
            variant="default-button"
            leftIcon={<Icon name="team" width={20} />}
          >
            Generate team
          </Button>
        </div>
      </form>
      {shouldShowTeams && (
        <>
          <div className="flex items-center gap-2 mb-4">
            <Checkbox
              id="edit-teams"
              checked={isEditingTeams}
              onCheckedChange={() => setIsEditingTeams(!isEditingTeams)}
            />
            <label htmlFor="edit-teams" className="text-sm cursor-pointer">
              Edit team names?
            </label>
          </div>
          <p className="my-4">
            Edit team names one team per line or paste team names from a spreadsheet column (Excel, Google sheet, etc.).
          </p>
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
              <Separator className="my-4" />
              <p className="font-medium">Teams</p>
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

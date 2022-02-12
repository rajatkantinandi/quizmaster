import { nanoid } from 'nanoid';
import React, { useState } from 'react';
import { Button, Icon, Input, Label, Modal, TextArea } from 'semantic-ui-react';
import { getCommaSeparatedStringWithAndBeforeTheLastItem } from '../../helpers/common';
import { Team } from '../../types';

interface Props {
  okCallback: Function;
  numOfTeams: number;
  hideModal: Function;
}

export default function TeamGenerator({ okCallback, numOfTeams, hideModal }: Props) {
  const [teamCount, setTeamCount] = useState<number | ''>(numOfTeams);
  const [teams, setTeams] = useState<Team[]>([]);
  const [playerNames, setPlayerNames] = useState('');

  function generateTeams() {
    const totalTeams = teamCount || numOfTeams || 2;
    const teamsPlayers = new Array<string[]>(totalTeams);

    let validPlayerNames = playerNames
      .split('\n')
      .map((name) => name.trim())
      .filter((name) => !!name);
    const minPlayersPerTeam = Math.floor(validPlayerNames.length / totalTeams);

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

    setTeams(
      teamsPlayers.map((playerNames) => ({
        id: nanoid(),
        name: getCommaSeparatedStringWithAndBeforeTheLastItem(playerNames),
        score: 0,
      })),
    );
  }

  return (
    <Modal open size="small" centered={false} dimmer="blurring">
      <Modal.Header>Generate team with player names</Modal.Header>
      <Modal.Content className="flexCol flex">
        <div className="flex flexCol">
          <Input
            label="Number of teams"
            value={teamCount}
            type="number"
            onChange={(ev) => setTeamCount(parseInt(ev.target.value) || '')}
            min={2}
          />
          <p className="mt-lg">
            Enter one name in each line or paste names from a spreadsheet column (Excel, Google sheet, etc.).
          </p>
          <Label as="label" className="fullWidth">
            <div className="mb-md">Player names</div>
            <TextArea
              className="fullWidth"
              rows={10}
              value={playerNames}
              onChange={(ev) => setPlayerNames(ev.target.value)}
            />
          </Label>
          <Button className="alignSelfEnd mt-lg" color="blue" onClick={() => generateTeams()}>
            <Icon name="refresh" /> {teams.length > 0 ? 'Regenerate' : 'Generate'} teams
          </Button>
          {teams.length > 0 && (
            <div className="mt-xl">
              <h3>Teams</h3>
              <ol>
                {teams.map((t) => (
                  <li key={t.id}>{t.name}</li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </Modal.Content>
      <Modal.Actions>
        <Button basic color="grey" onClick={() => hideModal()}>
          Cancel
        </Button>
        <Button
          color="green"
          disabled={teams.length < 2}
          onClick={() => {
            okCallback(teams);
            hideModal();
          }}>
          Choose teams
        </Button>
      </Modal.Actions>
    </Modal>
  );
}

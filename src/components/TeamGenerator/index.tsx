import { nanoid } from 'nanoid';
import React, { useState } from 'react';
import { Button, Icon, Input, Label, Modal, TextArea } from 'semantic-ui-react';
import { getCommaSeparatedStringWithAndBeforeTheLastItem } from '../../helpers';
import { Team } from '../../types';
import styles from './styles.module.css';

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
        teamId: nanoid(),
        name: getCommaSeparatedStringWithAndBeforeTheLastItem(playerNames),
        score: 0,
        selectedOptions: [],
      })),
    );
  }

  return (
    <Modal open size="tiny" centered={false} dimmer="blurring">
      <Modal.Header>Generate team with player names</Modal.Header>
      <Modal.Content className="flexCol flex">
        <div className="flex flexCol">
          <p className={styles.info}>
            Enter one player name in each line or paste names from a spreadsheet column (Excel, Google sheet, etc.).
          </p>
          <Label as="label" className={styles.playerNames}>
            <div className="mb-md">Player names</div>
            <TextArea
              className="fullWidth"
              rows={10}
              value={playerNames}
              onChange={(ev) => setPlayerNames(ev.target.value)}
            />
          </Label>
          <Input
            label="Number of teams"
            value={teamCount}
            type="number"
            className="fullWidth"
            onChange={(ev) => setTeamCount(parseInt(ev.target.value) || '')}
            min={2}
          />
          <Button className="alignSelfEnd mt-lg" color="blue" onClick={() => generateTeams()}>
            <Icon name="refresh" /> {teams.length > 0 ? 'Regenerate' : 'Generate'} teams
          </Button>
          {teams.length > 0 && (
            <div className={styles.teams}>
              <h3>Teams:</h3>
              <ol>
                {teams.map((t) => (
                  <li key={t.teamId}>{t.name}</li>
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

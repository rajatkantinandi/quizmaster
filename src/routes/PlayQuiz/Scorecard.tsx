import React from 'react';
import styles from './styles.module.css';
import { Text, Accordion, Group, Title } from '@mantine/core';
import TeamAvatar from '../../components/TeamAvatar';
import classNames from 'classnames';
import { Team } from '../../types';

export default function Scorecard({ teams, currentTeamId, winner }) {
  return (
    <div>
      <Group position="apart" mt="xl" mx="xl" pt="xl">
        <Title order={4}>Team</Title>
        <Title order={4}>Score</Title>
      </Group>
      {teams.some((x) => x.players) ? (
        <Accordion my="xl" multiple variant="separated">
          {teams.map((team) => (
            <Accordion.Item
              className={classNames({
                [styles.currentTeam]: team.teamId === currentTeamId,
                [styles.team]: true,
              })}
              key={team.teamId}
              value={`${team.teamId}`}>
              <Accordion.Control icon={<TeamAvatar team={team} />}>
                <Group position="apart" key={team.teamId}>
                  <Text color={team.teamId === currentTeamId ? 'white' : ''} className="truncatedOneLine">
                    {team.name}
                  </Text>
                  <div>
                    {(team.score || 0).toFixed(2)}
                    {team.teamId && winner.includes(`${team.teamId}`) && <span title="winner"> 👑</span>}
                  </div>
                </Group>
              </Accordion.Control>
              <Accordion.Panel>
                <ol>
                  {team.players.split(',').map((player) => (
                    <li key={player} className="truncatedOneLine">
                      {player}
                    </li>
                  ))}
                </ol>
              </Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion>
      ) : (
        teams.map((t: Team) => (
          <Group
            position="apart"
            my="xl"
            mx="xl"
            key={t.teamId}
            className={classNames({
              [styles.currentTeam]: t.teamId === currentTeamId,
              [styles.team]: true,
              [styles.teamWithoutPlayer]: true,
            })}>
            <Group noWrap>
              <TeamAvatar team={t} />
              <Text size="lg" className="truncatedOneLine" color={t.teamId === currentTeamId ? 'white' : ''}>
                {t.name}
              </Text>
            </Group>
            <div>
              {t.score.toFixed(2)}
              {t.teamId && winner.includes(`${t.teamId}`) && <span title="winner"> 👑</span>}
            </div>
          </Group>
        ))
      )}
    </div>
  );
}

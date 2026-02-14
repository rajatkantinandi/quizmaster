import React from 'react';
import styles from './styles.module.css';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import TeamAvatar from '../../components/TeamAvatar';
import classNames from 'classnames';
import { Team } from '../../types';

export default function Scorecard({ teams, currentTeamId, winnerIdsCsv }) {
  return (
    <div>
      <div className="flex justify-between items-center mt-xl mx-xl pt-xl">
        <h4 className="text-lg font-semibold">Team</h4>
        <h4 className="text-lg font-semibold">Score</h4>
      </div>
      {teams.some((x) => x.players) ? (
        <Accordion type="multiple" className="my-5">
          {teams.map((team) => (
            <AccordionItem
              className={classNames({
                [styles.currentTeam]: team.teamId === currentTeamId,
                [styles.team]: true,
              })}
              key={team.teamId}
              value={`${team.teamId}`}
            >
              <div className="flex items-center">
                <TeamAvatar team={team} />
                <AccordionTrigger>
                  <div className="flex justify-between items-center w-full ml-2">
                    <p className={classNames('truncate', { 'text-white': team.teamId === currentTeamId })}>
                      {team.name}
                    </p>
                    <div>
                      {(team.score || 0).toFixed(2)}
                      {team.teamId && winnerIdsCsv.includes(`${team.teamId}`) && <span title="winner"> 👑</span>}
                    </div>
                  </div>
                </AccordionTrigger>
              </div>
              <AccordionContent>
                <ol>
                  {team.players.split(',').map((player) => (
                    <li key={player} className="truncate">
                      {player}
                    </li>
                  ))}
                </ol>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        teams.map((t: Team) => (
          <div
            className={classNames('flex justify-between items-center my-xl mx-xl', {
              [styles.currentTeam]: t.teamId === currentTeamId,
              [styles.team]: true,
              [styles.teamWithoutPlayer]: true,
            })}
          >
            <div className="flex items-center gap-2">
              <TeamAvatar team={t} />
              <p className={classNames('text-lg truncate', { 'text-white': t.teamId === currentTeamId })}>{t.name}</p>
            </div>
            <div>
              {t.score.toFixed(2)}
              {t.teamId && winnerIdsCsv.includes(`${t.teamId}`) && <span title="winner"> 👑</span>}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
import TeamAvatar from '../../components/TeamAvatar';
import { Team } from '../../types';

export default function Scorecard({ teams, currentTeamId, winnerIdsCsv }) {
  return (
    <div>
      <div className="flex justify-between items-center mt-xl pt-xl px-2">
        <h4 className="text-lg font-semibold">Team</h4>
        <h4 className="text-lg font-semibold">Score</h4>
      </div>
      {teams.some((x) => x.players) ? (
        <Accordion type="multiple" className="my-5">
          {teams.map((team) => (
            <AccordionItem key={team.teamId} value={`${team.teamId}`} className="bg-white">
              <AccordionTrigger
                className={cn('flex items-center px-3', {
                  'flex-nowrap bg-[rgb(34,139,230)] text-white': team.teamId === currentTeamId,
                })}>
                <TeamAvatar team={team} />
                <div className="flex justify-between items-center w-full px-2">
                  <p className={cn('truncate', { 'text-white': team.teamId === currentTeamId })}>{team.name}</p>
                  <div>
                    {(team.score || 0).toFixed(2)}
                    {team.teamId && winnerIdsCsv.includes(`${team.teamId}`) && <span title="winner"> 👑</span>}
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <ol className="list-decimal pl-6">
                  {team.players.split(',').map((player) => (
                    <li key={player} className="truncate pt-2">
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
            className={cn('flex justify-between items-center my-lg mx-xl bg-white rounded-lg py-2 px-3', {
              'flex-nowrap bg-[rgb(34,139,230)] text-white': t.teamId === currentTeamId,
            })}>
            <div className="flex items-center gap-2">
              <TeamAvatar team={t} />
              <p className={cn('text-lg truncate', { 'text-white': t.teamId === currentTeamId })}>{t.name}</p>
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

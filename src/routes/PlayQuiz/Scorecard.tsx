import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
import TeamAvatar from '../../components/TeamAvatar';
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
              className={cn({
                'bg-[rgba(134,142,150,0.1)]': true,
                'flex-nowrap bg-[rgb(34,139,230)] [&_div]:text-white': team.teamId === currentTeamId,
              })}
              key={team.teamId}
              value={`${team.teamId}`}
            >
              <div className="flex items-center">
                <TeamAvatar team={team} />
                <AccordionTrigger>
                  <div className="flex justify-between items-center w-full ml-2">
                    <p className={cn('truncate', { 'text-white': team.teamId === currentTeamId })}>
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
            className={cn('flex justify-between items-center my-xl mx-xl', {
              'bg-[rgba(134,142,150,0.1)]': true,
              'flex-nowrap bg-[rgb(34,139,230)] [&_div]:text-white': t.teamId === currentTeamId,
              'rounded-[58px] px-[15px] py-[3px] pl-[3px]': true,
            })}
          >
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

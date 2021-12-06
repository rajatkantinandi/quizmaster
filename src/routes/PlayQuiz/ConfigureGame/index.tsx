import { nanoid } from 'nanoid';
import { Button, Divider, Input } from 'semantic-ui-react';

interface Props {
  teams: {
    name: string;
    id: string;
    score: number;
  }[];
  setTeams: Function;
  setIsConfigured: Function;
  setCurrentTeamId: Function;
}

export default function ConfigureGame({ teams, setTeams, setIsConfigured, setCurrentTeamId }: Props) {
  return (
    <div className="flex flexCol container-md">
      {teams.map((team, idx) => (
        <Input
          label={`Team ${idx + 1} name`}
          value={team.name}
          key={team.id}
          onChange={(ev) =>
            setTeams(
              teams.map((p) => {
                if (p.id === team.id) {
                  return { ...p, name: ev.target.value };
                } else {
                  return p;
                }
              }),
            )
          }
        />
      ))}
      <div className="flex mb-lg">
        <Button
          onClick={() => setTeams(teams.concat({ id: nanoid(), name: '', score: 0 }))}
          color="blue"
          className="mr-lg">
          Add team
        </Button>
        {teams.length > 2 && (
          <Button onClick={() => setTeams(teams.slice(0, -1))} color="red">
            Remove last team
          </Button>
        )}
      </div>
      <Divider />
      <Button
        color="orange"
        className="mb-lg alignSelfEnd"
        onClick={() => {
          setIsConfigured(true);
          setCurrentTeamId(teams[0].id);
        }}>
        Play
      </Button>
    </div>
  );
}

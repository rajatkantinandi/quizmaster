import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import classNames from 'classnames';
import { useNavigate } from 'react-router';

type Tab = {
  title: string;
  url: string;
};

type Props = {
  tabs: Tab[];
  onChange: (value: string) => void;
};

export default function HeaderTabs({ tabs, onChange }: Props) {
  const navigate = useNavigate();

  return (
    <Tabs
      value={window.location.pathname}
      onValueChange={(value) => {
        onChange(value);
        navigate(value);
      }}
    >
      <TabsList>
        {tabs.map((tab) => (
          <TabsTrigger
            value={tab.url}
            key={tab.title}
            className={classNames('tab', { active: window.location.pathname === tab.url })}
          >
            {tab.title}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
      className="h-full"
      value={window.location.pathname}
      onValueChange={(value) => {
        onChange(value);
        navigate(value);
      }}
    >
      <TabsList className="h-full items-end gap-0 border-0 bg-transparent p-0">
        {tabs.map((tab) => (
          <TabsTrigger
            value={tab.url}
            key={tab.title}
            className={`mr-2 block h-[60px] border border-transparent px-5 py-0 font-display font-bold text-[var(--qm-primary)] outline-none hover:bg-[var(--off-white-hover)] focus-visible:bg-[var(--off-white-hover)] data-[state=active]:text-[var(--qm-primary)] dark:text-white dark:data-[state=active]:text-white ${
              window.location.pathname === tab.url
                ? 'rounded-t-[10px] border-t-2 border-t-[var(--border-gray)] bg-[linear-gradient(to_bottom,var(--primary-card-bg)_20%,var(--off-white)_80%,var(--off-white)_100%)]'
                : 'rounded-t-[10px]'
            }`}>
            {tab.title}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}

import { Tabs } from '@mantine/core';
import classNames from 'classnames';
import { useNavigate } from 'react-router';
import styles from './styles.module.css';

type Tab = {
  title: string;
  url: string;
};

type Props = {
  tabs: Tab[];
};

export default function HeaderTabs({ tabs }: Props) {
  const navigate = useNavigate();

  return (
    <Tabs variant="outline" value={window.location.pathname} onTabChange={(value) => navigate(value!)}>
      <Tabs.List>
        {tabs.map((tab) => (
          <Tabs.Tab
            value={tab.url}
            key={tab.title}
            className={classNames(styles.tab, { [styles.active]: window.location.pathname === tab.url })}>
            {tab.title}
          </Tabs.Tab>
        ))}
      </Tabs.List>
    </Tabs>
  );
}

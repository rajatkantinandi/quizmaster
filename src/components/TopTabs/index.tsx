import classNames from 'classnames';
import { Link } from 'react-router-dom';
import styles from './styles.module.css';

type Tab = {
  title: string;
  url: string;
};

type Props = {
  tabs: Tab[];
};

export default function TopTabs({ tabs }: Props) {
  return (
    <div className="flex alignCenter">
      {tabs.map((tab) => (
        <Link
          to={tab.url}
          key={tab.title}
          className={classNames(styles.tab, { [styles.active]: window.location.pathname === tab.url })}>
          {tab.title}
        </Link>
      ))}
    </div>
  );
}

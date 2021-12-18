import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { Button, Icon } from 'semantic-ui-react';
import styles from './styles.module.css';

interface Props {
  duration: number;
  running?: boolean;
  title: string;
  handleTimeUp: Function;
  setIsRunning: Function;
}

export default function Question({ duration, running = false, title, handleTimeUp, setIsRunning }: Props) {
  const [remainingTime, setRemainingTime] = useState(duration);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (running && remainingTime > 0) {
      timer = setTimeout(() => {
        if (remainingTime <= 1) {
          setIsRunning(false);
          handleTimeUp();
        }
        setRemainingTime(remainingTime - 1);
      }, 1000);
    }

    return () => {
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, remainingTime]);

  return (
    <div className={classNames(styles.timer, { [styles.running]: running })}>
      {!!remainingTime && (
        <Button
          className={classNames('absolute', styles.playBtn)}
          aria-label="start / pause timer"
          aria-pressed={running}
          icon={<Icon name={running ? 'pause' : 'play'} />}
          onClick={() => setIsRunning(!running)}
          basic
        />
      )}
      <div className="bold">{title}</div>
      {remainingTime ? (
        <div className="time flex mt-md justifyCenter">
          <div className="min">
            {remainingTime / 60 < 10 ? '0' : ''}
            {Math.floor(remainingTime / 60)}
          </div>
          <div className={classNames('mx-md', { [styles.blinking]: running })}>:</div>
          <div className="sec">
            {remainingTime % 60 < 10 ? '0' : ''}
            {remainingTime % 60}
          </div>
        </div>
      ) : (
        <div>Time up</div>
      )}
      {!!remainingTime && (
        <div
          className={styles.timerIndicator}
          style={{
            top: ((duration - remainingTime) * 100) / duration + '%',
            height: (remainingTime * 100) / duration + '%',
          }}
        />
      )}
    </div>
  );
}

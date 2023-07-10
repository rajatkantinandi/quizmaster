import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import styles from './styles.module.css';
import { ActionIcon } from '@mantine/core';
import Icon from '../../components/Icon';

// Source: https://css-tricks.com/how-to-create-an-animated-countdown-timer-with-html-css-and-javascript/
interface Props {
  duration: number;
  isTimerRunning?: boolean;
  handleTimeUp: Function;
  setIsTimerRunning: Function;
  selectedQuestionId: string | undefined;
}

const timerCircleCircumference = Math.round(2 * Math.PI * 45);

export default function Timer({
  duration,
  isTimerRunning = false,
  handleTimeUp,
  setIsTimerRunning,
  selectedQuestionId,
}: Props) {
  const [remainingTime, setRemainingTime] = useState(duration);
  const [circleDasharray, setCircleDasharray] = useState(`${timerCircleCircumference}`);
  const [alert, setAlert] = useState(false);
  const [warning, setWarning] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isTimerRunning) {
      timer = setTimeout(() => {
        // allow 3s grace time to click the submit button by host
        if (remainingTime === 0) {
          setIsTimerRunning(false);
          handleTimeUp();
        } else {
          const timeLeft = remainingTime - 1;
          const rawTimeFraction = timeLeft / duration;

          setRemainingTime(timeLeft);
          setCircleDasharray(
            `${((rawTimeFraction - (1 / duration) * (1 - rawTimeFraction)) * timerCircleCircumference).toFixed(
              0,
            )} ${timerCircleCircumference}`,
          );
          setWarning(timeLeft <= duration / 2 && timeLeft > duration / 5);
          setAlert(timeLeft <= duration / 5);
        }
      }, 1000);
    }

    return () => {
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTimerRunning, remainingTime]);

  useEffect(() => {
    setRemainingTime(duration);
  }, [selectedQuestionId, duration]);

  function formatTimeLeft(time) {
    const minutes = Math.floor(time / 60);
    let seconds = `${time % 60}`;

    if (parseInt(seconds) < 10) {
      seconds = `0${seconds}`;
    }

    return `${minutes}:${seconds}`;
  }

  return (
    <div className={styles.baseTimer}>
      <svg className={styles.baseTimerSvg} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <g className={styles.baseTimerCircle}>
          <circle className={styles.baseTimerPathElapsed} cx="50" cy="50" r="45" />
          <path
            id="base-timer-path-remaining"
            strokeDasharray={circleDasharray}
            className={classNames({
              [styles.baseTimerPathRemaining]: true,
              [styles.green]: !alert && !warning,
              [styles.yellow]: warning,
              [styles.red]: alert,
            })}
            d="
              M 50, 50
              m -45, 0
              a 45,45 0 1,0 90,0
              a 45,45 0 1,0 -90,0
            "></path>
        </g>
      </svg>
      <span className={styles.baseTimerLabel}>{formatTimeLeft(remainingTime)}</span>
      <ActionIcon
        className={classNames({
          [styles.playButton]: !isTimerRunning,
          [styles.pauseButton]: true,
        })}
        onClick={() => setIsTimerRunning(!isTimerRunning)}>
        <Icon color="rgba(0,0,0,0.7)" name={isTimerRunning ? 'pause' : 'play'} width={70} height={70} />
      </ActionIcon>
    </div>
  );
}

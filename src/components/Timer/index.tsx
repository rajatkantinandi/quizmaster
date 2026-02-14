import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '../../components/Icon';

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
  }, [isTimerRunning, remainingTime, duration, handleTimeUp, setIsTimerRunning]);

  useEffect(() => {
    setRemainingTime(duration);
  }, [selectedQuestionId, duration]);

  function formatTimeLeft(time: number) {
    const minutes = Math.floor(time / 60);
    let seconds = `${time % 60}`;

    if (parseInt(seconds) < 10) {
      seconds = `0${seconds}`;
    }

    return `${minutes}:${seconds}`;
  }

  return (
    <div className="relative h-[150px] w-[150px] mx-auto my-2.5">
      <svg className="[transform:scaleX(-1)]" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <g className="fill-none stroke-none">
          <circle className="stroke-[7px] stroke-gray-400" cx="50" cy="50" r="45" />
          <path
            id="base-timer-path-remaining"
            strokeDasharray={circleDasharray}
            className={classNames({
              'stroke-[7px] stroke-linecap-round [transform:rotate(90deg)] [transform-origin:center] transition-all duration-1000 stroke-current':
                true,
              'text-green-500': !alert && !warning,
              'text-yellow-500': warning,
              'text-red-500': alert,
            })}
            d="
              M 50, 50
              m -45, 0
              a 45,45 0 1,0 90,0
              a 45,45 0 1,0 -90,0
            "
          ></path>
        </g>
      </svg>
      <span className="absolute w-[150px] h-[150px] top-0 flex items-center justify-center text-4xl">
        {formatTimeLeft(remainingTime)}
      </span>
      <Button
        variant="ghost"
        size="icon"
        className={classNames({
          'opacity-100': !isTimerRunning,
          'absolute left-3 top-3 rounded-full h-[124px] w-[124px] bg-transparent opacity-0 hover:opacity-100 transition-opacity duration-300':
            true,
        })}
        onClick={() => setIsTimerRunning(!isTimerRunning)}
      >
        <Icon color="rgba(0,0,0,0.7)" name={isTimerRunning ? 'pause' : 'play'} width={70} height={70} />
      </Button>
    </div>
  );
}

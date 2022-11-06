import React from 'react';
import styles from './styles.module.css';
import { Image } from '@mantine/core';
import quiz_1 from '../../images/icons/quiz_1.svg';
import quiz_2 from '../../images/icons/quiz_2.svg';
import quiz_3 from '../../images/icons/quiz_3.svg';
import quiz_4 from '../../images/icons/quiz_4.svg';
import quiz_5 from '../../images/icons/quiz_5.svg';
import quiz_6 from '../../images/icons/quiz_6.svg';
import quiz_7 from '../../images/icons/quiz_7.svg';
import quiz_8 from '../../images/icons/quiz_8.svg';
import quiz_9 from '../../images/icons/quiz_9.svg';
import quiz_10 from '../../images/icons/quiz_10.svg';
import quiz_11 from '../../images/icons/quiz_11.svg';
import quiz_12 from '../../images/icons/quiz_12.svg';
import quiz_13 from '../../images/icons/quiz_13.svg';

const images = [
  quiz_1,
  quiz_2,
  quiz_3,
  quiz_4,
  quiz_5,
  quiz_6,
  quiz_7,
  quiz_8,
  quiz_9,
  quiz_10,
  quiz_11,
  quiz_12,
  quiz_13,
];

export default function QuizImage({ index }) {
  return images[index % 13];
}

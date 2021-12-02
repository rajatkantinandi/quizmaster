import React, { useState } from 'react';
import { Button, Divider } from 'semantic-ui-react';
import { Option as IOption } from '../../types';
import Option from './Option';
import styles from './styles.module.css';

interface Props {
  text: string;
  options: IOption[];
}

export default function Question({ text, options }: Props) {
  const [selectedChoice, setSelectedChoice] = useState('');

  return (
    <form className={styles.container}>
      <div className={styles.questionText}>{text}</div>
      <Divider />
      {options.map((option) => (
        <Option
          id={option.id}
          checked={selectedChoice === option.id}
          onChange={(value: string) => setSelectedChoice(value)}
          optionText={option.optionText}
          key={option.id}
        />
      ))}
      <Divider />
      <Button type="submit" className="alignSelfEnd">
        Submit
      </Button>
    </form>
  );
}

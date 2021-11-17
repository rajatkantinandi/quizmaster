import React from 'react';
import { Checkbox } from 'semantic-ui-react';
import styles from './styles.module.css';

interface Props {
  optionText: string;
  id: number;
  onChange: Function;
  checked: boolean;
}

export default function Option({ optionText, onChange, id, checked }: Props) {
  return (
    <Checkbox
      className={styles.option}
      label={optionText}
      onChange={(ev, data) => {
        onChange(data.value);
      }}
      value={id}
      checked={checked}
    />
  );
}

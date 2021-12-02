import classNames from 'classnames';
import React from 'react';
import { Checkbox } from 'semantic-ui-react';
import styles from './styles.module.css';

interface Props {
  optionText: string;
  id: string;
  onChange: Function;
  checked: boolean;
  className?: string;
  disabled: boolean;
}

export default function Option({ optionText, onChange, id, checked, className = '', disabled }: Props) {
  return (
    <Checkbox
      className={classNames(styles.option, className)}
      label={optionText}
      onChange={(ev, data) => {
        onChange(data.value);
      }}
      value={id}
      checked={checked}
      disabled={disabled}
    />
  );
}

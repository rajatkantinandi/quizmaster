import React from 'react';
import { Form, Label, Input, TextArea, Checkbox } from 'semantic-ui-react';
import { Controller } from 'react-hook-form';
import styles from './styles.module.css';
import { FormInputTypes } from '../../constants';

interface Props {
  inputProps: any;
  name: string;
  rules: object;
  control: any;
  errorMessage: string;
  componentType?: string;
}

export default function FormInput({ inputProps, name, control, rules, errorMessage, componentType }: Props) {
  const InputElement = (propsVal: any) =>
    componentType === FormInputTypes.TEXT_AREA ? (
      <TextArea {...inputProps} {...propsVal} />
    ) : componentType === FormInputTypes.CHECK_BOX ? (
      <Checkbox {...inputProps} {...propsVal} />
    ) : (
      <Input {...inputProps} {...propsVal} />
    );

  return (
    <Form.Field inline className={styles.inputWrapper}>
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field }) => (
          <InputElement
            {...field}
            onChange={(ev: any, data: any) => {
              field.onChange(ev, data);

              if (inputProps.onChange) {
                inputProps.onChange(ev, data);
              }
            }}
          />
        )}
      />
      {errorMessage && (
        <Label basic color="red" size="small" className={styles.errorMessage}>
          {errorMessage}
        </Label>
      )}
    </Form.Field>
  );
}

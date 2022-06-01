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
  const inputPropsWithLabel = inputProps.label
    ? { ...inputProps, label: { as: 'label', children: inputProps.label } }
    : inputProps;

  const InputElement = (propsVal) =>
    componentType === FormInputTypes.TEXT_AREA ? (
      <TextArea {...inputProps} {...propsVal} />
    ) : componentType === FormInputTypes.CHECK_BOX ? (
      <Checkbox {...inputProps} {...propsVal} />
    ) : (
      <Input {...inputPropsWithLabel} {...propsVal} />
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
            id={name}
            onChange={(ev, data) => {
              field.onChange(ev, data);

              if (inputProps.onChange) {
                inputProps.onChange(ev, data);
              }
            }}
          />
        )}
      />
      <label htmlFor={name}></label>
      {errorMessage && (
        <Label basic color="red" size="small" className={styles.errorMessage}>
          {errorMessage}
        </Label>
      )}
    </Form.Field>
  );
}

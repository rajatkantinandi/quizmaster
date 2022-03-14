import React from 'react';
import { Form, Label, Input } from 'semantic-ui-react';
import { Controller } from 'react-hook-form';

interface Props {
  inputProps: object;
  name: string;
  rules: object;
  control: any;
  errorMessage: string;
}

export default function FormInput(props: Props) {
  return (
    <Form.Field inline>
      <Controller
        name={props.name}
        control={props.control}
        rules={props.rules}
        render={({ field }) => <Input {...props.inputProps} {...field} />}
      />
      {props.errorMessage && (
        <Label basic color="red" pointing="left">
          {props.errorMessage}
        </Label>
      )}
    </Form.Field>
  );
}

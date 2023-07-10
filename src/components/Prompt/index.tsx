import React, { useEffect, useRef, useState } from 'react';
import { useStore } from '../../useStore';
import { Modal as MTModal, Button, Group, Text } from '@mantine/core';
import { useForm } from 'react-hook-form';
import { FormInput } from '../FormInputs';

function Prompt() {
  const showPrompt = useStore.use.showPrompt();
  const prompt = useStore.use.prompt();
  const [disableOkButton, setDisableOkButton] = useState(false);
  const ref = useRef<HTMLInputElement>(null);
  const {
    title,
    initialValue = '',
    okText = 'OK',
    cancelText = 'Cancel',
    className = '',
    okCallback,
    cancelCallback,
    size = 'lg',
    closeOnOkClick = true,
    textInputProps = {},
  } = prompt || {};
  const [text, setText] = useState(initialValue);
  const { control, handleSubmit } = useForm();

  useEffect(() => {
    setTimeout(() => {
      ref.current?.focus();
    }, 50);
  }, []);

  function hidePrompt() {
    showPrompt(null);
  }

  const onSubmit = async () => {
    setDisableOkButton(true);
    if (okCallback) {
      await okCallback(text);
    }

    if (closeOnOkClick) {
      hidePrompt();
    } else {
      setDisableOkButton(false);
    }
  };

  return (
    <MTModal
      className={className}
      onClose={hidePrompt}
      opened
      overlayBlur={5}
      title={
        <Text size="lg" weight="bold">
          {title}
        </Text>
      }
      size={size}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormInput
          variant="filled"
          autoFocus
          type="text"
          name="text"
          control={control}
          value={text}
          className="grow"
          rules={{ required: textInputProps.required ? 'This field is required' : undefined }}
          onChange={(ev) => {
            setText(ev.target.value);
          }}
          ref={ref}
          {...textInputProps}
        />
        <Group mt="xl" pt="xl" position="right">
          {!!cancelText && (
            <Button
              color="dark"
              variant="outline"
              type="button"
              onClick={() => {
                hidePrompt();

                if (cancelCallback) {
                  cancelCallback();
                }
              }}
              radius="md">
              {cancelText}
            </Button>
          )}
          {!!okText && (
            <Button variant="filled" radius="md" type="submit" disabled={disableOkButton}>
              {okText}
            </Button>
          )}
        </Group>
      </form>
    </MTModal>
  );
}

export default Prompt;

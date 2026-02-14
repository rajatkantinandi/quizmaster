import React, { useEffect, useRef, useState } from 'react';
import { useStore } from '../../useStore';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
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
    <Dialog open onOpenChange={hidePrompt}>
      <DialogContent className={className}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
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
          <div className="flex justify-end gap-2 pt-6 mt-6">
            {!!cancelText && (
              <Button
                variant="outline"
                type="button"
                onClick={() => {
                  hidePrompt();

                  if (cancelCallback) {
                    cancelCallback();
                  }
                }}
              >
                {cancelText}
              </Button>
            )}
            {!!okText && (
              <Button variant="default" type="submit" disabled={disableOkButton}>
                {okText}
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default Prompt;

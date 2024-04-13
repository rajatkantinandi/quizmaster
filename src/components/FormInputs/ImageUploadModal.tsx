import React, { useEffect, useRef, useState } from 'react';
import { Modal as MTModal, Button, Group, Text, Divider } from '@mantine/core';
import { useForm } from 'react-hook-form';
import { FormInput } from '../FormInputs';

type Props = {
  okCallback: (text: string) => void;
  hideModal: () => void;
  title: string;
};

function ImageUploadModal({ okCallback, hideModal, title }: Props) {
  const ref = useRef<HTMLInputElement>(null);
  const [text, setText] = useState('');
  const [isInvalid, setIsInvalid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [disableOkButton, setDisableOkButton] = useState(true);
  const { control, handleSubmit } = useForm();

  useEffect(() => {
    setTimeout(() => {
      ref.current?.focus();
    }, 50);
  }, []);

  const onSubmit = async () => {
    setDisableOkButton(true);
    if (okCallback) {
      await okCallback(text);
    }

    hideModal();
  };

  return (
    <MTModal
      onClose={hideModal}
      opened
      overlayBlur={5}
      title={
        <Text size="lg" weight="bold">
          {title}
        </Text>
      }
      size="lg">
      <Text size="sm" mb="sm">
        Find images from unsplash, or other image sites. Or, right-click and "Copy Image Address" from a web search or
        anywhere on the internet.
      </Text>
      <form
        onSubmit={(ev) => {
          ev.stopPropagation();
          handleSubmit(onSubmit)(ev);
        }}>
        <FormInput
          variant="filled"
          autoFocus
          type="text"
          name="text"
          control={control}
          label="Enter a valid image URL"
          value={text}
          className="grow"
          rules={{ required: 'This field is required' }}
          onChange={(ev) => {
            setText(ev.target.value);
            setIsLoading(true);
            setIsInvalid(false);
          }}
          ref={ref}
          placeholder="https//example.com/image.png"
        />
        {isInvalid && !!text.trim() && !isLoading && (
          <Text color="red" size="sm" mt="sm">
            ⚠️ Failed to load the image, please enter a valid image URL
          </Text>
        )}
        {!!text.trim() && (
          <>
            {!isInvalid && (
              <>
                <Divider mt="lg" mb="md" />
                <Text size="md" mb="sm" weight="bold">
                  Preview
                </Text>
              </>
            )}
            <img
              src={text}
              alt=""
              onError={() => {
                setIsInvalid(true);
                setIsLoading(false);
              }}
              key={text}
              onLoad={() => {
                setIsInvalid(false);
                setDisableOkButton(false);
                setIsLoading(false);
              }}
              style={{ maxHeight: '50vh', maxWidth: '100%' }}
            />
          </>
        )}
        <Group position="right" mt="md">
          <Button color="dark" variant="outline" type="button" onClick={hideModal}>
            Cancel
          </Button>
          <Button variant="filled" type="submit" disabled={disableOkButton || isInvalid || isLoading}>
            Save
          </Button>
        </Group>
      </form>
    </MTModal>
  );
}

export default ImageUploadModal;

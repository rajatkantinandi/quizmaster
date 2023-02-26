import React, { useEffect, useRef, useState } from 'react';
import { useStore } from '../../useStore';
import { Modal as MTModal, Button, Group, Checkbox, Text } from '@mantine/core';

function Modal() {
  const { modal, showModal } = useStore();
  const okRef = useRef<any>();
  const [shouldNotShowAgain, setShouldNotShowAgain] = useState(false);
  const {
    body,
    title,
    okText = 'OK',
    cancelText = 'Cancel',
    className = '',
    okCallback,
    cancelCallback,
    size = 'lg',
    isAlert = false,
    doNotShowAgainKey,
    closeOnOkClick = true,
  } = modal || {};

  function hideModal() {
    showModal(null);
  }

  useEffect(() => {
    if (okRef.current && isAlert) {
      okRef.current.focus();
    }
  }, [isAlert, okRef]);

  return (
    <MTModal
      className={className}
      onClose={hideModal}
      closeOnClickOutside={isAlert}
      opened
      overlayBlur={5}
      title={
        <Text size="lg" weight="bold">
          {title}
        </Text>
      }
      size={size}>
      {body}
      {!!doNotShowAgainKey && (
        <Checkbox
          className="mt-xl"
          label="Do not show this message again"
          checked={shouldNotShowAgain}
          onChange={() => setShouldNotShowAgain(!shouldNotShowAgain)}
        />
      )}
      <Group mt="xl" pt="xl" position="right">
        {!!cancelText && (
          <Button
            color="dark"
            variant="outline"
            onClick={() => {
              hideModal();

              if (cancelCallback) {
                cancelCallback();
              }
            }}
            radius="md">
            {cancelText}
          </Button>
        )}
        {!!okText && (
          <Button
            ref={okRef}
            variant="filled"
            radius="md"
            onClick={() => {
              if (okCallback) {
                okCallback();
              }
              if (doNotShowAgainKey && shouldNotShowAgain) {
                localStorage.setItem('DoNotShow' + doNotShowAgainKey, 'true');
              }

              if (closeOnOkClick) {
                hideModal();
              }
            }}>
            {okText}
          </Button>
        )}
      </Group>
    </MTModal>
  );
}

export default Modal;

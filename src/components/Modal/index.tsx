import React, { useEffect, useRef, useState } from 'react';
import { useStore } from '../../useStore';
import { Modal as MTModal, Button, Group, Checkbox, Text } from '@mantine/core';
import { ModalState } from '../../stores/appStore';
import styles from './styles.module.css';

function Modal({ modalProps }: { modalProps?: ModalState }) {
  const showModal = useStore.use.showModal();
  const modal = useStore.use.modal();
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
    disableOkButton = false,
  } = modal || modalProps || {};

  function hideModal() {
    showModal(null);
  }

  useEffect(() => {
    if (okRef.current && isAlert) {
      okRef.current.focus();
    }
  }, [isAlert, okRef]);

  const onClose = () => {
    hideModal();

    if (cancelCallback) {
      cancelCallback();
    }
  };

  return (
    <MTModal
      className={className}
      onClose={onClose}
      closeOnClickOutside={isAlert}
      opened
      overlayBlur={5}
      title={
        title ? (
          <Text size="lg" weight="bold">
            {title}
          </Text>
        ) : null
      }
      size={size}>
      <div className={styles.body}>
        {body}
        {!!doNotShowAgainKey && (
          <Checkbox
            className="mt-xl"
            label="Do not show this message again"
            checked={shouldNotShowAgain}
            onChange={() => setShouldNotShowAgain(!shouldNotShowAgain)}
          />
        )}
      </div>
      {(!!cancelText || !!okText) && (
        <Group mt="xl" position="right">
          {!!cancelText && (
            <Button color="dark" variant="outline" onClick={onClose}>
              {cancelText}
            </Button>
          )}
          {!!okText && (
            <Button
              ref={okRef}
              variant="filled"
              disabled={disableOkButton}
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
      )}
    </MTModal>
  );
}

export default Modal;

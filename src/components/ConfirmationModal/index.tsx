import React, { useEffect, useRef } from 'react';
import { Button, Modal } from 'semantic-ui-react';
import { ConfirmationModalState, useAppStore } from '../../useAppStore';

interface Props extends ConfirmationModalState {}

function ConfirmationModal({
  body,
  title,
  okText = 'OK',
  cancelText = 'Cancel',
  className = '',
  okCallback,
  size = 'tiny',
  isAlert = false,
}: Props) {
  const { setConfirmationModal } = useAppStore();
  const okRef = useRef<any>();

  function hideModal() {
    setConfirmationModal(null);
  }

  useEffect(() => {
    if (okRef.current && isAlert) {
      okRef.current.focus();
    }
  }, [isAlert, okRef]);

  return (
    <Modal
      className={className}
      onClose={hideModal}
      closeOnDimmerClick={isAlert}
      open
      centered={false}
      dimmer="blurring"
      size={size}>
      <Modal.Header>{title}</Modal.Header>
      <Modal.Content>{body}</Modal.Content>
      <Modal.Actions>
        {!!cancelText && (
          <Button basic onClick={hideModal}>
            {cancelText}
          </Button>
        )}
        {!!okText && (
          <Button
            basic
            ref={okRef}
            onClick={() => {
              if (okCallback) {
                okCallback();
              }

              hideModal();
            }}>
            {okText}
          </Button>
        )}
      </Modal.Actions>
    </Modal>
  );
}

export default ConfirmationModal;

import React from 'react';
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

  function hideModal() {
    setConfirmationModal(null);
  }

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

import React, { useEffect, useRef, useState } from 'react';
import { Button, Checkbox, Modal } from 'semantic-ui-react';
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
  doNotShowAgainKey,
}: Props) {
  const { setConfirmationModal } = useAppStore();
  const okRef = useRef<any>();
  const [shouldNotShowAgain, setShouldNotShowAgain] = useState(false);

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
      <Modal.Content>
        {body}
        {!!doNotShowAgainKey && (
          <Checkbox
            className="mt-xl"
            label="Do not show this message again"
            checked={shouldNotShowAgain}
            onChange={() => setShouldNotShowAgain(!shouldNotShowAgain)}
          />
        )}
      </Modal.Content>
      <Modal.Actions>
        {!!cancelText && (
          <Button basic onClick={hideModal}>
            {cancelText}
          </Button>
        )}
        {!!okText && (
          <Button
            ref={okRef}
            color="blue"
            onClick={() => {
              if (okCallback) {
                okCallback();
              }
              if (doNotShowAgainKey && shouldNotShowAgain) {
                localStorage.setItem('DoNotShow' + doNotShowAgainKey, 'true');
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

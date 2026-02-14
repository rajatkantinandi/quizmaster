import React, { useEffect, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useStore } from '../../useStore';
import { ModalState } from '../../stores/appStore';

interface ModalProps {
  modalProps?: ModalState;
}

function Modal({ modalProps }: ModalProps) {
  const showModal = useStore.use.showModal();
  const modal = useStore.use.modal();
  const okRef = useRef<HTMLButtonElement>(null);
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
  }, [isAlert]);

  const onClose = () => {
    hideModal();

    if (cancelCallback) {
      cancelCallback();
    }
  };

  const getSizeClass = () => {
    switch (size) {
      case 'xl':
        return 'max-w-4xl';
      case 'lg':
        return 'max-w-2xl';
      case 'sm':
        return 'max-w-sm';
      default:
        return 'max-w-lg';
    }
  };

  return (
    <Dialog open={!!modal || !!modalProps} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={`${getSizeClass()} ${className}`}>
        {title && (
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">{title}</DialogTitle>
          </DialogHeader>
        )}
        <div className="max-h-[calc(100vh-250px)] overflow-auto pr-5">
          {body}
          {!!doNotShowAgainKey && (
            <div className="mt-6 flex items-center gap-2">
              <Checkbox
                id="do-not-show-again"
                checked={shouldNotShowAgain}
                onCheckedChange={() => setShouldNotShowAgain(!shouldNotShowAgain)}
              />
              <label htmlFor="do-not-show-again" className="text-sm cursor-pointer">
                Do not show this message again
              </label>
            </div>
          )}
        </div>
        {(!!cancelText || !!okText) && (
          <DialogFooter className="justify-end gap-2">
            {!!cancelText && (
              <Button variant="outline" onClick={onClose}>
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
                }}
              >
                {okText}
              </Button>
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default Modal;

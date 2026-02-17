import React, { useEffect, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
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
    <Dialog open onOpenChange={hideModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <p className="text-sm mb-4">
          Find images from unsplash, or other image sites. Or, right-click and "Copy Image Address" from a web search or
          anywhere on the internet and then paste the URL below.
        </p>
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
            className="flex-1"
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
            <p className="text-red-500 text-sm mt-2">⚠️ Failed to load the image, please enter a valid image URL</p>
          )}
          {!!text.trim() && (
            <>
              {!isInvalid && (
                <>
                  <Separator className="my-4" />
                  <p className="text-sm font-bold mb-2">Preview</p>
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
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" type="button" onClick={hideModal}>
              Cancel
            </Button>
            <Button variant="default" type="submit" disabled={disableOkButton || isInvalid || isLoading}>
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default ImageUploadModal;

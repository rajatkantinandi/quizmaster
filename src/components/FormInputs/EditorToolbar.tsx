import { Button } from '@mantine/core';
import { ChainedCommands, Editor } from '@tiptap/react';
import React, { useCallback, useMemo } from 'react';
import { isValidImageUrl, isValidUrl } from '../../helpers/url';
import { getEmbedUrlFromURL } from '../../helpers/video';
import { useStore } from '../../useStore';
import Icon from '../Icon';

type Props = {
  editor: Editor;
  isFocussed: boolean;
};

type ButtonParams = {
  commandName?: keyof ChainedCommands;
  children: React.ReactNode;
  actionName?: string;
  title?: string;
  actionParams?: Record<string, any>;
  onPress?: () => void;
};

export default function EditorToolbar({ editor, isFocussed }: Props) {
  const showPrompt = useStore.use.showPrompt();
  const showAlert = useStore.use.showAlert();
  const handleLink = useCallback(() => {
    const previousUrl = editor.getAttributes('link').href;

    const unsetLink = () => {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      showPrompt(null);
    };

    showPrompt({
      title: 'Enter a valid Url:',
      initialValue: previousUrl,
      textInputProps: { placeholder: 'https://example.com' },
      okText: 'Save',
      closeOnOkClick: false,
      okCallback: (url) => {
        // cancelled
        if (!url) {
          unsetLink();
        } else if (isValidUrl(url)) {
          // update link
          editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
          showPrompt(null);
        } else {
          showAlert({ message: 'Invalid URL!', type: 'warning' });
        }
      },
    });
  }, [editor]);

  const handleImage = useCallback(() => {
    // TODO: add ability to upload image
    showPrompt({
      title: 'Enter a valid image URL:',
      textInputProps: { placeholder: 'https://example.com/image.png' },
      okText: 'Save',
      closeOnOkClick: false,
      okCallback: (url) => {
        if (url && isValidImageUrl(url)) {
          // update link
          editor.chain().focus().setImage({ src: url }).run();
          showPrompt(null);
        } else {
          showAlert({
            message: 'Invalid image URL! An image url must end with a valid image file extension',
            type: 'warning',
          });
        }
      },
    });
  }, [editor]);

  const handleIframe = useCallback(() => {
    showPrompt({
      title: 'Enter youtube, Google Drive or Vimeo video URL:',
      textInputProps: { placeholder: 'https://youtube.com/watch?v=<videoId>' },
      okText: 'Save',
      closeOnOkClick: false,
      okCallback: (url) => {
        if (url) {
          const embedUrl = getEmbedUrlFromURL(url);

          if (embedUrl) {
            editor.chain().focus().setIframe({ src: embedUrl }).run();
            showPrompt(null);
          } else {
            showAlert({
              message:
                'We only support YouTube, Google Drive and Vimeo videos. Please use videos from those sources only',
              type: 'warning',
            });
          }
        }
      },
    });
  }, [editor]);

  const BUTTONS = useMemo(
    () =>
      [
        { actionName: 'bold', commandName: 'toggleBold', children: <b>B</b> },
        { actionName: 'italic', commandName: 'toggleItalic', children: <i>I</i> },
        { actionName: 'underline', commandName: 'toggleUnderline', children: <u>U</u> },
        { actionName: 'strike', commandName: 'toggleStrike', children: <del>S</del> },
        { actionName: 'code', commandName: 'toggleCode', children: <Icon name="code" width={18} height={18} /> },
        {
          actionName: 'blockquote',
          commandName: 'toggleBlockquote',
          children: <Icon name="blockquote" width={18} height={18} />,
        },
        {
          actionName: 'link',
          onPress: handleLink,
          title: 'link',
          children: <Icon name="link" width={18} height={18} />,
        },
        {
          onPress: handleImage,
          title: 'image',
          children: <Icon name="image" width={18} height={18} />,
        },
        {
          onPress: handleIframe,
          title: 'Embed video',
          children: <Icon name="videoCamera" width={18} height={18} />,
        },
        {
          actionName: 'bulletList',
          commandName: 'toggleBulletList',
          children: <Icon name="bulletList" width={18} height={18} />,
        },
        {
          actionName: 'orderedList',
          commandName: 'toggleOrderedList',
          children: <Icon name="orderedList" width={18} height={18} />,
        },
        {
          actionName: 'codeBlock',
          commandName: 'toggleCodeBlock',
          children: <Icon name="codeBlock" width={18} height={18} />,
        },
        {
          actionName: 'heading',
          commandName: 'toggleHeading',
          title: 'Heading 3',
          actionParams: { level: 3 },
          children: 'H3',
        },
        {
          actionName: 'heading',
          commandName: 'toggleHeading',
          title: 'Heading 4',
          actionParams: { level: 4 },
          children: 'H4',
        },
      ] as ButtonParams[],
    [handleLink, handleImage, handleIframe],
  );

  return (
    <div className="editor-toolbar" style={{ opacity: isFocussed ? 1 : 0.3 }}>
      {BUTTONS.map((props) => (
        <EditorButton editor={editor} {...props} key={props.title || props.actionName} />
      ))}
    </div>
  );
}

type ButtonProps = ButtonParams & {
  editor: Editor;
};

function EditorButton({ editor, children, commandName, actionName, actionParams, onPress, title }: ButtonProps) {
  return (
    <button
      type="button"
      title={title || actionName}
      onClick={() => (commandName ? (editor.chain().focus()[commandName] as any)(actionParams).run() : onPress?.())}
      disabled={commandName ? !(editor.can().chain().focus() as any)[commandName](actionParams).run() : false}
      className={actionName && editor.isActive(actionName, actionParams) ? 'active' : ''}>
      {children}
    </button>
  );
}

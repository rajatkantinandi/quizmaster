import { ChainedCommands, Editor } from '@tiptap/react';
import React, { useCallback, useMemo } from 'react';
import { getEmbedUrlFromURL } from '../../helpers/video';
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
  const handleLink = useCallback(() => {
    if (editor.isActive('link')) {
      editor.chain().focus().unsetLink().run();
      return;
    }

    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Enter URL:', previousUrl || 'https://');

    // cancelled
    if (url === null) {
      return;
    }

    // empty
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    // update link
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  const handleImage = useCallback(() => {
    // TODO: add ability to upload image
    const url = window.prompt('Enter image URL');

    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const handleIframe = useCallback(() => {
    const url = window.prompt('Enter youtube, Google Drive or Vimeo video URL');

    if (url) {
      const embedUrl = getEmbedUrlFromURL(url);

      if (embedUrl) {
        editor.chain().focus().setIframe({ src: embedUrl }).run();
      } else {
        alert('We only support YouTube, Google Drive and Vimeo videos. Please use videos from those sources only');
      }
    }
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

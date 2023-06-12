import { ChainedCommands, Editor } from '@tiptap/react';
import React, { useCallback, useMemo } from 'react';
import Icon from '../Icon';

type Props = {
  editor: Editor;
};

type ButtonParams = {
  commandName?: keyof ChainedCommands;
  children: React.ReactNode;
  actionName?: string;
  title?: string;
  actionParams?: Record<string, any>;
  onPress?: () => void;
};

export default function EditorToolbar({ editor }: Props) {
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

  const BUTTONS = useMemo(
    () =>
      [
        { actionName: 'bold', commandName: 'toggleBold', children: <b>B</b> },
        { actionName: 'italic', commandName: 'toggleItalic', children: <i>I</i> },
        { actionName: 'underline', commandName: 'toggleUnderline', children: <u>U</u> },
        { actionName: 'strike', commandName: 'toggleStrike', children: <del>S</del> },
        { actionName: 'code', commandName: 'toggleCode', children: <Icon name="code" width={18} height={18} /> },
        { actionName: 'heading', commandName: 'toggleHeading', actionParams: { level: 3 }, children: 'H3' },
        { actionName: 'heading', commandName: 'toggleHeading', actionParams: { level: 4 }, children: 'H4' },
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
          children: <Icon name="link" width={18} height={18} />,
        },
        {
          onPress: handleImage,
          title: 'image',
          children: <Icon name="image" width={18} height={18} />,
        },
      ] as ButtonParams[],
    [handleLink, handleImage],
  );

  return (
    <div className="editor-toolbar">
      {BUTTONS.map((props) => (
        <EditorButton editor={editor} {...props} key={props.commandName} />
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
      title={actionName || title}
      onClick={() => (commandName ? (editor.chain().focus()[commandName] as any)(actionParams).run() : onPress?.())}
      disabled={commandName ? !(editor.can().chain().focus() as any)[commandName](actionParams).run() : false}
      className={actionName && editor.isActive(actionName, actionParams) ? 'active' : ''}>
      {children}
    </button>
  );
}

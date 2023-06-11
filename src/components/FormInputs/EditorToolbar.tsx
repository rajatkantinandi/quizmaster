import { ChainedCommands, Editor } from '@tiptap/react';
import React from 'react';
import Icon from '../Icon';

type Props = {
  editor: Editor | null;
};

const BUTTONS: {
  commandName: keyof ChainedCommands;
  children: React.ReactNode;
  actionName: string;
  actionParams?: Record<string, any>;
}[] = [
  { actionName: 'bold', commandName: 'toggleBold', children: <b>B</b> },
  { actionName: 'italic', commandName: 'toggleItalic', children: <i>I</i> },
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
];

export default function EditorToolbar({ editor }: Props) {
  if (!editor) {
    return null;
  }

  return (
    <div className="editor-toolbar">
      {BUTTONS.map((props) => (
        <EditorButton editor={editor} {...props} key={props.commandName} />
      ))}

      <EditorButton
        actionName="link"
        editor={editor}
        onPress={() => {
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
        }}>
        <Icon name="link" width={18} height={18} />
      </EditorButton>
    </div>
  );
}

type ButtonProps = {
  editor: Editor;
  commandName?: keyof ChainedCommands;
  children: React.ReactNode;
  actionName: string;
  actionParams?: Record<string, any>;
  onPress?: () => void;
};

function EditorButton({ editor, children, commandName, actionName, actionParams, onPress }: ButtonProps) {
  return (
    <button
      type="button"
      title={actionName}
      onClick={() => (commandName ? (editor.chain().focus()[commandName] as any)(actionParams).run() : onPress?.())}
      disabled={commandName ? !(editor.can().chain().focus() as any)[commandName](actionParams).run() : false}
      className={editor.isActive(actionName, actionParams) ? 'active' : ''}>
      {children}
    </button>
  );
}

import { ChainedCommands, Editor } from '@tiptap/react';
import React from 'react';

type Props = {
  editor: Editor | null;
};

export default function EditorToolbar({ editor }: Props) {
  if (!editor) {
    return null;
  }

  return (
    <div className="editor-toolbar">
      <EditorButton editor={editor} actionName="bold" commandName="toggleBold">
        <b>B</b>
      </EditorButton>
      <EditorButton editor={editor} actionName="italic" commandName="toggleItalic">
        <i>I</i>
      </EditorButton>
      <EditorButton editor={editor} actionName="strike" commandName="toggleStrike">
        <del>S</del>
      </EditorButton>
      <EditorButton editor={editor} actionName="code" commandName="toggleCode">
        {'<>'}
      </EditorButton>
    </div>
  );
}

type ButtonProps = {
  editor: Editor;
  commandName: keyof ChainedCommands;
  children: React.ReactNode;
  actionName: string;
};

function EditorButton({ editor, children, commandName, actionName }: ButtonProps) {
  return (
    <button
      type="button"
      title={actionName}
      onClick={() => (editor.chain().focus()[commandName] as any)().run()}
      disabled={!(editor.can().chain().focus() as any)[commandName]().run()}
      className={editor.isActive(actionName) ? 'active' : ''}>
      {children}
    </button>
  );
}

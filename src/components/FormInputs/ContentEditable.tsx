import React from 'react';
import { TextareaProps } from '@mantine/core';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

type Props = TextareaProps & {
  autofocus?: boolean;
  value: string;
  onChange: (value: string) => void;
};

export default function ContentEditable({ label, autofocus, placeholder, value, onChange, ...rest }: Props) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    enableCoreExtensions: true,
    autofocus: autofocus,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  return (
    <>
      <label>{label}</label>
      <EditorContent editor={editor} />
    </>
  );
}

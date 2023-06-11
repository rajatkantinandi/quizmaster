import React from 'react';
import { TextareaProps } from '@mantine/core';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import EditorToolbar from './EditorToolbar';

type Props = TextareaProps & {
  autofocus?: boolean;
  value: string;
  onChange: (value: string) => void;
};

export default function ContentEditable({ label, autofocus, placeholder, value, onChange, ...rest }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        protocols: ['ftp', 'mailto', 'tel'],
        autolink: true,
        HTMLAttributes: {
          // Allow search engines to follow links(remove nofollow)
          rel: 'noopener noreferrer',
          // Remove target entirely so links open in current tab
          target: '_blank',
        },
      }),
    ],
    content: value,
    enableCoreExtensions: true,
    autofocus: autofocus,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  return (
    <div className="grow">
      <label>{label}</label>
      <EditorToolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}

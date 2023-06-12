import React from 'react';
import { TextareaProps } from '@mantine/core';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Underline from '@tiptap/extension-underline';
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
      Image.configure({
        allowBase64: false,
        inline: true,
      }),
      Underline,
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
      {!!editor && <EditorToolbar editor={editor} />}
      <EditorContent editor={editor} />
    </div>
  );
}

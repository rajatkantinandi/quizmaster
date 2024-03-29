import React from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Underline from '@tiptap/extension-underline';
import Iframe from '../../helpers/TipTapIframe';
import EditorToolbar from './EditorToolbar';
import classNames from 'classnames';

type Props = {
  autofocus?: boolean;
  value: string;
  onChange: (value: string) => void;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  label: React.ReactNode;
  className?: string;
  disabled?: boolean;
};

export default function ContentEditable({
  label,
  autofocus,
  value,
  onChange,
  size = 'sm',
  className,
  disabled,
}: Props) {
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
      Iframe,
    ],
    content: value,
    enableCoreExtensions: true,
    autofocus,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });
  const [isFocussed, setIsFocussed] = React.useState(false);

  return (
    <div
      className={classNames('grow relative', className)}
      onFocus={() => setIsFocussed(true)}
      onBlur={() => setIsFocussed(false)}>
      <label>{label}</label>
      {!!editor && <EditorToolbar editor={editor} isFocussed={isFocussed} />}
      <EditorContent editor={editor} className={`${size}Editor`} disabled={disabled} />
    </div>
  );
}

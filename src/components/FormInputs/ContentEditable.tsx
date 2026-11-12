import React from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Underline from '@tiptap/extension-underline';
import Iframe from '../../helpers/TipTapIframe';
import EditorToolbar from './EditorToolbar';
import { richTextClasses } from '@/lib/rich-text';
import { cn } from '@/lib/utils';

type Props = {
  autofocus?: boolean;
  value: string;
  onChange: (value: string) => void;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  label: React.ReactNode;
  className?: string;
  disabled?: boolean;
  id: string;
};

const editorMinHeightClasses = {
  xs: '',
  sm: 'min-h-[100px]',
  md: 'min-h-[150px]',
  lg: 'min-h-[250px]',
  xl: 'min-h-[350px]',
};

export default function ContentEditable({
  label,
  autofocus,
  value,
  onChange,
  size = 'sm',
  className,
  disabled,
  id,
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
    editable: !disabled,
    editorProps: {
      attributes: {
        class: cn(
          richTextClasses,
          'block max-h-[400px] overflow-auto bg-input-bg px-[15px] pb-2.5 pt-[50px]',
          editorMinHeightClasses[size],
        ),
        role: 'textbox',
        'aria-multiline': 'true',
        'aria-labelledby': `${id}-label`,
      },
    },
    enableCoreExtensions: true,
    autofocus,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });
  const [isFocussed, setIsFocussed] = React.useState(false);

  return (
    <div
      className={cn('flex-1 relative', className)}
      onFocus={() => setIsFocussed(true)}
      onBlur={() => setIsFocussed(false)}
    >
      <div id={`${id}-label`}>{label}</div>
      {!!editor && <EditorToolbar editor={editor} isFocussed={isFocussed} />}
      <EditorContent editor={editor} />
    </div>
  );
}

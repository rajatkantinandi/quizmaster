import classNames from 'classnames';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styles from './styles.module.css';

interface Props {
  children: string;
  className?: string;
}

export default function Markdown({ children, className = '' }: Props) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      linkTarget="_blank"
      className={classNames(className, styles.reactMarkdown)}>
      {children}
    </ReactMarkdown>
  );
}

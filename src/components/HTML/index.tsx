import classNames from 'classnames';
import React from 'react';

interface Props {
  children: string;
  className?: string;
}

export default function HTML({ children, className = '' }: Props) {
  return <div dangerouslySetInnerHTML={{ __html: children }} className={classNames(className, 'html')} />;
}

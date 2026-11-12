import { richTextClasses } from '@/lib/rich-text';
import { cn } from '@/lib/utils';
import React, { useMemo } from 'react';
import { sanitize } from '../../helpers/dom';

interface Props {
  children: string;
  Tag?: keyof React.JSX.IntrinsicElements;
  allowedTags?: (keyof React.JSX.IntrinsicElements)[];
  allowedAttributes?: string[];
  className?: string;
}

/**
 *
 * SanitizedHtml
 * @description Use this component to enforce to only render sanitized html content
 * & never use dangerouslySetInnerHTML anywhere
 *
 */
function SanitizedHtml({
  Tag = 'div',
  children,
  allowedAttributes,
  allowedTags,
  className,
  ...rest
}: Props): React.JSX.Element {
  const sanitizedHtml = useMemo(
    () => sanitize(children, allowedTags, allowedAttributes),
    [children, allowedTags, allowedAttributes],
  );

  return (
    <Tag className={cn(richTextClasses, className)} dangerouslySetInnerHTML={{ __html: sanitizedHtml }} {...rest} />
  );
}

export default SanitizedHtml;

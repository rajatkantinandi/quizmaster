import { cn } from '@/lib/utils';
import React, { useMemo } from 'react';
import { sanitize } from '../../helpers/dom';

interface Props {
  children: string;
  Tag?: keyof JSX.IntrinsicElements;
  allowedTags?: (keyof JSX.IntrinsicElements)[];
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
}: Props): JSX.Element {
  const sanitizedHtml = useMemo(
    () => sanitize(children, allowedTags, allowedAttributes),
    [children, allowedTags, allowedAttributes],
  );

  return (
    <Tag className={cn(className, 'html')} dangerouslySetInnerHTML={{ __html: sanitizedHtml }} {...rest} />
  );
}

export default SanitizedHtml;

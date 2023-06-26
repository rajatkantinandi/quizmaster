import DOMPurify from 'dompurify';

export const sanitize = (
  dirty?: string | null,
  allowedTags?: (keyof JSX.IntrinsicElements)[],
  allowedAttributes?: string[],
): any => {
  if (dirty === null) {
    return null;
  } else if (typeof dirty === 'undefined') {
    return dirty;
  }

  allowedTags = [
    ...(allowedTags || []),
    'b',
    'i',
    'u',
    'em',
    'strong',
    'a',
    'p',
    'br',
    'sub',
    'sup',
    'span',
    'img',
    'code',
    'pre',
    'blockquote',
    'iframe',
    'ul',
    'li',
    'ol',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
  ];
  allowedAttributes = [
    ...(allowedAttributes || []),
    'href',
    'target',
    'rel',
    'class',
    'data-userid',
    'src',
    'title',
    'frameborder',
    'allowfullscreen',
    'draggable',
    'alt',
    'contenteditable',
  ];

  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: allowedTags,
    ALLOWED_ATTR: allowedAttributes,
  });
};

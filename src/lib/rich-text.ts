export const richTextClasses = [
  '[&_p]:m-0',
  '[&_td]:border [&_td]:border-[var(--gray-dark)] [&_td]:px-2 [&_td]:py-0.5',
  '[&_th]:border [&_th]:border-[var(--border-gray)] [&_th]:bg-[var(--gray-dark)] [&_th]:px-2 [&_th]:py-0.5 [&_th]:text-white',
  '[&_tr]:text-foreground [&_tr:nth-last-of-type(2n)]:bg-[var(--option-background)] [&_tr:nth-last-of-type(2n+1)]:bg-background',
  '[&_table]:border-collapse',
  '[&_img]:max-h-[400px] [&_img]:max-w-[300px]',
  '[&_code]:rounded-[5px] [&_code]:bg-[var(--card-hover-bg)] [&_code]:px-[5px] [&_code]:py-0.5 [&_code]:text-white',
  '[&_pre_code]:block [&_pre_code]:w-full [&_pre_code]:bg-[var(--gray-dark)] [&_pre_code]:px-2.5 [&_pre_code]:py-[5px]',
  '[&_blockquote]:my-[5px] [&_blockquote]:ml-0 [&_blockquote]:mr-0 [&_blockquote]:border-l-[3px] [&_blockquote]:border-[var(--gray-dark)] [&_blockquote]:pl-2.5 [&_blockquote]:text-[var(--gray-dark)]',
  '[&_iframe]:aspect-video [&_iframe]:w-full [&_iframe]:max-w-[480px]',
  '[&_li_p]:inline-block',
  '[&_ol]:my-2 [&_ol]:ml-0 [&_ol]:pl-5 [&_ul]:my-2 [&_ul]:ml-0 [&_ul]:pl-5',
].join(' ');

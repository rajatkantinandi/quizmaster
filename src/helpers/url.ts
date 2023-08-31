const urlRegex = new RegExp(
  '^' +
    // protocol identifier
    '(?:(?:https?|ftp)://)?' +
    // user:pass authentication
    '(?:\\S+(?::\\S*)?@)?' +
    '(?:' +
    // IP address exclusion
    // private & local networks
    '(?!(?:10|127)(?:\\.\\d{1,3}){3})' +
    '(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})' +
    '(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})' +
    // IP address dotted notation octets
    // excludes loopback network 0.0.0.0
    // excludes reserved space >= 224.0.0.0
    // excludes network & broacast addresses
    // (first & last IP address of each class)
    '(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])' +
    '(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}' +
    '(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))' +
    '|' +
    // host name
    '(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)' +
    // domain name
    '(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*' +
    // TLD identifier
    '(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))' +
    // TLD may end with dot
    '\\.?' +
    ')' +
    // port number
    '(?::\\d{2,5})?' +
    // resource path
    '(?:[/?#]\\S*)?' +
    '$',
  'i',
);

const mailtoUrlRegex = /mailto:([a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4})/gi;
const telUrlRegex = /tel:([0-9()\-+\s]+)/gi;
const smsUrlRegex = /sms:([0-9()\-+\s]+)/gi;

export const isValidUrl = (str: string) => {
  return !!(str.match(urlRegex) || str.match(mailtoUrlRegex) || str.match(telUrlRegex) || str.match(smsUrlRegex));
};

export const imageContentTypes = [
  'binary/octet-stream',
  'image/jpeg',
  'image/pjpeg',
  'image/png',
  'image/gif',
  'image/bmp',
  'image/x-windows-bmp',
  'image/tiff',
  'image/webp',
  'image/svg+xml',
];

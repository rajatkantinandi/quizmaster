
/* eslint-disable max-len */
const youtubeRegex =
  /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|shorts\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;

const vimeoRegex =
  /^https?:\/\/(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^/]*)\/videos\/|album\/(\d+)\/video\/|video\/)?(\d+)(?:$|\/|\?)/;

const googleDriveVideoRegex = /^https?:\/\/drive.google.com\/file\/d\/([^/]+)\/?/;

export const getEmbedUrlFromURL = (url: string) => {
  const youTubeMatch = url.match(youtubeRegex);
  const vimeoMatch = url.match(vimeoRegex);
  const googleDriveMatch = url.match(googleDriveVideoRegex);

  if (youTubeMatch?.[1]) {
    return `https://www.youtube.com/embed/${youTubeMatch[1]}`;
  }
  if (vimeoMatch?.[3]) {
    return `https://player.vimeo.com/video/${vimeoMatch[3]}`;
  }
  if (googleDriveMatch?.[1]) {
    return `https://drive.google.com/file/d/${googleDriveMatch[1]}/preview`;
  }

  return null;
};
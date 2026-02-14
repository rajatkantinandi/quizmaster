import React from 'react';
import useVideoInModal from '../../helpers/useVideoInModal';
import Icon from '../Icon';

type Props = {
  thumbnailUrl: string;
  videoEmbedUrl: string;
  aspectRatio: number;
  videoTitle?: string;
};

export default function VideoPlayerOpenInModal({ thumbnailUrl, videoTitle, videoEmbedUrl, aspectRatio }: Props) {
  const showVideo = useVideoInModal({ videoEmbedUrl, videoTitle });

  return (
    <button onClick={showVideo} className="relative">
      <Icon name="play" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      {!!videoTitle && <div className="absolute bottom-2 left-0 right-0 text-white text-center">{videoTitle}</div>}
      <img
        src={thumbnailUrl}
        alt=""
        style={{ aspectRatio, width: 534, maxHeight: 300, objectFit: 'cover', opacity: 0.7 }}
      />
    </button>
  );
}

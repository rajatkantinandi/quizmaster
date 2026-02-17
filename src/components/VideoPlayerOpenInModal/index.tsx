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
    <button
      onClick={showVideo}
      className="relative cursor-pointer appearance-none overflow-hidden rounded-[10px] border-0 p-0 shadow-[0.5px_0.5px_10px_-2px_var(--shadow-color-light)]">
      <Icon
        name="play"
        className="absolute left-1/2 top-[150px] z-[2] h-[60px] w-[60px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--qm-primary)] p-2 fill-[#fff]"
      />
      {!!videoTitle && (
        <div className="absolute left-1/2 top-[210px] z-[2] -translate-x-1/2 -translate-y-1/2 rounded-[10px] bg-[var(--info-text-color)] px-[10px] py-[5px] text-white">
          {videoTitle}
        </div>
      )}
      <img
        src={thumbnailUrl}
        alt=""
        style={{ aspectRatio, width: 534, maxHeight: 300, objectFit: 'cover', opacity: 0.7 }}
      />
    </button>
  );
}

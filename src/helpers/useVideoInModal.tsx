import React from 'react';
import { useStore } from '../useStore';

type Props = {
  videoEmbedUrl: string;
  videoTitle?: string;
};

export default function useVideoInModal({ videoEmbedUrl, videoTitle }: Props) {
  const { showModal } = useStore();

  const showVideo = () => {
    showModal({
      body: (
        <iframe
          title={videoTitle}
          width="100%"
          height={Math.max(500, window.innerHeight - 300)}
          allowFullScreen
          allow="autoplay;"
          src={videoEmbedUrl}
          frameBorder="0"
        />
      ),
      okText: '',
      cancelText: '',
      size: '70%',
    });
  };

  return showVideo;
}

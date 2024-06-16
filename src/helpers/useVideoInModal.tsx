import React, { useRef } from 'react';
import { useStore } from '../useStore';
import { track } from './track';
import { TrackingEvent } from '../constants';

type Props = {
  videoEmbedUrl: string;
  videoTitle?: string;
};

export default function useVideoInModal({ videoEmbedUrl, videoTitle }: Props) {
  const { showModal } = useStore();
  const videoStartTime = useRef(0);

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
          onLoad={() => {
            track(TrackingEvent.VIDEO_PLAYED, { videoTitle });
            videoStartTime.current = new Date().valueOf();
          }}
          frameBorder="0"
        />
      ),
      okText: '',
      cancelText: '',
      size: '70%',
      cancelCallback: () => {
        track(TrackingEvent.VIDEO_CLOSED, {
          videoTitle,
          durationInSeconds: Math.round((new Date().valueOf() - videoStartTime.current) / 1000),
        });
      },
    });
  };

  return showVideo;
}

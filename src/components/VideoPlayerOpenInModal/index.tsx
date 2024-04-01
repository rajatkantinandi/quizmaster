import React from 'react';
import useVideoInModal from '../../helpers/useVideoInModal';
import Icon from '../Icon';
import styles from './styles.module.css';

type Props = {
  thumbnailUrl: string;
  videoEmbedUrl: string;
  aspectRatio: number;
  videoTitle?: string;
};

export default function VideoPlayerOpenInModal({ thumbnailUrl, videoTitle, videoEmbedUrl, aspectRatio }: Props) {
  const showVideo = useVideoInModal({ videoEmbedUrl, videoTitle });

  return (
    <button onClick={showVideo} className={styles.button}>
      <Icon name="play" className={styles.playIcon} />
      {!!videoTitle && <div className={styles.title}>{videoTitle}</div>}
      <img
        src={thumbnailUrl}
        alt=""
        style={{ aspectRatio, width: 534, maxHeight: 300, objectFit: 'cover', opacity: 0.7 }}
      />
    </button>
  );
}

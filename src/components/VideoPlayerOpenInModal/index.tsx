import React from 'react';
import { useStore } from '../../useStore';
import Icon from '../Icon';
import styles from './styles.module.css';

type Props = {
  thumbnailUrl: string;
  videoEmbedUrl: string;
  aspectRatio: number;
  videoTitle?: string;
};

export default function VideoPlayerOpenInModal({ thumbnailUrl, videoTitle, videoEmbedUrl, aspectRatio }: Props) {
  const { showModal } = useStore();

  const showVideo = () => {
    showModal({
      body: (
        <iframe
          title="Video demo"
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

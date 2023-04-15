import React from 'react';
import styles from './styles.module.css';
import { pickTextColorBasedOnBgColorSimple } from '../../helpers';

export default function TeamAvatar({ shouldShowAvatar = true, size = '', team }) {
  function getAvatarStyles(avatarColor) {
    const color = pickTextColorBasedOnBgColorSimple(avatarColor);

    return {
      backgroundColor: avatarColor,
      color,
      border: `1px solid ${color}`,
    };
  }

  function getNameInitials(name) {
    const arr = name.replace(/\s\s+/g, ' ').split(' ');

    // If team name has two words then take 1st character of each word
    // else take first two characters to first word
    // ex. Team Name - John Doe than name Initials are JD
    // Team Name - John than name Initials are JO
    return arr[0][0].toUpperCase() + (arr[1] ? arr[1][0].toUpperCase() : arr[0][1].toUpperCase());
  }

  if (shouldShowAvatar) {
    return (
      <div
        className={`flex justifyCenter alignCenter ${styles[size]} ${styles.avatar}`}
        style={getAvatarStyles(team.avatarColor)}>
        {getNameInitials(team.name)}
      </div>
    );
  } else {
    return <div className={`${styles[size]} ${styles.avatar}`}></div>;
  }
}

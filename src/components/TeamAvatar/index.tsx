import React from 'react';
import { pickTextColorBasedOnBgColorSimple } from '../../helpers';

interface TeamAvatarProps {
  shouldShowAvatar?: boolean;
  size?: string;
  team: {
    name: string;
    avatarColor: string;
  };
}

export default function TeamAvatar({ shouldShowAvatar = true, size = '', team }: TeamAvatarProps) {
  function getAvatarStyles(avatarColor: string) {
    const color = pickTextColorBasedOnBgColorSimple(avatarColor);

    return {
      backgroundColor: avatarColor,
      color,
      border: `1px solid ${color}`,
    };
  }

  function getNameInitials(name: string) {
    const arr = name.replace(/\s\s+/g, ' ').split(' ');
    return arr[0][0].toUpperCase() + (arr[1] ? arr[1][0].toUpperCase() : arr[0][1]?.toUpperCase() || '');
  }

  const sizeClasses = size === 'small' ? 'rounded-[28px] w-7 h-7 text-xs' : 'rounded-[32px] w-9 h-9 font-bold';

  if (shouldShowAvatar) {
    return (
      <div
        className={`flex items-center justify-center ${sizeClasses} shrink-0`}
        style={getAvatarStyles(team.avatarColor)}
      >
        {getNameInitials(team.name)}
      </div>
    );
  } else {
    return <div className={sizeClasses}></div>;
  }
}

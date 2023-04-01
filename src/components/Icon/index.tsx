/**
 *
 * Icon
 *
 */
import React, { HTMLAttributes, memo } from 'react';
// eslint-disable-next-line
import icons from './icons';

export type IconName = keyof typeof icons;

export interface IconProps extends HTMLAttributes<HTMLOrSVGElement> {
  name: IconName | string;
  width?: number | string;
  height?: number | string;
  color?: string;
  className?: string;
  svgClassName?: string;
}

function Icon({
  name,
  width = 26,
  height = 26,
  color = 'var(--qm-primary)',
  className = '',
  ...rest
}: IconProps): JSX.Element {
  const IconComponent = icons[name];

  return <IconComponent width={width} height={height} fill={color} className={className} {...rest} />;
}

export default memo(Icon) as React.FunctionComponent<IconProps>;

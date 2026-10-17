import React from 'react';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { Colors } from '../../theme';

export type IconName =
  | 'coffee-bean'
  | 'pourover'
  | 'french-press'
  | 'teapot'
  | 'cup'
  | 'flame'
  | 'sparkles'
  | 'leaf'
  | 'heart'
  | 'heart-filled'
  | 'bag'
  | 'search'
  | 'filter'
  | 'star'
  | 'check'
  | 'truck'
  | 'arrow-left'
  | 'arrow-right'
  | 'chevron-down'
  | 'chevron-right'
  | 'plus'
  | 'minus'
  | 'trash'
  | 'user'
  | 'shield'
  | 'clock'
  | 'map-pin'
  | 'close'
  | 'info'
  | 'sliders';

interface BespokeIconProps {
  name: IconName | string;
  size?: number;
  color?: string;
}

export const BespokeIcon: React.FC<BespokeIconProps> = ({
  name,
  size = 22,
  color = Colors.light.textPrimary,
}) => {
  switch (name) {
    case 'coffee-bean':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z"
            fill={color}
            opacity={0.15}
          />
          <Path
            d="M17.5 4.5C13.5 3.5 8 5.5 5 9.5C2 13.5 3 19 6.5 21C10.5 23 16 20.5 19 16.5C22 12.5 21.5 5.5 17.5 4.5Z"
            stroke={color}
            strokeWidth={1.8}
            strokeLinecap="round"
          />
          <Path
            d="M7 7C9.5 9.5 8 13.5 12 14.5C16 15.5 14.5 19.5 17 19"
            stroke={color}
            strokeWidth={1.8}
            strokeLinecap="round"
          />
        </Svg>
      );

    case 'pourover':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M4 4H20L15 13H9L4 4Z"
            stroke={color}
            strokeWidth={1.8}
            strokeLinejoin="round"
          />
          <Path
            d="M9 13L8 20H16L15 13"
            stroke={color}
            strokeWidth={1.8}
            strokeLinejoin="round"
          />
          <Path
            d="M12 16V17"
            stroke={color}
            strokeWidth={2}
            strokeLinecap="round"
          />
          <Path
            d="M3 4H21"
            stroke={color}
            strokeWidth={1.8}
            strokeLinecap="round"
          />
        </Svg>
      );

    case 'french-press':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect
            x="6"
            y="6"
            width="12"
            height="15"
            rx="2"
            stroke={color}
            strokeWidth={1.8}
          />
          <Path d="M12 2V6" stroke={color} strokeWidth={1.8} />
          <Path d="M9 2H15" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
          <Path d="M6 13H18" stroke={color} strokeWidth={1.8} strokeDasharray="2 2" />
          <Path
            d="M18 9H20C21.1 9 22 9.9 22 11V15C22 16.1 21.1 17 20 17H18"
            stroke={color}
            strokeWidth={1.8}
          />
        </Svg>
      );

    case 'teapot':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M4 12C4 8 8 7 12 7C16 7 20 8 20 12C20 17 16 19 12 19C8 19 4 17 4 12Z"
            stroke={color}
            strokeWidth={1.8}
          />
          <Path d="M10 5H14" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
          <Path d="M12 5V7" stroke={color} strokeWidth={1.8} />
          <Path
            d="M4 11L1 8"
            stroke={color}
            strokeWidth={1.8}
            strokeLinecap="round"
          />
          <Path
            d="M20 10C22 11 22 13 20 15"
            stroke={color}
            strokeWidth={1.8}
            strokeLinecap="round"
          />
        </Svg>
      );

    case 'cup':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M4 8H18V14C18 17.31 15.31 20 12 20C8.69 20 6 17.31 6 14V8H4"
            stroke={color}
            strokeWidth={1.8}
            strokeLinecap="round"
          />
          <Path
            d="M18 10H20C21.1 10 22 10.9 22 12C22 13.1 21.1 14 20 14H18"
            stroke={color}
            strokeWidth={1.8}
          />
          <Path
            d="M9 3C9 4.5 8 5.5 8 6.5"
            stroke={color}
            strokeWidth={1.5}
            strokeLinecap="round"
          />
          <Path
            d="M13 3C13 4.5 12 5.5 12 6.5"
            stroke={color}
            strokeWidth={1.5}
            strokeLinecap="round"
          />
        </Svg>
      );

    case 'leaf':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M19.5 4.5C14.5 4.5 7 8 5 15C12 17 15.5 9.5 19.5 4.5Z"
            stroke={color}
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M5 15L3 21"
            stroke={color}
            strokeWidth={1.8}
            strokeLinecap="round"
          />
          <Path
            d="M8 13.5C11 11.5 14 9.5 17 6.5"
            stroke={color}
            strokeWidth={1.5}
            strokeLinecap="round"
          />
        </Svg>
      );

    case 'flame':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M12 2C10 5.5 13 8 11 11C10 9 9.5 8.5 8 10C6 12 5 14.5 5 17C5 20.87 8.13 24 12 24C15.87 24 19 20.87 19 17C19 12 14.5 8.5 12 2Z"
            stroke={color}
            strokeWidth={1.8}
            strokeLinejoin="round"
          />
        </Svg>
      );

    case 'sparkles':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M12 2L13.8 8.2L20 10L13.8 11.8L12 18L10.2 11.8L4 10L10.2 8.2L12 2Z"
            stroke={color}
            strokeWidth={1.8}
            strokeLinejoin="round"
          />
          <Circle cx="19" cy="4" r="1.5" fill={color} />
          <Circle cx="5" cy="18" r="1" fill={color} />
        </Svg>
      );

    case 'heart':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z"
            stroke={color}
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );

    case 'heart-filled':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z"
            fill={color}
          />
        </Svg>
      );

    case 'bag':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M6 8H18L19 21H5L6 8Z"
            stroke={color}
            strokeWidth={1.8}
            strokeLinejoin="round"
          />
          <Path
            d="M9 10V6C9 4.34 10.34 3 12 3C13.66 3 15 4.34 15 6V10"
            stroke={color}
            strokeWidth={1.8}
            strokeLinecap="round"
          />
        </Svg>
      );

    case 'search':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Circle
            cx="11"
            cy="11"
            r="7"
            stroke={color}
            strokeWidth={1.8}
          />
          <Path
            d="M20 20L16 16"
            stroke={color}
            strokeWidth={2}
            strokeLinecap="round"
          />
        </Svg>
      );

    case 'filter':
    case 'sliders':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M4 6H20" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
          <Circle cx="8" cy="6" r="2.5" fill="#FFFFFF" stroke={color} strokeWidth={1.8} />
          <Path d="M4 12H20" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
          <Circle cx="16" cy="12" r="2.5" fill="#FFFFFF" stroke={color} strokeWidth={1.8} />
          <Path d="M4 18H20" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
          <Circle cx="10" cy="18" r="2.5" fill="#FFFFFF" stroke={color} strokeWidth={1.8} />
        </Svg>
      );

    case 'star':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
            fill={color}
          />
        </Svg>
      );

    case 'check':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M5 12L10 17L19 7"
            stroke={color}
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );

    case 'truck':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="2" y="5" width="13" height="11" rx="1" stroke={color} strokeWidth={1.8} />
          <Path
            d="M15 9H19L22 13V16H15V9Z"
            stroke={color}
            strokeWidth={1.8}
            strokeLinejoin="round"
          />
          <Circle cx="6.5" cy="17.5" r="2" stroke={color} strokeWidth={1.8} />
          <Circle cx="18.5" cy="17.5" r="2" stroke={color} strokeWidth={1.8} />
        </Svg>
      );

    case 'arrow-left':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M19 12H5M5 12L12 19M5 12L12 5"
            stroke={color}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );

    case 'arrow-right':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M5 12H19M19 12L12 5M19 12L12 19"
            stroke={color}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );

    case 'chevron-down':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M6 9L12 15L18 9"
            stroke={color}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );

    case 'chevron-right':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M9 18L15 12L9 6"
            stroke={color}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );

    case 'plus':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M12 5V19M5 12H19"
            stroke={color}
            strokeWidth={2}
            strokeLinecap="round"
          />
        </Svg>
      );

    case 'minus':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M5 12H19"
            stroke={color}
            strokeWidth={2}
            strokeLinecap="round"
          />
        </Svg>
      );

    case 'trash':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M3 6H21M19 6V20C19 21.1 18.1 22 17 22H7C5.9 22 5 21.1 5 20V6M8 6V4C8 2.9 8.9 2 10 2H14C15.1 2 16 2.9 16 4V6"
            stroke={color}
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path d="M10 11V17M14 11V17" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
        </Svg>
      );

    case 'user':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Circle cx="12" cy="7" r="4" stroke={color} strokeWidth={1.8} />
          <Path
            d="M4 21C4 17.13 7.58 14 12 14C16.42 14 20 17.13 20 21"
            stroke={color}
            strokeWidth={1.8}
            strokeLinecap="round"
          />
        </Svg>
      );

    case 'shield':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M12 2L4 5V11C4 16.55 7.42 21.74 12 23C16.58 21.74 20 16.55 20 11V5L12 2Z"
            stroke={color}
            strokeWidth={1.8}
            strokeLinejoin="round"
          />
          <Path d="M9 12L11 14L15 10" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
        </Svg>
      );

    case 'clock':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth={1.8} />
          <Path
            d="M12 7V12L15 15"
            stroke={color}
            strokeWidth={1.8}
            strokeLinecap="round"
          />
        </Svg>
      );

    case 'map-pin':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2Z"
            stroke={color}
            strokeWidth={1.8}
          />
          <Circle cx="12" cy="9" r="2.5" stroke={color} strokeWidth={1.8} />
        </Svg>
      );

    case 'close':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M18 6L6 18M6 6L18 18"
            stroke={color}
            strokeWidth={2}
            strokeLinecap="round"
          />
        </Svg>
      );

    case 'info':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth={1.8} />
          <Path d="M12 8V8.5M12 11V16" stroke={color} strokeWidth={2} strokeLinecap="round" />
        </Svg>
      );

    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Circle cx="12" cy="12" r="8" stroke={color} strokeWidth={1.5} />
        </Svg>
      );
  }
};

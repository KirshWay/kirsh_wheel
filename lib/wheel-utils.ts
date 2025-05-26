import type { WheelSegment } from './types';

export const calculateSegmentAngle = (segmentCount: number): number => {
  return 360 / segmentCount;
};

export const degreesToRadians = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};

export const calculateSegmentWidth = (radius: number, segmentAngle: number): number => {
  const radians = degreesToRadians(segmentAngle);
  return 2 * radius * Math.sin(radians / 2);
};

export const generateRandomSpin = (segmentCount: number, minSpins = 5, maxSpins = 8): number => {
  const segmentAngle = calculateSegmentAngle(segmentCount);

  const fullSpins = minSpins + Math.random() * (maxSpins - minSpins);

  const randomSegment = Math.floor(Math.random() * segmentCount);

  const offsetRange = segmentAngle * 0.8;
  const offsetStart = segmentAngle * 0.1;
  const randomOffset = offsetStart + Math.random() * offsetRange;

  return 360 * fullSpins + randomSegment * segmentAngle + randomOffset;
};

export const getWinningSegment = (
  rotation: number,
  segments: WheelSegment[]
): { segment: WheelSegment; index: number } => {
  const segmentAngle = calculateSegmentAngle(segments.length);

  const normalizedRotation = ((rotation % 360) + 360) % 360;

  const adjustedRotation = (360 - normalizedRotation) % 360;

  const segmentIndex = Math.floor(adjustedRotation / segmentAngle) % segments.length;

  return {
    segment: segments[segmentIndex],
    index: segmentIndex,
  };
};

export const createSegmentPath = (
  index: number,
  segmentCount: number,
  radius: number,
  centerX: number,
  centerY: number
): string => {
  const segmentAngle = calculateSegmentAngle(segmentCount);
  const startAngle = index * segmentAngle - 90;
  const endAngle = startAngle + segmentAngle;

  const startAngleRad = degreesToRadians(startAngle);
  const endAngleRad = degreesToRadians(endAngle);

  const x1 = centerX + radius * Math.cos(startAngleRad);
  const y1 = centerY + radius * Math.sin(startAngleRad);
  const x2 = centerX + radius * Math.cos(endAngleRad);
  const y2 = centerY + radius * Math.sin(endAngleRad);

  const largeArcFlag = segmentAngle > 180 ? 1 : 0;

  return [
    `M ${centerX} ${centerY}`,
    `L ${x1} ${y1}`,
    `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
    'Z',
  ].join(' ');
};

export const calculateTextPosition = (
  index: number,
  segmentCount: number,
  radius: number,
  textDistance: number,
  centerX: number,
  centerY: number
): { x: number; y: number; rotation: number } => {
  const segmentAngle = calculateSegmentAngle(segmentCount);
  const angle = index * segmentAngle + segmentAngle / 2 - 90;
  const angleRad = degreesToRadians(angle);

  const textRadius = radius - textDistance;
  const x = centerX + textRadius * Math.cos(angleRad);
  const y = centerY + textRadius * Math.sin(angleRad);

  return {
    x,
    y,
    rotation: angle + 90,
  };
};

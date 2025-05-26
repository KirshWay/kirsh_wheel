'use client';

import { motion } from 'motion/react';
import { useCallback,useRef, useState } from 'react';

import type { SpinResult, WheelSegment } from '@/lib/types';
import { cn } from '@/lib/utils';
import {
  calculateTextPosition,
  createSegmentPath,
  generateRandomSpin,
  getWinningSegment,
} from '@/lib/wheel-utils';

import { Button } from './ui/button';

export type Props = {
  segments: WheelSegment[];
  onSpinComplete?: (result: SpinResult) => void;
  size?: number;
  strokeWidth?: number;
  fontSize?: number;
  textDistance?: number;
  disabled?: boolean;
  className?: string;
};

const DEFAULT_SIZE = 300;
const DEFAULT_STROKE_WIDTH = 2;
const DEFAULT_FONT_SIZE = 14;
const DEFAULT_TEXT_DISTANCE = 50;

export const Wheel = ({
  segments,
  onSpinComplete,
  size = DEFAULT_SIZE,
  strokeWidth = DEFAULT_STROKE_WIDTH,
  fontSize = DEFAULT_FONT_SIZE,
  textDistance = DEFAULT_TEXT_DISTANCE,
  disabled = false,
  className,
}: Props) => {
  const wheelRef = useRef<SVGSVGElement>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [targetRotation, setTargetRotation] = useState(0);

  const radius = (size - strokeWidth) / 2;
  const centerX = size / 2;
  const centerY = size / 2;

  const handleSpin = useCallback(() => {
    if (isSpinning || disabled) return;

    const newRotation = targetRotation + generateRandomSpin(segments.length);
    setTargetRotation(newRotation);
    setIsSpinning(true);
  }, [isSpinning, disabled, targetRotation, segments.length]);

  const handleAnimationComplete = useCallback(() => {
    setIsSpinning(false);

    const result = getWinningSegment(targetRotation, segments);
    const spinResult: SpinResult = {
      segment: result.segment,
      rotation: targetRotation,
      index: result.index,
    };

    onSpinComplete?.(spinResult);
  }, [targetRotation, segments, onSpinComplete]);

  const renderSegments = () => {
    return segments.map((segment, index) => {
      const path = createSegmentPath(index, segments.length, radius, centerX, centerY);
      const textPos = calculateTextPosition(
        index,
        segments.length,
        radius,
        textDistance,
        centerX,
        centerY
      );

      return (
        <g key={segment.id}>
          <path
            d={path}
            fill={segment.color}
            stroke="white"
            strokeWidth={strokeWidth}
            className="wheel-segment"
          />

          <text
            x={textPos.x}
            y={textPos.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={fontSize}
            fill="white"
            fontWeight="bold"
            className="wheel-text"
            style={{
              transform: `rotate(${textPos.rotation}deg)`,
              transformOrigin: `${textPos.x}px ${textPos.y}px`,
            }}
            suppressHydrationWarning
          >
            {segment.label}
          </text>
        </g>
      );
    });
  };

  const renderPointer = () => {
    const pointerSize = radius * 0.1;
    const pointerY = centerY - radius - 10;

    return (
      <polygon
        points={`${centerX},${pointerY} ${centerX - pointerSize},${pointerY + pointerSize * 2} ${centerX + pointerSize},${pointerY + pointerSize * 2}`}
        fill="#8A79AB"
        stroke="white"
        strokeWidth={2}
        className="wheel-pointer"
      />
    );
  };

  return (
    <div className={cn('flex flex-col items-center gap-4', className)}>
      <div className="relative">
        <svg
          ref={wheelRef}
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="wheel-container"
          suppressHydrationWarning
        >
          <motion.g
            className="wheel-spinner"
            style={{
              transformOrigin: `${centerX}px ${centerY}px`,
            }}
            animate={{ rotate: targetRotation }}
            transition={{
              type: 'spring',
              stiffness: 30,
              damping: 30,
              mass: 1,
              duration: 4,
              restSpeed: 2,
              restDelta: 2,
            }}
            onAnimationComplete={handleAnimationComplete}
          >
            {renderSegments()}
          </motion.g>

          <circle
            cx={centerX}
            cy={centerY}
            r={radius * 0.1}
            fill="white"
            stroke="#333"
            strokeWidth={strokeWidth}
            className="wheel-center"
          />
        </svg>

        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="absolute top-0 left-0 pointer-events-none"
        >
          {renderPointer()}
        </svg>
      </div>

      <Button onClick={handleSpin} disabled={isSpinning || disabled}>
        {isSpinning ? 'Wheel is spinning...' : 'Spin the wheel'}
      </Button>
    </div>
  );
};

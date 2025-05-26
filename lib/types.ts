export type WheelSegment = {
  id: string;
  label: string;
  color: string;
  value?: number;
};

export type WheelConfig = {
  segments: WheelSegment[];
  size?: number;
  strokeWidth?: number;
  fontSize?: number;
  textDistance?: number;
};

export type SpinResult = {
  segment: WheelSegment;
  rotation: number;
  index: number;
};

'use client';

import { useState } from 'react';

import { Wheel } from '@/components/Wheel';
import type { SpinResult, WheelSegment } from '@/lib/types';

// TODO: TEMP DATA
const sampleSegments: WheelSegment[] = [
  { id: '1', label: 'Gift 1 ', color: '#FF6B6B' },
  { id: '2', label: 'Gift 2', color: '#4ECDC4' },
  { id: '3', label: 'Gift 3', color: '#45B7D1' },
  { id: '4', label: 'Gift 4', color: '#96CEB4' },
  { id: '5', label: 'Gift 5', color: '#FECA57' },
  { id: '6', label: 'Gift 6', color: '#FF9FF3' },
  { id: '7', label: 'Gift 7', color: '#54A0FF' },
  { id: '8', label: 'Gift 8', color: '#FF7675' },
];

export default function HomePage() {
  const [_, setLastResult] = useState<SpinResult | null>(null);
  const [history, setHistory] = useState<SpinResult[]>([]);

  const handleSpinComplete = (result: SpinResult) => {
    setLastResult(result);
    setHistory((prev) => [result, ...prev.slice(0, 4)]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br bg-[#6d559c]">
      <div className="container mx-auto p-4">
        <div className="flex flex-col lg:flex-row items-start justify-center gap-8">
          <div className="flex flex-col items-center">
            <Wheel
              segments={sampleSegments}
              onSpinComplete={handleSpinComplete}
              size={400}
              className="mb-4"
            />
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 w-full max-w-sm">
            <p className="text-xl font-bold text-white mb-4">📊 History of results</p>
            {history.length === 0 ? (
              <p className="text-gray-300">No results yet. Spin the wheel!</p>
            ) : (
              <div className="space-y-2">
                {history.map((result, index) => (
                  <div
                    key={`${result.segment.id}-${result.rotation}`}
                    className="flex items-center gap-3 p-2 rounded bg-white/5"
                  >
                    <span className="text-gray-400 text-sm w-6">#{index + 1}</span>
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: result.segment.color }}
                    />
                    <span className="text-white flex-1">{result.segment.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

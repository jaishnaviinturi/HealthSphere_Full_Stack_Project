import React from 'react';
import { Clock } from 'lucide-react';

interface TimeSelectorProps {
  times: string[];
  onChange: (times: string[]) => void;
  frequency: number;
}

export function TimeSelector({ times, onChange, frequency }: TimeSelectorProps) {
  const handleTimeChange = (index: number, value: string) => {
    const newTimes = [...times];
    newTimes[index] = value;
    onChange(newTimes);
  };

  return (
    <div className="space-y-3">
      {Array.from({ length: frequency }).map((_, index) => (
        <div key={index} className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-gray-500" />
          <input
            type="time"
            value={times[index] || ''}
            onChange={(e) => handleTimeChange(index, e.target.value)}
            className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      ))}
    </div>
  );
}
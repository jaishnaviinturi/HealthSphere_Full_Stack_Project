import React from 'react';

const DAYS = [
  { id: 1, name: 'Mon' },
  { id: 2, name: 'Tue' },
  { id: 3, name: 'Wed' },
  { id: 4, name: 'Thu' },
  { id: 5, name: 'Fri' },
  { id: 6, name: 'Sat' },
  { id: 7, name: 'Sun' },
];

interface DaySelectorProps {
  selectedDays: number[];
  onChange: (days: number[]) => void;
}

export function DaySelector({ selectedDays, onChange }: DaySelectorProps) {
  const toggleDay = (dayId: number) => {
    const newDays = selectedDays.includes(dayId)
      ? selectedDays.filter(id => id !== dayId)
      : [...selectedDays, dayId].sort((a, b) => a - b);
    onChange(newDays);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {DAYS.map(day => (
        <button
          key={day.id}
          onClick={() => toggleDay(day.id)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
            ${selectedDays.includes(day.id)
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
        >
          {day.name}
        </button>
      ))}
    </div>
  );
}
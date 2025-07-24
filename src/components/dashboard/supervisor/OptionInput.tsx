'use client';

import React from 'react';

type Option = {
  text: string;
  is_correct: boolean;
};

type Props = {
  options: Option[];
  onChange: (index: number, field: 'text' | 'is_correct', value: string | boolean) => void;
  onAddOption?: () => void;
  namePrefix?: string; // untuk membedakan radio antar pertanyaan
};

export default function OptionInput({ options, onChange, onAddOption, namePrefix = 'option' }: Props) {
  return (
    <div className="space-y-2">
      {options.map((opt, index) => {
        const radioId = `${namePrefix}-option-${index}`;
        return (
          <div key={index} className="flex items-center gap-2">
            <input
              type="text"
              value={opt.text}
              onChange={(e) => onChange(index, 'text', e.target.value)}
              placeholder={`Opsi ${index + 1}`}
              className="flex-1 px-3 py-2 border rounded-md text-sm"
            />
            <input
              id={radioId}
              type="radio"
              name={namePrefix}
              checked={opt.is_correct}
              onChange={() => onChange(index, 'is_correct', true)}
              className="accent-cyan-600"
            />
            <label htmlFor={radioId} className="text-sm text-gray-700">
              Benar
            </label>
          </div>
        );
      })}

      {onAddOption && (
        <button
          type="button"
          onClick={onAddOption}
          className="text-sm text-cyan-600 hover:underline mt-1"
        >
          + Tambah Opsi
        </button>
      )}
    </div>
  );
}

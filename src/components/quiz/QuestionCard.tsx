'use client';

import Image from 'next/image';

type Option = {
  label: string;
  value: string;
};

type Props = {
  question: string;
  image?: string;
  options: Option[];
  selectedAnswer: string | null;
  onSelect: (value: string) => void;
};

export default function QuestionCard({
  question,
  image,
  options,
  selectedAnswer,
  onSelect,
}: Props) {
  return (
    <div className='space-y-4'>
      <h2 className='text-lg font-semibold'>{question}</h2>

      {image && (
        <div className='relative w-full h-48 rounded-lg overflow-hidden bg-gray-100'>
          <Image
            src={image}
            alt='Ilustrasi'
            fill
            className='object-contain'
          />
        </div>
      )}

      <div className='grid gap-3'>
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onSelect(opt.value)}
            className={`w-full px-4 py-2 border rounded-lg text-left transition ${
              selectedAnswer === opt.value
                ? 'bg-cyan-100 border-cyan-600 text-cyan-800 font-semibold'
                : 'bg-white border-gray-300 hover:bg-gray-50'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

'use client';

type Props = {
  current: 'all' | 'completed' | 'not_started';
  onChange: (val: 'all' | 'completed' | 'not_started') => void;
};

export default function QuizFilterBar({ current, onChange }: Props) {
  return (
    <div className="flex gap-2 text-sm font-medium">
      {(['all', 'not_started', 'completed'] as const).map((status) => (
        <button
          key={status}
          onClick={() => onChange(status)}
          className={`px-3 py-1.5 rounded-md border ${
            current === status
              ? 'bg-cyan-600 text-white border-cyan-600'
              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
          }`}
        >
          {status === 'all'
            ? 'Semua'
            : status === 'not_started'
            ? 'Belum Dikerjakan'
            : 'Sudah Dikerjakan'}
        </button>
      ))}
    </div>
  );
}

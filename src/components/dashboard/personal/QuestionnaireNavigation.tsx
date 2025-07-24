'use client';

import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';

type Props = {
  onBack: () => void;
  onNext: () => void;
  isFirst: boolean;
  isLast: boolean;
  disabled: boolean;
};

export default function QuestionnaireNavigation({ onBack, onNext, isFirst, isLast, disabled }: Props) {
  return (
    <div className="flex justify-between pt-4">
      <button
        onClick={onBack}
        disabled={isFirst}
        className="flex items-center gap-1 text-sm text-slate-600 hover:text-slate-800 disabled:text-slate-300"
      >
        <ArrowLeft className="w-4 h-4" />
        Sebelumnya
      </button>

      <button
        onClick={onNext}
        disabled={disabled}
        className={`flex items-center gap-2 px-6 py-2 text-sm font-medium rounded-md transition ${
          disabled
            ? 'bg-slate-300 text-white cursor-not-allowed'
            : 'bg-gradient-to-r from-sky-500 to-teal-500 text-white hover:brightness-110'
        }`}
      >
        {isLast ? 'Selesai' : 'Lanjutkan'}
        {isLast ? <CheckCircle className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
      </button>
    </div>
  );
}

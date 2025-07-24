'use client';

import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';

type QuestionnaireNavigationProps = {
  step: number;
  total: number;
  canNext: boolean;
  onBack: () => void;
  onNext: () => void;
};

export default function QuestionnaireNavigation({
  step,
  total,
  canNext,
  onBack,
  onNext,
}: QuestionnaireNavigationProps) {
  return (
    <div className="flex justify-between items-center pt-4">
      <button
        onClick={onBack}
        disabled={step === 0}
        className="inline-flex items-center gap-1 text-sm text-slate-700 bg-white border border-slate-300 px-4 py-2 rounded-md hover:bg-slate-100 disabled:opacity-50"
      >
        <ArrowLeft className="w-4 h-4" />
        Sebelumnya
      </button>

      <button
        onClick={onNext}
        disabled={!canNext}
        className={`flex items-center gap-2 px-6 py-2 text-sm font-medium rounded-md transition ${
          canNext
            ? 'bg-gradient-to-r from-sky-500 to-teal-500 text-white hover:brightness-110'
            : 'bg-slate-300 text-white cursor-not-allowed'
        }`}
      >
        {step === total - 1 ? 'Selesai' : 'Lanjutkan'}
        {step === total - 1 ? <CheckCircle className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
      </button>
    </div>
  );
}

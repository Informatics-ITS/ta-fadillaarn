'use client';

type QuestionnaireHeaderProps = {
  step: number;
  total: number;
};

export default function QuestionnaireHeader({ step, total }: QuestionnaireHeaderProps) {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-bold text-slate-800">Evaluasi Postur - Kuisioner</h1>
      <p className="text-sm text-slate-500">Pertanyaan {step + 1} dari {total}</p>
      <div className="w-full bg-slate-200 rounded-full h-2">
        <div
          className="bg-cyan-500 h-full rounded-full transition-all"
          style={{ width: `${((step + 1) / total) * 100}%` }}
        />
      </div>
    </div>
  );
}

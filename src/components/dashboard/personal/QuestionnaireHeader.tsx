'use client';

type QuestionnaireHeaderProps = {
  current: number;
  total: number;
};

export default function QuestionnaireHeader({ current, total }: QuestionnaireHeaderProps) {
  const progress = (current / total) * 100;

  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-bold text-slate-800">Kuis Ergonomi</h1>
      <p className="text-sm text-slate-500">Pertanyaan {current} dari {total}</p>
      <div className="w-full bg-slate-200 h-2 rounded-full">
        <div
          className="bg-cyan-500 h-full rounded-full transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

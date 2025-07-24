type ProgressProps = {
  step: number;
  total: number;
};

export default function QuestionnaireProgress({ step, total }: ProgressProps) {
  const percent = ((step + 1) / total) * 100;
  return (
    <div className="w-full bg-slate-200 rounded-full h-2">
      <div
        className="bg-cyan-500 h-full rounded-full transition-all"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}

'use client';

type Props = {
  completed: number;
  total: number;
};

export default function ProgressBar({ completed, total }: Props) {
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm text-gray-600 font-semibold">Progress Mingguan</p>
        <span className="text-xs text-cyan-600 font-medium">
          {completed}/{total} Selesai
        </span>
      </div>

      <div className="w-full">
        <div className="h-3 bg-gray-200 rounded-full relative">
          <div
            className="h-full rounded-full bg-gradient-to-r from-sky-500 to-teal-500"
            style={{ width: `${percent}%` }}
          />
        </div>
        <div className="flex justify-between text-[11px] text-gray-400 mt-1">
          <span>0%</span>
          <span>100%</span>
        </div>
      </div>
    </div>
  );
}

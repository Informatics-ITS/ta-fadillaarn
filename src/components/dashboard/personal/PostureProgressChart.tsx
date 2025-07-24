'use client';

import * as RadixProgress from '@radix-ui/react-progress';

type PostureProgressCardProps = {
  progress: number;
  completed: number;
  total: number;
};

export default function PostureProgressCard({ progress = 0, completed = 0, total = 0 }: PostureProgressCardProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
      <div className="text-slate-600 text-sm">Progress Evaluasi Postur</div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-700">Selesai: {completed} dari {total}</span>
        <span className="text-sm text-sky-600 font-semibold">{progress}%</span>
      </div>

      <RadixProgress.Root
        value={progress}
        className="relative h-3 w-full overflow-hidden rounded-full bg-slate-200"
      >
        <RadixProgress.Indicator
          className="h-full bg-gradient-to-r from-sky-500 to-teal-500 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </RadixProgress.Root>
    </div>
  );
}


'use client';

import { CameraIcon } from "lucide-react";
type Props = {
  score: number;
  date: string;
  status?: 'Baik' | 'Cukup' | 'Kurang';
};

export default function EvaluationCard({ score, date, status = 'Baik' }: Props) {
  const statusColor =
    status === 'Baik'
      ? 'bg-green-100 text-green-700'
      : status === 'Cukup'
      ? 'bg-yellow-100 text-yellow-700'
      : 'bg-red-100 text-red-700';

  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm relative">
      {/* Status badge */}
      <span
        className={`absolute top-4 right-4 text-xs px-3 py-1 rounded-full font-medium ${statusColor}`}
      >
        {status}
      </span>

      <div className="flex items-center gap-4">
        {/* Icon */}
        <div className="p-3 rounded-full bg-cyan-100 text-cyan-600">
          <CameraIcon className="w-5 h-5" />
        </div>

        {/* Text content */}
        <div className="flex-1">
          <p className="text-sm text-gray-500 font-medium">Evaluasi Terakhir</p>
          <h2 className="text-4xl font-bold text-gray-800 leading-tight">{score}</h2>
          <p className="text-sm text-gray-500">{date}</p>
        </div>

        {/* Detail link */}
        <a
          href="/dashboard/evaluasi"
          className="text-sm text-cyan-600 hover:underline whitespace-nowrap"
        >
          Detail →
        </a>
      </div>
    </div>
  );
}

'use client';

import { CalendarDays } from 'lucide-react';

type Props = {
  nextScheduleDate?: string;
  totalSchedule?: number;
};

export default function UpcomingSchedule({ nextScheduleDate, totalSchedule = 3 }: Props) {
  return (
    <div className="relative rounded-xl border bg-white p-5 shadow-sm">
      {/* Badge jumlah jadwal */}
      <span className="absolute top-4 right-4 bg-indigo-100 text-indigo-700 text-xs px-3 py-1 rounded-full font-medium">
        {totalSchedule} Jadwal
      </span>

      <div className="flex items-center gap-4">
        {/* Icon */}
        <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
          <CalendarDays className="w-5 h-5" />
        </div>

        {/* Teks */}
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">Jadwal Mendatang</p>
          <p className="text-sm text-gray-500">
            Evaluasi berikutnya: {nextScheduleDate || 'Belum dijadwalkan'}
          </p>
        </div>

        {/* Link */}
        <a
          href="/dashboard/jadwal"
          className="text-sm text-cyan-600 hover:underline whitespace-nowrap"
        >
          Lihat Jadwal
        </a>
      </div>
    </div>
  );
}

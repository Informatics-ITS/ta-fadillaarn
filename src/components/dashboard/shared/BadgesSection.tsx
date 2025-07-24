'use client';

import { Medal } from 'lucide-react';

type Badge = {
  title: string;
  level?: number;
};

type Props = {
  badges?: Badge[];
};

export default function BadgesSection({ badges = [] }: Props) {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="flex justify-between items-center mb-3">
        <p className="text-sm font-semibold text-gray-700">Lencana Saya</p>
        <a
          href="/dashboard/penghargaan"
          className="text-xs text-cyan-600 hover:underline font-medium"
        >
          Lihat Semua
        </a>
      </div>

      {badges.length === 0 ? (
        <p className="text-sm text-gray-500">Belum ada lencana yang diperoleh.</p>
      ) : (
        <ul className="grid grid-cols-2 gap-3">
          {badges.map((badge, idx) => (
            <li key={idx} className="flex items-center gap-3 bg-cyan-50 p-2 rounded-md">
              <div className="p-2 bg-white rounded-full border border-cyan-200">
                <Medal className="w-5 h-5 text-cyan-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-cyan-700">{badge.title}</p>
                {badge.level && (
                  <p className="text-xs text-gray-500">Level {badge.level}</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

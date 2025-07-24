'use client';

import { AlertTriangle } from 'lucide-react';

type Props = {
  message: string;
};

export default function ErgonomicAlert({ message }: Props) {
  return (
    <div className="rounded-xl border border-orange-300 bg-orange-50 p-5 text-sm text-orange-800 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="mt-1">
          <AlertTriangle className="w-5 h-5 text-orange-500" />
        </div>
        <div className="flex-1">
          <p className="font-semibold mb-1">Peringatan Ergonomi</p>
          <p className="mb-2">{message}</p>
          <a
            href="/dashboard/rekomendasi"
            className="text-cyan-700 hover:underline font-medium"
          >
            Lihat Rekomendasi →
          </a>
        </div>
      </div>
    </div>
  );
}

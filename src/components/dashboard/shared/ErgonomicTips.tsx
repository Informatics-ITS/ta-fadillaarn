'use client';

import { Lightbulb } from 'lucide-react';

type Tip = {
  title: string;
  desc: string;
};

type Props = {
  tips?: Tip[];
};

export default function ErgonomicTips({ tips = [] }: Props) {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <p className="text-sm font-semibold text-gray-700 mb-3">Tips Ergonomi</p>

      {tips.length === 0 ? (
        <p className="text-sm text-gray-500">Belum ada tips saat ini.</p>
      ) : (
        <ul className="space-y-3">
          {tips.map((tip, idx) => (
            <li key={idx} className="rounded-md bg-sky-50 p-3 flex items-start gap-3">
              <div className="mt-1">
                <Lightbulb className="w-4 h-4 text-sky-600" />
              </div>
              <div>
                <p className="font-medium text-sm text-sky-700">{tip.title}</p>
                <p className="text-sm text-gray-600">{tip.desc}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

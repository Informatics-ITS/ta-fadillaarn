import { ReactNode } from 'react';

type StatCardProps = {
  title: string;
  value: string;
  subtext?: string;
  highlight?: string;
  color?: string;
  icon: ReactNode; // tambahkan icon sebagai properti wajib
};

export default function StatCard({ title, value, subtext, highlight, color = 'slate', icon }: StatCardProps) {
  const badgeClass = {
    red: 'text-red-600 bg-red-100',
    orange: 'text-orange-600 bg-orange-100',
    slate: 'text-slate-600 bg-slate-100',
  }[color];

  return (
    <div className="bg-white shadow-sm border rounded-lg px-4 py-3 flex items-center justify-between">
      <div>
        <p className="text-sm text-slate-500">{title}</p>
        <p className="text-2xl font-semibold text-slate-800 mt-1">{value}</p>
        {subtext && <p className="text-xs text-slate-400">{subtext}</p>}
        {highlight && <span className={`inline-block mt-1 px-2 py-0.5 text-xs rounded ${badgeClass}`}>{highlight}</span>}
      </div>
      <div className="bg-slate-100 rounded-full p-2">{icon}</div>
    </div>
  );
}

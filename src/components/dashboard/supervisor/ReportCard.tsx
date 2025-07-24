'use client';

import { Calendar, Eye } from 'lucide-react';

type ReportCardProps = {
  id: string;
  name: string;
  email: string;
  department: string;
  score: number;
  risk: string;
  date: string;
};

export default function ReportCard({ id, name, email, department, score, risk, date }: ReportCardProps) {
  return (
    <div className="bg-white p-5 rounded-xl border hover:shadow-md transition">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-lg">{name}</h3>
          <p className="text-sm text-slate-500">{email}</p>
          <p className="text-sm text-slate-500">{department}</p>
        </div>
        <button className="flex items-center gap-1 px-3 py-1 text-sm rounded bg-teal-100 text-teal-600 hover:bg-teal-200">
          <Eye className="w-4 h-4" />
          Detail
        </button>
      </div>

      <div className="flex justify-between text-sm text-slate-600 mb-2">
        <div className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          {date}
        </div>
        <div className="font-medium">
          Skor: <span className="text-slate-800">{score}</span>
        </div>
      </div>

      <div>
        <span
          className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
            risk === 'High'
              ? 'bg-red-100 text-red-600'
              : risk === 'Medium'
              ? 'bg-yellow-100 text-yellow-600'
              : 'bg-green-100 text-green-600'
          }`}
        >
          Risiko: {risk}
        </span>
      </div>
    </div>
  );
}

'use client';

import { Eye, FileDown } from 'lucide-react';

type RiskLevel = 'Low' | 'Medium' | 'High' | string;

export type Report = {
  id: string;
  name: string;
  email: string;
  department: string;
  score: number;
  risk: RiskLevel;
  date: string;
};

type Props = {
  data: Report[];
  onView: (item: Report) => void;
  onDownload: (id: string) => void;
};

export default function ReportTable({ data, onView, onDownload }: Props) {
  const formatDate = (date: string) => {
    const d = new Date(date);
    if (isNaN(d.getTime())) return '-';
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="overflow-x-auto border rounded-lg">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-slate-50 text-slate-600 text-sm border-b">
          <tr>
            <th className="px-5 py-3">Nama</th>
            <th className="px-5 py-3">Email</th>
            <th className="px-5 py-3">Departemen</th>
            <th className="px-5 py-3">Tanggal</th>
            <th className="px-5 py-3 text-center">Skor</th>
            <th className="px-5 py-3 text-center">Risiko</th>
            <th className="px-5 py-3 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-5 py-8 text-center text-slate-400">
                Tidak ada data evaluasi.
              </td>
            </tr>
          ) : (
            data.map((emp) => (
              <tr key={emp.id} className="border-b hover:bg-slate-50 transition">
                <td className="px-5 py-4">{emp.name || '-'}</td>
                <td className="px-5 py-4">{emp.email || '-'}</td>
                <td className="px-5 py-4">{emp.department || '-'}</td>
                <td className="px-5 py-4">{formatDate(emp.date)}</td>
                <td className="px-5 py-4 text-center font-medium">{emp.score ?? '-'}</td>
                <td className="px-5 py-4 text-center">
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      emp.risk === 'High'
                        ? 'bg-red-100 text-red-700'
                        : emp.risk === 'Medium'
                        ? 'bg-yellow-100 text-yellow-700'
                        : emp.risk === 'Low'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {emp.risk || 'Unknown'}
                  </span>
                </td>
                <td className="px-5 py-4 flex justify-center gap-2">
                  <button
                    onClick={() => onView(emp)}
                    className="p-2 rounded-full border border-blue-300 text-blue-500 hover:bg-blue-50 shadow-sm"
                    title="Lihat Detail"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDownload(emp.id)}
                    className="p-2 rounded-full border border-green-300 text-green-500 hover:bg-green-50 shadow-sm"
                    title="Unduh"
                  >
                    <FileDown className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

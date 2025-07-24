'use client';

import { useMemo } from 'react';

const RiskBadge = ({ level }: { level: string }) => {
  const colorMap: any = {
    High: 'bg-red-100 text-red-600',
    Medium: 'bg-yellow-100 text-yellow-600',
    Low: 'bg-green-100 text-green-600',
  };
  return (
    <span className={`px-2 py-1 text-xs rounded-full font-medium ${colorMap[level]}`}>
      {level}
    </span>
  );
};

export default function EvaluationTable({ employees }: { employees: any[] }) {
  const latestEvaluations = useMemo(() => {
    return employees
      .filter((emp) => emp.evaluation)
      .map((emp) => ({
        name: emp.name,
        department: emp.division?.name || 'Tidak diketahui',
        date: emp.evaluation.createdAt?.slice(0, 10) || '-',
        score: emp.evaluation.score,
        risk: emp.evaluation.risk,
      }))
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 5);
  }, [employees]);

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold">Evaluasi Terbaru</h2>
        <a href="/supervisor/report-summary" className="text-sm text-sky-600 font-medium hover:underline">
          Lihat Semua
        </a>
      </div>

      <div className="overflow-auto bg-white rounded-xl border">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 font-semibold">
            <tr>
              <th className="px-4 py-3 text-left">Karyawan</th>
              <th className="px-4 py-3 text-left">Departemen</th>
              <th className="px-4 py-3 text-left">Tanggal</th>
              <th className="px-4 py-3 text-left">Skor</th>
              <th className="px-4 py-3 text-left">Risiko</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {latestEvaluations.length > 0 ? (
              latestEvaluations.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-2">{item.name}</td>
                  <td className="px-4 py-2">{item.department}</td>
                  <td className="px-4 py-2">{item.date}</td>
                  <td className="px-4 py-2 font-semibold">{item.score}</td>
                  <td className="px-4 py-2"><RiskBadge level={item.risk} /></td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={5} className="text-center py-6 text-gray-400">Belum ada data evaluasi.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

'use client';

import { useMemo } from 'react';

type Props = {
  employees: any[];
};

export default function DepartmentSummary({ employees }: Props) {
  const departments = useMemo(() => {
    const map: Record<string, number> = {};
    for (const emp of employees) {
      const dept = emp?.division?.name || 'Tidak diketahui';
      map[dept] = (map[dept] || 0) + 1;
    }
    return map;
  }, [employees]);

  const total = employees.length;

  if (total === 0)
    return (
      <div>
        <h2 className="text-lg font-semibold mb-3">Ikhtisar Departemen</h2>
        <p className="text-sm text-slate-400">Tidak ada data.</p>
      </div>
    );

  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">Ikhtisar Departemen</h2>
      <div className="space-y-3">
        {Object.entries(departments).map(([dept, count], idx) => {
          const percentage = total > 0 ? (count / total) * 100 : 0;
          return (
            <div key={idx} className="bg-white border rounded-xl p-4 shadow-sm space-y-1">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-semibold">{dept}</h3>
                <span className="text-xs text-gray-500">{count} Karyawan</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded">
                <div className="h-2 bg-sky-500 rounded" style={{ width: `${percentage}%` }} />
              </div>
              <div className="text-xs text-right text-gray-500">{percentage.toFixed(0)}%</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

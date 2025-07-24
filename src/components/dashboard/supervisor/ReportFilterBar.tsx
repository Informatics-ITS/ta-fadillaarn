'use client';

type Props = {
  deptFilter: string;
  riskFilter: string;
  searchTerm: string;
  divisions: string[]; // daftar departemen dinamis
  onDeptChange: (val: string) => void;
  onRiskChange: (val: string) => void;
  onSearchChange: (val: string) => void;
  onExport: () => void;
};

export default function ReportFilterBar({
  deptFilter,
  riskFilter,
  searchTerm,
  divisions,
  onDeptChange,
  onRiskChange,
  onSearchChange,
  onExport,
}: Props) {
  return (
    <div className="flex flex-wrap gap-3 items-center">
      <input
        type="text"
        placeholder="Cari nama karyawan..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="min-w-[200px] px-4 py-2 border border-gray-300 rounded-md text-slate-700 text-sm shadow-sm hover:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-500"
        aria-label="Cari nama karyawan"
      />

      <select
        id="deptFilter"
        aria-label="Filter Departemen"
        value={deptFilter}
        onChange={(e) => onDeptChange(e.target.value)}
        className="min-w-[200px] border border-gray-300 text-slate-700 rounded-md px-4 py-2 text-sm shadow-sm hover:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-500"
      >
        <option value="all">Semua Divisi</option>
        {divisions.length > 0 ? (
          divisions.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))
        ) : (
          <option disabled>Data divisi kosong</option>
        )}
      </select>

      <select
        id="riskFilter"
        aria-label="Filter Risiko"
        value={riskFilter}
        onChange={(e) => onRiskChange(e.target.value)}
        className="min-w-[160px] border border-gray-300 text-slate-700 rounded-md px-4 py-2 text-sm shadow-sm hover:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-500"
      >
        <option value="all">Semua Risiko</option>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>

      <button
        onClick={onExport}
        className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-sky-500 hover:brightness-110 text-white text-sm font-medium rounded-md shadow-md transition"
        type="button"
      >
        Export CSV
      </button>
    </div>
  );
}
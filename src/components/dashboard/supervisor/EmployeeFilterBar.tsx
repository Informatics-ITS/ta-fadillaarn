'use client';

import { Search, Download } from 'lucide-react';
import { useState } from 'react';

type Props = {
  onExport: () => void;
  onSearch: (query: string) => void;
  onFilterDepartemen: (value: string) => void;
  divisions: { id: string; name: string }[]; // ⬅️ data divisi dinamis
};

export default function EmployeeFilterBar({
  onExport,
  onSearch,
  onFilterDepartemen,
  divisions,
}: Props) {
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <div className="bg-white rounded-xl p-4 border flex flex-wrap items-center gap-2 justify-between">
      <div className="flex flex-wrap items-center gap-2 flex-1">
        {/* Input Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Cari nama atau email karyawan..."
            value={query}
            onChange={handleSearch}
            className="w-full border rounded-md pl-9 pr-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring focus:ring-sky-200"
          />
        </div>

        {/* Filter Departemen */}
        <select
          className="text-sm border rounded-md px-3 py-2 bg-gray-100 text-gray-700"
          onChange={(e) => onFilterDepartemen(e.target.value)}
        >
          <option value="">Semua Departemen</option>
          {divisions.map((div) => (
            <option key={div.id} value={div.name}>
              {div.name}
            </option>
          ))}
        </select>

        {/* Export */}
        <button
          onClick={onExport}
          className="flex items-center gap-1 text-sm text-gray-700 bg-gray-100 px-3 py-2 rounded-md border hover:bg-gray-200"
        >
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>
    </div>
  );
}

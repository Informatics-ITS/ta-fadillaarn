'use client';

import { Search, Download } from 'lucide-react';

type Props = {
  search: string;
  onSearchChange: (val: string) => void;
  onExport: () => void;
};

export default function DivisionFilterBar({ search, onSearchChange, onExport }: Props) {
  return (
    <div className="bg-white rounded-xl p-4 border flex flex-wrap items-center gap-2 justify-between">
      <div className="flex flex-wrap items-center gap-2 flex-1">
        {/* Input Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Cari nama divisi..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full border rounded-md pl-9 pr-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring focus:ring-sky-200"
          />
        </div>

        {/* Tombol Export */}
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

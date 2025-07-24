'use client';

import { Search, Download } from 'lucide-react';

type Props = {
  search: string;
  setSearch: (val: string) => void;
  setRefresh?: (val: boolean) => void;
  badges: { name: string; description: string }[];
};

export default function BadgeSearchFilter({
  search,
  setSearch,
  setRefresh,
  badges,
}: Props) {
  const handleExport = () => {
    if (!badges || badges.length === 0) {
      alert('Data badge belum tersedia.');
      return;
    }

    const headers = ['Nama', 'Deskripsi'];
    const rows = badges.map((b) => [b.name, b.description]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers, ...rows]
        .map((row) => row.map((v) => `"${v}"`).join(','))
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'data_badge.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
      <div className="relative w-full md:w-1/2">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Cari nama badge..."
          className="w-full border border-gray-300 rounded-md pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-200"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setRefresh?.(true);
          }}
        />
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleExport}
          className="flex items-center gap-1 border border-gray-300 px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-50"
        >
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>
    </div>
  );
}

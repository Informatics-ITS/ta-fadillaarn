'use client';

import { Search, Download } from 'lucide-react';

type Props = {
  search: string;
  setSearch: (val: string) => void;
  roleFilter: string;
  setRoleFilter: (val: string) => void;
  setRefresh?: (val: boolean) => void;
  users: any[];
};

export default function UserSearchFilter({
  search,
  setSearch,
  roleFilter,
  setRoleFilter,
  setRefresh,
  users,
}: Props) {
  const handleExport = () => {
    if (!users || users.length === 0) {
      alert('Data pengguna belum tersedia.');
      return;
    }

    const headers = ['Nama', 'Email', 'Role', 'Perusahaan'];
    const rows = users.map((u) => [
      u.name,
      u.email,
      u.role,
      u.company || '-',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers, ...rows].map((e) => e.map((v) => `"${v}"`).join(',')).join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'data_pengguna.csv');
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
          placeholder="Cari nama atau email..."
          className="w-full border border-gray-300 rounded-md pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-200"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setRefresh?.(true);
          }}
        />
      </div>

      <div className="flex gap-2">
        <select
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value);
            setRefresh?.(true);
          }}
          className="text-sm border border-gray-300 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-50 min-w-[140px] focus:outline-none focus:ring-2 focus:ring-sky-200"
        >
          <option value="">Semua Role</option>
          <option value="superadmin">Superadmin</option>
          <option value="supervisor">Supervisor</option>
          <option value="employee">Employee</option>
          <option value="personal">Personal</option>
        </select>

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

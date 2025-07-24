'use client';

import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';

type Division = {
  id: string;
  name: string;
};

type Props = {
  divisions: Division[];
  onEdit: (division: Division) => void;
  onDelete: (division: Division) => void;
};

export default function DivisionTable({ divisions, onEdit, onDelete }: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(divisions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentDivisions = divisions.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <table className="w-full text-sm text-gray-700">
        <thead className="bg-gray-50 text-gray-500 text-xs uppercase border-b">
          <tr>
            <th className="px-6 py-3 text-left">No</th>
            <th className="px-6 py-3 text-left">Nama Divisi</th>
            <th className="px-6 py-3 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {currentDivisions.length === 0 ? (
            <tr>
              <td colSpan={3} className="text-center py-6 text-gray-400">Tidak ada data</td>
            </tr>
          ) : (
            currentDivisions.map((d, index) => (
              <tr key={d.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4">{startIndex + index + 1}</td>
                <td className="px-6 py-4">{d.name}</td>
                <td className="px-6 py-4 text-center space-x-2">
                  <button
                    onClick={() => onEdit(d)}
                    className="text-gray-500 hover:text-gray-700"
                    title="Edit"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(d)}
                    className="text-gray-500 hover:text-gray-700"
                    title="Hapus"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center px-6 py-4 text-sm text-gray-600">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
          >
            Sebelumnya
          </button>
          <span>Halaman {currentPage} dari {totalPages}</span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
          >
            Selanjutnya
          </button>
        </div>
      )}
    </div>
  );
}

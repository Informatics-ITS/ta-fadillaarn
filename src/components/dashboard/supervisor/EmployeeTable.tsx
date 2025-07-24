'use client';

import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';

type Employee = {
  id: string;
  name: string;
  email: string;
  divisionId?: string;
  divisionName?: string;
  companyName?: string;
};

type Props = {
  employees: Employee[];
  onEdit: (emp: Employee) => void;
  onDelete: (emp: Employee) => void;
};

export default function EmployeeTable({ employees, onEdit, onDelete }: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(employees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEmployees = employees.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="overflow-x-auto bg-white border rounded-xl shadow">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50 text-left text-gray-600 font-semibold">
          <tr>
            <th className="px-6 py-3 w-16">No</th>
            <th className="px-6 py-3">Nama</th>
            <th className="px-6 py-3">Email</th>
            <th className="px-6 py-3">Departemen</th>
            <th className="px-6 py-3 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {paginatedEmployees.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center py-6 text-gray-400">
                Tidak ada data
              </td>
            </tr>
          ) : (
            paginatedEmployees.map((emp, index) => (
              <tr key={emp.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">{startIndex + index + 1}</td>
                <td className="px-6 py-4">{emp.name}</td>
                <td className="px-6 py-4">{emp.email}</td>
                <td className="px-6 py-4">{emp.divisionName || '-'}</td>
                <td className="px-6 py-4 text-center space-x-2">
                  <button
                    onClick={() => onEdit(emp)}
                    className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                    title="Edit"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(emp)}
                    className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
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
          <span>
            Halaman {currentPage} dari {totalPages}
          </span>
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

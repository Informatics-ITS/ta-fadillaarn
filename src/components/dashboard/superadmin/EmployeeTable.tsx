'use client';

import { Pencil, ShieldOff, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import EmployeeConfirmModal from './EmployeeConfirmModal';

type Employee = {
  id: string;
  name: string;
  email: string;
  companyName?: string;
  divisionName?: string;
  supervisorName?: string;
  status: string;
  lastLogin: string;
};

type EmployeeTableProps = {
  data: Employee[];
  refresh: boolean;
  setRefresh: (val: boolean) => void;
  onEdit: (employee: Employee) => void;
  onToggle: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
};

const statusColor: Record<string, string> = {
  active: 'bg-green-100 text-green-600',
  inactive: 'bg-gray-100 text-gray-500',
  suspended: 'bg-yellow-100 text-yellow-600',
};

export default function EmployeeTable({
  data,
  refresh,
  setRefresh,
  onEdit,
  onToggle,
  onDelete,
}: EmployeeTableProps) {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmType, setConfirmType] = useState<'delete' | 'suspend'>('delete');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [refresh]);

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = data.slice(startIndex, startIndex + itemsPerPage);

  const handleShowModal = (emp: Employee, type: 'delete' | 'suspend') => {
    setSelectedEmployee(emp);
    setConfirmType(type);
    setShowConfirmModal(true);
  };

  const handleConfirm = () => {
    if (!selectedEmployee) return;
    confirmType === 'delete' ? onDelete(selectedEmployee) : onToggle(selectedEmployee);
    setShowConfirmModal(false);
  };

  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
          <tr>
            <th className="px-6 py-3">Karyawan</th>
            <th className="px-6 py-3">Perusahaan</th>
            <th className="px-6 py-3">Divisi</th>
            <th className="px-6 py-3">Supervisor</th>
            <th className="px-6 py-3 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-center py-6 text-gray-400">
                Tidak ada data karyawan.
              </td>
            </tr>
          ) : (
            paginatedData.map((emp) => (
              <tr key={emp.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium uppercase">
                      {emp.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium">{emp.name}</div>
                      <div className="text-gray-500 text-xs">{emp.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">{emp.companyName || '-'}</td>
                <td className="px-6 py-4">{emp.divisionName || '-'}</td>
                <td className="px-6 py-4">{emp.supervisorName || '-'}</td>
                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center gap-3 text-gray-500">
                    <button onClick={() => onEdit(emp)} title="Edit">
                      <Pencil className="w-4 h-4 hover:text-sky-600" />
                    </button>
                    <button onClick={() => handleShowModal(emp, 'delete')} title="Hapus">
                      <Trash2 className="w-4 h-4 hover:text-red-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Modal Konfirmasi */}
      {showConfirmModal && selectedEmployee && (
        <EmployeeConfirmModal
          name={selectedEmployee.name}
          type={confirmType}
          onClose={() => setShowConfirmModal(false)}
          onConfirm={handleConfirm}
        />
      )}

      {/* Pagination */}
      {data.length > 0 && (
        <div className="flex justify-between items-center px-6 py-4 border-t bg-gray-50 text-sm text-gray-600">
          <div>
            Menampilkan {startIndex + 1}–{Math.min(startIndex + itemsPerPage, data.length)} dari {data.length} karyawan
          </div>
          <div className="space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 border rounded ${currentPage === 1 ? 'bg-gray-50 text-gray-400' : 'bg-white hover:bg-gray-100'}`}
            >
              Sebelumnya
            </button>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 border rounded ${currentPage === totalPages ? 'bg-gray-50 text-gray-400' : 'bg-white hover:bg-gray-100'}`}
            >
              Selanjutnya
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
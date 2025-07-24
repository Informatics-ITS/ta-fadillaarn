'use client';

import { useState, useEffect } from 'react';
import axios from '@/lib/axios';
import UserFormModal from './UserFormModal';
import UserConfirmModal from './UserConfirmModal';
import { Pencil, Trash2 } from 'lucide-react';

type UserTableProps = {
  search: string;
  roleFilter: string;
  refresh: boolean;
  setRefresh: (val: boolean) => void;
  onUsersUpdate?: (users: any[]) => void;
};

export default function UserTable({
  search,
  roleFilter,
  refresh,
  setRefresh,
  onUsersUpdate,
}: UserTableProps) {
  const [users, setUsers] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const [spvRes, empRes, personalRes] = await Promise.all([
          axios.get('/super-admin/get-all-supervisors'),
          axios.get('/super-admin/get-all-employees'),
          axios.get('/super-admin/get-all-users'),
        ]);

        const supervisors = Array.isArray(spvRes.data?.data)
          ? spvRes.data.data.map((u: any) => ({ ...u, role: 'supervisor' }))
          : [];

        const employees = Array.isArray(empRes.data?.data?.data)
          ? empRes.data.data.data.map((u: any) => ({ ...u, role: 'employee' }))
          : [];

        const personals = Array.isArray(personalRes.data?.data)
          ? personalRes.data.data.map((u: any) => ({ ...u, role: 'personal' }))
          : [];

        const merged = [...supervisors, ...employees, ...personals];

        setUsers(merged);
        onUsersUpdate?.(merged);
      } catch (err) {
        console.error('❌ Gagal mengambil data pengguna:', err);
      } finally {
        setRefresh(false);
      }
    };

    if (refresh || users.length === 0) {
      fetchUsers();
    }
  }, [refresh]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, roleFilter]);

  const filtered = users.filter(
    (u) =>
      (roleFilter === 'all' || roleFilter === '' || u.role === roleFilter) &&
      (u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase()) ||
        u.company?.toLowerCase().includes(search.toLowerCase()))
  );

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedData = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
      <table className="w-full text-sm text-gray-700">
        <thead className="bg-gray-50 text-gray-500 text-xs uppercase border-b">
          <tr>
            <th className="px-6 py-3 text-center">No.</th>
            <th className="px-6 py-3 text-left">Pengguna</th>
            <th className="px-6 py-3 text-left">Role</th>
            <th className="px-6 py-3 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center px-4 py-6 text-gray-500 italic">
                Tidak ada pengguna ditemukan.
              </td>
            </tr>
          ) : (
            paginatedData.map((user, index) => (
              <tr key={user.id} className="border-t hover:bg-gray-50 transition-colors duration-150">
                <td className="px-4 py-3 text-center">{startIndex + index + 1}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-500 font-medium uppercase">
                      {user.name?.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">{user.name}</div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 capitalize text-gray-700">
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${
                      user.role === 'superadmin'
                        ? 'bg-red-100 text-red-700'
                        : user.role === 'supervisor'
                        ? 'bg-blue-100 text-blue-700'
                        : user.role === 'employee'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="flex justify-center items-center gap-2">
                    <button
                      aria-label="Edit pengguna"
                      onClick={() => {
                        setSelectedUser(user);
                        setShowEditModal(true);
                      }}
                      className="p-1 rounded hover:bg-blue-100 text-gray-500 transition"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      aria-label="Hapus pengguna"
                      onClick={() => {
                        setSelectedUser(user);
                        setShowConfirmModal(true);
                      }}
                      className="p-1 rounded hover:bg-red-100 text-gray-500 transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
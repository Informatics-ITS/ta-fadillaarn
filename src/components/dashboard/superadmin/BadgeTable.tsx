'use client';

import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import axios from '@/lib/axios';
import EditBadgeModal from '@/components/dashboard/superadmin/EditBadgeModal';
import ConfirmDeleteModal from '@/components/dashboard/superadmin/BadgeConfirmDeleteModal';
import ColoredIcon from '@/components/ColoredIcon';

type Badge = {
  id: string;
  name: string;
  description: string;
  quizCompleted: number;
  icon: string;
};

type Props = {
  badges: Badge[];
  onRefresh: () => void;
};

const ITEMS_PER_PAGE = 10;

function BadgeRow({
  badge,
  index,
  onEdit,
  onDelete,
}: {
  badge: Badge;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <tr className="border-t hover:bg-gray-50 transition-colors duration-150">
      <td className="px-4 py-3 text-center">{index}</td>
      <td className="px-4 py-3">
        <ColoredIcon name={badge.icon} className="w-6 h-6" />
      </td>
      <td className="px-4 py-3 font-medium text-gray-800">{badge.name}</td>
      <td className="px-4 py-3 text-gray-600">{badge.description}</td>
      <td className="px-4 py-3 text-center">
        <div className="flex justify-center items-center gap-2">
          <button
            aria-label="Edit badge"
            onClick={onEdit}
            className="p-1 rounded hover:bg-blue-100 text-gray-500 transition"
          >
            <Pencil size={16} />
          </button>
          <button
            aria-label="Hapus badge"
            onClick={onDelete}
            className="p-1 rounded hover:bg-red-100 text-gray-500 transition"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
}

export default function BadgeTable({ badges, onRefresh }: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(badges.length / ITEMS_PER_PAGE);
  const paginatedBadges = badges.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleDelete = async () => {
    if (!badgeToDelete) return;
    try {
      await axios.delete(`/badges/${badgeToDelete.id}`);
      onRefresh();
    } catch (err) {
      console.error('❌ Gagal menghapus badge:', err);
    } finally {
      setBadgeToDelete(null);
    }
  };

  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [badgeToDelete, setBadgeToDelete] = useState<Badge | null>(null);

  return (
    <>
      <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
        <table className="w-full text-sm text-gray-700">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase border-b">
            <tr>
              <th className="px-6 py-3 text-center">No.</th>
              <th className="px-6 py-3 text-left">Icon</th>
              <th className="px-6 py-3 text-left">Nama</th>
              <th className="px-6 py-3 text-left">Deskripsi</th>
              <th className="px-6 py-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {paginatedBadges.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center px-4 py-6 text-gray-500 italic">
                  Belum ada badge yang ditambahkan.
                </td>
              </tr>
            ) : (
              paginatedBadges.map((badge, index) => (
                <BadgeRow
                  key={badge.id}
                  badge={badge}
                  index={(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                  onEdit={() => {
                    setSelectedBadge(badge);
                    setShowEditModal(true);
                  }}
                  onDelete={() => setBadgeToDelete(badge)}
                />
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

      <EditBadgeModal
        visible={showEditModal}
        onClose={() => setShowEditModal(false)}
        onRefresh={onRefresh}
        badge={selectedBadge}
      />

      <ConfirmDeleteModal
        visible={!!badgeToDelete}
        onClose={() => setBadgeToDelete(null)}
        onConfirm={handleDelete}
        title="Hapus Badge"
        message={`Apakah Anda yakin ingin menghapus badge "${badgeToDelete?.name || ''}"?`}
      />
    </>
  );
}

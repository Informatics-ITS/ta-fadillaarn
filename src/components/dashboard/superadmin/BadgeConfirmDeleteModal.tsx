'use client';

import { XCircle } from 'lucide-react';

type Props = {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
};

export default function ConfirmDeleteModal({
  visible,
  onClose,
  onConfirm,
  title = 'Hapus Data',
  message = 'Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.',
}: Props) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
      <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-lg space-y-4">
        <div className="flex items-center gap-2">
          <XCircle className="text-red-500" size={24} />
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        </div>

        <p className="text-sm text-gray-600">{message}</p>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm rounded-md bg-red-600 text-white hover:bg-red-700"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}

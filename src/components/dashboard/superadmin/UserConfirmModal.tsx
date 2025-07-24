'use client';

import { X } from 'lucide-react';

type Props = {
  onClose: () => void;
  onConfirm: () => void;
  type: 'delete' | 'suspend';
  name: string;
};

export default function UserConfirmModal({ onClose, onConfirm, type, name }: Props) {
  const title = type === 'delete' ? 'Hapus Pengguna?' : 'Nonaktifkan Pengguna?';
  const desc = type === 'delete'
    ? `Apakah Anda yakin ingin menghapus ${name}? Tindakan ini tidak dapat dibatalkan.`
    : `Apakah Anda yakin ingin menonaktifkan ${name}? Pengguna tidak akan dapat mengakses sistem.`;

  const buttonText = type === 'delete' ? 'Hapus' : 'Nonaktifkan';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-lg relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
        >
          <X size={20} />
        </button>

        <h2 className="text-lg font-semibold mb-2">{title}</h2>
        <p className="text-sm text-gray-600 mb-6">{desc}</p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm text-white rounded ${
              type === 'delete'
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-yellow-500 hover:bg-yellow-600'
            }`}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}

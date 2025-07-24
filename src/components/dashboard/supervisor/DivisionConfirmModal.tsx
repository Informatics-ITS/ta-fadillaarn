'use client';

import { X } from 'lucide-react';

type Props = {
  visible: boolean;
  divisionName: string;
  onClose: () => void;
  onConfirm: () => void;
};

export default function DivisionConfirmModal({ visible, divisionName, onClose, onConfirm }: Props) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 w-[90%] max-w-md relative shadow-lg">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-lg font-bold mb-4">Konfirmasi Hapus</h2>
        <p className="text-sm text-gray-700 mb-6">
          Apakah Anda yakin ingin menghapus divisi <strong>{divisionName}</strong>?
        </p>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}

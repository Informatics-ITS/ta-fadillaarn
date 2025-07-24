'use client';

import { X } from 'lucide-react';

type Props = {
  name: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function EmployeeConfirmModal({ name, onCancel, onConfirm }: Props) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl relative">
        <button onClick={onCancel} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-lg font-semibold text-gray-800 mb-2">Konfirmasi Hapus</h2>
        <p className="text-sm text-gray-600 mb-4">
          Yakin ingin menghapus karyawan <strong>{name}</strong>?
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Ya, Hapus
          </button>
        </div>
      </div>
    </div>
  );
}

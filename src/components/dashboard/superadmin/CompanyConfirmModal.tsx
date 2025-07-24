'use client';

import { X } from 'lucide-react';

type Props = {
  visible: boolean;
  companyName: string;
  onClose: () => void;
  onConfirm: () => void;
};

export default function CompanyConfirmModal({ visible, companyName, onClose, onConfirm }: Props) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
        <button className="absolute top-4 right-4 text-gray-500" onClick={onClose}>
          <X />
        </button>
        <h2 className="text-xl font-bold mb-4">Konfirmasi Hapus</h2>
        <p className="mb-6">Apakah kamu yakin ingin menghapus perusahaan <strong>{companyName}</strong>?</p>
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">
            Batal
          </button>
          <button onClick={onConfirm} className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700">
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}

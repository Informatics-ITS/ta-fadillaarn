'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import UserFormModal from './UserFormModal';

type Props = {
  setRefresh: (val: boolean) => void;
};

export default function UserActionBar({ setRefresh }: Props) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Manajemen Pengguna Sistem</h1>
          <p className="text-sm text-gray-600">Kelola pengguna dan hak akses sistem</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-2 text-sm font-semibold rounded-lg bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow hover:from-cyan-600 hover:to-teal-600 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
        >
          + Tambah Pengguna
        </button>
      </div>

      {showModal && (
        <UserFormModal
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setRefresh(true); // trigger reload
            setShowModal(false);
          }}
        />
      )}
    </>
  );
}

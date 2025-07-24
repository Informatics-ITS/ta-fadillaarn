'use client';

import { Plus } from 'lucide-react';
import { useState } from 'react';
import CompanyFormModal from './CompanyFormModal';

type Props = {
  setRefresh: (val: boolean) => void;
};

export default function CompanyActionBar({ setRefresh }: Props) {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Manajemen Perusahaan</h1>
        <p className="text-sm text-gray-500 mt-1">Kelola daftar perusahaan pada sistem</p>
      </div>

      <button
        onClick={() => setShowForm(true)}
        className="flex items-center gap-2 h-10 px-4 py-2 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white font-medium rounded-xl text-sm shadow transition"
      >
        <Plus size={16} />
        Tambah Perusahaan
      </button>

      <CompanyFormModal
        visible={showForm}
        mode="add"
        data={null}
        onClose={() => setShowForm(false)}
        onSuccess={() => {
          setShowForm(false);
          setRefresh(true);
        }}
      />
    </div>
  );
}

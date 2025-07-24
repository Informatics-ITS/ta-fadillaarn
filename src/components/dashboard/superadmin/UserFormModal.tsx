'use client';

import { useState } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';
import axios from '@/lib/axios';

type Props = {
  onClose: () => void;
  onSuccess: () => void;
  userToEdit?: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
};

export default function UserFormModal({ onClose, onSuccess, userToEdit }: Props) {
  const [form, setForm] = useState({
    name: userToEdit?.name || '',
    email: userToEdit?.email || '',
    phone: userToEdit?.phone || '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (userToEdit) {
        await axios.put(`/super-admin/personal-data/${userToEdit.id}`, {
          name: form.name,
          email: form.email,
          phone: form.phone,
        });
        onSuccess();
      } else {
        await axios.post('/personal/register', {
          name: form.name,
          email: form.email,
          password: form.password,
          phone: form.phone,
          role: 'personal',
        });
        onSuccess();
      }
    } catch (err) {
      console.error('Gagal menyimpan data:', err);
      alert('Terjadi kesalahan saat menyimpan data.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40" />

      <div className="relative z-10 bg-white w-full max-w-md rounded-2xl shadow-lg p-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-red-500"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-semibold mb-6 text-slate-800">
          {userToEdit ? 'Edit Data Pengguna' : 'Tambah Pengguna Baru'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Nama Lengkap</label>
            <input
              type="text"
              placeholder="Masukkan nama lengkap"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Email</label>
            <input
              type="email"
              placeholder="email@domain.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Nomor Telepon</label>
            <input
              type="text"
              placeholder="08xx-xxxx-xxxx"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>

          {!userToEdit && (
            <div>
              <label className="block text-sm text-gray-600 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm rounded-md bg-gradient-to-r from-cyan-600 to-teal-500 text-white hover:brightness-110 transition"
            >
              {userToEdit ? 'Simpan Perubahan' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import axios from '@/lib/axios';

type Company = {
  id?: string;
  name: string;
  email: string;
  address: string;
  phone: string;
};

type Props = {
  visible: boolean;
  mode: 'add' | 'edit';
  data: Company | null;
  onClose: () => void;
  onSuccess: () => void;
};

export default function CompanyFormModal({ visible, mode, data, onClose, onSuccess }: Props) {
  const [form, setForm] = useState<Company>({
    name: '',
    email: '',
    address: '',
    phone: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (mode === 'edit' && data) {
      setForm(data);
    } else {
      setForm({
        name: '',
        email: '',
        address: '',
        phone: '',
      });
    }
    setError('');
  }, [visible, mode, data]);

  const handleChange = (field: keyof Company, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim()) {
      alert('Nama perusahaan wajib diisi.');
      return;
    }

    setLoading(true);
    setError('');
    const token = localStorage.getItem('token');

    try {
      if (mode === 'add') {
        await axios.post('/company/register', form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else if (mode === 'edit' && data?.id) {
        await axios.put(`/company/${data.id}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      onSuccess(); // ⬅️ Di parent, gunakan setRefresh(prev => !prev)
    } catch (err: any) {
      console.error('Gagal menyimpan perusahaan:', err);
      setError(err?.response?.data?.message || 'Terjadi kesalahan saat menyimpan.');
    } finally {
      setLoading(false);
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          {mode === 'add' ? 'Tambah Perusahaan' : 'Edit Perusahaan'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Nama perusahaan"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring focus:ring-teal-200 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="Email perusahaan"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring focus:ring-teal-200 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="Alamat kantor"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring focus:ring-teal-200 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Telepon</label>
            <input
              type="text"
              value={form.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="Nomor telepon"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring focus:ring-teal-200 focus:outline-none"
            />
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-sm rounded-lg bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white disabled:opacity-50 transition"
            >
              {loading ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

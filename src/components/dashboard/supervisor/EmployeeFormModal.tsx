'use client';

import { useEffect, useState } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';
import axios from '@/lib/axios';

type Props = {
  visible: boolean;
  mode: 'add' | 'edit';
  data: any;
  onClose: () => void;
  onSubmit: (data: any) => void;
};

export default function EmployeeFormModal({ visible, mode, data, onClose, onSubmit }: Props) {
  const [divisions, setDivisions] = useState<{ id: string; name: string }[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    divisionId: '',
    password: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    axios
      .get('/division/get-all-division', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const result = res.data?.data?.divisions;
        if (Array.isArray(result)) {
          setDivisions(result);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch divisions:', err);
      });
  }, []);

  useEffect(() => {
    if (mode === 'edit' && data) {
      setForm({
        name: data.name || '',
        email: data.email || '',
        phone: '',
        divisionId: data.divisionId || data.division?.id || '',
        password: '',
      });
    } else {
      setForm({
        name: '',
        email: '',
        phone: '',
        divisionId: '',
        password: '',
      });
    }
  }, [mode, data]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return;

    if (!form.name || !form.email || !form.divisionId || (mode === 'add' && (!form.phone || !form.password))) {
      alert('Semua field harus diisi');
      return;
    }

    try {
      const payload: any = {
        name: form.name,
        email: form.email,
        divisionId: form.divisionId,
      };
      if (mode === 'add') {
        payload.phone = form.phone;
        payload.password = form.password;
        await axios.post('/employee/register', payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        if (form.password) payload.password = form.password;
        await axios.put(`/employee/${data?.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      onSubmit(payload);
      onClose();
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || 'Gagal menyimpan data.');
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-2xl w-[90%] max-w-md p-6 shadow-xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-lg font-bold mb-6">
          {mode === 'edit' ? 'Edit Karyawan' : 'Tambah Karyawan Baru'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div>
            <label className="block font-medium text-gray-700 mb-1">Nama Lengkap</label>
            <input
              type="text"
              required
              placeholder="Masukkan nama lengkap"
              className="w-full border px-3 py-2 rounded-md text-sm"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              required
              placeholder="email@perusahaan.com"
              className="w-full border px-3 py-2 rounded-md text-sm"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          {mode === 'add' && (
            <div>
              <label className="block font-medium text-gray-700 mb-1">Nomor Telepon</label>
              <input
                type="tel"
                required
                placeholder="08xx-xxxx-xxxx"
                className="w-full border px-3 py-2 rounded-md text-sm"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
          )}

          <div>
            <label className="block font-medium text-gray-700 mb-1">Departemen</label>
            <select
              required
              className="w-full border px-3 py-2 rounded-md text-sm"
              value={form.divisionId}
              onChange={(e) => setForm({ ...form, divisionId: e.target.value })}
            >
              <option value="">Pilih divisi</option>
              {divisions.map((div) => (
                <option key={div.id} value={div.id}>
                  {div.name}
                </option>
              ))}
            </select>
          </div>

          {mode === 'add' && (
            <div>
              <label className="block font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Masukkan password awal"
                  className="w-full border px-3 py-2 rounded-md text-sm pr-10"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="text-sm text-gray-700 bg-gray-100 px-4 py-2 rounded-md hover:bg-gray-200"
            >
              Batal
            </button>
            <button
              type="submit"
              className="bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-medium px-4 py-2 rounded-md"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

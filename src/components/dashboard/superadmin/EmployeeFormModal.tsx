'use client';

import { useEffect, useState } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';
import axios from '@/lib/axios';

type Company = {
  id: string;
  name: string;
};

type Props = {
  onClose: () => void;
  onSuccess: () => void;
  userToEdit?: {
    id: string;
    name: string;
    email: string;
    phone: string;
    companyId: string;
    access: string[];
  };
};

const EmployeeFormModal = ({ onClose, onSuccess, userToEdit }: Props) => {
  const [form, setForm] = useState({
    name: userToEdit?.name || '',
    email: userToEdit?.email || '',
    phone: userToEdit?.phone || '',
    companyId: userToEdit?.companyId || '',
    password: '',
    access: userToEdit?.access || [],
  });

  const [showPassword, setShowPassword] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await axios.get('/company/get-all-company');
        setCompanies(res.data.data);
      } catch (err) {
        console.error('❌ Gagal fetch perusahaan:', err);
      }
    };
    fetchCompanies();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (userToEdit) {
        await axios.put(`/super-admin/employee-data/${userToEdit.id}`, {
          name: form.name,
          email: form.email,
          phone: form.phone,
          companyId: form.companyId,
          access: form.access,
        });
      } else {
        await axios.post('/super-admin/register-employee', {
          name: form.name,
          email: form.email,
          phone: form.phone,
          password: form.password,
          companyId: form.companyId,
          access: form.access,
        });
      }

      onSuccess();
    } catch (err) {
      console.error('Gagal simpan data karyawan:', err);
      alert('Terjadi kesalahan saat menyimpan data.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl w-full max-w-2xl p-6 shadow-lg relative max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-red-500">
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold mb-5">
          {userToEdit ? 'Edit Data Karyawan' : 'Tambah Karyawan Baru'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3">
            <div>
              <label className="text-sm text-gray-600">Nama Lengkap</label>
              <input
                type="text"
                className="w-full border rounded-lg px-4 py-2 text-sm mt-1"
                placeholder="Masukkan nama lengkap"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Email</label>
              <input
                type="email"
                className="w-full border rounded-lg px-4 py-2 text-sm mt-1"
                placeholder="email@domain.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Nomor Telepon</label>
              <input
                type="text"
                className="w-full border rounded-lg px-4 py-2 text-sm mt-1"
                placeholder="08xx-xxxx-xxxx"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Perusahaan</label>
              <select
                className="w-full border rounded-lg px-4 py-2 text-sm mt-1"
                value={form.companyId}
                onChange={(e) => setForm({ ...form, companyId: e.target.value })}
                required
              >
                <option value="">Pilih perusahaan</option>
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {!userToEdit && (
              <div>
                <label className="text-sm text-gray-600">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="w-full border rounded px-4 py-2 text-sm pr-10 mt-1"
                    placeholder="Password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
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
          </div>

          <div className="flex justify-end gap-3 pt-6">
            <button type="button" onClick={onClose} className="px-5 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-sm">
              Batal
            </button>
            <button type="submit" className="px-5 py-2 rounded-md text-sm text-white bg-gradient-to-r from-cyan-600 to-teal-500 hover:brightness-110">
              {userToEdit ? 'Simpan Perubahan' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeFormModal;

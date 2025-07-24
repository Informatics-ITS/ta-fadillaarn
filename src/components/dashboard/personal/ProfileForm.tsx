'use client';

import { useState } from 'react';
import axios from '@/lib/axios';
import Button from '@/components/buttons/Button';

type ProfileFormProps = {
  initialData: {
    id: string;
    name: string;
    email: string;
    role: string;
    supervisorName?: string;
  };
};

export default function ProfileForm({ initialData }: ProfileFormProps) {
  const [form, setForm] = useState({
    name: initialData.name || '',
    email: initialData.email || '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.email.trim()) {
      alert('Nama dan email tidak boleh kosong.');
      return;
    }

    const payload: Record<string, string> = {
      name: form.name.trim(),
      email: form.email.trim(),
    };
    if (form.password.trim()) {
      payload.password = form.password.trim();
    }

    setLoading(true);
    try {
      const endpoint =
        initialData.role === 'employee'
          ? `/employee/${initialData.id}`
          : `/personal/${initialData.id}`;

      await axios.put(endpoint, payload);
      alert('Profil berhasil diperbarui.');

      setForm((prev) => ({ ...prev, password: '' }));

      // Optional: Update localStorage
      const existing = JSON.parse(localStorage.getItem('user') || '{}');
      localStorage.setItem(
        'user',
        JSON.stringify({
          ...existing,
          name: payload.name,
          email: payload.email,
        })
      );
    } catch (err: any) {
      const message =
        err?.response?.data?.message || 'Gagal menyimpan perubahan.';
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Nama Lengkap
        </label>
        <input
          type="text"
          className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
          placeholder="Nama lengkap"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Email
        </label>
        <input
          type="email"
          className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
          placeholder="Email aktif"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Password Baru (opsional)
        </label>
        <input
          type="password"
          className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
          placeholder="Kosongkan jika tidak ingin mengganti"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
      </div>

      {initialData.role === 'employee' && (
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Nama Supervisor
          </label>
          <input
            type="text"
            disabled
            className="w-full border bg-gray-100 text-gray-700 rounded-lg px-4 py-2 text-sm"
            value={initialData.supervisorName || 'Tidak diketahui'}
          />
        </div>
      )}

      <Button onClick={handleSubmit} isLoading={loading}>
        Simpan Perubahan
      </Button>
    </div>
  );
}

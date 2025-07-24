'use client';

import { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import Button from '@/components/buttons/Button';

export default function ProfileForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      const fallbackId = localStorage.getItem('userId');

      if (storedUser) {
        const user = JSON.parse(storedUser);
        setForm((prev) => ({
          ...prev,
          name: user.name || '',
          email: user.email || '',
        }));

        // Ambil id dari user.id jika tersedia
        const resolvedId = user.id || fallbackId;
        if (resolvedId) {
          setId(resolvedId);
        }
      } else if (fallbackId) {
        setId(fallbackId);
      }

    } catch (error) {
      console.error('Gagal membaca localStorage:', error);
    }
  }, []);

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.email.trim()) {
      alert('Nama dan email tidak boleh kosong.');
      return;
    }

    if (!id || id === 'undefined') {
      alert('ID tidak valid. Silakan login ulang.');
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
      await axios.put(`/supervisor/${id}`, payload);
      alert('Profil berhasil diperbarui.');

      // Kosongkan password field
      setForm((prev) => ({ ...prev, password: '' }));

      // Perbarui localStorage.user
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

      <Button onClick={handleSubmit} isLoading={loading}>
        Simpan Perubahan
      </Button>
    </div>
  );
}
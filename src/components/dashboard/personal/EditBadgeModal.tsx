'use client';

import { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import Button from '@/components/buttons/Button';

type Badge = {
  id: string;
  name: string;
  description: string;
};

type Props = {
  badge: Badge;
  open: boolean;
  onClose: () => void;
};

export default function EditBadgeModal({ badge, open, onClose }: Props) {
  const [form, setForm] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (badge) {
      setForm({ name: badge.name, description: badge.description });
    }
  }, [badge]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) return setError('Nama badge wajib diisi');
    setLoading(true);
    setError('');
    try {
      await axios.put(`/badges/${badge.id}`, form);
      onClose();
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Gagal mengubah badge.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-md shadow w-full max-w-md space-y-4">
        <h2 className="text-xl font-semibold">Edit Badge</h2>

        <input
          name="name"
          placeholder="Nama Badge"
          value={form.name}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
        <input
          name="description"
          placeholder="Deskripsi"
          value={form.description}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Batal
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
          </Button>
        </div>
      </div>
    </div>
  );
}

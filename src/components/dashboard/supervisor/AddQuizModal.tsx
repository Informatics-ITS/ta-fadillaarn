'use client';

import { useState } from 'react';
import axios from '@/lib/axios';
import Button from '@/components/buttons/Button';

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function AddQuizModal({ open, onClose }: Props) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    deadline: '',
    duration_minutes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const payload = {
        ...form,
        duration_minutes: parseInt(form.duration_minutes),
      };
      await axios.post('/quiz/create', payload);
      onClose();
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Gagal membuat kuis.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-md shadow-md w-full max-w-lg">
        <h2 className="text-xl font-semibold mb-4">Buat Kuis Baru</h2>

        <div className="space-y-3">
          <input
            name="title"
            type="text"
            placeholder="Judul Kuis"
            value={form.title}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
          <input
            name="description"
            type="text"
            placeholder="Deskripsi"
            value={form.description}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
          <input
            name="category"
            type="text"
            placeholder="Kategori (misal: Kesehatan)"
            value={form.category}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
          <input
            name="deadline"
            type="date"
            placeholder="Deadline"
            value={form.deadline}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
          <input
            name="duration_minutes"
            type="number"
            placeholder="Durasi (menit)"
            value={form.duration_minutes}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />

          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>

        <div className="flex justify-end mt-6 gap-2">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Batal
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Menyimpan...' : 'Simpan'}
          </Button>
        </div>
      </div>
    </div>
  );
}

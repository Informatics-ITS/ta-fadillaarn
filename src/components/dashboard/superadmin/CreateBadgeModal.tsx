'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import axios from '@/lib/axios';

type Badge = {
  id?: string;
  name: string;
  description: string;
  quizCompleted: number;
};

type Props = {
  visible: boolean;
  mode: 'add' | 'edit';
  data: Badge | null;
  onClose: () => void;
  onSuccess: () => void;
  onRefresh: () => void;
};

export default function BadgeFormModal({ visible, mode, data, onClose, onSuccess, onRefresh }: Props) {
  const [form, setForm] = useState<Badge>({
    name: '',
    description: '',
    quizCompleted: 1,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (mode === 'edit' && data) {
      setForm(data);
    } else {
      setForm({
        name: '',
        description: '',
        quizCompleted: 1,
      });
    }
    setError('');
  }, [visible, mode, data]);

  const handleChange = (field: keyof Badge, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim()) {
      alert('Nama badge wajib diisi.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        name: form.name,
        description: form.description,
        quizCompleted: form.quizCompleted,
      };

      if (mode === 'add') {
        await axios.post('/badges/create', payload);
      } else if (mode === 'edit' && data?.id) {
        await axios.put(`/badges/${data.id}`, payload);
      }

      onSuccess();
      onRefresh();
      onClose();
    } catch (err: any) {
      console.error('Gagal menyimpan badge:', err);
      setError(err?.response?.data?.message || 'Terjadi kesalahan saat menyimpan.');
    } finally {
      setLoading(false);
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40" />

      <div className="relative z-10 bg-white w-full max-w-lg rounded-2xl shadow-lg p-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-semibold mb-6 text-slate-800">
          {mode === 'add' ? 'Tambah Badge Baru' : 'Edit Badge'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Badge</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Contoh: Quiz Master"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-400 focus:ring-opacity-30 focus:border-teal-400 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
            <textarea
              value={form.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Contoh: Menyelesaikan 5 kuis ergonomi."
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-400 focus:ring-opacity-30 focus:border-teal-400 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah Kuis Diselesaikan</label>
            <input
              type="number"
              min={1}
              value={form.quizCompleted}
              onChange={(e) => handleChange('quizCompleted', parseInt(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-400 focus:ring-opacity-30 focus:border-teal-400 focus:outline-none transition-colors"
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

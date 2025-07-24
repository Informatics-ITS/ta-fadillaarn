'use client';

import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import axios from '@/lib/axios';

type Props = {
  visible: boolean;
  onClose: () => void;
  onRefresh: () => void;
  badge: {
    id: string;
    name: string;
    description: string;
    quizCompleted: number;
  } | null;
};

export default function EditBadgeModal({ visible, onClose, onRefresh, badge }: Props) {
  const [form, setForm] = useState({
    name: '',
    description: '',
    quizCompleted: 1,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (badge) {
      setForm({
        name: badge.name || '',
        description: badge.description || '',
        quizCompleted: badge.quizCompleted || 1,
      });
      setError('');
    }
  }, [badge]);

  const handleChange = (field: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!form.name || !form.description || form.quizCompleted < 1) {
      setError('Semua field wajib diisi.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await axios.put(`/badges/${badge?.id}`, form);
      onClose();
      onRefresh();
    } catch (err) {
      console.error('❌ Gagal menyimpan:', err);
      setError('Gagal menyimpan perubahan.');
    } finally {
      setLoading(false);
    }
  };

  if (!visible || !badge) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* BACKDROP FULLSCREEN */}
      <div className="fixed inset-0 bg-black/40" />

      {/* MODAL */}
      <div className="relative z-10 bg-white w-full max-w-lg rounded-2xl shadow-xl p-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Edit Badge</h2>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Badge</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Nama badge"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring focus:ring-teal-200 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
            <textarea
              value={form.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Deskripsi badge"
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring focus:ring-teal-200 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Jumlah Kuis Diselesaikan
            </label>
            <input
              type="number"
              min={1}
              value={form.quizCompleted}
              onChange={(e) =>
                handleChange('quizCompleted', parseInt(e.target.value || '1'))
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring focus:ring-teal-200 focus:outline-none"
            />
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
              {error}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-5 py-2 text-sm rounded-lg bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white disabled:opacity-50 transition"
          >
            {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </div>
      </div>
    </div>
  );
}

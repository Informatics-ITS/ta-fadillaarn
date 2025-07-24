'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

type Props = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  data?: any;
  mode: 'add' | 'edit';
};

export default function QuizFormModal({ visible, onClose, onSubmit, data, mode }: Props) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    totalQuestions: 0,
    totalRespondents: 0,
  });

  useEffect(() => {
    if (mode === 'edit' && data) {
      setForm(data);
    } else {
      setForm({
        title: '',
        description: '',
        totalQuestions: 0,
        totalRespondents: 0,
      });
    }
  }, [mode, data]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-lg font-bold mb-4">{mode === 'add' ? 'Tambah Kuis' : 'Edit Kuis'}</h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(form);
          }}
          className="space-y-4 text-sm"
        >
          <div>
            <label className="block mb-1 text-gray-700 font-medium">Judul Kuis</label>
            <input
              required
              type="text"
              className="w-full border px-3 py-2 rounded-md"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-700 font-medium">Deskripsi</label>
            <textarea
              required
              className="w-full border px-3 py-2 rounded-md"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-700 font-medium">Jumlah Soal</label>
            <input
              required
              type="number"
              className="w-full border px-3 py-2 rounded-md"
              value={form.totalQuestions}
              onChange={(e) =>
                setForm({ ...form, totalQuestions: parseInt(e.target.value) || 0 })
              }
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="text-sm px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              Batal
            </button>
            <button
              type="submit"
              className="text-sm px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

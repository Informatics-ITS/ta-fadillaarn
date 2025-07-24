'use client';

import { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import toast from 'react-hot-toast';
import { X } from 'lucide-react';
import Button from '@/components/buttons/Button';

export type QuizForm = {
  deadline: string;
  id: string;
  title: string;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  quiz: QuizForm | null;
  onSubmit?: (updatedQuiz: QuizForm) => void;
};

export default function EditQuizModal({ visible, onClose, quiz, onSubmit }: Props) {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!quiz) return;

    setTitle(quiz.title || '');
    setError('');
  }, [quiz]);

  const validate = () => {
    if (!title.trim()) {
      setError('Judul kuis tidak boleh kosong.');
      return false;
    }
    if (title === quiz?.title) {
      setError('Tidak ada perubahan yang dilakukan.');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setLoading(true);
      await axios.put(`/quiz/update/${quiz?.id}`, { title });

      toast.success('Judul kuis berhasil diperbarui');
      if (onSubmit && quiz) onSubmit({ ...quiz, title });
      onClose();
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? 'Gagal menyimpan perubahan.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!visible || !quiz) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          aria-label="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-lg font-bold mb-6">Edit Judul Kuis</h2>

        <div className="space-y-4 text-sm">
          <div>
            <label htmlFor="quiz-title" className="block font-medium mb-1">
              Judul Kuis
            </label>
            <input
              id="quiz-title"
              type="text"
              placeholder="Masukkan judul kuis"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded-md px-4 py-2 placeholder-gray-400"
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="text-sm"
          >
            Batal
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-cyan-600 text-white hover:bg-cyan-700 text-sm"
          >
            {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
          </Button>
        </div>
      </div>
    </div>
  );
}

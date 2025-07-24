'use client';

import { useState } from 'react';
import axios from '@/lib/axios';
import toast from 'react-hot-toast';

type Props = {
  loading: boolean;
  onCreate: (quizId: string) => void;
  onLoading: (loading: boolean) => void;
};

export default function StepCreateQuiz({ loading, onCreate, onLoading }: Props) {
  const [quizTitle, setQuizTitle] = useState('');

  const handleCreateQuiz = async () => {
    if (!quizTitle.trim()) {
      toast.error('Judul kuis wajib diisi');
      return;
    }
    try {
      onLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.post(
        '/quiz/create',
        { title: quizTitle },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const newQuizId = res.data?.data?.id;
      if (!newQuizId) throw new Error('Quiz ID tidak diterima dari server');
      toast.success('Kuis berhasil dibuat');
      onCreate(newQuizId);
    } catch (err) {
      toast.error('Gagal membuat kuis');
      console.error('Error create quiz:', err);
    } finally {
      onLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loading) {
      handleCreateQuiz();
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold text-gray-800 mb-1">Buat Kuis</h1>
      <p className="text-sm text-gray-500 mb-4">Isi judul kuis terlebih dahulu.</p>

      <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden mb-6">
        <div className="h-full w-1/3 bg-sky-500" />
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 space-y-4">
        <input
          type="text"
          placeholder="Judul Kuis"
          value={quizTitle}
          onChange={(e) => setQuizTitle(e.target.value)}
          className="w-full border px-4 py-2 rounded-md text-sm"
        />
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-sky-500 to-cyan-500 text-white px-5 py-2 rounded-md hover:opacity-90 text-sm"
          >
            {loading ? 'Membuat...' : 'Lanjutkan →'}
          </button>
        </div>
      </form>
    </>
  );
}

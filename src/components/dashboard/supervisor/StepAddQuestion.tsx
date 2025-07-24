'use client';

import { useState } from 'react';
import axios from '@/lib/axios';
import toast from 'react-hot-toast';

type Props = {
  quizId: string | null;
  loading: boolean;
  onAddQuestion: (questionId: string) => void;
  onBack: () => void;
  onLoading: (loading: boolean) => void;
};

export default function StepAddQuestion({ quizId, loading, onAddQuestion, onBack, onLoading }: Props) {
  const [questionText, setQuestionText] = useState('');

  const handleAddQuestion = async () => {
    if (!quizId) {
      toast.error('Quiz ID belum tersedia');
      return;
    }
    if (!questionText.trim()) {
      toast.error('Pertanyaan wajib diisi');
      return;
    }
    try {
      onLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `/question/${quizId}`,
        { text: questionText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const newQuestionId = res.data?.data?.id;
      if (!newQuestionId) throw new Error('Question ID tidak diterima dari server');
      setQuestionText('');
      toast.success('Pertanyaan berhasil dibuat');
      onAddQuestion(newQuestionId);
    } catch (err) {
      toast.error('Gagal membuat pertanyaan');
      console.error('Error add question:', err);
    } finally {
      onLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loading) {
      handleAddQuestion();
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold text-gray-800 mb-1">Tambah Pertanyaan</h1>
      <p className="text-sm text-gray-500 mb-4">Masukkan pertanyaan baru.</p>
      <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden mb-6">
        <div className="h-full w-2/3 bg-sky-500" />
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 space-y-4">
        <input
          type="text"
          placeholder="Tulis pertanyaan..."
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          className="w-full border px-4 py-2 rounded-md text-sm"
        />
        <div className="flex justify-between pt-2">
          <button
            type="button"
            onClick={onBack}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 text-sm"
          >
            ← Kembali
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-sky-500 to-cyan-500 text-white px-5 py-2 rounded-md hover:opacity-90 text-sm"
          >
            {loading ? 'Menyimpan...' : 'Lanjutkan →'}
          </button>
        </div>
      </form>
    </>
  );
}

'use client';

import { useState } from 'react';
import axios from '@/lib/axios';
import Button from '@/components/buttons/Button';

type Question = {
  id: string;
  text: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  question: Question;
};

export default function DeleteQuestionDialog({ open, onClose, question }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    setLoading(true);
    setError('');
    try {
      await axios.delete(`/question/${question.id}`);
      onClose();
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Gagal menghapus soal.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-md shadow-md w-full max-w-md">
        <h2 className="text-xl font-semibold">Hapus Soal</h2>
        <p>Apakah Anda yakin ingin menghapus soal berikut?</p>
        <p className="italic text-slate-600 mt-2">"{question.text}"</p>

        {error && <p className="text-sm text-red-500 mt-2">{error}</p>}

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Batal
          </Button>
          <Button variant="primary" onClick={handleDelete} disabled={loading}>
            {loading ? 'Menghapus...' : 'Hapus'}
          </Button>
        </div>
      </div>
    </div>
  );
}

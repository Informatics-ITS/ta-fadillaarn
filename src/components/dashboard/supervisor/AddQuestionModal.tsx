'use client';

import { useState } from 'react';
import axios from '@/lib/axios';
import Button from '@/components/buttons/Button';

type Props = {
  quizId: string;
  open: boolean;
  onClose: () => void;
};

export default function AddQuestionModal({ quizId, open, onClose }: Props) {
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState([
    { text: '', is_correct: false },
    { text: '', is_correct: false },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const resetForm = () => {
    setQuestionText('');
    setOptions([
      { text: '', is_correct: false },
      { text: '', is_correct: false },
    ]);
    setError('');
  };

  const handleOptionChange = (
    index: number,
    field: 'text' | 'is_correct',
    value: string | boolean
  ) => {
    const updated = [...options];
    if (field === 'text') {
      updated[index].text = value as string;
    } else {
      // Hanya satu yang bisa benar
      updated.forEach((opt, i) => {
        opt.is_correct = i === index;
      });
    }
    setOptions(updated);
  };

  const addOption = () => {
    setOptions([...options, { text: '', is_correct: false }]);
  };

  const validateForm = () => {
    if (!quizId) {
      setError('Quiz ID tidak ditemukan.');
      return false;
    }
    if (!questionText.trim()) {
      setError('Pertanyaan tidak boleh kosong.');
      return false;
    }
    if (options.length < 2) {
      setError('Minimal 2 pilihan harus disediakan.');
      return false;
    }
    if (!options.some((o) => o.is_correct)) {
      setError('Harus ada satu jawaban yang benar.');
      return false;
    }
    if (options.some((o) => !o.text.trim())) {
      setError('Semua opsi harus diisi.');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`/question/${quizId}`, {
        text: questionText,
      });

      const questionId = res?.data?.data?.id;
      if (!questionId) throw new Error('Gagal mendapatkan ID pertanyaan.');

      await Promise.all(
        options.map((opt) =>
          axios.post(`/options/${questionId}`, {
            text: opt.text,
            is_correct: opt.is_correct,
          })
        )
      );

      resetForm();
      onClose();
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Gagal menambahkan pertanyaan.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-md shadow-md w-full max-w-xl space-y-4">
        <h2 className="text-xl font-semibold">Tambah Soal Baru</h2>

        <textarea
          aria-label="Tulis pertanyaan"
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          placeholder="Tulis pertanyaan di sini"
        />

        <div className="space-y-2">
          {options.map((opt, index) => (
            <div key={index} className="flex gap-2 items-center">
              <input
                aria-label={`Pilihan ${index + 1}`}
                type="text"
                value={opt.text}
                onChange={(e) => handleOptionChange(index, 'text', e.target.value)}
                className="flex-1 border px-3 py-2 rounded"
                placeholder={`Pilihan ${index + 1}`}
              />
              <label className="text-sm flex items-center gap-1" htmlFor={`option-correct-${index}`}>
                <input
                  id={`option-correct-${index}`}
                  type="radio"
                  name="correctOption"
                  checked={opt.is_correct}
                  onChange={() => handleOptionChange(index, 'is_correct', true)}
                />
                Benar
              </label>
            </div>
          ))}
          <Button size="sm" variant="outline" onClick={addOption} disabled={loading}>
            + Tambah Pilihan
          </Button>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="flex justify-end gap-2 mt-4">
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

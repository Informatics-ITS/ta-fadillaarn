'use client';

import { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import Button from '@/components/buttons/Button';

type Option = {
  id: string;
  text: string;
  is_correct: boolean;
};

type Question = {
  id: string;
  text: string;
  options: Option[];
};

type Props = {
  open: boolean;
  onClose: () => void;
  question: Question;
};

export default function EditQuestionModal({ open, onClose, question }: Props) {
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (question) {
      setQuestionText(question.text);
      setOptions(question.options);
    }
  }, [question]);

  const handleOptionChange = (index: number, field: 'text' | 'is_correct', value: string | boolean) => {
    const updated = [...options];
    if (field === 'text') updated[index].text = value as string;
    else updated[index].is_correct = value as boolean;
    setOptions(updated);
  };

  const handleSubmit = async () => {
    if (!questionText.trim()) return setError('Pertanyaan tidak boleh kosong');
    if (!options.some((o) => o.is_correct)) return setError('Harus ada satu jawaban benar');

    setLoading(true);
    setError('');
    try {
      await axios.put(`/question/${question.id}`, { text: questionText });

      await Promise.all(
        options.map((opt) =>
          axios.put(`/option/${opt.id}`, {
            text: opt.text,
            is_correct: opt.is_correct,
          })
        )
      );

      onClose();
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Gagal memperbarui soal.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-md shadow-md w-full max-w-xl space-y-4">
        <h2 className="text-xl font-semibold">Edit Soal</h2>

        <textarea
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          placeholder="Tulis pertanyaan di sini"
        />

        <div className="space-y-2">
          {options.map((opt, index) => (
            <div key={opt.id} className="flex gap-2 items-center">
              <input
                type="text"
                value={opt.text}
                onChange={(e) => handleOptionChange(index, 'text', e.target.value)}
                className="flex-1 border px-3 py-2 rounded"
              />
              <label className="text-sm flex items-center gap-1">
                <input
                  type="radio"
                  name="correct"
                  checked={opt.is_correct}
                  onChange={() => {
                    const updated = options.map((o, i) => ({ ...o, is_correct: i === index }));
                    setOptions(updated);
                  }}
                />
                Benar
              </label>
            </div>
          ))}
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="flex justify-end gap-2 mt-4">
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

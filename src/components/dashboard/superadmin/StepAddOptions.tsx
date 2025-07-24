'use client';

import { useState } from 'react';
import axios from '@/lib/axios';
import toast from 'react-hot-toast';
import { Trash2 } from 'lucide-react';
import Button from '@/components/buttons/Button';

type Option = { text: string; is_correct: boolean };

type Props = {
  questionId: string | null;
  loading: boolean;
  onAddAnotherQuestion: () => void;
  onFinish: () => void;
  onBack: () => void;
  onLoading: (loading: boolean) => void;
};

export default function StepAddOptions({
  questionId,
  loading,
  onAddAnotherQuestion,
  onFinish,
  onBack,
  onLoading,
}: Props) {
  const [options, setOptions] = useState<Option[]>([
    { text: '', is_correct: false },
    { text: '', is_correct: false },
  ]);
  const [success, setSuccess] = useState(false);

  const addOption = () => {
    if (options.length >= 5) return;
    setOptions([...options, { text: '', is_correct: false }]);
  };

  const removeOption = (index: number) => {
    if (options.length <= 2) return;
    setOptions(options.filter((_, i) => i !== index));
  };

  const updateOptionText = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index].text = value;
    setOptions(newOptions);
  };

  const setCorrectAnswer = (index: number) => {
    setOptions(options.map((opt, i) => ({ ...opt, is_correct: i === index })));
  };

  const handleAddOptions = async () => {
    if (!questionId) {
      toast.error('Tidak ada pertanyaan yang dipilih');
      return;
    }
    const validOptions = options.filter((opt) => opt.text.trim() !== '');
    if (validOptions.length < 2) {
      toast.error('Minimal 2 opsi yang valid harus diisi');
      return;
    }
    if (!validOptions.some((opt) => opt.is_correct)) {
      toast.error('Tandai satu jawaban benar');
      return;
    }

    try {
      onLoading(true);
      const token = localStorage.getItem('token');
      const payloadOptions = validOptions.map((opt) => ({
        text: opt.text,
        isCorrect: opt.is_correct,
      }));

      await axios.post(
        `/option/${questionId}`,
        { options: payloadOptions },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success('Opsi jawaban berhasil ditambahkan');
      setSuccess(true);
    } catch (err) {
      toast.error('Gagal menyimpan opsi');
      console.error('Error add options:', err);
    } finally {
      onLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loading) {
      handleAddOptions();
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold text-gray-800 mb-1">Tambah Opsi Jawaban</h1>
      <p className="text-sm text-gray-500 mb-4">Masukkan minimal 2 opsi, dan tandai satu yang benar.</p>

      <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden mb-6">
        <div className="h-full w-full bg-sky-500" />
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 space-y-4">
        <div className="space-y-2">
          {options.map((opt, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="radio"
                name="correct"
                checked={opt.is_correct}
                onChange={() => setCorrectAnswer(index)}
                aria-label={`Pilih opsi ${index + 1} sebagai jawaban benar`}
              />
              <input
                type="text"
                placeholder={`Opsi ${index + 1}`}
                value={opt.text}
                onChange={(e) => updateOptionText(index, e.target.value)}
                className="flex-1 border px-3 py-2 rounded-md text-sm"
                aria-label={`Isi teks opsi ${index + 1}`}
              />
              {options.length > 2 && (
                <button
                  type="button"
                  onClick={() => removeOption(index)}
                  className="text-red-500 hover:text-red-700"
                  aria-label={`Hapus opsi ${index + 1}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>

        {options.length < 5 && !success && (
          <button
            type="button"
            onClick={addOption}
            className="text-sm text-sky-600 hover:underline"
            aria-label="Tambah opsi jawaban"
          >
            + Tambah Opsi
          </button>
        )}

        {!success ? (
          <div className="flex justify-between items-center pt-2">
            <button
              type="button"
              onClick={onBack}
              className="px-5 py-2 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
            >
              ← Kembali
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-sky-500 to-cyan-500 text-white px-5 py-2 rounded-md hover:opacity-90 text-sm"
            >
              {loading ? 'Menyimpan...' : 'Simpan Opsi'}
            </button>
          </div>
        ) : (
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={onFinish}>
              Selesai
            </Button>
            <Button onClick={onAddAnotherQuestion} className="bg-sky-500 text-white hover:bg-sky-600">
              + Tambah Pertanyaan Lagi
            </Button>
          </div>
        )}
      </form>
    </>
  );
}

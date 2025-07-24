'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import axios from '@/lib/axios';

type Option = { text: string; is_correct: boolean };

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function CreateQuizModal({ visible, onClose }: Props) {
  const [step, setStep] = useState(1);
  const [quizId, setQuizId] = useState<string | null>(null);
  const [questionId, setQuestionId] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: '',
    category: '',
    deadline: '',
    duration_minutes: '',
    description: '',
  });

  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState<Option[]>([
    { text: '', is_correct: false },
    { text: '', is_correct: false },
  ]);

  const resetState = () => {
    setForm({
      title: '',
      category: '',
      deadline: '',
      duration_minutes: '',
      description: '',
    });
    setQuestionText('');
    setOptions([
      { text: '', is_correct: false },
      { text: '', is_correct: false },
    ]);
    setStep(1);
    setQuizId(null);
    setQuestionId(null);
  };

  const handleCreateQuiz = async () => {
    const token = localStorage.getItem('token');
    if (!token) return alert('Unauthorized');

    try {
      const res = await axios.post(
        '/quiz/create',
        { ...form, duration_minutes: parseInt(form.duration_minutes) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const createdId = res.data?.data?.id;
      if (createdId) {
        setQuizId(createdId);
        setStep(2);
      }
    } catch (err) {
      alert('Gagal membuat kuis');
      console.error(err);
    }
  };

  const handleAddOption = async () => {
    const token = localStorage.getItem('token');
    if (!token || !questionId) return;

    const nonEmptyOptions = options.filter((opt) => opt.text.trim() !== '');
    if (nonEmptyOptions.length < 2) {
      alert('Minimal 2 opsi harus diisi');
      return;
    }

    const correctCount = nonEmptyOptions.filter((opt) => opt.is_correct).length;
    if (correctCount !== 1) {
      alert('Harus ada tepat satu jawaban yang benar');
      return;
    }

    const payload = {
      options: nonEmptyOptions.map((opt) => ({
        text: opt.text.trim(),
        isCorrect: opt.is_correct, // sesuai dengan format backend
      })),
    };

    try {
      await axios.post(`/option/${questionId}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert('Pertanyaan dan opsi berhasil ditambahkan!');
      setQuestionText('');
      setOptions([
        { text: '', is_correct: false },
        { text: '', is_correct: false },
      ]);
      setQuestionId(null);
      setStep(2); // kembali ke tambah pertanyaan
    } catch (err) {
      alert('Gagal menyimpan opsi jawaban');
      console.error(err);
    }
  };

  const addOption = () => {
    setOptions([...options, { text: '', is_correct: false }]);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex items-center justify-center">
      <div className="bg-white w-full max-w-3xl rounded-xl shadow-lg p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-rose-500"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          {step === 1
            ? 'Buat Kuis'
            : step === 2
            ? 'Tambah Pertanyaan'
            : 'Tambah Opsi Jawaban'}
        </h2>

        {/* Step 1 */}
        {step === 1 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Judul"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="border px-4 py-2 rounded w-full"
              />
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="border px-4 py-2 rounded w-full"
              >
                <option value="">Pilih Kategori</option>
                <option value="Ergonomi Umum">Ergonomi Umum</option>
                <option value="Postur Duduk">Postur Duduk</option>
                <option value="Postur Berdiri">Postur Berdiri</option>
                <option value="Penggunaan Komputer">Penggunaan Komputer</option>
              </select>
              <input
                type="date"
                value={form.deadline}
                onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                className="border px-4 py-2 rounded w-full"
              />
              <input
                type="number"
                placeholder="Durasi (menit)"
                value={form.duration_minutes}
                onChange={(e) => setForm({ ...form, duration_minutes: e.target.value })}
                className="border px-4 py-2 rounded w-full"
              />
            </div>
            <textarea
              placeholder="Deskripsi"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="border px-4 py-2 rounded w-full mt-4 min-h-[100px]"
            />
            <div className="mt-6 text-right">
              <button
                onClick={handleCreateQuiz}
                className="bg-sky-600 hover:bg-sky-700 text-white font-medium px-5 py-2 rounded"
              >
                Lanjut ke Pertanyaan
              </button>
            </div>
          </>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <>
            <input
              type="text"
              placeholder="Tulis pertanyaan..."
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              className="border px-4 py-2 rounded w-full"
            />
            <div className="mt-6 text-right">
              <button
                onClick={async () => {
                  if (!questionText.trim()) return alert('Pertanyaan tidak boleh kosong');
                  const token = localStorage.getItem('token');
                  if (!token || !quizId) return alert('Token atau Quiz ID tidak ditemukan');
                  try {
                    const res = await axios.post(
                      `/question/${quizId}`,
                      { text: questionText },
                      { headers: { Authorization: `Bearer ${token}` } }
                    );
                    const qId = res.data?.data?.id;
                    if (qId) {
                      setQuestionId(qId);
                      setStep(3);
                    } else {
                      alert('Gagal mendapatkan ID pertanyaan');
                    }
                  } catch (err) {
                    alert('Gagal menyimpan pertanyaan');
                    console.error(err);
                  }
                }}
                className="bg-sky-600 hover:bg-sky-700 text-white font-medium px-5 py-2 rounded"
              >
                Lanjut ke Opsi Jawaban
              </button>
            </div>
          </>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <>
            <div className="space-y-3">
              {options.map((opt, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <input
                    type="text"
                    placeholder={`Opsi ${idx + 1}`}
                    value={opt.text}
                    onChange={(e) => {
                      const updated = [...options];
                      updated[idx].text = e.target.value;
                      setOptions(updated);
                    }}
                    className="border px-4 py-2 rounded w-full"
                  />
                  <label className="flex items-center gap-1 text-sm text-gray-600">
                    <input
                      type="checkbox"
                      checked={opt.is_correct}
                      onChange={(e) => {
                        const updated = [...options];
                        updated[idx].is_correct = e.target.checked;
                        setOptions(updated);
                      }}
                    />
                    Benar
                  </label>
                </div>
              ))}
              <button
                onClick={addOption}
                className="text-sky-600 hover:underline text-sm"
              >
                + Tambah Opsi
              </button>
            </div>

            <div className="flex justify-between mt-6">
              <button
                onClick={() => setStep(2)}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
              >
                Kembali
              </button>
              <button
                onClick={handleAddOption}
                className="bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-600 hover:to-teal-600 text-white px-5 py-2 rounded shadow"
              >
                Simpan Pertanyaan
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

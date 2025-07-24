'use client';

import { useState, useEffect } from 'react';
import axios from '@/lib/axios';
import { Plus, X } from 'lucide-react';

type Option = {
  text: string;
  isCorrect: boolean;
};

type Question = {
  id: string;
  questionText: string;
  options: Option[];
};

type QuizDetailProps = {
  quizId: string;
  onClose: () => void;
};

export default function QuizDetail({ quizId, onClose }: QuizDetailProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);

  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [newQuestionText, setNewQuestionText] = useState('');

  const [showAddOption, setShowAddOption] = useState(false);
  const [currentQuestionId, setCurrentQuestionId] = useState<string | null>(null);
  const [optionInputs, setOptionInputs] = useState<Option[]>([
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
  ]);

  async function fetchQuestions() {
    setLoading(true);
    try {
      const res = await axios.get(`/question/${quizId}`);
      const questionsData = res.data.data || [];

      const questionsWithOptions = await Promise.all(
        questionsData.map(async (q: any) => {
          const resOptions = await axios.get(`/option/${q.id}`);
          return {
            ...q,
            options: resOptions.data.data || [],
          };
        })
      );

      setQuestions(questionsWithOptions);
    } catch (error) {
      console.error('❌ Gagal mengambil data pertanyaan:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchQuestions();
  }, [quizId]);

  async function handleAddQuestion() {
    if (!newQuestionText.trim()) return alert('Pertanyaan tidak boleh kosong');

    try {
      await axios.post(`/question/${quizId}`, {
        questionText: newQuestionText.trim(),
      });
      setNewQuestionText('');
      setShowAddQuestion(false);
      fetchQuestions();
    } catch (error) {
      console.error('❌ Gagal menambahkan pertanyaan:', error);
      alert('Gagal menambah pertanyaan');
    }
  }

  function openAddOptionModal(questionId: string) {
    if (!questionId) return;

    setCurrentQuestionId(questionId);
    setOptionInputs([
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
    ]);
    setShowAddOption(true);
  }

  async function handleSubmitAllOptions() {
    console.log('🚀 handleSubmitAllOptions dipanggil!');
    if (!currentQuestionId) {
      alert('Pertanyaan tidak valid');
      return;
    }

    // Ambil hanya opsi yang tidak kosong
    const nonEmptyOptions = optionInputs.filter((opt) => opt.text.trim() !== '');
    if (nonEmptyOptions.length < 2) {
      alert('Minimal 2 opsi diperlukan');
      return;
    }

    const correctCount = nonEmptyOptions.filter((opt) => opt.isCorrect).length;
    if (correctCount !== 1) {
      alert('Harus ada tepat satu jawaban benar');
      return;
    }

    // Format payload SESUAI backend (array dalam key `options`)
    const payload = {
      options: nonEmptyOptions.map((opt) => ({
        text: opt.text.trim(),
        isCorrect: opt.isCorrect, // ✅ camelCase (bukan is_correct)
      })),
    };

    console.log('📦 Payload dikirim ke backend:', JSON.stringify(payload, null, 2));

    try {
      await axios.post(`/option/${currentQuestionId}`, payload, {
        headers: {
          'Content-Type': 'application/json', // ✅ Penting agar backend baca JSON
        },
      });
      console.log('✅ Opsi berhasil disimpan');
      setShowAddOption(false);
      fetchQuestions(); // refresh tampilan pertanyaan & opsi
    } catch (error: any) {
      console.error('❌ Gagal kirim opsi:', {
        message: error?.message,
        status: error?.response?.status,
        data: error?.response?.data,
      });
      alert('Gagal menyimpan opsi jawaban');
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start pt-20 overflow-auto z-50">
      <div className="bg-white rounded-lg max-w-3xl w-full p-6 relative">
        <button
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
          onClick={onClose}
          aria-label="Close"
        >
          <X size={24} />
        </button>

        <h2 className="text-xl font-semibold mb-4">Detail Kuis</h2>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            {questions.length === 0 && <p>Belum ada pertanyaan.</p>}
            <div className="space-y-6">
              {questions.map((q) => (
                <div key={q.id} className="border rounded p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">{q.questionText}</h3>
                    <button
                      className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
                      onClick={() => openAddOptionModal(q.id)}
                    >
                      <Plus size={16} /> Tambah Opsi
                    </button>
                  </div>

                  <ul className="list-disc list-inside">
                    {q.options.length === 0 && <li><i>Belum ada opsi jawaban.</i></li>}
                    {q.options.map((opt, index) => (
                      <li key={index}>
                        {opt.text} {opt.isCorrect && <strong>(Benar)</strong>}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={() => setShowAddQuestion(true)}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Tambah Pertanyaan
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Tutup
          </button>
        </div>

        {showAddQuestion && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded shadow max-w-md w-full">
              <h3 className="text-lg font-semibold mb-4">Tambah Pertanyaan</h3>
              <textarea
                className="w-full border rounded px-3 py-2 mb-4"
                rows={3}
                placeholder="Tulis pertanyaan..."
                value={newQuestionText}
                onChange={(e) => setNewQuestionText(e.target.value)}
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowAddQuestion(false)}
                  className="px-4 py-2 border rounded"
                >
                  Batal
                </button>
                <button
                  onClick={handleAddQuestion}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Simpan
                </button>
              </div>
            </div>
          </div>
        )}

        {showAddOption && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded shadow max-w-md w-full">
              <h3 className="text-lg font-semibold mb-4">Tambah Opsi Jawaban</h3>
              {optionInputs.map((opt, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    className="w-full border rounded px-3 py-2"
                    placeholder={`Opsi ${String.fromCharCode(65 + index)}`}
                    value={opt.text}
                    onChange={(e) => {
                      const updated = [...optionInputs];
                      updated[index].text = e.target.value;
                      setOptionInputs(updated);
                    }}
                  />
                  <label className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={opt.isCorrect}
                      onChange={(e) => {
                        const updated = optionInputs.map((o, i) => ({
                          ...o,
                          isCorrect: i === index ? e.target.checked : false,
                        }));
                        setOptionInputs(updated);
                      }}
                    />
                    <span>Benar</span>
                  </label>
                </div>
              ))}
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => setShowAddOption(false)}
                  className="px-4 py-2 border rounded"
                >
                  Batal
                </button>
                <button
                  onClick={handleSubmitAllOptions}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Simpan Pertanyaan
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { X, Plus } from 'lucide-react';

type Option = {
  text: string;
  isCorrect: boolean;
};

type QuestionForm = {
  question: string;
  options: Option[];
};

type QuizInfo = {
  title: string;
  category: string;
  status: 'draft' | 'published';
};

type Props = {
  onClose: () => void;
  onSubmit: (data: { quiz: QuizInfo; questions: QuestionForm[] }) => void;
};

export default function AddQuizModal({ onClose, onSubmit }: Props) {
  const [quizInfo, setQuizInfo] = useState<QuizInfo>({
    title: '',
    category: '',
    status: 'draft',
  });

  const [questions, setQuestions] = useState<QuestionForm[]>([
    {
      question: '',
      options: [
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
      ],
    },
  ]);

  const handleChangeQuestion = (index: number, value: string) => {
    const updated = [...questions];
    updated[index].question = value;
    setQuestions(updated);
  };

  const handleChangeOption = (qIndex: number, oIndex: number, value: string) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex].text = value;
    setQuestions(updated);
  };

  const handleSelectCorrect = (qIndex: number, oIndex: number) => {
    const updated = [...questions];
    updated[qIndex].options = updated[qIndex].options.map((opt, idx) => ({
      ...opt,
      isCorrect: idx === oIndex,
    }));
    setQuestions(updated);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: '',
        options: [
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
        ],
      },
    ]);
  };

  const handleSubmit = () => {
    onSubmit({
      quiz: quizInfo,
      questions,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-3xl rounded-xl p-6 relative max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-400 hover:text-red-500">
          <X />
        </button>

        <h2 className="text-lg font-semibold mb-6">Tambah Kuis Ergonomi</h2>

        {/* Quiz Info */}
        <div className="space-y-4 mb-8 border-b pb-6">
          <div>
            <label className="text-sm font-medium">Judul Kuis</label>
            <input
              type="text"
              className="w-full border rounded px-4 py-2 text-sm mt-1"
              placeholder="Masukkan judul kuis"
              value={quizInfo.title}
              onChange={(e) => setQuizInfo({ ...quizInfo, title: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Kategori</label>
            <select
              className="w-full border rounded px-4 py-2 text-sm mt-1"
              value={quizInfo.category}
              onChange={(e) => setQuizInfo({ ...quizInfo, category: e.target.value })}
            >
              <option value="">Pilih kategori</option>
              <option value="Postur Kerja">Postur Kerja</option>
              <option value="Kesehatan">Kesehatan</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Status</label>
            <select
              className="w-full border rounded px-4 py-2 text-sm mt-1"
              value={quizInfo.status}
              onChange={(e) => setQuizInfo({ ...quizInfo, status: e.target.value as 'draft' | 'published' })}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>

        {/* Question List */}
        {questions.map((q, qIndex) => (
          <div key={qIndex} className="space-y-4 mb-8 border-t pt-6">
            <div>
              <label className="text-sm font-medium">Pertanyaan {qIndex + 1}</label>
              <input
                type="text"
                className="w-full border rounded px-4 py-2 text-sm mt-1"
                placeholder="Masukkan pertanyaan"
                value={q.question}
                onChange={(e) => handleChangeQuestion(qIndex, e.target.value)}
              />
            </div>

            {q.options.map((opt, oIndex) => (
              <div key={oIndex} className="flex items-center gap-2">
                <input
                  type="text"
                  className="flex-1 border rounded px-4 py-2 text-sm"
                  placeholder={`Opsi ${oIndex + 1}`}
                  value={opt.text}
                  onChange={(e) => handleChangeOption(qIndex, oIndex, e.target.value)}
                />
                <label className="text-sm flex items-center gap-1">
                  <input
                    type="radio"
                    checked={opt.isCorrect}
                    onChange={() => handleSelectCorrect(qIndex, oIndex)}
                  />
                  Jawaban Benar
                </label>
              </div>
            ))}
          </div>
        ))}

        <button
          type="button"
          onClick={addQuestion}
          className="flex items-center gap-2 text-sky-600 hover:underline text-sm mb-4"
        >
          <Plus className="w-4 h-4" /> Tambah Pertanyaan
        </button>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-sm"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2 rounded-md bg-cyan-600 hover:brightness-110 text-white text-sm"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}

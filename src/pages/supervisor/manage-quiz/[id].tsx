'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from '@/lib/axios';
import toast from 'react-hot-toast';
import { Loader2, LayoutDashboard, Building2, Users2, Book, BarChart3, UserCog } from 'lucide-react';
import SidebarWrapper from '@/components/dashboard/SidebarWrapper';

const supervisorMenu = [
  { label: 'Dashboard', href: '/dashboard/supervisor', icon: <LayoutDashboard /> },
  { label: 'Manajemen Divisi', href: '/supervisor/manage-division', icon: <Building2 /> },
  { label: 'Manajemen Karyawan', href: '/supervisor/manage-employees', icon: <Users2 /> },
  { label: 'Manajemen Kuis', href: '/supervisor/manage-quiz', icon: <Book /> },
  { label: 'Report Evaluasi', href: '/supervisor/report-summary', icon: <BarChart3 /> },
  { label: 'Profile', href: '/supervisor/profile', icon: <UserCog /> },
];

export default function QuizDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  const [quiz, setQuiz] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    if (id) {
      fetchQuizDetail();
      fetchQuizQuestions();
    }
  }, [id]);

  const fetchQuizDetail = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/quiz/get-quiz', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const found = res.data?.data?.find((q: any) => q.id === id);
      if (!found) toast.error('Kuis tidak ditemukan');
      setQuiz(found);
    } catch {
      toast.error('Gagal memuat daftar kuis');
    } finally {
      setLoading(false);
    }
  };

  const fetchQuizQuestions = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`/question/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuestions(res.data?.data || []);
    } catch {
      toast.error('Gagal memuat pertanyaan');
    }
  };

  const handleUpdateQuestion = async (questionId: string) => {
    if (!editText.trim()) {
      toast.error('Pertanyaan tidak boleh kosong');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.put(`/question/${questionId}`, { text: editText }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Pertanyaan berhasil diperbarui');
      setEditingId(null);
      fetchQuizQuestions();
    } catch {
      toast.error('Gagal memperbarui pertanyaan');
    }
  };

  return (
  <div className="flex min-h-screen bg-gray-50">
    <SidebarWrapper menu={supervisorMenu} />

    <main className="flex-1 px-6 py-10 max-w-5xl mx-auto">
      {loading ? (
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="animate-spin w-6 h-6 text-gray-500" />
        </div>
      ) : !quiz ? (
        <div className="p-6 text-center text-gray-500">
          Kuis tidak ditemukan atau gagal dimuat.
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/supervisor/manage-quiz')}
                className="px-4 py-1.5 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 border border-gray-300"
              >
                ← Kembali
              </button>
              <h1 className="text-2xl font-bold text-gray-800">Detail Kuis</h1>
            </div>

            <button
              onClick={() => router.push(`/supervisor/manage-quiz/create?quizId=${id}`)}
              className="text-sm bg-sky-600 text-white px-4 py-1.5 rounded hover:bg-sky-700"
            >
              + Tambah Pertanyaan
            </button>
          </div>

          {/* Info Kuis */}
          <div className="bg-white border rounded-xl p-5 shadow-md mb-6">
            <p className="text-base text-slate-700">
              <span className="font-medium">Judul:</span> {quiz.title}
            </p>
          </div>

          {/* Daftar Pertanyaan */}
          <section className="space-y-5">
            <h2 className="text-xl font-medium text-slate-800">Daftar Pertanyaan</h2>

            {questions.length === 0 ? (
              <p className="text-sm text-gray-500">Belum ada pertanyaan ditambahkan.</p>
            ) : (
              <ul className="space-y-4">
                {questions.map((q, index) => (
                  <li key={q.id} className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm space-y-3">
                    {editingId === q.id ? (
                      <>
                        <textarea
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="w-full border rounded-md p-2 text-sm"
                          rows={3}
                        />
                        <div className="flex justify-end gap-3">
                          <button
                            onClick={() => handleUpdateQuestion(q.id)}
                            className="bg-cyan-600 text-white text-sm px-3 py-1 rounded hover:bg-cyan-700"
                          >
                            Simpan
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="text-sm text-gray-600 underline"
                          >
                            Batal
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex justify-between items-start">
                          <p className="text-base font-medium text-slate-700">
                            {index + 1}. {q.question}
                          </p>
                          <button
                            onClick={() => {
                              setEditingId(q.id);
                              setEditText(q.question);
                            }}
                            className="text-sm text-cyan-700 hover:underline"
                          >
                            Edit
                          </button>
                        </div>
                        {q.options?.length > 0 && (
                          <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                            {q.options.map((opt: any, idx: number) => (
                              <li key={opt.id}>
                                {String.fromCharCode(97 + idx)}. {opt.text}
                                {opt.isCorrect && (
                                  <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                    Benar
                                  </span>
                                )}
                              </li>
                            ))}
                          </ul>
                        )}
                      </>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Navigasi */}
          <div className="pt-8 text-right">
            <button
              onClick={() => router.push(`/supervisor/quiz-result/${id}`)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-100"
            >
              Lihat Hasil Kuis
            </button>
          </div>
        </>
      )}
    </main>
  </div>
  );
}

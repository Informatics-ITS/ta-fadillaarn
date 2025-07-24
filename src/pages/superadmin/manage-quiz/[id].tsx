'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from '@/lib/axios';
import toast from 'react-hot-toast';
import { Loader2, LayoutDashboard, Building2, Users2, Award, ClipboardList, UserCog } from 'lucide-react';
import SidebarWrapper from '@/components/dashboard/SidebarWrapper';

const superadminMenu = [
  { label: "Dashboard", href: "/dashboard/superadmin", icon: <LayoutDashboard /> },
  { label: "Manajemen Perusahaan", href: "/superadmin/manage-company", icon: <Building2 /> },
  { label: "Manajemen User", href: "/superadmin/manage-users", icon: <Users2 /> },
  { label: "Manajemen Badge", href: "/superadmin/manage-badge", icon: <Award /> },
  { label: "Manajemen Kuis", href: "/superadmin/manage-quiz", icon: <ClipboardList /> },
  { label: "Profile", href: "/superadmin/profile", icon: <UserCog /> },
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
      const res = await axios.get('/quiz/get-personal-quiz', { headers: { Authorization: `Bearer ${token}` } });
      setQuiz(res.data?.data?.find((q: any) => q.id === id) || null);
    } catch {
      toast.error('Gagal memuat detail kuis');
    } finally {
      setLoading(false);
    }
  };

  const fetchQuizQuestions = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`/question/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setQuestions(res.data?.data || []);
    } catch {
      toast.error('Gagal memuat pertanyaan');
    }
  };

  const handleUpdateQuestion = async (questionId: string) => {
    if (!editText.trim()) return toast.error('Pertanyaan tidak boleh kosong');

    try {
      const token = localStorage.getItem('token');
      await axios.put(`/question/${questionId}`, { text: editText }, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Pertanyaan diperbarui');
      setEditingId(null);
      fetchQuizQuestions();
    } catch {
      toast.error('Gagal memperbarui pertanyaan');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarWrapper menu={superadminMenu} profileHref="/superadmin/profile" />

      <main className="flex-1 px-6 py-10 space-y-10 max-w-5xl mx-auto">
        {loading ? (
          <div className="flex items-center justify-center h-[60vh]">
            <Loader2 className="animate-spin w-6 h-6 text-gray-500" />
          </div>
        ) : !quiz ? (
          <div className="text-center text-gray-500 p-10">Kuis tidak ditemukan.</div>
        ) : (
          <>
            {/* Header */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => router.push('/superadmin/manage-quiz')}
                  className="px-4 py-2 text-sm bg-gray-100 border border-gray-300 text-gray-700 rounded hover:bg-gray-200"
                >
                  ← Kembali
                </button>
                <h1 className="text-2xl font-bold text-slate-700">Detail Kuis</h1>
              </div>

              <button
                onClick={() => router.push(`/superadmin/manage-quiz/create?quizId=${id}`)}
                className="px-4 py-2 text-sm bg-sky-600 text-white rounded hover:bg-sky-700"
              >
                + Tambah Pertanyaan
              </button>
            </div>

            {/* Info Quiz */}
            <div className="bg-white p-5 rounded-xl shadow border">
              <p className="text-base text-slate-700">
                <span className="font-medium">Judul:</span> {quiz.title}
              </p>
            </div>

            {/* Questions */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-slate-800">Daftar Pertanyaan</h2>

              {questions.length === 0 ? (
                <p className="text-sm text-gray-500">Belum ada pertanyaan ditambahkan.</p>
              ) : (
                <div className="space-y-4">
                  {questions.map((q, index) => (
                    <div key={q.id} className="bg-white p-4 rounded-lg border shadow-sm space-y-3">
                      {editingId === q.id ? (
                        <>
                          <textarea
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="w-full border rounded p-2 text-sm"
                            rows={3}
                          />
                          <div className="flex justify-end gap-3">
                            <button
                              onClick={() => handleUpdateQuestion(q.id)}
                              className="px-3 py-1 text-sm bg-cyan-600 text-white rounded hover:bg-cyan-700"
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
                            <p className="font-medium text-slate-700">
                              {index + 1}. {q.question}
                            </p>
                            <button
                              onClick={() => { setEditingId(q.id); setEditText(q.question); }}
                              className="text-sm text-sky-600 hover:underline"
                            >
                              Edit
                            </button>
                          </div>
                          {q.options?.length > 0 && (
                            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                              {q.options.map((opt: any, idx: number) => (
                                <li key={opt.id}>
                                  {String.fromCharCode(97 + idx)}. {opt.text}
                                  {opt.isCorrect && (
                                    <span className="ml-2 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                                      Benar
                                    </span>
                                  )}
                                </li>
                              ))}
                            </ul>
                          )}
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quiz Results */}
            <div className="text-right">
              <button
                onClick={() => router.push(`/supervisor/quiz-result/${id}`)}
                className="px-4 py-2 text-sm font-medium bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-100"
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

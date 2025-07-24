'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  LayoutDashboard,
  Camera,
  ClipboardList,
  Award,
  UserCog,
  FileText,
} from 'lucide-react';
import SidebarWrapper from '@/components/dashboard/SidebarWrapper';
import axios from '@/lib/axios';

const userMenu = [
  { label: 'Dashboard', href: '/dashboard/user', icon: <LayoutDashboard /> },
  { label: 'Evaluasi Postur', href: '/user/evaluasi', icon: <Camera /> },
  { label: 'Progress Postur', href: '/user/progress', icon: <ClipboardList /> },
  { label: 'Kuis Ergonomi', href: '/user/quiz/kuis', icon: <FileText /> },
  { label: 'Penghargaan', href: '/user/badge', icon: <Award /> },
  { label: 'Profil', href: '/user/profile', icon: <UserCog /> },
];

export default function QuizResultPage() {
  const router = useRouter();
  const [quizResults, setQuizResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    if (!token || !userId) {
      console.warn('[WARNING] Token atau userId tidak tersedia.');
      return;
    }

  const fetchQuizHistory = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      console.warn('[WARNING] Token tidak tersedia.');
      return;
    }

    try {
      const res = await axios.get(`/quiz-attempt/attempt-history`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('[DEBUG] Riwayat kuis:', res.data);
      setQuizResults(res.data.data || []);
    } catch (err) {
      console.error('❌ Gagal mengambil riwayat kuis:', err);
    } finally {
      setLoading(false);
    }
  };

    fetchQuizHistory();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Memuat hasil kuis...
      </div>
    );
  }

  if (!quizResults.length) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Tidak ada hasil kuis ditemukan.
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarWrapper menu={userMenu} profileHref="/user/profile" />

      <main className="flex-1 ml-64 px-12 py-12 space-y-10">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-slate-800">
            Riwayat Hasil Kuis Anda
          </h1>
          <p className="text-sm text-slate-500">
            Berikut adalah daftar hasil kuis yang pernah Anda kerjakan.
          </p>
        </div>

        <section className="space-y-4">
          {quizResults.map((quiz, i) => (
            <div
              key={i}
              className="rounded-xl px-6 py-4 bg-white border shadow-sm flex flex-col gap-2"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-slate-800 font-medium">
                    {quiz.quizName || 'Tidak diketahui'}
                  </p>
                  <p className="text-sm text-slate-500">
                    Tanggal:{' '}
                    {quiz.createdAt
                      ? new Date(quiz.createdAt).toLocaleDateString('id-ID')
                      : 'Tidak tersedia'}
                  </p>
                </div>
                <div className="text-sm text-slate-700 font-medium">
                  Skor: {quiz.score !== null ? quiz.score : '-'}
                </div>
              </div>
            </div>
          ))}
        </section>

        <div className="pt-2">
          <button
            onClick={() => router.push('/user/quiz/kuis')}
            className="inline-flex items-center gap-2 text-sm px-5 py-2.5 rounded-md border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Daftar Kuis
          </button>
        </div>
      </main>
    </div>
  );
}

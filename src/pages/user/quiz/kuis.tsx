'use client';

import { useEffect, useState } from 'react';
import SidebarWrapper from '@/components/dashboard/SidebarWrapper';
import QuizCard from '@/components/dashboard/personal/QuizCard';
import axios from '@/lib/axios';
import {
  LayoutDashboard,
  ClipboardList,
  FileText,
  Camera,
  Award,
  UserCog,
  Search,
} from 'lucide-react';

const userMenu = [
  { label: 'Dashboard', href: '/dashboard/user', icon: <LayoutDashboard /> },
  { label: 'Evaluasi Postur', href: '/user/evaluasi', icon: <Camera /> },
  { label: 'Progress Postur', href: '/user/progress', icon: <ClipboardList /> },
  { label: 'Kuis Ergonomi', href: '/user/quiz/kuis', icon: <FileText /> },
  { label: 'Penghargaan', href: '/user/badge', icon: <Award /> },
  { label: 'Profil', href: '/user/profile', icon: <UserCog /> },
];

type Quiz = {
  id: string;
  title: string;
  category: string;
  type: 'public' | 'private';
  status: 'completed' | 'not_started';
};

export default function QuizPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'not_started'>('all');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token || !role) return;

const fetchData = async () => {
  try {
    const quizEndpoint = role === 'employee' ? '/quiz/get-quiz' : '/quiz/get-personal-quiz';

    const [quizRes, historyRes] = await Promise.all([
      axios.get(quizEndpoint, { headers: { Authorization: `Bearer ${token}` } }),
      axios.get('/quiz-attempt/attempt-history', { headers: { Authorization: `Bearer ${token}` } }),
    ]);

    const quizzesData = quizRes.data?.data || [];
    const historyData = historyRes.data?.data || [];

    const mapped = quizzesData.map((quiz: any) => {
      const isCompleted = historyData.some(
        (attempt: any) => attempt.quizId === quiz.id
      );

      return {
        id: quiz.id,
        title: quiz.title,
        category: quiz.category || 'Umum',
        type: quiz.type || 'public',
        status: isCompleted ? 'completed' : 'not_started',
      };
    });

    setQuizzes(mapped);
  } catch (err) {
    console.error('Gagal mengambil data kuis:', err);
  }
};


    fetchData();
  }, []);

  const filteredQuizzes = quizzes.filter((quiz) => {
    const matchSearch = quiz.title.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' ? true : quiz.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarWrapper menu={userMenu} profileHref="/user/profile" />

      <main className="flex-1 ml-64 px-16 py-10 space-y-8">
        <header className="space-y-1">
          <h1 className="text-2xl font-bold text-slate-800">Kuis Ergonomi</h1>
          <p className="text-sm text-slate-500">Latih dan ukur pengetahuan ergonomi Anda.</p>
        </header>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search */}
          <div className="relative w-full md:w-1/2">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Cari kuis..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-slate-300 pl-10 pr-3 py-2 text-sm placeholder-slate-400 focus:border-cyan-500 focus:ring-cyan-500"
            />
          </div>

          {/* Filter Status */}
          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as 'all' | 'completed' | 'not_started')}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-cyan-500 focus:ring-cyan-500"
            >
              <option value="all">Semua Status</option>
              <option value="not_started">Belum Dikerjakan</option>
              <option value="completed">Sudah Dikerjakan</option>
            </select>
          </div>
        </div>

        {filteredQuizzes.length > 0 ? (
          <section className="space-y-4">
            {filteredQuizzes.map((quiz) => (
              <QuizCard
                key={quiz.id}
                id={quiz.id}
                title={quiz.title}
                category={quiz.category}
                status={quiz.status}
              />
            ))}
          </section>
        ) : (
          <p className="text-center text-sm text-slate-500">Tidak ada kuis ditemukan.</p>
        )}
      </main>
    </div>
  );
}

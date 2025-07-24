'use client';

import { useEffect, useState } from 'react';
import { LayoutDashboard, Camera, ClipboardList, Award, User, FileText, UserCog } from 'lucide-react';
import SidebarWrapper from '@/components/dashboard/SidebarWrapper';
import PostureProgressCard from '@/components/dashboard/personal/PostureProgressChart';
import ErgonomicWarningCard from '@/components/dashboard/personal/ErgonomicWarningCard';
import BadgeList from '@/components/dashboard/personal/BadgeList';
import ErgoTips from '@/components/dashboard/personal/ErgoTips';
import axios from '@/lib/axios';
import { toast } from 'sonner';
import { jwtDecode } from 'jwt-decode';

const userMenu = [
  { label: 'Dashboard', href: '/dashboard/user', icon: <LayoutDashboard /> },
  { label: 'Evaluasi Postur', href: '/user/evaluasi', icon: <Camera /> },
  { label: 'Progress Postur', href: '/user/progress', icon: <ClipboardList /> },
  { label: 'Kuis Ergonomi', href: '/user/quiz/kuis', icon: <FileText /> },
  { label: 'Penghargaan', href: '/user/badge', icon: <Award /> },
  { label: 'Profil', href: '/user/profile', icon: <UserCog /> },
];

export default function PersonalDashboard() {
  const [lastPosture, setLastPosture] = useState<any>(null);
  const [lastQuiz, setLastQuiz] = useState<any>(null);
  const [quizCompleted, setQuizCompleted] = useState(0);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') ?? '' : '';
  const decoded: any = token ? jwtDecode(token) : null;
  const userId = decoded?.id;

  const fetchLastPosture = async () => {
    try {
      const res = await axios.get('/ergonomic/ergonomic-history', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data.data || [];
      setLastPosture(data[0] || null);
    } catch (err) {
      console.error('❌ Gagal mengambil data evaluasi:', err);
      toast.error('Gagal memuat evaluasi postur');
    }
  };

  const fetchQuizHistory = async () => {
    try {
      if (!userId) return;
      const res = await axios.get(`/quiz-attempt/history/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data.data || [];
      setQuizCompleted(data.length);
      setLastQuiz(data[0] || null);
    } catch (err) {
      console.error('❌ Gagal mengambil riwayat kuis:', err);
      toast.error('Gagal memuat riwayat kuis');
    }
  };

  useEffect(() => {
    fetchLastPosture();
    fetchQuizHistory();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarWrapper menu={userMenu} profileHref="/user/profile" />

      <main className="flex-1 ml-64 px-6 py-10 space-y-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Dashboard Personal</h1>
            <p className="text-sm text-slate-500">Pantau dan evaluasi postur kerja Anda</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border rounded-lg p-4 shadow">
            <div className="text-slate-600 text-sm mb-2">Evaluasi Terakhir</div>
            <div className="text-3xl font-bold text-slate-900">{lastPosture?.score ?? '-'}</div>
            <p className="text-sm text-slate-500">
              {lastPosture ? new Date(lastPosture.createdAt).toLocaleDateString('id-ID') : '-'}
            </p>
            <span className="inline-block mt-2 text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
              {lastPosture?.riskLevel ?? 'Tidak Diketahui'}
            </span>
          </div>

          <PostureProgressCard progress={60} completed={quizCompleted} total={5} />

          <div className="bg-white border rounded-lg p-4 shadow">
            <div className="text-slate-600 text-sm mb-2">Kuis Terakhir</div>
            <p className="text-base font-semibold text-slate-800">{lastQuiz?.quizName ?? '-'}</p>
            <p className="text-sm text-slate-500">Skor: <span className="font-medium text-emerald-600">{lastQuiz?.score ?? '-'}</span></p>
            <p className="text-xs text-slate-500 mt-1">
              Dikerjakan pada: {lastQuiz ? new Date(lastQuiz.createdAt).toLocaleDateString('id-ID') : '-'}
            </p>
          </div>
        </div>

        <ErgonomicWarningCard message="Evaluasi terakhir menunjukkan postur Anda perlu diperbaiki." />

        <section>
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold text-slate-800">Badges</h2>
          </div>
          <BadgeList employeeId={userId} />
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-800 mb-2">Tips Ergonomi</h2>
          <ErgoTips />
        </section>
      </main>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import SidebarWrapper from '@/components/dashboard/SidebarWrapper';
import {
  LayoutDashboard,
  Users2,
  Building2,
  Award,
  ClipboardList,
  UserCog,
} from 'lucide-react';

import StatOverview from '@/components/dashboard/superadmin/StatOverview';
import UserDistribution from '@/components/dashboard/superadmin/UserDistribution';
import TrendChart from '@/components/dashboard/superadmin/TrendChart';
import RecentCompanies from '@/components/dashboard/superadmin/RecentCompanies';
import BadgeSummary from '@/components/dashboard/superadmin/BadgeSummary';
import QuizSummary from '@/components/dashboard/superadmin/QuizSummary';
import axios from '@/lib/axios';

const superadminMenu = [
  { label: 'Dashboard', href: '/dashboard/superadmin', icon: <LayoutDashboard /> },
  { label: 'Manajemen Perusahaan', href: '/superadmin/manage-company', icon: <Building2 /> },
  { label: 'Manajemen User', href: '/superadmin/manage-users', icon: <Users2 /> },
  { label: 'Manajemen Badge', href: '/superadmin/manage-badge', icon: <Award /> },
  { label: 'Manajemen Kuis', href: '/superadmin/manage-quiz', icon: <ClipboardList /> },
  { label: 'Profile', href: '/superadmin/profile', icon: <UserCog /> },
];

export default function SuperadminDashboardPage() {
  const [quizCount, setQuizCount] = useState<number>(0);

  useEffect(() => {
    const fetchQuizCount = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/quiz/get-personal-quiz', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const quizzes = res.data?.data || [];
        setQuizCount(quizzes.length);
      } catch (error) {
        console.error('❌ Gagal mengambil data kuis:', error);
        setQuizCount(0);
      }
    };

    fetchQuizCount();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarWrapper menu={superadminMenu} profileHref="/superadmin/profile" />

      <main className="flex-1 p-6 md:p-10 space-y-12 ml-64">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-slate-700">Dashboard Superadmin</h1>
          <p className="text-sm text-gray-500">Monitoring akun dan data perusahaan</p>
        </div>

        {/* Statistik ringkasan */}
        <StatOverview />

        {/* Tambahkan total quiz */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <QuizSummary total={quizCount} />
        </div>

        {/* Grafik */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <UserDistribution />
          <TrendChart />
        </div>

        {/* Data terbaru */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <RecentCompanies />
        </div>
      </main>
    </div>
  );
}

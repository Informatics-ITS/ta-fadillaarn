'use client';

import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import SidebarWrapper from '@/components/dashboard/SidebarWrapper';
import ColoredIcon from '@/components/ColoredIcon';
import { LayoutDashboard, Camera, ClipboardList, FileText, Award, UserCog } from 'lucide-react';
import axios from '@/lib/axios';
import { toast } from 'sonner';

const userMenu = [
  { label: 'Dashboard', href: '/dashboard/user', icon: <LayoutDashboard /> },
  { label: 'Evaluasi Postur', href: '/user/evaluasi', icon: <Camera /> },
  { label: 'Progress Postur', href: '/user/progress', icon: <ClipboardList /> },
  { label: 'Kuis Ergonomi', href: '/user/quiz/kuis', icon: <FileText /> },
  { label: 'Penghargaan', href: '/user/badge', icon: <Award /> },
  { label: 'Profil', href: '/user/profile', icon: <UserCog /> },
];

type Badge = {
  id: string;
  name: string;
  description: string;
  quizCompleted: number;
  icon?: string;
  obtained?: boolean;
  dateObtained?: string;
  progress?: number;
};

type DecodedToken = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export default function BadgePage() {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [quizCompleted, setQuizCompleted] = useState<number>(0);
  const [userId, setUserId] = useState<string | null>(null);
  const [token, setToken] = useState<string>('');

  const fetchQuizHistory = async (userId: string, token: string) => {
    try {
      const res = await axios.get(`/quiz-attempt/history/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const totalCompleted = res.data.data?.length || 0;
      setQuizCompleted(totalCompleted);
    } catch (err) {
      console.error('❌ Gagal mengambil riwayat kuis:', err);
      toast.error('Gagal memuat riwayat kuis');
    }
  };

  const fetchBadges = async () => {
    try {
      const res = await axios.get('/badges/get-all-badges');
      const rawBadges = res.data.data || [];

      const updatedBadges: Badge[] = rawBadges.map((badge: any) => {
        const obtained = quizCompleted >= badge.quizCompleted;
        const progress = obtained ? 100 : Math.floor((quizCompleted / badge.quizCompleted) * 100);
        return {
          ...badge,
          icon: 'shield',
          obtained,
          progress,
          dateObtained: obtained ? new Date().toLocaleDateString('id-ID') : undefined,
        };
      });

      setBadges(updatedBadges);
    } catch (err) {
      console.error('❌ Gagal mengambil badge:', err);
      toast.error('Gagal memuat badge');
    }
  };

  // ✅ Ambil userId dan token hanya di client
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('token') ?? '';
      setToken(storedToken);
      try {
        const decoded = storedToken ? jwtDecode<DecodedToken>(storedToken) : null;
        if (decoded?.id) {
          setUserId(decoded.id);
        }
      } catch {
        console.error('❌ Token tidak valid');
      }
    }
  }, []);

  useEffect(() => {
    if (userId && token) {
      fetchQuizHistory(userId, token);
    }
  }, [userId, token]);

  useEffect(() => {
    fetchBadges();
  }, [quizCompleted]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarWrapper menu={userMenu} profileHref="/user/profile" />

      <main className="flex-1 ml-64 px-10 py-10 space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Pencapaian & Penghargaan</h1>
          <p className="text-sm text-slate-500">Lihat progres dan prestasi Anda</p>
        </div>

        <div className="space-y-4">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className="flex items-start gap-4 bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition"
            >
              <ColoredIcon name={badge.icon || 'shield'} />
              <div className="flex-1 space-y-1">
                <h2 className="text-lg font-semibold text-slate-800">{badge.name}</h2>
                <p className="text-sm text-slate-600">{badge.description}</p>
                {badge.obtained ? (
                  <p className="text-xs text-slate-500 mt-1">
                    Diperoleh pada {badge.dateObtained || '-'}
                  </p>
                ) : (
                  <>
                    <p className="text-xs text-slate-500 mt-2">Progres</p>
                    <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-cyan-500 transition-all" style={{ width: `${badge.progress}%` }} />
                    </div>
                  </>
                )}
              </div>

              {badge.obtained && (
                <span className="text-xs bg-green-100 text-green-600 px-3 py-1 rounded-full self-start">
                  Diperoleh
                </span>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { Medal } from 'lucide-react';
import axios from '@/lib/axios';
import { toast } from 'sonner';

type Badge = {
  obtained: any;
  id: string;
  name: string;
  level: number;
  quizCompleted: number; // Target quiz untuk dapat badge
};

export default function BadgeList({ employeeId }: { employeeId: string }) {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [quizCompleted, setQuizCompleted] = useState(0);
  const [loading, setLoading] = useState(true);

  // Ambil riwayat quiz user
  const fetchQuizHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`/quiz-attempt/history/${employeeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.data?.length || 0;
    } catch (err) {
      console.error('❌ Gagal mengambil riwayat kuis:', err);
      toast.error('Gagal memuat riwayat kuis');
      return 0;
    }
  };

  // Ambil badge
  const fetchBadges = async (quizDone: number) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/badges/get-all-badges', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const rawBadges: Badge[] = res.data.data || [];

      const updatedBadges = rawBadges.map((badge) => {
        const obtained = quizDone >= badge.quizCompleted;
        return {
          ...badge,
          obtained,
        };
      });

      setBadges(updatedBadges);
    } catch (err) {
      console.error('❌ Gagal mengambil badge:', err);
      toast.error('Gagal memuat badge');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!employeeId) return;

    const load = async () => {
      const quizDone = await fetchQuizHistory();
      setQuizCompleted(quizDone);
      await fetchBadges(quizDone);
    };

    load();
  }, [employeeId]);

  if (loading) {
    return <p className="text-sm text-slate-500">Memuat badge...</p>;
  }

  if (badges.length === 0) {
    return <p className="text-sm text-slate-500">Belum ada badge yang diperoleh.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {badges.map((badge) => (
        <div
          key={badge.id}
          className={`flex items-center gap-3 p-3 rounded-lg border bg-white shadow-sm ${
            badge.obtained ? '' : 'opacity-50'
          }`}
        >
          <div className="bg-slate-100 p-2 rounded-full">
            <Medal className="w-6 h-6 text-yellow-500" />
          </div>
          <div>
            <p className="font-semibold">{badge.name}</p>
            <p className="text-sm text-slate-500">
              Level {badge.level} {badge.obtained ? '(✅ Diperoleh)' : '(❌ Belum)'}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

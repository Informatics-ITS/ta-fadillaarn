'use client';

import { useEffect, useState } from 'react';
import { Users, Building, Award, ClipboardList } from 'lucide-react';
import axios from '@/lib/axios';

export default function SummaryBoxGroup() {
  const [userCount, setUserCount] = useState<number>(0);
  const [companyCount, setCompanyCount] = useState<number>(0);
  const [badgeCount, setBadgeCount] = useState<number>(0);
  const [quizCount, setQuizCount] = useState<number>(0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const fetchData = async () => {
      try {
        const [userRes, companyRes, badgeRes, quizRes] = await Promise.all([
          axios.get('/super-admin/get-all-users', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('/company/get-all-company', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('/badges/get-all-badges', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('/quiz/get-quiz', { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        setUserCount(userRes.data?.data?.length || 0);
        setCompanyCount(companyRes.data?.data?.length || 0);
        setBadgeCount(badgeRes.data?.data?.length || 0);
        setQuizCount(quizRes.data?.data?.length || 0);
      } catch (err) {
        console.error('❌ Error summary:', err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <SummaryBox icon={<Users className="h-5 w-5 text-blue-500" />} label="Total Pengguna" value={userCount} sub="Semua role terdaftar" />
      <SummaryBox icon={<Building className="h-5 w-5 text-green-500" />} label="Total Perusahaan" value={companyCount} sub="Terdaftar di sistem" />
      <SummaryBox icon={<Award className="h-5 w-5 text-yellow-500" />} label="Total Badge" value={badgeCount} sub="Tersedia di sistem" />
      <SummaryBox icon={<ClipboardList className="h-5 w-5 text-purple-500" />} label="Total Kuis" value={quizCount} sub="Kuis yang tersedia" />
    </div>
  );
}

function SummaryBox({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: number; sub: string }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow flex flex-col justify-between">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-full bg-gray-100">{icon}</div>
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
      </div>
      <div className="text-sm text-gray-500">{sub}</div>
    </div>
  );
}

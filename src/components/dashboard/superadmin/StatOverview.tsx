'use client';

import { useEffect, useState } from 'react';
import { Users, Building, Award } from 'lucide-react';
import axios from '@/lib/axios';

export default function StatOverview() {
  const [userCount, setUserCount] = useState<number | null>(null);
  const [companyCount, setCompanyCount] = useState<number | null>(null);
  const [badgeCount, setBadgeCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');

        // Fetch semua user role terpisah
        const [spvRes, empRes, personalRes, companyRes, badgeRes] = await Promise.all([
          axios.get('/super-admin/get-all-supervisors', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('/super-admin/get-all-employees', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('/super-admin/get-all-users', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('/company/get-all-company', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('/badges/get-all-badges', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        // Hitung total user dari semua role
        const totalSupervisors = spvRes.data?.data?.length || 0;
        const totalEmployees = empRes.data?.data?.data?.length || 0;
        const totalPersonals = personalRes.data?.data?.length || 0;

        const totalUsers = totalSupervisors + totalEmployees + totalPersonals;
        const totalCompanies = companyRes.data?.data?.length || 0;
        const totalBadges = badgeRes.data?.data?.length || 0;

        setUserCount(totalUsers);
        setCompanyCount(totalCompanies);
        setBadgeCount(totalBadges);
      } catch (error) {
        console.error('❌ Gagal mengambil data:', error);
        setUserCount(0);
        setCompanyCount(0);
        setBadgeCount(0);
      }
    };

    fetchData();
  }, []);

  const isLoading = (val: number | null) => val === null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      <StatCard
        title="Total Pengguna"
        value={userCount}
        icon={<Users className="h-5 w-5 text-blue-500" />}
        bg="bg-blue-50"
        sub="Semua role terdaftar"
        isLoading={isLoading(userCount)}
      />

      <StatCard
        title="Total Perusahaan"
        value={companyCount}
        icon={<Building className="h-5 w-5 text-green-500" />}
        bg="bg-green-50"
        sub="Terdaftar di sistem"
        isLoading={isLoading(companyCount)}
      />

      <StatCard
        title="Total Badge"
        value={badgeCount}
        icon={<Award className="h-5 w-5 text-yellow-500" />}
        bg="bg-yellow-50"
        sub="Tersedia di sistem"
        isLoading={isLoading(badgeCount)}
      />
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  bg,
  sub,
  isLoading,
}: {
  title: string;
  value: number | null;
  icon: React.ReactNode;
  bg: string;
  sub: string;
  isLoading: boolean;
}) {
  return (
    <div className="bg-white p-6 rounded-xl shadow flex flex-col justify-between">
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 rounded-full ${bg}`}>{icon}</div>
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-800">
            {isLoading ? (
              <span className="text-gray-400 animate-pulse">...</span>
            ) : (
              value ?? 0
            )}
          </p>
        </div>
      </div>
      <div className="text-sm text-gray-500">{sub}</div>
    </div>
  );
}

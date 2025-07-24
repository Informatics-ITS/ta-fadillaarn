'use client';

import { useEffect, useState } from 'react';
import SidebarWrapper from '@/components/dashboard/SidebarWrapper';
import ProfileForm from '@/components/dashboard/personal/ProfileForm';
import axios from '@/lib/axios';
import {
  LayoutDashboard,
  ClipboardList,
  UserCog,
  Camera,
  Award,
  FileText,
} from 'lucide-react';

const userMenu = [
  { label: 'Dashboard', href: '/dashboard/user', icon: <LayoutDashboard /> },
  { label: 'Evaluasi Postur', href: '/user/evaluasi', icon: <Camera /> },
  { label: 'Progress Postur', href: '/user/progress', icon: <ClipboardList /> },
  { label: 'Kuis Ergonomi', href: '/user/quiz/kuis', icon: <FileText /> },
  { label: 'Penghargaan', href: '/user/badge', icon: <Award /> },
  { label: 'Profil', href: '/user/profile', icon: <UserCog /> },
];

export default function PersonalProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token || !role) return;

    const fetchProfile = async () => {
      try {
        const endpoint =
          role === 'employee' ? '/employee/profile' : '/personal/profile';
        const res = await axios.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = res.data?.data;
        setProfile({
          id: data.id,
          name: data.name,
          email: data.email,
          role: role,
          supervisorName: data.supervisorName,
        });
      } catch (err) {
        console.error('❌ Gagal mengambil data profil:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarWrapper menu={userMenu} profileHref="/user/profile" />
      <main className="flex-1 ml-64 px-8 py-12 space-y-8">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-slate-800">Profil Saya</h1>
          <p className="text-sm text-slate-500">
            Perbarui informasi akun Anda untuk menjaga data tetap akurat.
          </p>
        </div>

        <div className="w-full max-w-xl">
          <div className="bg-white p-8 rounded-2xl shadow border border-slate-200">
            {loading ? (
              <p className="text-sm text-slate-500">Memuat data profil...</p>
            ) : profile ? (
              <ProfileForm initialData={profile} />
            ) : (
              <p className="text-sm text-red-500">Data profil tidak ditemukan.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

'use client';

import SidebarWrapper from '@/components/dashboard/SidebarWrapper';
import ProfileForm from '@/components/dashboard/supervisor/ProfileForm';
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  Settings,
  Building2,
  Users2,
  BarChart3,
  UserCog,
  Book,
} from 'lucide-react';

const supervisorMenu = [
  { label: 'Dashboard', href: '/dashboard/supervisor', icon: <LayoutDashboard /> },
  { label: 'Manajemen Divisi', href: '/supervisor/manage-division', icon: <Building2 /> },
  { label: 'Manajemen Karyawan', href: '/supervisor/manage-employees', icon: <Users2 /> },
  { label: 'Manajemen Kuis', href: '/supervisor/manage-quiz', icon: <Book /> },
  { label: 'Report Evaluasi', href: '/supervisor/report-summary', icon: <BarChart3 /> },
  { label: 'Profile', href: '/supervisor/profile', icon: <UserCog /> },
];

export default function SupervisorProfilePage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarWrapper menu={supervisorMenu} profileHref="/supervisor/profile" />

      <main className="flex-1 ml-64 p-6 md:p-10 space-y-8">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-slate-800">Profil Saya</h1>
          <p className="text-sm text-slate-500">Perbarui informasi akun Anda di bawah ini.</p>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm max-w-xl">
          <ProfileForm />
        </div>
      </main>
    </div>
  );
}

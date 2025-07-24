'use client';

import SidebarWrapper from '@/components/dashboard/SidebarWrapper';
import ProfileForm from '@/components/dashboard/superadmin/ProfileForm';
import {
  LayoutDashboard,
  Users2,
  Building2,
  Award,
  ClipboardList,
  UserCog,
} from 'lucide-react';

const superadminMenu = [
  { label: 'Dashboard', href: '/dashboard/superadmin', icon: <LayoutDashboard /> },
  { label: 'Manajemen Perusahaan', href: '/superadmin/manage-company', icon: <Building2 /> },
  { label: 'Manajemen User', href: '/superadmin/manage-users', icon: <Users2 /> },
  { label: 'Manajemen Badge', href: '/superadmin/manage-badge', icon: <Award /> },
  { label: 'Manajemen Kuis', href: '/superadmin/manage-quiz', icon: <ClipboardList /> },
  { label: 'Profile', href: '/superadmin/profile', icon: <UserCog /> },
];

export default function SuperadminProfilePage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarWrapper menu={superadminMenu} profileHref="/superadmin/profile" />

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

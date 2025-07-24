'use client';

import { useState } from 'react';
import SidebarWrapper from '@/components/dashboard/SidebarWrapper';
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  Settings,
  User,
  Building2,
  Users2,
  Award,
  UserCog,
} from 'lucide-react';

import CompanyActionBar from '@/components/dashboard/superadmin/CompanyActionBar';
import CompanySearchFilter from '@/components/dashboard/superadmin/CompanySearchFilter';
import CompanyTable from '@/components/dashboard/superadmin/CompanyTable';

const superadminMenu = [
  { label: "Dashboard", href: "/dashboard/superadmin", icon: <LayoutDashboard /> },
  { label: "Manajemen Perusahaan", href: "/superadmin/manage-company", icon: <Building2 /> },
  { label: "Manajemen User", href: "/superadmin/manage-users", icon: <Users2 /> },
  { label: "Manajemen Badge", href: "/superadmin/manage-badge", icon: <Award /> },
  { label: "Manajemen Kuis", href: "/superadmin/manage-quiz", icon: <ClipboardList /> },
  { label: "Profile", href: "/superadmin/profile", icon: <UserCog /> },
];

export default function ManageCompanyPage() {
  const [search, setSearch] = useState('');
  const [refresh, setRefresh] = useState(false);
  const [companies, setCompanies] = useState<any[]>([]); // ✅ untuk export

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarWrapper menu={superadminMenu} profileHref="/superadmin/profile" />

      <main className="flex-1 p-6 md:p-10 ml-64 space-y-8">
        {/* Tombol + Tambah & Export */}
        <CompanyActionBar setRefresh={setRefresh} />

        {/* Pencarian */}
        <CompanySearchFilter
          search={search}
          setSearch={setSearch}
          setRefresh={setRefresh}
          companies={companies} // ✅ untuk export
        />

        {/* Tabel Data */}
        <CompanyTable
          search={search}
          refresh={refresh}
          setRefresh={setRefresh}
          onCompaniesUpdate={setCompanies} // ✅ kirim ke parent
        />
      </main>
    </div>
  );
}

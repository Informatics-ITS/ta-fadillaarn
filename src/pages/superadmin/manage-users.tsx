'use client';

import { useState } from 'react';
import SidebarWrapper from '@/components/dashboard/SidebarWrapper';
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  Settings,
  User,
  UserCheck,
  Building2,
  Users2,
  Award,
  UserCog,
} from 'lucide-react';

import UserActionBar from '@/components/dashboard/superadmin/UserActionBar';
import UserSearchFilter from '@/components/dashboard/superadmin/UserSearchFilter';
import UserTable from '@/components/dashboard/superadmin/UserTable';

const superadminMenu = [
  { label: "Dashboard", href: "/dashboard/superadmin", icon: <LayoutDashboard /> },
  { label: "Manajemen Perusahaan", href: "/superadmin/manage-company", icon: <Building2 /> },
  { label: "Manajemen User", href: "/superadmin/manage-users", icon: <Users2 /> },
  { label: "Manajemen Badge", href: "/superadmin/manage-badge", icon: <Award /> },
  { label: "Manajemen Kuis", href: "/superadmin/manage-quiz", icon: <ClipboardList /> },
  { label: "Profile", href: "/superadmin/profile", icon: <UserCog /> },
];

export default function ManageUsersPage() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [refresh, setRefresh] = useState(false);
  const [users, setUsers] = useState<any[]>([]); // ✅ untuk export

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarWrapper menu={superadminMenu} profileHref="/superadmin/profile" />

      <main className="flex-1 p-6 md:p-10 ml-64 space-y-8">
        <UserActionBar setRefresh={setRefresh} />

        <UserSearchFilter
          search={search}
          setSearch={setSearch}
          roleFilter={roleFilter}
          setRoleFilter={setRoleFilter}
          setRefresh={setRefresh}
          users={users} // ✅ untuk export
        />

        <UserTable
          search={search}
          roleFilter={roleFilter}
          refresh={refresh}
          setRefresh={setRefresh}
          onUsersUpdate={setUsers} // ✅ kirim ke parent
        />
      </main>
    </div>
  );
}

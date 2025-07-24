'use client';

import { useEffect, useState } from 'react';
import SidebarWrapper from '@/components/dashboard/SidebarWrapper';
import {
  LayoutDashboard,
  Users,
  Building2,
  Award,
  User,
  Book,
  ClipboardList,
  UserCog,
  Users2,
} from 'lucide-react';

import BadgeActionBar from '@/components/dashboard/superadmin/BadgeActionBar';
import BadgeSearchFilter from '@/components/dashboard/superadmin/BadgeSearchFilter';
import BadgeTable from '@/components/dashboard/superadmin/BadgeTable';
import CreateBadgeModal from '@/components/dashboard/superadmin/CreateBadgeModal';
import axios from '@/lib/axios';
import { toast } from 'sonner';

// Sidebar
const superadminMenu = [
  { label: "Dashboard", href: "/dashboard/superadmin", icon: <LayoutDashboard /> },
  { label: "Manajemen Perusahaan", href: "/superadmin/manage-company", icon: <Building2 /> },
  { label: "Manajemen User", href: "/superadmin/manage-users", icon: <Users2 /> },
  { label: "Manajemen Badge", href: "/superadmin/manage-badge", icon: <Award /> },
  { label: "Manajemen Kuis", href: "/superadmin/manage-quiz", icon: <ClipboardList /> },
  { label: "Profile", href: "/superadmin/profile", icon: <UserCog /> },
];

// Tipe Badge
export type BadgeData = {
  id: string;
  name: string;
  description: string;
  quizCompleted: number;
};

// Mapping icon otomatis
const getBadgeIcon = (name: string): string => {
  const text = name.toLowerCase();

  if (text.includes('evaluasi') && text.includes('master')) return 'clipboardlist';
  if (text.includes('evaluasi')) return 'clipboardlist';
  if (text.includes('guru')) return 'book';
  if (text.includes('master')) return 'shield';
  if (text.includes('ergonomi')) return 'star';
  if (text.includes('materi')) return 'users';
  if (text.includes('kesehatan')) return 'heart';
  if (text.includes('quiz') || text.includes('kuis')) return 'trophy';

  return 'trophy';
};

export default function ManageBadgePage() {
  const [badges, setBadges] = useState<(BadgeData & { icon: string })[]>([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);

  const fetchBadges = async () => {
    try {
      const res = await axios.get('/badges/get-all-badges');
      const rawBadges: BadgeData[] = res.data.data || [];

      console.log('Badge dari API:', rawBadges);

      const mappedBadges = rawBadges.map((badge) => ({
        ...badge,
        icon: getBadgeIcon(badge.name),
      }));

      setBadges(mappedBadges);
    } catch (err) {
      console.error('❌ Gagal mengambil badge:', err);
      toast.error('Gagal memuat daftar badge');
    }
  };

  useEffect(() => {
    fetchBadges();
  }, []); 

  const filteredBadges = badges.filter((badge) =>
    badge.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarWrapper menu={superadminMenu} profileHref="/superadmin/profile" />

      <main className="flex-1 p-6 md:p-10 ml-64 space-y-8">
        <BadgeActionBar onOpen={() => setShowModal(true)} />

        <BadgeSearchFilter
          search={search}
          setSearch={setSearch}
          badges={badges}
          setRefresh={() => fetchBadges()} // opsional kalau SearchFilter butuh refresh
        />

        <BadgeTable
          badges={filteredBadges}
          onRefresh={() => fetchBadges()}
        />

        <CreateBadgeModal
          visible={showModal}
          onClose={() => setShowModal(false)}
          onRefresh={() => fetchBadges()}
          mode="add"
          data={null}
          onSuccess={() => {
            setShowModal(false);
            fetchBadges(); // langsung fetch ulang data
          }}
        />
      </main>
    </div>
  );
}

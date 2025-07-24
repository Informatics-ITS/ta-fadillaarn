'use client';

import { useEffect, useState } from 'react';
import SidebarWrapper from '@/components/dashboard/SidebarWrapper';
import {
  LayoutDashboard,
  Users2,
  ClipboardList,
  UserCog,
  BarChart3,
  Book,
  Building2,
  Download,
  Plus,
} from 'lucide-react';
import axios from '@/lib/axios';
import DivisionTable from '@/components/dashboard/supervisor/DivisionTable';
import DivisionFormModal from '@/components/dashboard/supervisor/DivisionFormModal';
import DivisionConfirmModal from '@/components/dashboard/supervisor/DivisionConfirmModal';
import DivisionFilterBar from '@/components/dashboard/supervisor/DivisionFilterBar';

type Division = {
  id: string;
  name: string;
};

const supervisorMenu = [
  { label: 'Dashboard', href: '/dashboard/supervisor', icon: <LayoutDashboard /> },
  { label: 'Manajemen Divisi', href: '/supervisor/manage-division', icon: <Building2 /> },
  { label: 'Manajemen Karyawan', href: '/supervisor/manage-employees', icon: <Users2 /> },
  { label: 'Manajemen Kuis', href: '/supervisor/manage-quiz', icon: <Book /> },
  { label: 'Report Evaluasi', href: '/supervisor/report-summary', icon: <BarChart3 /> },
  { label: 'Profile', href: '/supervisor/profile', icon: <UserCog /> },
];

export default function ManageDivisionPage() {
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [search, setSearch] = useState('');
  const [refresh, setRefresh] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [selectedDivision, setSelectedDivision] = useState<Division | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Fetch divisions
  useEffect(() => {
    axios
      .get('/division/get-all-division')
      .then((res) => {
        const result = res.data?.data?.divisions;
        if (Array.isArray(result)) {
          setDivisions(result);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch divisions:', err);
        setDivisions([]);
      });
  }, [refresh]);

  const handleAdd = () => {
    setFormMode('add');
    setSelectedDivision(null);
    setShowFormModal(true);
  };

  const handleEdit = (division: Division) => {
    setFormMode('edit');
    setSelectedDivision(division);
    setShowFormModal(true);
  };

  const handleDelete = (division: Division) => {
    setSelectedDivision(division);
    setShowConfirmModal(true);
  };

  const handleDeleteConfirmed = async () => {
    if (!selectedDivision) return;
    try {
      await axios.delete(`/division/${selectedDivision.id}`);
      setRefresh(!refresh);
    } catch (err) {
      console.error('Failed to delete division:', err);
    } finally {
      setShowConfirmModal(false);
    }
  };

  const handleExportCSV = () => {
    const headers = ['No', 'Nama Divisi'];
    const rows = filteredDivisions.map((div, index) => [
      `${index + 1}`,
      div.name || '',
    ]);

    const csvContent =
      [headers, ...rows]
        .map((row) => row.map((item) => `"${item}"`).join(','))
        .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'divisi.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredDivisions = divisions.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarWrapper menu={supervisorMenu} />
      <main className="flex-1 p-6 md:p-10 ml-64 space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Manajemen Divisi</h1>
            <p className="text-sm text-gray-500">Kelola daftar divisi perusahaan</p>
          </div>
          <button
            onClick={handleAdd}
            className="bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-medium px-4 py-2 rounded-md flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Tambah Divisi
          </button>
        </div>

        <DivisionFilterBar
          search={search}
          onSearchChange={setSearch}
          onExport={handleExportCSV}
        />

        {/* Tabel Divisi */}
        <DivisionTable
          divisions={filteredDivisions}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </main>

      {/* Modal Tambah/Edit */}
      <DivisionFormModal
        visible={showFormModal}
        mode={formMode}
        data={selectedDivision}
        onClose={() => setShowFormModal(false)}
        onSuccess={() => {
          setShowFormModal(false);
          setRefresh(!refresh);
        }}
      />

      {/* Modal Konfirmasi Hapus */}
      {showConfirmModal && (
        <DivisionConfirmModal
          divisionName={selectedDivision?.name || ''}
          onClose={() => setShowConfirmModal(false)}
          onConfirm={handleDeleteConfirmed} visible={false}        />
      )}
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import SidebarWrapper from '@/components/dashboard/SidebarWrapper';
import { LayoutDashboard, Users, ClipboardList, Settings, Building2, Users2, BarChart3, UserCog, Book } from 'lucide-react';
import axios from '@/lib/axios';
import EmployeeFilterBar from '@/components/dashboard/supervisor/EmployeeFilterBar';
import EmployeeFormModal from '@/components/dashboard/supervisor/EmployeeFormModal';
import EmployeeTable from '@/components/dashboard/supervisor/EmployeeTable';
import EmployeeConfirmModal from '@/components/dashboard/supervisor/EmployeeConfirmModal';

type Employee = {
  [x: string]: any;
  id: string;
  name: string;
  email: string;
  phone?: string;
  divisionId?: string;
  divisionName?: string;
  companyName?: string;
};

const supervisorMenu = [
  { label: 'Dashboard', href: '/dashboard/supervisor', icon: <LayoutDashboard /> },
  { label: 'Manajemen Divisi', href: '/supervisor/manage-division', icon: <Building2 /> },
  { label: 'Manajemen Karyawan', href: '/supervisor/manage-employees', icon: <Users2 /> },
  { label: 'Manajemen Kuis', href: '/supervisor/manage-quiz', icon: <Book /> },
  { label: 'Report Evaluasi', href: '/supervisor/report-summary', icon: <BarChart3 /> },
  { label: 'Profile', href: '/supervisor/profile', icon: <UserCog /> },
];

export default function ManageEmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [divisionList, setDivisionList] = useState<{ id: string; name: string }[]>([]);
  const [refresh, setRefresh] = useState(false);
  const [query, setQuery] = useState('');
  const [departemen, setDepartemen] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);

  // Ambil data karyawan
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    axios
      .get('/supervisor/get-all-employee', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const result = res.data?.data?.data;
        if (Array.isArray(result)) {
          setEmployees(result);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch employees:', err);
      });
  }, [refresh]);

  // Ambil data divisi
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    axios
      .get('/division/get-all-division', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const result = res.data?.data?.divisions;
        if (Array.isArray(result)) {
          setDivisionList(result);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch divisions:', err);
      });
  }, []);

  const handleAdd = () => {
    setFormMode('add');
    setSelectedEmployee(null);
    setShowForm(true);
  };

  const handleEdit = async (emp: Employee) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const res = await axios.get(`/employee/${emp.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const fullData = res.data?.data;

      const mergedData = {
        ...fullData,
        phone: fullData.phone || emp.phone || '',
      };

      setFormMode('edit');
      setSelectedEmployee(mergedData);
      setShowForm(true);
    } catch (err) {
      console.error('Gagal ambil detail employee:', err);
      alert('Gagal mengambil data lengkap karyawan.');
    }
  };

  const handleDelete = (emp: Employee) => {
    setEmployeeToDelete(emp);
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    if (!employeeToDelete) return;

    try {
      await axios.delete(`/employee/${employeeToDelete.id}`);
      setShowConfirmModal(false);
      setEmployeeToDelete(null);
      setRefresh(!refresh);
    } catch (err) {
      console.error('Gagal menghapus karyawan:', err);
      alert('Gagal menghapus karyawan.');
    }
  };

  const handleSubmit = () => {
    setShowForm(false);
    setRefresh(!refresh);
  };

  const handleExportCSV = () => {
    const headers = ['No', 'Nama', 'Email', 'Telepon', 'Departemen'];

    const rows = filteredEmployees.map((emp, index) => [
      index + 1, // Nomor urut
      emp.name || '',
      emp.email || '',
      emp.phone || '',
      emp.divisionName || '',
    ]);

    const csvContent =
      [headers, ...rows]
        .map((row) => row.map((item) => `"${item}"`).join(','))
        .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'karyawan.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredEmployees = employees.filter((emp) => {
    const matchQuery =
      emp.name?.toLowerCase().includes(query.toLowerCase()) ||
      emp.email?.toLowerCase().includes(query.toLowerCase());
    const matchDept = departemen
      ? emp.divisionName?.toLowerCase() === departemen.toLowerCase()
      : true;
    return matchQuery && matchDept;
  });

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarWrapper menu={supervisorMenu} />
      <main className="flex-1 p-6 md:p-10 ml-64 space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Manajemen Karyawan</h1>
            <p className="text-sm text-gray-500">Kelola data dan akun karyawan</p>
          </div>
          <button
            onClick={handleAdd}
            className="bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-medium px-4 py-2 rounded-md flex items-center gap-2"
          >
            <Users className="w-4 h-4" />
            Tambah Karyawan
          </button>
        </div>

        <EmployeeFilterBar
          onExport={handleExportCSV}
          onSearch={setQuery}
          onFilterDepartemen={setDepartemen}
          divisions={divisionList}
        />

        <EmployeeTable
          employees={filteredEmployees}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </main>

      <EmployeeFormModal
        visible={showForm}
        mode={formMode}
        data={selectedEmployee}
        onClose={() => setShowForm(false)}
        onSubmit={handleSubmit}
      />

      {showConfirmModal && employeeToDelete && (
        <EmployeeConfirmModal
          name={employeeToDelete.name}
          onCancel={() => {
            setShowConfirmModal(false);
            setEmployeeToDelete(null);
          }}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
}

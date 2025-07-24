'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from '@/lib/axios';
import SidebarWrapper from '@/components/dashboard/SidebarWrapper';
import StatCard from '@/components/dashboard/supervisor/StatCard';
import EvaluationTable from '@/components/dashboard/supervisor/EvaluationTable';
import SummaryBoxGroup from '@/components/dashboard/supervisor/SummaryBoxGroup';
import DivisionChart from '@/components/dashboard/supervisor/DivisionChart';
import {
  LayoutDashboard,
  Building2,
  Users2,
  Book,
  BarChart3,
  UserCog,
  User,
  CheckCircle,
  Clock,
  Flame,
  Users,
} from 'lucide-react';

const supervisorMenu = [
  { label: 'Dashboard', href: '/dashboard/supervisor', icon: <LayoutDashboard /> },
  { label: 'Manajemen Divisi', href: '/supervisor/manage-division', icon: <Building2 /> },
  { label: 'Manajemen Karyawan', href: '/supervisor/manage-employees', icon: <Users2 /> },
  { label: 'Manajemen Kuis', href: '/supervisor/manage-quiz', icon: <Book /> },
  { label: 'Report Evaluasi', href: '/supervisor/report-summary', icon: <BarChart3 /> },
  { label: 'Profile', href: '/supervisor/profile', icon: <UserCog /> },
];

export default function SupervisorDashboardPage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [employees, setEmployees] = useState<any[]>([]);
  const [divisions, setDivisions] = useState<any[]>([]);
  const [quizzes, setQuizzes] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [empRes, divRes, quizRes] = await Promise.all([
          axios.get('/supervisor/get-all-employee'),
          axios.get('/division/get-all-division'),
          axios.get('/quiz/get-quiz'),
        ]);

        setEmployees(empRes.data?.data?.data || []);
        const divisionData = divRes.data?.data;
        console.log('✅ Division Data:', divisionData);
        setDivisions(Array.isArray(divisionData) ? divisionData : []);
        setQuizzes(quizRes.data?.data || []);
      } catch (err) {
        console.error('❌ Gagal memuat data dashboard:', err);
        setEmployees([]);
        setDivisions([]);
        setQuizzes([]);
      }
    };
    fetchData();
  }, []);

  const totalEmployees = employees.length;
  const evaluatedEmployees = employees.filter((e) => e.evaluation).length;
  const highRisk = employees.filter((e) => e.evaluation?.risk === 'High').length;
  const pending = totalEmployees - evaluatedEmployees;
  const percentage = totalEmployees > 0 ? ((evaluatedEmployees / totalEmployees) * 100).toFixed(1) : '0.0';

  const divisionSummary = Array.isArray(divisions)
    ? divisions
        .map((div) => {
          const employeeCount = employees.filter((e) => e.division === div.name).length;
          return { name: div.name || 'Tidak diketahui', total: employeeCount };
        })
        .filter((d) => d.total > 0)
    : [];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarWrapper menu={supervisorMenu} />
      <main className="flex-1 ml-64 p-6 md:p-10 space-y-10">
        {/* Header */}
        <div className="flex justify-between items-start md:items-center flex-col md:flex-row">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Dashboard Supervisor</h1>
            <p className="text-sm text-slate-500">Pantau dan kelola postur kerja tim Anda</p>
          </div>
          <div className="flex gap-4 mt-4 md:mt-0">
            <input
              type="text"
              placeholder="Cari karyawan..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && query.trim()) {
                  router.push(`/supervisor/manage-employees?search=${encodeURIComponent(query.trim())}`);
                }
              }}
              className="px-3 py-2 border rounded-md text-sm w-56 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
            <button onClick={() => router.push('/supervisor/profile')}>
              <User className="w-6 h-6 text-slate-500 hover:text-sky-600" />
            </button>
          </div>
        </div>

        {/* Statistik */}
        {employees.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Total Karyawan" value={totalEmployees.toString()} icon={<Users className="w-5 h-5 text-sky-600" />} />
            <StatCard title="Evaluasi Selesai" value={evaluatedEmployees.toString()} subtext={`${percentage}% dari ${totalEmployees}`} icon={<CheckCircle className="w-5 h-5 text-teal-600" />} />
            <StatCard title="Menunggu Evaluasi" value={pending.toString()} highlight="Perlu Perhatian" color="orange" icon={<Clock className="w-5 h-5 text-orange-500" />} />
            <StatCard title="Risiko Tinggi" value={highRisk.toString()} highlight="Prioritas" color="red" icon={<Flame className="w-5 h-5 text-red-500" />} />
          </div>
        )}

        {/* Ringkasan Divisi & Kuis */}
        {(divisions.length > 0 || quizzes.length > 0) && (
          <SummaryBoxGroup totalDivisions={divisions.length} totalQuizzes={quizzes.length} />
        )}

        {/* Tabel Evaluasi */}
        {employees.length > 0 && <EvaluationTable employees={employees} />}

        {/* Chart Distribusi */}
        {divisionSummary.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-700">Distribusi Karyawan per Divisi</h3>
            <DivisionChart data={divisionSummary} />
          </div>
        )}
      </main>
    </div>
  );
}

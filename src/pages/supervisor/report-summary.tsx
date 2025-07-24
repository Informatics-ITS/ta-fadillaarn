'use client';

import { useState, useEffect } from 'react';
import SidebarWrapper from '@/components/dashboard/SidebarWrapper';
import ReportCard from '@/components/dashboard/supervisor/ReportCard';
import axios from '@/lib/axios';
import { LayoutDashboard, Building2, Users2, Book, BarChart3, UserCog } from 'lucide-react';

type Report = {
  id: string;
  name: string;
  email: string;
  department: string;
  score: number;
  risk: string;
  date: string;
};

const supervisorMenu = [
  { label: 'Dashboard', href: '/dashboard/supervisor', icon: <LayoutDashboard /> },
  { label: 'Manajemen Divisi', href: '/supervisor/manage-division', icon: <Building2 /> },
  { label: 'Manajemen Karyawan', href: '/supervisor/manage-employees', icon: <Users2 /> },
  { label: 'Manajemen Kuis', href: '/supervisor/manage-quiz', icon: <Book /> },
  { label: 'Report Evaluasi', href: '/supervisor/report-summary', icon: <BarChart3 /> },
  { label: 'Profile', href: '/supervisor/profile', icon: <UserCog /> },
];

const endpoints = [
  '/ergonomic/all-employee-history',
  '/ergonomic-movenet/all-employee-history',
  '/ergonomic-video/all-employee-history',
  '/ergonomic-video-movenet/all-employee-history',
];

export default function ReportSummaryCardPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllReports = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token tidak ditemukan.');
        setLoading(false);
        return;
      }

      try {
        const responses = await Promise.all(
          endpoints.map((endpoint) =>
            axios.get(endpoint, { headers: { Authorization: `Bearer ${token}` } }).catch((err) => {
              console.warn(`Gagal fetch ${endpoint}:`, err);
              return null;
            })
          )
        );

        const allReports: Report[] = responses.flatMap((res, index) => {
          if (!res) return [];

          const rawData =
            (Array.isArray(res.data?.data?.july) && res.data.data.july) ||
            (Array.isArray(res.data?.data) && res.data.data) ||
            (Array.isArray(res.data?.result) && res.data.result) ||
            (Array.isArray(res.data) ? res.data : []);

          return rawData.map((item: any) => ({
            id: item.id || item.evaluation_id || `${endpoints[index]}-unknown`,
            name: item.employeeName || item.employee_name || '-',
            email: item.email || item.employeeEmail || '-',
            department: item.divisionName || item.division_name || '-',
            score: Number(item.score ?? item.avg_reba_score ?? 0),
            risk: item.riskLevel || item.avg_risk_level || 'Unknown',
            date: new Date(item.evaluationDate || item.createdAt || Date.now()).toLocaleDateString('id-ID', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            }),
          }));
        });

        setReports(allReports);
      } catch (error) {
        console.error('Error fetch semua laporan:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllReports();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarWrapper menu={supervisorMenu} />
      <main className="flex-1 ml-64 p-8 space-y-8">
        <header>
          <h1 className="text-2xl font-bold text-slate-800">Report Evaluasi Postur</h1>
          <p className="text-slate-500 text-sm">Total Evaluasi: {reports.length}</p>
        </header>

        {loading ? (
          <p className="text-slate-600">Memuat data...</p>
        ) : reports.length === 0 ? (
          <p className="text-slate-600">Belum ada data evaluasi.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {reports.map((report) => (
              <ReportCard key={report.id} {...report} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

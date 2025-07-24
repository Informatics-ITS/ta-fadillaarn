'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import SidebarWrapper from '@/components/dashboard/SidebarWrapper';
import {
  LayoutDashboard,
  Users2,
  ClipboardList,
  BarChart3,
  UserCog,
  Book,
  ArrowLeft,
  Download,
  Search,
  Building2,
} from 'lucide-react';
import axios from '@/lib/axios';
import QuizResultTable from '@/components/dashboard/supervisor/QuizResultTable';
import router from 'next/router';

const supervisorMenu = [
  { label: 'Dashboard', href: '/dashboard/supervisor', icon: <LayoutDashboard /> },
  { label: 'Manajemen Divisi', href: '/supervisor/manage-division', icon: <Building2 /> },
  { label: 'Manajemen Karyawan', href: '/supervisor/manage-employees', icon: <Users2 /> },
  { label: 'Manajemen Kuis', href: '/supervisor/manage-quiz', icon: <Book /> },
  { label: 'Report Evaluasi', href: '/supervisor/report-summary', icon: <BarChart3 /> },
  { label: 'Profile', href: '/supervisor/profile', icon: <UserCog /> },
];

export default function QuizResultPage() {
  const params = useParams();
  const id = params?.id as string;
  const [quizHistory, setQuizHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || !id) return;

    axios
      .get(`/quiz-attempt/detail-history/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setQuizHistory(res.data?.data || []);
      })
      .catch((err) => {
        console.error('Gagal memuat hasil kuis:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handleExport = () => {
    if (!quizHistory.length) return alert('Tidak ada data untuk diekspor.');
    const headers = ['Nama', 'Email', 'Skor', 'Tanggal'];
    const rows = quizHistory.map((r: any) => [r.name, r.email, r.score, r.date]);
    const csv =
      'data:text/csv;charset=utf-8,' +
      [headers, ...rows].map((row) => row.map((x) => `"${x}"`).join(',')).join('\n');
    const encoded = encodeURI(csv);
    const link = document.createElement('a');
    link.setAttribute('href', encoded);
    link.setAttribute('download', `quiz_result_${id}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const filteredResults = quizHistory.filter((entry: any) =>
    entry.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarWrapper menu={supervisorMenu} />

      <main className="flex-1 ml-64 px-6 pt-8 pb-16 space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-slate-800">Hasil Kuis Karyawan</h1>
          <p className="text-sm text-slate-500">
            Berikut adalah daftar hasil kuis yang telah dikerjakan oleh karyawan
          </p>
          <div className="inline-block bg-gray-100 border border-gray-300 text-sm font-medium text-gray-700 px-3 py-1 rounded mt-2">
            ID Kuis: <span className="font-semibold">{id}</span>
          </div>
        </div>

        <div className="flex flex-wrap justify-between items-center gap-4">
          <button
            onClick={() => router.push('/supervisor/manage-quiz')}
            className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded text-sm shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Daftar Kuis
          </button>

          <div className="flex gap-3 items-center">
            <div className="relative">
              <input
                type="text"
                className="pl-10 pr-4 py-2 text-sm border rounded-md"
                placeholder="Cari nama karyawan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            </div>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 text-sm text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
            >
              <Download className="w-4 h-4" /> Export CSV
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl border shadow px-6 py-6">
          <QuizResultTable quizHistory={filteredResults} loading={loading} />
        </div>
      </main>
    </div>
  );
}
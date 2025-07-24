"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import SidebarWrapper from "@/components/dashboard/SidebarWrapper";
import { LayoutDashboard, Users2, ClipboardList, UserCog, BarChart3, Book, Building2, Award, ArrowLeft, Search, Download } from "lucide-react";
import axios from "@/lib/axios";
import QuizResultTable from '@/components/dashboard/superadmin/QuizResultTable';
import router from 'next/router';

const superadminMenu = [
  { label: "Dashboard", href: "/dashboard/superadmin", icon: <LayoutDashboard /> },
  { label: "Manajemen Perusahaan", href: "/superadmin/manage-company", icon: <Building2 /> },
  { label: "Manajemen User", href: "/superadmin/manage-users", icon: <Users2 /> },
  { label: "Manajemen Badge", href: "/superadmin/manage-badge", icon: <Award /> },
  { label: "Manajemen Kuis", href: "/superadmin/manage-quiz", icon: <ClipboardList /> },
  { label: "Profile", href: "/superadmin/profile", icon: <UserCog /> },
];

interface QuizResult {
  id: string;
  user_name: string;
  score: number;
  category: string;
  completed_at: string;
}

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
      <SidebarWrapper menu={superadminMenu} />
      <main className="flex-1 ml-64 px-6 pt-10 pb-20 space-y-8 bg-gray-50">
        <div className="max-w-7xl mx-auto space-y-3">
          <h1 className="text-2xl font-bold text-slate-800">Hasil Kuis Karyawan</h1>
          <p className="text-sm text-slate-500">Berikut adalah daftar hasil kuis yang telah dikerjakan oleh karyawan.</p>
          <div className="inline-block bg-slate-100 border border-slate-300 text-sm font-medium text-slate-600 px-3 py-1 rounded">
            ID Kuis: <span className="font-semibold text-slate-800">{id}</span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-4">
          <button
            onClick={() => router.push('/superadmin/manage-quiz')}
            className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg text-sm shadow"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Daftar Kuis
          </button>

          <div className="flex gap-3 items-center">
            <div className="relative">
              <input
                type="text"
                className="pl-10 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                placeholder="Cari nama karyawan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            </div>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 text-sm text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg"
            >
              <Download className="w-4 h-4" /> Export CSV
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto bg-white rounded-2xl border shadow-sm px-8 py-6">
          <QuizResultTable quizHistory={filteredResults} loading={loading} />
        </div>
      </main>
    </div>
  );
}

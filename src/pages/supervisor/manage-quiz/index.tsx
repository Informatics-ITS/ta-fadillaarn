'use client';

import { SetStateAction, useEffect, useState } from 'react';
import SidebarWrapper from '@/components/dashboard/SidebarWrapper';
import {
  LayoutDashboard, Users2, ClipboardList, UserCog, BarChart3, Book, Building2,
} from 'lucide-react';
import axios from '@/lib/axios';
import QuizFilterBar from '@/components/dashboard/supervisor/QuizFilterBar';
import QuizTable from '@/components/dashboard/supervisor/QuizTable';
import CreateQuizModal from '@/components/dashboard/supervisor/CreateQuizModal';
import EditQuizModal, { QuizForm } from '@/components/dashboard/supervisor/EditQuizModal';
import QuizDetail from '@/components/dashboard/supervisor/QuizDetail';
import { useRouter } from 'next/navigation';

const supervisorMenu = [
  { label: 'Dashboard', href: '/dashboard/supervisor', icon: <LayoutDashboard /> },
  { label: 'Manajemen Divisi', href: '/supervisor/manage-division', icon: <Building2 /> },
  { label: 'Manajemen Karyawan', href: '/supervisor/manage-employees', icon: <Users2 /> },
  { label: 'Manajemen Kuis', href: '/supervisor/manage-quiz', icon: <Book /> },
  { label: 'Report Evaluasi', href: '/supervisor/report-summary', icon: <BarChart3 /> },
  { label: 'Profile', href: '/supervisor/profile', icon: <UserCog /> },
];

export default function ManageQuizPage() {
  const [quizzes, setQuizzes] = useState<QuizForm[]>([]);
  const [filtered, setFiltered] = useState<QuizForm[]>([]);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<QuizForm | null>(null);
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const router = useRouter();

  const fetchQuizzes = () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    axios
      .get('/quiz/get-quiz', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        const result = res.data?.data || [];
        const formatted: QuizForm[] = result.map((q: any) => ({
          id: q.id,
          title: q.title,
          category: q.category,
          deadline: q.deadline || '',
          duration: `${q.duration_minutes} menit`,
          duration_minutes: q.duration_minutes,
          totalQuestions: q.totalQuestions || 0,
          status: q.status,
          description: q.description || '',
          progress: q.progress || [0, 0],
        }));
        setQuizzes(formatted);
      })
      .catch((err) => {
        console.error('Gagal mengambil data kuis:', err);
      });
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  useEffect(() => {
    const filteredData = quizzes
      .filter((q) =>
        q.title?.toLowerCase().includes(search.toLowerCase())
      )
    setFiltered(filteredData);
  }, [search, quizzes]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarWrapper menu={supervisorMenu} />

      <main className="flex-1 p-6 md:p-10 ml-64 space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Manajemen Kuis</h1>
            <p className="text-sm text-gray-500">Kelola daftar kuis dan bank soal</p>
          </div>
          <button
            onClick={() => router.push('/supervisor/manage-quiz/create')}
            className="bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-medium px-4 py-2 rounded-md flex items-center gap-2"
          >
            + Buat Kuis
          </button>
        </div>

        <QuizFilterBar
          search={search}
          setSearch={setSearch}
        />

        <QuizTable
          quizzes={filtered}
          onEdit={(quiz) => {
            setSelectedQuiz(quiz);
            setShowEditModal(true);
          }}
          onResult={(quiz) => router.push(`/supervisor/manage-quiz/quiz-result/${quiz.id}`)}
        />
      </main>

      {showEditModal && selectedQuiz && (
        <EditQuizModal
          visible={showEditModal}
          quiz={selectedQuiz}
          onClose={() => {
            setShowEditModal(false);
            setSelectedQuiz(null);
          }}
          onSubmit={(updatedQuiz) => {
            setQuizzes((prev) =>
              prev.map((q) => (q.id === updatedQuiz.id ? updatedQuiz : q))
            );
            setShowEditModal(false);
          }}
        />
      )}

      {selectedQuizId && (
        <QuizDetail
          quizId={selectedQuizId}
          onClose={() => setSelectedQuizId(null)}
        />
      )}
    </div>
  );
}

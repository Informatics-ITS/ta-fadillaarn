"use client";

import { useEffect, useState } from 'react';
import SidebarWrapper from '@/components/dashboard/SidebarWrapper';
import { LayoutDashboard, Users2, ClipboardList, UserCog, BarChart3, Book, Building2, Award } from 'lucide-react';
import axios from '@/lib/axios';
import QuizFilterBar from '@/components/dashboard/superadmin/QuizFilterBar';
import QuizTable from '@/components/dashboard/superadmin/QuizTable';
import CreateQuizModal from '@/components/dashboard/superadmin/CreateQuizModal';
import EditQuizModal, { QuizForm } from '@/components/dashboard/superadmin/EditQuizModal';
import { useRouter } from 'next/navigation';

const superadminMenu = [
  { label: 'Dashboard', href: '/dashboard/superadmin', icon: <LayoutDashboard /> },
  { label: 'Manajemen Perusahaan', href: '/superadmin/manage-company', icon: <Building2 /> },
  { label: 'Manajemen User', href: '/superadmin/manage-users', icon: <Users2 /> },
  { label: 'Manajemen Badge', href: '/superadmin/manage-badge', icon: <Award /> },
  { label: 'Manajemen Kuis', href: '/superadmin/manage-quiz', icon: <ClipboardList /> },
  { label: 'Profile', href: '/superadmin/profile', icon: <UserCog /> },
];

export default function ManageQuizPage() {
  const [quizzes, setQuizzes] = useState<QuizForm[]>([]);
  const [filtered, setFiltered] = useState<QuizForm[]>([]);
  const [search, setSearch] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<QuizForm | null>(null);
  const router = useRouter();

  const fetchQuizzes = async () => {
    try {
      const personalRes = await axios.get('/quiz/get-personal-quiz'); // endpoint baru untuk superadmin

        const allQuizzes = personalRes.data.data.map((q: any) => ({
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

      setQuizzes(allQuizzes);
    } catch (error) {
      console.error('Gagal mengambil data kuis:', error);
    }
  };

  useEffect(() => { fetchQuizzes(); }, []);

  useEffect(() => {
    const filteredData = quizzes.filter((q) => q.title.toLowerCase().includes(search.toLowerCase()));
    setFiltered(filteredData);
  }, [search, quizzes]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarWrapper menu={superadminMenu} profileHref="/superadmin/profile" />

      <main className="flex-1 p-6 md:p-10 ml-64 space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Manajemen Kuis</h1>
            <p className="text-sm text-gray-500">Kelola daftar kuis public</p>
          </div>
          <button
            onClick={() => router.push('/superadmin/manage-quiz/create')}
            className="px-5 py-2 text-sm font-semibold rounded-lg bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow hover:from-cyan-600 hover:to-teal-600 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
          >
            + Buat Kuis
          </button>
        </div>

        <QuizFilterBar search={search} setSearch={setSearch} />

        <QuizTable
          quizzes={filtered}
          onEdit={(quiz: QuizForm) => {
            setSelectedQuiz(quiz);
            setShowEditModal(true);
          }}
          onResult={(quiz: QuizForm) => router.push(`/superadmin/manage-quiz/quiz-result/${quiz.id}`)}
        />
      </main>

      {showCreateModal && (
        <CreateQuizModal
          visible={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSuccess={fetchQuizzes}
        />
      )}

      {showEditModal && selectedQuiz && (
        <EditQuizModal
          visible={showEditModal}
          quiz={selectedQuiz}
          onClose={() => {
            setShowEditModal(false);
            setSelectedQuiz(null);
          }}
          onSubmit={() => {
            fetchQuizzes();
            setShowEditModal(false);
          }}
        />
      )}
    </div>
  );
}

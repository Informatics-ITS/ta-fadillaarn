'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SidebarWrapper from '@/components/dashboard/SidebarWrapper';
import {
  LayoutDashboard,
  Building2,
  Users2,
  Book,
  BarChart3,
  UserCog,
  ChevronRight,
  CheckCircle,
  ClipboardList,
  Award,
} from 'lucide-react';
import StepCreateQuiz from '@/components/dashboard/superadmin/StepCreateQuiz';
import StepAddQuestion from '@/components/dashboard/superadmin/StepAddQuestion';
import StepAddOptions from '@/components/dashboard/superadmin/StepAddOptions';
import clsx from 'clsx';

const superadminMenu = [
  { label: 'Dashboard', href: '/dashboard/superadmin', icon: <LayoutDashboard /> },
  { label: 'Manajemen Perusahaan', href: '/superadmin/manage-company', icon: <Building2 /> },
  { label: 'Manajemen User', href: '/superadmin/manage-users', icon: <Users2 /> },
  { label: 'Manajemen Badge', href: '/superadmin/manage-badge', icon: <Award /> },
  { label: 'Manajemen Kuis', href: '/superadmin/manage-quiz', icon: <ClipboardList /> },
  { label: 'Profile', href: '/superadmin/profile', icon: <UserCog /> },
];

export default function CreateQuizPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [quizId, setQuizId] = useState<string | null>(null);
  const [questionId, setQuestionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const steps = [
    { title: 'Buat Info Kuis', step: 1 },
    { title: 'Tambah Pertanyaan', step: 2 },
    { title: 'Tambah Opsi Jawaban', step: 3 },
  ];

  const currentTitle = steps.find((s) => s.step === step)?.title;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarWrapper menu={superadminMenu} profileHref="/superadmin/profile" />

      <main className="flex-1 ml-64 px-10 pt-10 pb-16">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-sky-700">{currentTitle}</h1>
          <p className="text-gray-500 text-sm mt-1">
            {step === 1 && 'Lengkapi informasi dasar kuis terlebih dahulu.'}
            {step === 2 && 'Tambahkan pertanyaan untuk kuis ini.'}
            {step === 3 && 'Masukkan opsi jawaban dari pertanyaan yang dibuat.'}
          </p>
        </div>

        {/* Stepper */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-4 text-sm">
            {steps.map((s, i) => (
              <div key={s.step} className="flex items-center gap-2">
                <div
                  className={clsx(
                    'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold',
                    step === s.step
                      ? 'bg-sky-600 text-white'
                      : step > s.step
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-300 text-gray-700'
                  )}
                >
                  {step > s.step ? <CheckCircle className="w-4 h-4" /> : s.step}
                </div>
                <span className={clsx('text-sm', step >= s.step ? 'text-sky-700 font-medium' : 'text-gray-400')}>
                  {s.title}
                </span>
                {i < steps.length - 1 && <ChevronRight className="w-4 h-4 text-gray-400" />}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white shadow-lg rounded-xl p-6">
          {step === 1 && (
            <StepCreateQuiz
              loading={loading}
              onCreate={(id) => {
                setQuizId(id);
                setStep(2);
              }}
              onLoading={setLoading}
            />
          )}
          {step === 2 && (
            <StepAddQuestion
              quizId={quizId}
              loading={loading}
              onAddQuestion={(id) => {
                setQuestionId(id);
                setStep(3);
              }}
              onBack={() => setStep(1)}
              onLoading={setLoading}
            />
          )}
          {step === 3 && (
            <StepAddOptions
              questionId={questionId}
              loading={loading}
              onAddAnotherQuestion={() => setStep(2)}
              onFinish={() => router.push('/superadmin/manage-quiz')}
              onBack={() => setStep(2)}
              onLoading={setLoading}
            />
          )}
        </div>
      </main>
    </div>
  );
}

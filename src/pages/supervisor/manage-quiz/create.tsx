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
} from 'lucide-react';
import StepCreateQuiz from '@/components/dashboard/supervisor/StepCreateQuiz';
import StepAddQuestion from '@/components/dashboard/supervisor/StepAddQuestion';
import StepAddOptions from '@/components/dashboard/supervisor/StepAddOptions';
import clsx from 'clsx';

const supervisorMenu = [
  { label: 'Dashboard', href: '/dashboard/supervisor', icon: <LayoutDashboard /> },
  { label: 'Manajemen Divisi', href: '/supervisor/manage-division', icon: <Building2 /> },
  { label: 'Manajemen Karyawan', href: '/supervisor/manage-employees', icon: <Users2 /> },
  { label: 'Manajemen Kuis', href: '/supervisor/manage-quiz', icon: <Book /> },
  { label: 'Report Evaluasi', href: '/supervisor/report-summary', icon: <BarChart3 /> },
  { label: 'Profile', href: '/supervisor/profile', icon: <UserCog /> },
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
      <SidebarWrapper menu={supervisorMenu} />
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

        {/* Stepper Centered */}
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

        {/* Card Wrapper */}
        <div className="bg-white shadow-lg rounded-xl p-6">
          {step === 1 && (
            <StepCreateQuiz
              loading={loading}
              onCreate={async (id) => {
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
              onAddQuestion={async (id) => {
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
              onFinish={() => router.push('/supervisor/manage-quiz')}
              onBack={() => setStep(2)}
              onLoading={setLoading}
            />
          )}
        </div>
      </main>
    </div>
  );
}

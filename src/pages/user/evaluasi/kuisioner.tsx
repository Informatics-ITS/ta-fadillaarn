'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SidebarWrapper from '@/components/dashboard/SidebarWrapper';
import QuestionnaireHeader from '@/components/evaluasi/QuestionnaireHeader';
import QuestionCard from '@/components/evaluasi/QuestionCard';
import QuestionnaireNavigation from '@/components/evaluasi/QuestionnaireNavigation';
import {
  LayoutDashboard,
  ClipboardList,
  FileText,
  Camera,
  Award,
  User,
} from 'lucide-react';

const userMenu = [
  { label: 'Dashboard', href: '/dashboard/user', icon: <LayoutDashboard /> },
  { label: 'Evaluasi Postur', href: '/evaluasi', icon: <Camera /> },
  { label: 'Progress Postur', href: '/user/progress', icon: <ClipboardList /> },
  { label: 'Kuis Ergonomi', href: '/user/kuis', icon: <FileText /> },
  { label: 'Penghargaan', href: '/user/badge', icon: <Award /> },
  { label: 'Profil', href: '/user/profile', icon: <User /> },
];
const questions = [
  {
    question: 'Apakah Anda sering duduk lebih dari 2 jam tanpa berdiri?',
    options: ['Ya', 'Tidak'],
  },
  {
    question: 'Apakah Anda menggunakan kursi dengan penopang punggung?',
    options: ['Ya', 'Tidak'],
  },
  {
    question: 'Apakah tinggi monitor sejajar dengan pandangan mata?',
    options: ['Ya', 'Tidak'],
  },
  {
    question: 'Apakah posisi kaki Anda menapak sempurna di lantai?',
    options: ['Ya', 'Tidak'],
  },
  {
    question: 'Seberapa sering Anda melakukan peregangan saat kerja?',
    options: ['Setiap 30 menit', 'Setiap jam', 'Jarang', 'Tidak Pernah'],
  },
];

export default function QuestionnairePage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);

  const handleSelect = (answer: string) => {
    const newAnswers = [...answers];
    newAnswers[step] = answer;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      router.push('/evaluasi/hasil');
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarWrapper menu={userMenu} profileHref="/user/profile" />
      <main className="flex-1 ml-64 px-8 py-10 bg-white flex flex-col items-center">
        <div className="w-full max-w-2xl space-y-6">
          <QuestionnaireHeader step={step} total={questions.length} />
          <QuestionCard
            question={questions[step].question}
            options={questions[step].options}
            selected={answers[step]}
            onSelect={handleSelect}
          />
          <QuestionnaireNavigation
            step={step}
            total={questions.length}
            canNext={!!answers[step]}
            onBack={handleBack}
            onNext={handleNext}
          />
        </div>
      </main>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import SidebarWrapper from '@/components/dashboard/SidebarWrapper';
import {
  LayoutDashboard,
  Camera,
  ClipboardList,
  FileText,
  Award,
  User,
  ArrowLeft,
  ArrowRight,
  UserCog,
} from 'lucide-react';
import axios from '@/lib/axios';

const userMenu = [
  { label: 'Dashboard', href: '/dashboard/user', icon: <LayoutDashboard /> },
  { label: 'Evaluasi Postur', href: '/user/evaluasi', icon: <Camera /> },
  { label: 'Progress Postur', href: '/user/progress', icon: <ClipboardList /> },
  { label: 'Kuis Ergonomi', href: '/user/quiz/kuis', icon: <FileText /> },
  { label: 'Penghargaan', href: '/user/badge', icon: <Award /> },
  { label: 'Profil', href: '/user/profile', icon: <UserCog /> },
];

export default function QuizStartPage() {
  const router = useRouter();
  const { id: quizId } = router.query;

  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [attemptId, setAttemptId] = useState<string | null>(null);

  useEffect(() => {
    if (!quizId || typeof quizId !== 'string') return;

    const fetchData = async () => {
      try {
        const resStart = await axios.post(`/quiz-attempt/start/${quizId}`);
        const attemptIdFromAPI = resStart.data?.data?.id;
        setAttemptId(attemptIdFromAPI);

        const resQuestions = await axios.get(`/question/${quizId}`);
        setQuestions(resQuestions.data?.data || []);
      } catch (err) {
        console.error('Gagal memulai atau memuat kuis:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [quizId]);

  const handleSelect = (questionId: string, optionId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const next = async () => {
    const current = questions[step];
    const selectedOptionId = answers[current.id];

    if (!selectedOptionId || !attemptId) return;

    try {
      await axios.post(`/quiz-attempt/submit/${attemptId}`, {
        questionId: current.id,
        optionId: selectedOptionId,
      });

      if (step < questions.length - 1) {
        setStep(step + 1);
      } else {
        router.push(`/user/quiz/quiz-result/${attemptId}`);
      }
    } catch (err) {
      console.error('Gagal submit kuis:', err);
      alert('Gagal menyimpan jawaban. Coba lagi.');
    }
  };

  const prev = () => {
    if (step > 0) setStep(step - 1);
  };

  if (loading || !quizId) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Memuat pertanyaan...
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Tidak ada pertanyaan tersedia.
      </div>
    );
  }

  const current = questions[step];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarWrapper menu={userMenu} profileHref="/dashboard/user/profile" />
      <main className="flex-1 ml-64 px-8 py-12 flex flex-col items-center bg-white">
        <div className="w-full max-w-4xl space-y-10">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-slate-800">Kuis Ergonomi</h1>
            <p className="text-sm text-slate-500">
              Pertanyaan {step + 1} dari {questions.length}
            </p>
            <div className="w-full h-2 bg-slate-200 rounded-full mt-2">
              <div
                className="h-full bg-cyan-500 rounded-full transition-all"
                style={{ width: `${((step + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Pertanyaan */}
          <div className="bg-slate-50 border rounded-xl p-8 shadow space-y-6">
            <h2 className="text-lg font-semibold text-slate-800">{current.question}</h2>
            <div className="space-y-3">
              {current.options.map((opt: any, idx: number) => (
                <button
                  key={opt.id}
                  onClick={() => handleSelect(current.id, opt.id)}
                  className={`w-full text-left px-5 py-3 rounded-md border text-sm font-medium transition ${
                    answers[current.id] === opt.id
                      ? 'bg-cyan-600 text-white border-cyan-600'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  {String.fromCharCode(97 + idx)}. {opt.text}
                </button>
              ))}
            </div>
          </div>

          {/* Navigasi */}
          <div className="flex justify-between pt-4">
            <button
              onClick={prev}
              disabled={step === 0}
              className="flex items-center gap-2 text-sm px-4 py-2 rounded-md border border-slate-300 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4" />
              Sebelumnya
            </button>

            <button
              onClick={next}
              disabled={!answers[current.id]}
              className={`flex items-center gap-2 text-sm px-6 py-2 rounded-md font-medium transition ${
                answers[current.id]
                  ? 'bg-gradient-to-r from-sky-500 to-teal-500 text-white hover:brightness-110'
                  : 'bg-slate-300 text-white cursor-not-allowed'
              }`}
            >
              {step === questions.length - 1 ? 'Selesai' : 'Lanjutkan'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

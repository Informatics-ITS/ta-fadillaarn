'use client';

import Layout from '@/components/layout/Layout';
import { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import { useRouter } from 'next/navigation';
import { HelpCircle } from 'lucide-react';

type Question = {
  id: string;
  question: string;
  options: string[];
};

export default function QuizPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [attemptId, setAttemptId] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

 useEffect(() => {
    const fetchQuiz = async () => {
        const token = localStorage.getItem('token');
        const quizId = 'fd815893-627f-4613-96b5-0867d67c2429';

        try {
        const res = await axios.post(
            `/quiz-attempt/start/${quizId}`,
            null,
            {
            headers: { Authorization: `Bearer ${token}` },
            }
        );
        console.log('REQUESTING QUIZ START:', `/quiz-attempt/start/${quizId}`); 

        const data = res.data?.data;
        const questions = data?.questions || [];

        // Debugging: lihat isi pertanyaan
        console.log('Quiz Questions:', questions);

        setQuestions(questions);
        setAttemptId(data?.attemptId || '');
        } catch (err) {
        console.error('Gagal memulai kuis:', err);
        } finally {
        setLoading(false);
        }
    };

    fetchQuiz();
    }, []);


  const handleAnswer = (answer: string) => {
    const updated = [...answers];
    updated[currentIndex] = answer;
    setAnswers(updated);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      submitQuiz(updated);
    }
  };

  const submitQuiz = async (userAnswers: string[]) => {
    const token = localStorage.getItem('token');

    try {
      await axios.post(
        `/quiz-attempt/submit/${attemptId}`,
        { answers: userAnswers },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      router.push('/dashboard/quiz/result');
    } catch (err) {
      console.error('Gagal submit kuis:', err);
    }
  };

  if (loading) return <Layout><div className="p-10">Memuat soal...</div></Layout>;
  if (questions.length === 0) return <Layout><div className="p-10">Tidak ada soal.</div></Layout>;

  const currentQuestion = questions[currentIndex];

  return (
    <Layout>
      <div className="min-h-screen p-6 md:p-10 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6 flex items-center gap-2 text-cyan-700">
            <HelpCircle className="w-5 h-5" />
            <h1 className="text-xl font-bold">Kuis Ergonomi</h1>
          </div>

          <div className="border p-6 rounded-xl shadow space-y-4">
            <h2 className="font-semibold text-gray-700">
              Soal {currentIndex + 1} dari {questions.length}
            </h2>
            <p className="text-gray-800">{currentQuestion.question}</p>

            <div className="space-y-2">
              {currentQuestion.options.map((option, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(option)}
                  className="w-full text-left border px-4 py-2 rounded-md hover:bg-cyan-50 transition text-gray-700"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

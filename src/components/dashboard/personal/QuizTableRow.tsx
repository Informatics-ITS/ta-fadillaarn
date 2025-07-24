'use client';

import { useRouter } from 'next/navigation';

type Quiz = {
  id: string;
  title: string;
  category: string;
  status: 'completed' | 'not_started';
  score?: number;
};

export default function QuizTableRow({ quiz }: { quiz: Quiz }) {
  const router = useRouter();

  const handleAction = () => {
    if (quiz.status === 'not_started') {
      router.push(`/user/quiz/quiz-start/${quiz.id}`);
    } else {
      router.push(`/user/quiz/quiz-result/${quiz.id}`);
    }
  };

  return (
    <tr className="border-t">
      <td className="p-4">{quiz.title}</td>
      <td className="p-4">{quiz.category}</td>
      <td className="p-4 capitalize">{quiz.status === 'completed' ? 'Sudah' : 'Belum'}</td>
      <td className="p-4">{quiz.score ?? '-'}</td>
      <td className="p-4 text-center">
        <button
          onClick={handleAction}
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${
            quiz.status === 'not_started'
              ? 'bg-cyan-600 text-white hover:bg-cyan-700'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          {quiz.status === 'not_started' ? 'Mulai' : 'Lihat Hasil'}
        </button>
      </td>
    </tr>
  );
}

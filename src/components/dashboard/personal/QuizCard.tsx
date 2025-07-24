'use client';

import { useRouter } from 'next/navigation';

type QuizCardProps = {
  id: string;
  title: string;
  category: string;
  status: 'completed' | 'not_started';
  score?: number;
};

export default function QuizCard({
  id,
  title,
  category,
  status,
  score,
}: QuizCardProps) {
  const router = useRouter();

  const handleClick = () => {
    if (status === 'not_started') {
      router.push(`/user/quiz/quiz-start/${id}`);
    } else {
      router.push(`/user/quiz/quiz-result/${id}`);
    }
  };

  return (
    <div className="w-full bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      {/* Info Kuis */}
      <div className="flex-1">
        <h3 className="text-base font-semibold text-slate-800">{title}</h3>
        <p className="text-sm text-slate-500">{category}</p>
        {status === 'completed' && (
          <p className="text-sm text-emerald-600 mt-1">Skor: {score}</p>
        )}
      </div>

      {/* Tombol Aksi */}
      <div>
        <button
          onClick={handleClick}
          className={`text-sm px-5 py-2 rounded-md transition ${
            status === 'not_started'
              ? 'bg-cyan-500 hover:bg-cyan-600 text-white'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
          }`}
        >
          {status === 'not_started' ? 'Mulai' : 'Lihat Hasil'}
        </button>
      </div>
    </div>
  );
}

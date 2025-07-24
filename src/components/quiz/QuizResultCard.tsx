'use client';

import { BarChart, ThumbsUp } from 'lucide-react';

type Props = {
  score: number;
  category: string;
  recommendation: string;
};

export default function QuizResultCard({ score, category, recommendation }: Props) {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-2 text-cyan-700">
        <BarChart className="w-5 h-5" />
        <h1 className="text-xl font-bold">Hasil Kuis Ergonomi</h1>
      </div>

      <div className="border border-gray-200 p-6 rounded-xl shadow space-y-4">
        <div>
          <p className="text-sm text-gray-500">Skor Anda</p>
          <h2 className="text-4xl font-bold text-cyan-600">{score}</h2>
        </div>

        <div>
          <p className="text-sm text-gray-500">Kategori Risiko</p>
          <h2 className="text-2xl font-semibold">{category}</h2>
        </div>

        <div className="bg-cyan-50 border border-cyan-200 text-cyan-700 rounded-lg p-4 flex items-start gap-2">
          <ThumbsUp className="w-5 h-5 mt-1" />
          <p className="text-sm">{recommendation}</p>
        </div>
      </div>
    </div>
  );
}

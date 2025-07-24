'use client';

import { Pencil, Trash2 } from 'lucide-react';

type Props = {
  quiz: {
    id: string;
    title: string;
    description: string;
    totalQuestions: number;
    totalRespondents: number;
  };
  onEdit: () => void;
  onDelete: () => void;
};

export default function QuizCard({ quiz, onEdit, onDelete }: Props) {
  return (
    <div className="bg-white border rounded-lg p-4 shadow-sm space-y-2 hover:shadow-md transition">
      <div className="text-lg font-semibold">{quiz.title}</div>
      <div className="text-sm text-gray-600">{quiz.description}</div>
      <div className="text-sm text-gray-500">
        <span>{quiz.totalQuestions} Soal</span> •{' '}
        <span>{quiz.totalRespondents} Responden</span>
      </div>
      <div className="flex justify-end gap-3 pt-2 text-sm">
        <button onClick={onEdit} className="text-blue-600 hover:underline flex items-center gap-1">
          <Pencil className="w-4 h-4" /> Edit
        </button>
        <button onClick={onDelete} className="text-red-500 hover:underline flex items-center gap-1">
          <Trash2 className="w-4 h-4" /> Hapus
        </button>
      </div>
    </div>
  );
}

'use client';

import { Eye, Pencil, Trash2, FileText } from 'lucide-react';

type Props = {
  quiz: {
    id: string;
    title: string;
    deadline: string | null;
    category: string;
    totalQuestions: number;
    duration: string;
    status: 'Draft' | 'Published';
    progress: [number, number];
  };
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export default function QuizTableRow({ quiz, onView, onEdit, onDelete }: Props) {
  const percentage = quiz.progress[1]
    ? Math.round((quiz.progress[0] / quiz.progress[1]) * 100)
    : 0;

  const statusBadge = {
    Draft: 'bg-yellow-100 text-yellow-800',
    Published: 'bg-green-100 text-green-600',
  };

  const categoryColor = {
    'Pengetahuan Dasar': 'bg-blue-100 text-blue-600',
    'Praktik Ergonomi': 'bg-indigo-100 text-indigo-600',
    Kesehatan: 'bg-cyan-100 text-cyan-700',
  };

  return (
    <tr className="bg-white rounded-lg shadow-sm">
      <td className="p-4">
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-cyan-600" />
          <div>
            <div className="font-medium">{quiz.title}</div>
            <div className="text-xs text-gray-500">
              Deadline: {quiz.deadline || 'Tidak ada'}
            </div>
          </div>
        </div>
      </td>

      <td className="p-4">
        <span
          className={`text-xs font-medium px-2 py-1 rounded-full ${
            categoryColor[quiz.category as keyof typeof categoryColor] ||
            'bg-gray-100 text-gray-600'
          }`}
        >
          {quiz.category}
        </span>
      </td>

      <td className="p-4">
        {quiz.totalQuestions} pertanyaan
        <br />
        <span className="text-xs text-gray-500">{quiz.duration}</span>
      </td>

      <td className="p-4">
        <span
          className={`text-xs font-medium px-2 py-1 rounded-full ${
            statusBadge[quiz.status]
          }`}
        >
          {quiz.status}
        </span>
      </td>

      <td className="p-4">
        <div className="text-xs mb-1 text-gray-700">
          {quiz.progress[0]}/{quiz.progress[1]} selesai
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full">
          <div
            className="h-2 bg-cyan-600 rounded-full"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </td>

      <td className="p-4">
        <div className="flex gap-3">
          <button onClick={onView} className="text-gray-600 hover:text-cyan-600" title="Lihat Detail">
            <Eye className="w-4 h-4" />
          </button>
          <button onClick={onEdit} className="text-gray-600 hover:text-blue-600" title="Edit">
            <Pencil className="w-4 h-4" />
          </button>
          <button onClick={onDelete} className="text-gray-600 hover:text-red-600" title="Hapus">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}

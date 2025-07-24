'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, BarChart3, Pencil } from 'lucide-react';
import { QuizForm } from './EditQuizModal';

type Props = {
  quizzes: QuizForm[];
  onEdit: (quiz: QuizForm) => void;
  onResult?: (quiz: QuizForm) => void;
};

const ITEMS_PER_PAGE = 10;

export default function QuizTable({ quizzes, onEdit, onResult }: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(quizzes.length / ITEMS_PER_PAGE);
  const paginatedQuizzes = quizzes.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const router = useRouter();

  return (
    <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
      <table className="w-full text-sm text-gray-700">
        <thead className="bg-gray-50 text-gray-500 text-xs uppercase border-b">
          <tr>
            <th className="px-6 py-3 text-left">No</th>
            <th className="px-6 py-3 text-left">Judul</th>
            <th className="px-6 py-3 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {paginatedQuizzes.map((quiz, index) => (
            <tr key={quiz.id} className="border-t">
              <td className="px-6 py-4">{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</td>
              <td className="px-6 py-4">{quiz.title}</td>
              <td className="px-6 py-4 text-center">
                <div className="flex justify-center gap-2 text-slate-500">
                  <button
                    onClick={() => router.push(`/superadmin/manage-quiz/${quiz.id}`)}
                    className="hover:text-slate-700"
                    title="Lihat Detail"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onEdit(quiz)}
                    className="hover:text-slate-700"
                    title="Edit Kuis"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  {onResult && (
                    <button
                      onClick={() => onResult(quiz)}
                      className="hover:text-slate-700"
                      title="Lihat Hasil"
                    >
                      <BarChart3 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center px-6 py-4 text-sm text-gray-600">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
          >
            Sebelumnya
          </button>
          <span>
            Halaman {currentPage} dari {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
          >
            Selanjutnya
          </button>
        </div>
      )}
    </div>
  );
}

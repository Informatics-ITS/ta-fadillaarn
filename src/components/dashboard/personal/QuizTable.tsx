'use client';

import QuizTableRow from '@/components/dashboard/personal/QuizTableRow';
import QuizTablePagination from '@/components/dashboard/personal/QuizTablePagination';

type Quiz = {
  id: string;
  title: string;
  category: string;
  status: 'completed' | 'not_started';
  score?: number;
};

type Props = {
  quizzes: Quiz[];
  currentPage: number;
  itemsPerPage: number;
  setPage: (page: number) => void;
};

export default function QuizTable({ quizzes, currentPage, itemsPerPage, setPage }: Props) {
  const totalPages = Math.ceil(quizzes.length / itemsPerPage);
  const paginated = quizzes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      <div className="overflow-x-auto bg-white shadow border rounded-lg">
        <table className="min-w-full text-sm text-slate-700">
          <thead className="bg-slate-100 text-left font-semibold text-slate-600">
            <tr>
              <th className="p-4">Judul</th>
              <th className="p-4">Kategori</th>
              <th className="p-4">Status</th>
              <th className="p-4">Skor</th>
              <th className="p-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length > 0 ? (
              paginated.map((quiz) => <QuizTableRow key={quiz.id} quiz={quiz} />)
            ) : (
              <tr>
                <td className="p-4 text-center text-slate-500" colSpan={5}>
                  Tidak ada kuis ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <QuizTablePagination
          totalPages={totalPages}
          currentPage={currentPage}
          goToPage={setPage}
        />
      )}
    </>
  );
}

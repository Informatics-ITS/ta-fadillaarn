'use client';

type Props = {
  totalPages: number;
  currentPage: number;
  goToPage: (page: number) => void;
};

export default function QuizTablePagination({ totalPages, currentPage, goToPage }: Props) {
  return (
    <div className="flex justify-center gap-2 mt-6">
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 border rounded disabled:opacity-50"
      >
        Prev
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => goToPage(page)}
          className={`px-3 py-1 border rounded ${
            currentPage === page
              ? 'bg-cyan-500 text-white'
              : 'bg-white hover:bg-slate-100'
          }`}
        >
          {page}
        </button>
      ))}
      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 border rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}

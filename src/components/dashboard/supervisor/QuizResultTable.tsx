'use client';

type QuizResult = {
  employeeName: string;
  score: number;
};

type QuizResultTableProps = {
  quizHistory: QuizResult[];
  loading?: boolean;
};

export default function QuizResultTable({ quizHistory, loading }: QuizResultTableProps) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-700 mb-4">Riwayat Hasil Kuis</h2>
      <table className="min-w-full table-auto border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left">Karyawan</th>
            <th className="px-6 py-3 text-left">Skor</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={2} className="px-6 py-4 text-center text-gray-400">
                Memuat data...
              </td>
            </tr>
          ) : quizHistory.length > 0 ? (
            quizHistory.map((result, idx) => (
              <tr key={idx} className="border-t">
                <td className="px-6 py-4">{result.employeeName}</td>
                <td className="px-6 py-4">{result.score}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={2} className="px-6 py-4 text-center text-gray-500">
                Tidak ada hasil kuis untuk karyawan ini.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

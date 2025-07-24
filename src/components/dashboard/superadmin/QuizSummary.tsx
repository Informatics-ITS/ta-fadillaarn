import { ClipboardList } from 'lucide-react';

export default function QuizSummary({ total }: { total: number }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow flex flex-col justify-between">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-full bg-purple-50">
          <ClipboardList className="h-5 w-5 text-purple-500" />
        </div>
        <div>
          <p className="text-sm text-gray-500">Total Kuis</p>
          <p className="text-2xl font-bold text-gray-800">{total}</p>
        </div>
      </div>
      <div className="text-sm text-gray-500">Kuis yang tersedia</div>
    </div>
  );
}

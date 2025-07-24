import { Building2, Book } from 'lucide-react';

type Props = {
  totalDivisions: number;
  totalQuizzes: number;
};

export default function SummaryBoxGroup({ totalDivisions, totalQuizzes }: Props) {
  const summaryItems = [
    {
      label: 'Total Divisi',
      value: totalDivisions,
      icon: <Building2 className="w-6 h-6 text-sky-600" />,
      bg: 'bg-sky-50',
    },
    {
      label: 'Total Kuis',
      value: totalQuizzes,
      icon: <Book className="w-6 h-6 text-teal-600" />,
      bg: 'bg-teal-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {summaryItems.map((item) => (
        <div
          key={item.label}
          className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition"
        >
          <div className={`p-3 rounded-xl ${item.bg}`}>{item.icon}</div>
          <div>
            <p className="text-sm text-slate-500">{item.label}</p>
            <p className="text-2xl font-bold text-slate-800">{item.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

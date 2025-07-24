'use client';

import { Calendar, ClipboardList, BookOpen } from 'lucide-react';

const tasks = [
  { icon: <Calendar className="w-4 h-4" />, label: 'Evaluasi Postur Mingguan', date: '24 Apr 2025' },
  { icon: <ClipboardList className="w-4 h-4" />, label: 'Kuis Ergonomi Dasar', date: '26 Apr 2025' },
  { icon: <BookOpen className="w-4 h-4" />, label: 'Materi Pembelajaran Selesai', date: '30 Apr 2025' },
];

export default function UpcomingTaskList() {
  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="flex items-center justify-between px-4 pt-4">
        <h3 className="text-sm font-semibold text-gray-700">Tugas Mendatang</h3>
        <a href="#" className="text-xs text-cyan-600 font-medium hover:underline">Lihat Semua</a>
      </div>
      <ul className="p-4 space-y-3">
        {tasks.map((task, idx) => (
          <li key={idx} className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="text-cyan-600">{task.icon}</div>
              <div>{task.label}</div>
            </div>
            <button className="text-xs bg-cyan-100 text-cyan-700 px-2 py-1 rounded-md font-medium">Mulai</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

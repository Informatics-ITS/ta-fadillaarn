'use client';

import { Calendar, Download, Plus, Clock } from 'lucide-react';

const events = [
  { title: 'Evaluasi Tim Produksi', date: '2025-04-25', location: 'Produksi', type: 'Group', count: 12 },
  { title: 'Kuis Ergonomi Q2', date: '2025-04-27', location: 'All', type: 'Quiz', count: 45 },
  { title: 'Evaluasi Admin Cabang', date: '2025-04-30', location: 'Admin', type: 'Individual', count: 8 },
];

export default function UpcomingSchedule() {
  const handleAddEmployee = () => {
    alert('Tambah Karyawan diklik!');
    // TODO: buka modal tambah karyawan
  };

  const handleScheduleEvaluation = () => {
    alert('Jadwalkan Evaluasi diklik!');
    // TODO: buka modal penjadwalan evaluasi
  };

  const handleDownloadReport = () => {
    alert('Unduh Laporan diklik!');
    // TODO: trigger export laporan
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-slate-800">Jadwal Mendatang</h2>

      {/* List Jadwal */}
      <div className="space-y-2">
        {events.map((e, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between bg-white p-4 rounded-xl border shadow-sm"
          >
            <div className="flex items-center gap-3">
              <Calendar className="text-sky-500 w-5 h-5" />
              <div className="text-sm">
                <div className="font-medium text-slate-800">{e.title}</div>
                <div className="text-xs text-gray-500">
                  {e.date} - {e.location}
                </div>
              </div>
            </div>
            <span className="text-xs px-2 py-1 rounded-full bg-sky-100 text-sky-600 font-semibold">
              {e.type}
            </span>
          </div>
        ))}
      </div>

      {/* Tombol Aksi */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
        <button
          onClick={handleAddEmployee}
          className="flex items-center gap-2 justify-center text-sm px-4 py-2 bg-white border rounded-md shadow hover:bg-gray-50"
        >
          <Plus className="w-4 h-4" />
          Tambah Karyawan
        </button>

        <button
          onClick={handleScheduleEvaluation}
          className="flex items-center gap-2 justify-center text-sm px-4 py-2 bg-white border rounded-md shadow hover:bg-gray-50"
        >
          <Clock className="w-4 h-4" />
          Jadwalkan Evaluasi
        </button>

        <button
          onClick={handleDownloadReport}
          className="flex items-center gap-2 justify-center text-sm px-4 py-2 bg-white border rounded-md shadow hover:bg-gray-50"
        >
          <Download className="w-4 h-4" />
          Unduh Laporan
        </button>
      </div>
    </div>
  );
}

'use client';

import { Download, Repeat, BookOpenCheck } from 'lucide-react';

export default function PostureEvaluationResult() {
  return (
    <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6 space-y-6">
      <h2 className="text-xl font-bold text-slate-800">Hasil Evaluasi Postur Kerja</h2>
      <p className="text-sm text-slate-500">Tanggal: 24 April 2025</p>

      {/* Ringkasan */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        <div className="bg-yellow-100 rounded-md p-4">
          <p className="text-sm text-slate-600">Skor Ergonomi</p>
          <p className="text-3xl font-bold text-yellow-700">65</p>
          <p className="text-sm text-yellow-700">Perlu Perbaikan</p>
        </div>
        <div className="bg-red-100 rounded-md p-4">
          <p className="text-sm text-slate-600">Tingkat Risiko</p>
          <p className="text-2xl font-bold text-red-700">Sedang</p>
          <p className="text-sm text-red-700">Segera perbaiki</p>
        </div>
        <div className="bg-blue-100 rounded-md p-4">
          <p className="text-sm text-slate-600">Prioritas</p>
          <p className="text-3xl font-bold text-blue-700">3</p>
          <p className="text-sm text-blue-700">Tindakan dalam 1 bulan</p>
        </div>
      </div>

      {/* Analisis Detail */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Analisis Detail</h3>
        <ul className="space-y-2 text-sm text-slate-700">
          <li>
            <span className="text-red-500 font-medium">• Posisi Leher Terlalu Maju:</span> Leher condong ke depan lebih dari 20°.
          </li>
          <li>
            <span className="text-yellow-500 font-medium">• Posisi Punggung Membungkuk:</span> Menambah risiko nyeri punggung.
          </li>
          <li>
            <span className="text-green-600 font-medium">• Posisi Kaki Baik:</span> Sudah tepat 90° dengan lantai.
          </li>
        </ul>
      </div>

      {/* Rekomendasi */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Rekomendasi Perbaikan</h3>
        <ul className="space-y-3 text-sm text-slate-800">
          <li className="bg-cyan-50 border-l-4 border-cyan-400 p-3 rounded">
            <strong>1. Atur Posisi Monitor:</strong> Setinggi mata, jarak ideal 50–70 cm.
          </li>
          <li className="bg-cyan-50 border-l-4 border-cyan-400 p-3 rounded">
            <strong>2. Perbaiki Postur Duduk:</strong> Gunakan sandaran lumbar atau kursi ergonomis.
          </li>
          <li className="bg-cyan-50 border-l-4 border-cyan-400 p-3 rounded">
            <strong>3. Lakukan Peregangan:</strong> Setiap 30 menit peregangan leher dan punggung.
          </li>
          <li className="bg-cyan-50 border-l-4 border-cyan-400 p-3 rounded">
            <strong>4. Gunakan Footrest:</strong> Jika kaki tidak menapak sempurna ke lantai.
          </li>
        </ul>
      </div>

      {/* Tombol */}
      <div className="flex flex-wrap gap-3 pt-4 border-t mt-4">
        <button className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-md text-sm">
          <Download className="w-4 h-4" />
          Download Laporan PDF
        </button>
        <button className="flex items-center gap-2 bg-white border hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-md text-sm">
          <Repeat className="w-4 h-4" />
          Evaluasi Lagi
        </button>
        <button className="ml-auto flex items-center gap-2 bg-gradient-to-r from-sky-500 to-teal-500 text-white px-4 py-2 rounded-md text-sm hover:brightness-110">
          <BookOpenCheck className="w-4 h-4" />
          Lihat Materi Edukasi
        </button>
      </div>
    </div>
  );
}

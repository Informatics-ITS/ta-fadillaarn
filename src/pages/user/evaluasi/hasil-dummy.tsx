'use client';

import { useState, useEffect } from 'react';
import SidebarWrapper from '@/components/dashboard/SidebarWrapper';
import GradientButton from '@/components/buttons/GradientButton';
import {
  LayoutDashboard,
  ClipboardList,
  FileText,
  User,
  Download,
  RotateCcw,
  Camera,
  Award,
} from 'lucide-react';

const userMenu = [
  { label: 'Dashboard', href: '/dashboard/user', icon: <LayoutDashboard /> },
  { label: 'Evaluasi Postur', href: '/evaluasi', icon: <Camera /> },
  { label: 'Progress Postur', href: '/user/progress', icon: <ClipboardList /> },
  { label: 'Kuis Ergonomi', href: '/user/kuis', icon: <FileText /> },
  { label: 'Penghargaan', href: '/user/badge', icon: <Award /> },
  { label: 'Profil', href: '/user/profile', icon: <User /> },
];

export default function HasilEvaluasiPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const dummyData = {
      id: '649a917a-ec31-4be4-9b83-6b69a1b8b571',
      userId: '48df0b85-870a-47d4-a0be-6dba5d524ab3',
      flags_sudut_bahu: false,
      flags_sudut_leher: false,
      flags_sudut_lutut: false,
      flags_sudut_pergelangan: false,
      flags_sudut_punggung: false,
      flags_sudut_siku: false,
      details_adjust_arm_supported: -1,
      details_adjust_legs_feet: 1,
      details_adjust_neck_twist: 0,
      details_adjust_shoulder_raised: 0,
      details_adjust_trunk_twist: 0,
      details_adjust_wrist_twist: 1,
      details_sudut_bahu: 32.73,
      details_sudut_leher: 13.86,
      details_sudut_lutut: 81.88,
      details_sudut_pergelangan: 4.25,
      details_sudut_punggung: 0.04,
      details_sudut_siku: 50.19,
      feedback: 'Sudut siku jangan terlalu rendah. Sebaiknya antara 60°–100°.',
      fileUrl: 'https://vps.danar.site/model1/output_images/2025-06-03/082233_682485_hasil.png',
      reba_final_score: 1,
      reba_summary: 'Risiko dapat diabaikan (Negligible Risk).',
      rula_final_score: 3,
      rula_summary: 'Perlu investigasi lebih lanjut, mungkin butuh penyesuaian postur tubuh.',
      createdAt: '2025-06-03T08:22:33.815Z',
    };

    setData(dummyData);
  }, []);

  if (!data) return <div className="p-10 text-center">Memuat hasil evaluasi...</div>;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarWrapper menu={userMenu} profileHref="/dashboard/user/profile" />

      <main className="flex-1 ml-64 px-6 py-10 flex justify-center">
        <div className="w-full max-w-5xl space-y-10">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Evaluasi Postur Kerja</h1>
            <p className="text-sm text-slate-500">Berikut hasil evaluasi postur Anda</p>
          </div>

          <div className="rounded-xl overflow-hidden border shadow bg-white">
            <div className="bg-gradient-to-r from-sky-500 to-teal-500 text-white px-6 py-4">
              <p className="text-sm font-medium">Hasil Evaluasi Postur Kerja</p>
              <p className="text-sm">Tanggal: {new Date(data.createdAt).toLocaleDateString()}</p>
            </div>

            {/* Tampilkan berdasarkan ketersediaan skor */}
            {data.reba_final_score !== undefined && data.rula_final_score !== undefined ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
                <div className="text-center bg-yellow-50 p-4 rounded-md">
                  <p className="text-sm text-yellow-700 font-medium">Skor REBA</p>
                  <h2 className="text-3xl font-bold text-yellow-800">{data.reba_final_score}</h2>
                  <p className="text-xs text-yellow-600 mt-1">{data.reba_summary}</p>
                </div>
                <div className="text-center bg-red-50 p-4 rounded-md">
                  <p className="text-sm text-red-700 font-medium">Skor RULA</p>
                  <h2 className="text-3xl font-bold text-red-800">{data.rula_final_score}</h2>
                  <p className="text-xs text-red-600 mt-1">{data.rula_summary}</p>
                </div>
                <div className="text-center bg-blue-50 p-4 rounded-md">
                  <p className="text-sm text-blue-700 font-medium">Feedback Sistem</p>
                  <p className="text-sm text-blue-800 font-semibold mt-1">{data.feedback}</p>
                </div>
              </div>
            ) : (
              <div className="p-6 bg-blue-50 rounded-md text-center">
                <p className="text-sm text-blue-700 font-medium">Feedback Sistem</p>
                <p className="text-base font-semibold text-blue-800 mt-1">{data.feedback || 'Tidak ada feedback.'}</p>
              </div>
            )}
          </div>

          {/* Gambar hasil */}
          {data.fileUrl && (
            <div className="rounded-xl overflow-hidden border bg-white shadow">
              <img src={data.fileUrl} alt="Hasil Evaluasi" className="w-full object-contain" />
            </div>
          )}

          {/* Detail sudut tubuh */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-800">Detail Sudut Tubuh</h2>
            <ul className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm text-slate-700 bg-white p-4 rounded-xl border">
              <li>Leher: {data.details_sudut_leher?.toFixed(2)}°</li>
              <li>Bahu: {data.details_sudut_bahu?.toFixed(2)}°</li>
              <li>Siku: {data.details_sudut_siku?.toFixed(2)}°</li>
              <li>Punggung: {data.details_sudut_punggung?.toFixed(2)}°</li>
              <li>Pergelangan: {data.details_sudut_pergelangan?.toFixed(2)}°</li>
              <li>Lutut: {data.details_sudut_lutut?.toFixed(2)}°</li>
            </ul>
          </section>

          {/* Tombol aksi */}
          <div className="pt-6 flex justify-between items-center flex-wrap gap-3">
            <button
              onClick={() => alert('Fitur export PDF coming soon')}
              className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
            >
              <Download className="w-4 h-4" />
              Download Laporan PDF
            </button>

            <div className="flex gap-3">
              <button
                onClick={() => location.href = '/evaluasi'}
                className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
              >
                <RotateCcw className="w-4 h-4" />
                Evaluasi Lagi
              </button>
              <GradientButton href="/dashboard/pembelajaran">
                Lihat Materi Edukasi
              </GradientButton>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

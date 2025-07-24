'use client';

import { useState } from 'react';
import SidebarWrapper from '@/components/dashboard/SidebarWrapper';
import {
  LayoutDashboard,
  ClipboardList,
  FileText,
  Camera,
  Award,
  User,
  UserCog,
} from 'lucide-react';

const userMenu = [
  { label: 'Dashboard', href: '/dashboard/user', icon: <LayoutDashboard /> },
  { label: 'Evaluasi Postur', href: '/user/evaluasi', icon: <Camera /> },
  { label: 'Progress Postur', href: '/user/progress', icon: <ClipboardList /> },
  { label: 'Kuis Ergonomi', href: '/user/quiz/kuis', icon: <FileText /> },
  { label: 'Penghargaan', href: '/user/badge', icon: <Award /> },
  { label: 'Profil', href: '/user/profile', icon: <UserCog /> },
];

export default function StreamingEvaluasiPage() {
  const [iframeError, setIframeError] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarWrapper menu={userMenu} profileHref="/user/profile" />
      <main className="flex-1 ml-64 px-8 py-10 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Streaming Evaluasi Postur (OpenPose)</h1>
          <p className="text-sm text-slate-500 mt-1">
            Analisis postur kerja secara langsung melalui kamera webcam Anda dengan bantuan model OpenPose.
          </p>
        </div>

        <div className="rounded-xl overflow-hidden border bg-white shadow">
          {!iframeError ? (
            <iframe
              src="https://vps.danar.site/model1/ws-client"
              className="w-full h-[600px]"
              onError={() => setIframeError(true)}
              title="Streaming OpenPose"
            />
          ) : (
            <div className="p-8 text-center space-y-2">
              <h2 className="text-lg font-semibold text-red-600">Gagal Memuat Streaming</h2>
              <p className="text-sm text-slate-600">
                Silakan buka langsung melalui link berikut:
              </p>
              <a
                href="https://vps.danar.site/model1/ws-client"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-4 py-2 mt-2 bg-rose-500 text-white text-sm font-medium rounded-md hover:bg-rose-600 transition"
              >
                Buka di Tab Baru
              </a>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

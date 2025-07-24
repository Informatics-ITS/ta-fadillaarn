'use client';

import SidebarWrapper from '@/components/dashboard/SidebarWrapper';
import { Camera, Video, Wifi, ClipboardList, CheckCircle, Award, FileText, UserCog } from 'lucide-react';
import { LayoutDashboard, User } from 'lucide-react';

const userMenu = [
  { label: 'Dashboard', href: '/dashboard/user', icon: <LayoutDashboard /> },
  { label: 'Evaluasi Postur', href: '/user/evaluasi', icon: <Camera /> },
  { label: 'Progress Postur', href: '/user/progress', icon: <ClipboardList /> },
  { label: 'Kuis Ergonomi', href: '/user/quiz/kuis', icon: <FileText /> },
  { label: 'Penghargaan', href: '/user/badge', icon: <Award /> },
  { label: 'Profil', href: '/user/profile', icon: <UserCog /> },
];

const evaluationCards = [
  {
    title: 'Upload Foto',
    description: 'Evaluasi postur kerja melalui foto',
    icon: <Camera className="w-6 h-6 text-white" />,
    href: '/user/evaluasi/foto',
    color: 'bg-sky-500',
  },
  {
    title: 'Upload Video',
    description: 'Evaluasi gerakan dan postur kerja',
    icon: <Video className="w-6 h-6 text-white" />,
    href: '/user/evaluasi/video',
    color: 'bg-emerald-500',
  },
  {
    title: 'Streaming OpenPose',
    description: 'Evaluasi real-time melalui kamera langsung',
    icon: <Wifi className="w-6 h-6 text-white" />,
    href: 'https://vps.danar.site/model1/ws-client', // ✅ langsung redirect ke link eksternal
    color: 'bg-rose-500',
  },
];

export default function EvaluasiIndexPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarWrapper menu={userMenu} profileHref="/user/profile" />
      <main className="flex-1 ml-64 px-8 py-10 space-y-10">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Evaluasi Postur Kerja</h1>
          <p className="text-sm text-slate-500 mt-1">
            Periksa dan tingkatkan ergonomi kerja Anda
          </p>
        </div>

        <div className="grid gap-4">
          {evaluationCards.map((card, i) => (
            <a
              key={i}
              href={card.href}
              target={card.href.startsWith('http') ? '_blank' : '_self'} // ⬅️ buka tab baru jika eksternal
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 rounded-xl border hover:shadow-md bg-white transition"
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-md ${card.color}`}>
                  {card.icon}
                </div>
                <div>
                  <p className="font-semibold text-slate-800">{card.title}</p>
                  <p className="text-sm text-slate-500">{card.description}</p>
                </div>
              </div>
              <span className="text-sm text-sky-600 font-medium">Mulai →</span>
            </a>
          ))}
        </div>

        <div className="bg-gradient-to-br from-sky-50 to-cyan-50 p-5 rounded-xl border border-cyan-100 space-y-3">
          <h3 className="font-semibold text-slate-800">Manfaat Evaluasi Rutin</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 mt-0.5 text-emerald-500" />
              <span><strong>Deteksi Dini</strong> – Kenali risiko gangguan muskuloskeletal sedini mungkin</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 mt-0.5 text-emerald-500" />
              <span><strong>Rekomendasi Personal</strong> – Dapatkan saran perbaikan yang disesuaikan</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 mt-0.5 text-emerald-500" />
              <span><strong>Track Progress</strong> – Pantau perkembangan postur kerja Anda</span>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}

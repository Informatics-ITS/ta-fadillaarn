'use client';

import PostureEvaluationResult from '@/components/dashboard/personal/PostureEvaluationResult';

export default function HasilEvaluasiPage() {
  return (
    <div className="min-h-screen p-6 bg-white">
      <h1 className="text-2xl font-bold text-slate-800 mb-4">Evaluasi Postur Kerja</h1>
      <p className="text-slate-500 mb-6">Periksa dan tingkatkan ergonomi kerja Anda</p>
      <PostureEvaluationResult />
    </div>
  );
}

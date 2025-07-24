'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function BackToDashboardButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push('/dashboard/superadmin')}
      className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-cyan-600 hover:underline"
    >
      <ArrowLeft size={16} />
      Kembali ke Dashboard
    </button>
  );
}

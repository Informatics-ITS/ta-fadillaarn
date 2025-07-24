'use client';

import BadgeList from '@/components/dashboard/personal/BadgeList';

export default function BadgePage() {
  const employeeId = typeof window !== 'undefined' ? localStorage.getItem('userId') || '' : '';

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Penghargaan</h1>
      <BadgeList employeeId={employeeId} />
    </div>
  );
}

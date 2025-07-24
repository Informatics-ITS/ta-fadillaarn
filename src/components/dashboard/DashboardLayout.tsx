'use client';

import Sidebar from '@/components/dashboard/Sidebar';
import Topbar from '@/components/dashboard/Topbar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex min-h-screen bg-gray-50 text-gray-800'>
      <Sidebar />
      <div className='flex-1 flex flex-col'>
        <Topbar />
        <main className='flex-1 p-6'>{children}</main>
      </div>
    </div>
  );
}

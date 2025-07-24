'use client';

import { Bell, Search, UserCircle } from 'lucide-react';

export default function Topbar() {
  return (
    <div className='flex items-center justify-between bg-white border-b px-6 py-4'>
      <div className='text-lg font-semibold'>Dashboard</div>
      <div className='flex items-center gap-4'>
        <div className='relative'>
          <input
            type='text'
            placeholder='Cari...'
            className='rounded-md border px-3 py-1.5 text-sm focus:ring-cyan-500 focus:border-cyan-500'
          />
        </div>
        <Bell className='h-5 w-5 text-gray-600' />
        <UserCircle className='h-6 w-6 text-gray-600' />
      </div>
    </div>
  );
}

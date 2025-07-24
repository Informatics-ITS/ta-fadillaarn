'use client';

import {
  LogOut,
  LayoutDashboard,
  Calendar,
  BookOpen,
  Award,
  Settings,
  Camera,
  ClipboardCheck,
} from 'lucide-react';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import axios from 'axios';

const menu = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: Camera, label: 'Evaluasi Postur', href: '/dashboard/evaluasi' },
  { icon: Calendar, label: 'Jadwal', href: '/dashboard/jadwal' },
  { icon: BookOpen, label: 'Pembelajaran', href: '/dashboard/pembelajaran' },
  { icon: Award, label: 'Penghargaan', href: '/dashboard/penghargaan' },
  { icon: Settings, label: 'Pengaturan', href: '/dashboard/pengaturan' },
  { icon: ClipboardCheck, label: 'Kuis Ergonomi', href: '/dashboard/quiz' },

];

export default function Sidebar() {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');

  useEffect(() => {
    const storedName = localStorage.getItem('name');
    const storedRole = localStorage.getItem('role') || 'personal';
    setName(storedName || '(Tidak Dikenali)');
    setRole(storedRole);
  }, []);


  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = '/auth/login';
  };

  return (
    <aside className='w-64 bg-white border-r px-4 py-6 hidden md:block'>
      <div className='mb-6 px-2 text-xl font-bold bg-gradient-to-r from-sky-500 via-cyan-500 to-teal-500 bg-clip-text text-transparent'>ErgoCheck</div>

      <div className='mb-8'>
        <div className='flex items-center gap-3 px-2'>
          <div className='h-10 w-10 rounded-full bg-cyan-100' />
          <div>
            <p className='text-sm font-semibold'>{name || '...'}</p>
            <p className='text-xs text-gray-500 capitalize'>{role}</p>
          </div>
        </div>
      </div>

      <nav className='space-y-1'>
        {menu.map(({ icon: Icon, label, href }) => (
          <Link
            key={label}
            href={href}
            className='flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-cyan-50 transition font-medium text-gray-700'
          >
            <Icon className='h-4 w-4' />
            {label}
          </Link>
        ))}

        <hr className='my-3 border-gray-200' />

        <button
          onClick={handleLogout}
          className='flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-red-50 text-red-500 transition'
        >
          <LogOut className='h-4 w-4' />
          Keluar
        </button>
      </nav>
    </aside>
  );
}

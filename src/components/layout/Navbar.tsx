'use client';

import Link from 'next/link';

export default function Navbar() {
  return (
    <header className='sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm'>
      <div className='layout flex h-16 items-center justify-between px-4 md:px-8'>
        {/* Logo */}
        <Link
          href='/'
          className='text-xl font-bold bg-gradient-to-r from-sky-500 via-cyan-500 to-teal-500 bg-clip-text text-transparent'
        >
          ErgoCheck
        </Link>

        {/* Nav menu */}
        <nav className='hidden md:flex items-center gap-8 text-sm text-gray-700 font-medium'>
          <Link href='#tentang' className='hover:text-cyan-600 transition-colors'>Tentang</Link>
          <Link href='#fitur' className='hover:text-cyan-600 transition-colors'>Fitur</Link>
          <Link href='#kontak' className='hover:text-cyan-600 transition-colors'>Kontak</Link>
        </nav>

        {/* CTA Button */}
        <Link
          href='/auth/register'
          className='rounded-lg bg-gradient-to-r from-sky-500 to-teal-500 px-4 py-2 text-sm font-semibold text-white shadow hover:brightness-110 transition'
        >
          Mulai Sekarang
        </Link>
      </div>
    </header>
  );
}

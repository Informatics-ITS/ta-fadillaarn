'use client';

import ButtonLink from '@/components/links/ButtonLink';
import GradientButton from '../buttons/GradientButton';

export default function HeroSection() {
  return (
    <section className='bg-gradient-to-br from-sky-100 via-cyan-100 to-teal-100 py-20 text-center'>
      <div className='layout flex flex-col items-center justify-center px-4'>
        <h1 className='text-4xl md:text-5xl font-bold text-gray-800 mb-4'>
          Workspace Ergonomis, <span className='bg-gradient-to-r from-sky-500 via-cyan-500 to-teal-500 bg-clip-text text-transparent'>Produktivitas Optimal</span>
        </h1>
        <p className='text-lg text-gray-700 max-w-2xl mb-6'>
          ErgoCheck membantu Anda menciptakan lingkungan kerja yang sehat dan nyaman melalui evaluasi ergonomis yang komprehensif dan edukasi yang terstruktur.
        </p>
        <div className='flex flex-col sm:flex-row gap-4'>
          <GradientButton href='/auth/login'>
            Mulai Assessment
          </GradientButton>
          <ButtonLink 
            href='#fitur'
            className='inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-5 py-2 text-sm font-medium text-gray-800 shadow-sm transition hover:brightness-105'
          >
            Pelajari Lebih Lanjut
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
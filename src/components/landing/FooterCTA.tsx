'use client';

import GradientButton from '@/components/buttons/GradientButton';

export default function FooterCTA() {
  return (
    <section className='bg-white py-16'>
      <div className='layout text-center space-y-4'>
        <h2 className='text-2xl font-bold text-gray-800'>
          Siap Menciptakan Workspace yang Lebih Sehat?
        </h2>
        <p className='text-gray-700'>
          Bergabung dengan ErgoCheck dan mulai perjalanan menuju workspace yang lebih ergonomis dan produktif.
        </p>
        <GradientButton href='/auth/register'>
          Mulai Assessment Gratis
        </GradientButton>
      </div>
    </section>
  );
}

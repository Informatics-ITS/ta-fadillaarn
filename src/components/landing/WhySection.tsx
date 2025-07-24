'use client';

import ButtonLink from '@/components/links/ButtonLink';

export default function WhySection() {
  return (
    <section className='bg-cyan-50 py-16'>
      <div className='layout space-y-10 text-center'>
        <h2 className='text-2xl font-bold text-gray-800'>Mengapa Menggunakan ErgoCheck?</h2>
        <ul className='text-left max-w-2xl mx-auto space-y-3 text-gray-700 list-disc list-inside'>
          <li>Evaluasi Komprehensif terhadap ergonomi workspace dan postur kerja Anda.</li>
          <li>Rekomendasi Personal berdasarkan hasil evaluasi dan kondisi Anda.</li>
          <li>Tracking Progress & peningkatan kondisi ergonomi secara berkala.</li>
        </ul>
        <div className='rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 p-6 text-white shadow-md'>
          <h3 className='text-xl font-semibold mb-2'>Mulai Perjalanan Ergonomis Anda</h3>
          <p className='mb-4'>Lakukan self-assessment gratis dan dapatkan laporan lengkap serta akses materi edukasi ergonomi.</p>
          <ButtonLink href='/auth/register' variant='light'>Mulai Sekarang</ButtonLink>
        </div>
      </div>
    </section>
  );
}
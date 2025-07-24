'use client';

import { ShieldCheck, BookOpenCheck, Users } from 'lucide-react';

const features = [
  {
    icon: ShieldCheck,
    title: 'Self-Assessment',
    desc: 'Evaluasi ergonomi workspace Anda dengan panduan yang terstruktur dan mudah diikuti.',
  },
  {
    icon: BookOpenCheck,
    title: 'Edukasi Terstruktur',
    desc: 'Akses materi pembelajaran ergonomi yang komprehensif kapan saja dengan efisiensi.',
  },
  {
    icon: Users,
    title: 'Monitoring Tim',
    desc: 'Pantau dan kelola ergonomi workspace untuk seluruh tim Anda.',
  },
];

export default function FeatureSection() {
  return (
    <section id='fitur' className='bg-white py-16'>
      <div className='layout space-y-12 text-center'>
        <h2 className='text-3xl font-bold text-gray-800'>Solusi Lengkap untuk Workspace Ergonomis</h2>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className='rounded-lg border p-6 text-left shadow-sm'>
              <Icon className='mb-4 h-8 w-8 text-teal-500' />
              <h3 className='text-xl font-semibold'>{title}</h3>
              <p className='text-gray-600 mt-2'>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
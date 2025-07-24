'use client';

import Link from 'next/link';

interface Props {
  title: string;
  description: string;
  icon: string;
  href: string;
}

export default function MetodeCard({ title, description, icon, href }: Props) {
  return (
    <div className="rounded-xl border bg-white px-4 py-3 shadow-sm hover:shadow-md transition">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img src={icon} alt="" className="w-10 h-10" />
          <div>
            <p className="font-semibold text-gray-800">{title}</p>
            <p className="text-sm text-gray-500">{description}</p>
          </div>
        </div>
        <Link
          href={href}
          className="text-sm text-cyan-600 font-medium hover:underline"
        >
          Mulai →
        </Link>
      </div>
    </div>
  );
}

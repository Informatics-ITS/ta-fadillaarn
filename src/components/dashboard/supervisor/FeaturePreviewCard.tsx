'use client';

import Link from 'next/link';

export default function FeaturePreviewCard({
  title,
  description,
  href,
  icon,
}: {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group block bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition"
    >
      <div className="flex items-center gap-4">
        <div className="p-3 bg-sky-50 rounded-xl group-hover:bg-sky-100">{icon}</div>
        <div>
          <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
          <p className="text-sm text-slate-500">{description}</p>
        </div>
      </div>
    </Link>
  );
}

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menu = [
  { label: 'Dashboard', href: '/dashboard/superadmin' },
  { label: 'Manajemen User', href: '/dashboard/superadmin/users' },
];

export default function SidebarSuperadmin() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen fixed left-0 top-0 bg-white shadow p-6">
      <h1 className="text-xl font-bold mb-6">ErgoCheck</h1>
      <nav className="space-y-2">
        {menu.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`block px-3 py-2 rounded-md ${
              pathname === item.href
                ? 'bg-sky-100 text-sky-600 font-semibold'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

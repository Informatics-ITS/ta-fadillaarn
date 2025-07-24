'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { LogOut } from 'lucide-react';

type MenuItem = {
  label: string;
  href: string;
  icon: JSX.Element;
  danger?: boolean;
};

export default function SidebarWrapper({
  menu,
  profileHref = '/supervisor/profile',
}: {
  menu: MenuItem[];
  profileHref?: string;
}) {
  const pathname = usePathname();

  const [user, setUser] = useState<{ name: string; role: string; avatar?: string }>({
    name: '',
    role: '',
  });

  useEffect(() => {
    const loadUser = () => {
      const stored = localStorage.getItem('user');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setUser({
            name: parsed.name || '',
            role: parsed.role || 'Supervisor',
            avatar: parsed.avatar || '',
          });
        } catch {
          // fallback if parsing fails
        }
      }
    };

    loadUser(); // initial load
    window.addEventListener('user-updated', loadUser); // listen for profile updates

    return () => {
      window.removeEventListener('user-updated', loadUser);
    };
  }, []);

  const getInitials = (fullName: string) => {
    const parts = fullName.trim().split(' ');
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <aside className="w-64 h-screen fixed left-0 top-0 bg-white shadow px-6 py-8 flex flex-col justify-between">
      <div>
        <h1 className="text-xl font-bold text-cyan-600 mb-8">ErgoCheck</h1>

        <Link
          href={profileHref}
          className="flex items-center gap-3 mb-8 hover:bg-gray-100 px-3 py-2 rounded-md transition"
        >
          <div className="w-10 h-10 rounded-full bg-sky-500 flex items-center justify-center text-white font-semibold text-sm uppercase">
            {user.name ? getInitials(user.name) : '?'}
          </div>

          <div>
            <p className="font-semibold text-sm text-slate-800 truncate max-w-[120px]">{user.name}</p>
            <p className="text-xs text-gray-500 capitalize">{user.role}</p>
          </div>
        </Link>

        <nav className="space-y-2">
          {menu.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm ${
                pathname === item.href
                  ? 'bg-sky-100 text-sky-600 font-semibold'
                  : item.danger
                  ? 'text-red-500 hover:bg-red-50'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <button
        onClick={() => {
          localStorage.clear();
          window.location.href = '/auth/login';
        }}
        className="w-full flex items-center gap-2 px-4 py-2 rounded-md hover:bg-red-50 text-red-500 hover:text-red-600 transition text-sm font-medium justify-start"
      >
        <LogOut className="w-5 h-5" />
        <span>Keluar</span>
      </button>
    </aside>
  );
}

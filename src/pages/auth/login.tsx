'use client';

import { useRef, useState } from 'react';
import { Eye, EyeOff, Lock, Mail, LogIn } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';
import axios from '@/lib/axios';
import { jwtDecode } from 'jwt-decode';

export default function LoginPage() {
  const router = useRouter();
  const passwordRef = useRef<HTMLInputElement>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('superadmin'); // hanya untuk pilih endpoint login
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = { email, password };
      let endpoint = '/auth/login';
      if (role === 'superadmin') endpoint = '/auth/super-admin/login';

      const res = await axios.post(endpoint, payload);
      const { token, companyId, name, email: userEmail } = res.data.data;

      // ✅ Decode token untuk ambil userId & role
      const decoded: { userId: string; role: string; companyId?: string } = jwtDecode(token);

      // ✅ Simpan data ke localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('userId', decoded.userId);
      localStorage.setItem('role', decoded.role);
      localStorage.setItem('name', name);

      localStorage.setItem('user', JSON.stringify({
        id: decoded.userId,
        name,
        email: userEmail,
        role: decoded.role,
      }));

      if (decoded.role === 'supervisor' && companyId) {
        localStorage.setItem('companyId', companyId);
      }

      // ✅ Trigger event supaya Sidebar update
      window.dispatchEvent(new Event('user-updated'));

      // ✅ Redirect sesuai role
      if (decoded.role === 'superadmin') router.push('/dashboard/superadmin');
      else if (decoded.role === 'supervisor') router.push('/dashboard/supervisor');
      else router.push('/dashboard/user');

    } catch (err: any) {
      const message = err?.response?.data?.message || 'Login gagal. Coba lagi.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout withTransparentFooter>
      <Seo templateTitle="Login" />
      <div className="flex-grow flex justify-center items-center bg-gradient-to-br from-sky-50 via-cyan-50 to-teal-50 px-4 py-12">
        <form onSubmit={handleSubmit} className="w-full max-w-md rounded-3xl bg-white p-8 shadow-lg">
          <div className="rounded-t-2xl bg-gradient-to-r from-sky-500 to-teal-500 px-6 py-4 mb-6 text-center">
            <h2 className="text-lg font-bold text-white">Login</h2>
            <p className="text-sm text-white mt-1">Masuk ke akun Anda</p>
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="relative">
              <input
                type="email"
                placeholder="nama@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && passwordRef.current?.focus()}
                className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2 text-sm placeholder-gray-400 focus:border-cyan-500 focus:ring-cyan-500"
                required
              />
              <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input
                ref={passwordRef}
                type={showPassword ? 'text' : 'password'}
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-300 pl-10 pr-10 py-2 text-sm placeholder-gray-400 focus:border-cyan-500 focus:ring-cyan-500"
                required
              />
              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-400"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Role */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Masuk sebagai</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-cyan-500 focus:ring-cyan-500"
            >
              <option value="superadmin">Superadmin</option>
              <option value="supervisor">Supervisor</option>
              <option value="employee">Employee</option>
              <option value="personal">Personal</option>
            </select>
          </div>

          {/* Error */}
          {error && <p className="mb-3 text-sm text-center text-red-600">{error}</p>}

          {/* Button */}
          <div className="mt-4">
            <button
              type="submit"
              disabled={loading || !email || !password}
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-sky-500 to-teal-500 px-6 py-2 text-sm font-medium text-white shadow hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Masuk...' : 'Login'}
              <LogIn className="h-4 w-4" />
            </button>
          </div>

          {/* Register */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Belum punya akun?{' '}
            <Link href="/auth/register" className="text-cyan-600 font-medium hover:underline">
              Daftar disini
            </Link>
          </p>
        </form>
      </div>
    </Layout>
  );
}
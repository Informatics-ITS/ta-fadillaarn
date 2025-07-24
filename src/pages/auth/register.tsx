'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Eye, EyeOff, Lock, Mail, User, ArrowRight, User2,
} from 'lucide-react';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';
import axios from '@/lib/axios';

const accountTypes = [
  { key: 'personal', label: 'Personal', desc: 'Untuk pengguna individu', icon: User2 },
  { key: 'supervisor', label: 'Supervisor', desc: 'Untuk pemantau karyawan', icon: User },
];

export default function RegisterPage() {
  const [selectedType, setSelectedType] = useState<'personal' | 'supervisor'>('personal');
  const [showPassword, setShowPassword] = useState(false);
  const [agree, setAgree] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyId, setCompanyId] = useState('');
  const [companies, setCompanies] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const companyRef = useRef<HTMLSelectElement>(null);
  const agreeRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await axios.get('/company/get-all-company');
        setCompanies(res.data.data);
      } catch (err) {
        console.error('❌ Gagal ambil data perusahaan:', err);
      }
    };
    if (selectedType === 'supervisor') fetchCompanies();
  }, [selectedType]);

  const handleRegister = async () => {
    setLoading(true);
    setError('');

    if (password.length < 8) {
      setError('Password minimal 8 karakter.');
      setLoading(false);
      return;
    }

    const payload =
      selectedType === 'supervisor'
        ? { name, email, password, companyId }
        : { name, email, password };

    const endpoint =
      selectedType === 'personal'
        ? '/personal/register'
        : '/supervisor/register';

    try {
      const headers =
        selectedType === 'supervisor'
          ? { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
          : {};

      await axios.post(endpoint, payload, headers);
      window.location.href = '/auth/login';
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Terjadi kesalahan. Silakan coba lagi.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Seo templateTitle='Register' />
      <div className='min-h-screen bg-gradient-to-br from-sky-50 via-cyan-50 to-teal-50 flex justify-center items-start pt-24 px-4'>
        <div className='w-full max-w-md rounded-3xl bg-white p-8 shadow-lg'>

          {/* Header */}
          <div className='rounded-t-2xl bg-gradient-to-r from-sky-500 to-teal-500 px-6 py-4 mb-6 text-center'>
            <h2 className='text-lg font-bold text-white'>Buat Akun Baru</h2>
            <p className='text-sm text-white mt-1'>Daftar untuk memulai perjalanan ergonomis Anda</p>
          </div>

          {/* Tipe Akun */}
          <div className='mb-6'>
            <label className='block text-sm font-semibold text-gray-800 mb-2'>Tipe Akun</label>
            <div className='flex gap-2'>
              {accountTypes.map((type) => {
                const Icon = type.icon;
                const isActive = selectedType === type.key;
                return (
                  <button
                    key={type.key}
                    onClick={() => setSelectedType(type.key as any)}
                    className={`flex-1 rounded-lg border px-4 py-3 text-sm transition text-left ${
                      isActive
                        ? 'border-cyan-500 bg-cyan-50 text-cyan-600'
                        : 'border-gray-300 bg-white text-gray-800'
                    }`}
                  >
                    <div className='flex items-center gap-2 mb-1'>
                      <Icon className='h-4 w-4' />
                      <span className='font-medium'>{type.label}</span>
                    </div>
                    <p className='text-xs text-gray-500'>{type.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Nama */}
          <div className='mb-4'>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Nama Lengkap</label>
            <div className='relative'>
              <input
                ref={nameRef}
                type='text'
                placeholder='Masukkan nama lengkap'
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    emailRef.current?.focus();
                  }
                }}
                className='w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2 text-sm placeholder-gray-400 focus:border-cyan-500 focus:ring-cyan-500'
              />
              <User className='absolute left-3 top-2.5 h-5 w-5 text-gray-400' />
            </div>
          </div>

          {/* Email */}
          <div className='mb-4'>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Email</label>
            <div className='relative'>
              <input
                ref={emailRef}
                type='email'
                placeholder='nama@perusahaan.com'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    passwordRef.current?.focus();
                  }
                }}
                className='w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2 text-sm placeholder-gray-400 focus:border-cyan-500 focus:ring-cyan-500'
              />
              <Mail className='absolute left-3 top-2.5 h-5 w-5 text-gray-400' />
            </div>
          </div>

          {/* Password */}
          <div className='mb-2'>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Password</label>
            <div className='relative'>
              <input
                ref={passwordRef}
                type={showPassword ? 'text' : 'password'}
                placeholder='Buat password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (selectedType === 'supervisor') {
                      companyRef.current?.focus();
                    } else {
                      agreeRef.current?.focus();
                    }
                  }
                }}
                className='w-full rounded-lg border border-gray-300 pl-10 pr-10 py-2 text-sm placeholder-gray-400 focus:border-cyan-500 focus:ring-cyan-500'
              />
              <Lock className='absolute left-3 top-2.5 h-5 w-5 text-gray-400' />
              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className='absolute right-3 top-2.5 text-gray-400'
              >
                {showPassword ? <EyeOff className='h-5 w-5' /> : <Eye className='h-5 w-5' />}
              </button>
            </div>
            <p className='text-xs text-gray-500 mt-1'>Minimal 8 karakter, kombinasi huruf dan angka</p>
          </div>

          {/* Company */}
          {selectedType === 'supervisor' && (
            <div className='mb-4'>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Pilih Perusahaan</label>
              <select
                ref={companyRef}
                value={companyId}
                onChange={(e) => setCompanyId(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    agreeRef.current?.focus();
                  }
                }}
                className='w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-cyan-500 focus:ring-cyan-500'
              >
                <option value=''>-- Pilih Perusahaan --</option>
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* Agreement */}
          <div className='mb-6 mt-3 flex items-start gap-2 text-sm'>
            <input
              ref={agreeRef}
              type='checkbox'
              id='agree'
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleRegister();
                }
              }}
              className='mt-1'
            />
            <label htmlFor='agree' className='text-gray-700'>
              Saya menyetujui <Link href='/terms' className='text-cyan-600 hover:underline'>Syarat & Ketentuan</Link> dan <Link href='/privacy' className='text-cyan-600 hover:underline'>Kebijakan Privasi</Link>
            </label>
          </div>

          {error && <p className='mb-3 text-sm text-center text-red-600'>{error}</p>}

          <div>
            <button
              onClick={handleRegister}
              disabled={loading || !agree}
              className='w-full inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-sky-500 to-teal-500 px-6 py-2 text-sm font-medium text-white shadow hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {loading ? 'Mendaftar...' : 'Daftar Sekarang'}
              <ArrowRight className='h-4 w-4' />
            </button>
          </div>

          <p className='mt-6 text-center text-sm text-gray-600'>
            Sudah punya akun? <Link href='/auth/login' className='text-cyan-600 font-medium hover:underline'>Login disini</Link>
          </p>
        </div>
      </div>
    </Layout>
  );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UploadCloud, ArrowRight, ArrowLeft, LayoutDashboard, ClipboardList, FileText, Camera, Award, UserCog } from 'lucide-react';
import axios from '@/lib/axios';
import SidebarWrapper from '@/components/dashboard/SidebarWrapper';

const userMenu = [
  { label: 'Dashboard', href: '/dashboard/user', icon: <LayoutDashboard /> },
  { label: 'Evaluasi Postur', href: '/user/evaluasi', icon: <Camera /> },
  { label: 'Progress Postur', href: '/user/progress', icon: <ClipboardList /> },
  { label: 'Kuis Ergonomi', href: '/user/quiz/kuis', icon: <FileText /> },
  { label: 'Penghargaan', href: '/user/badge', icon: <Award /> },
  { label: 'Profil', href: '/user/profile', icon: <UserCog /> },
];

export default function PostureUploadFoto() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [model, setModel] = useState<'openpose' | 'movenet' | ''>('');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    if (!selected.type.startsWith('image/')) return setError('File harus berupa gambar.');
    if (selected.size > 5 * 1024 * 1024) return setError('Ukuran maksimal 5MB.');

    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
    setError('');
  };

  const handleSubmit = async () => {
    if (!file || !model) return setError('Pilih model dan unggah foto terlebih dahulu.');

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('image', file);

    const endpoint = model === 'movenet' ? '/ergonomic-movenet/upload' : '/ergonomic/upload';

    try {
      const res = await axios.post(endpoint, formData);
      const resultData = res.data?.data;

      console.log('✅ Upload berhasil:', resultData);

      // Simpan ke localStorage (opsional, untuk fallback)
      localStorage.setItem('lastEvaluation', JSON.stringify(resultData));

      // ✅ PERBAIKAN: Tambahkan parameter model pada redirect
      const modelParam = model === 'movenet' ? 'movenet_image' : 'openpose_image';
      router.push(`/user/evaluasi/hasil?model=${modelParam}`);

    } catch (err: any) {
      console.error('❌ Upload gagal:', err);
      setError(err?.response?.data?.message || 'Terjadi kesalahan saat mengunggah.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarWrapper menu={userMenu} profileHref="/user/profile" />
      <main className="flex-1 ml-64 px-8 py-10 bg-white space-y-10">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Evaluasi Postur Kerja</h1>
          <p className="text-sm text-slate-500 mt-1">Ikuti langkah-langkah untuk melakukan evaluasi postur kerja Anda.</p>
          <div className="w-full bg-slate-200 rounded-full h-2 mt-4">
            <div className={`h-full rounded-full ${step === 1 ? 'w-1/3 bg-cyan-400' : 'w-2/3 bg-teal-500'}`} />
          </div>
        </div>

        <div className="w-full max-w-2xl mx-auto space-y-6">
          {step === 1 && (
            <div className="bg-slate-50 border rounded-xl p-8 shadow-sm text-center space-y-4">
              <p className="text-base font-semibold text-slate-700 mb-2">1. Pilih Model Analisis</p>
              <div className="flex justify-center gap-6">
                {['openpose', 'movenet'].map((m) => (
                  <label key={m} className="flex items-center gap-2">
                    <input type="radio" name="model" value={m} checked={model === m} onChange={() => setModel(m as any)} />
                    <span className="capitalize">{m}</span>
                  </label>
                ))}
              </div>
              <div className="flex justify-between pt-6">
                <button onClick={() => window.history.back()} className="flex items-center gap-2 text-sm border border-slate-300 px-4 py-2 rounded-md text-slate-700 bg-white hover:bg-slate-50">
                  <ArrowLeft className="w-4 h-4" />
                  Kembali
                </button>
                <button onClick={() => model && setStep(2)} className={`flex items-center gap-2 px-6 py-2 text-sm font-medium rounded-md ${model ? 'bg-gradient-to-r from-sky-500 to-teal-500 text-white' : 'bg-slate-300 text-white cursor-not-allowed'}`}>
                  Lanjutkan <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="bg-slate-50 border rounded-xl p-8 shadow-sm text-center space-y-6">
              <p className="text-base font-semibold text-slate-700">2. Unggah Foto Postur</p>
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="max-h-64 mx-auto object-contain rounded-md shadow" />
              ) : (
                <div className="flex flex-col items-center space-y-3">
                  <UploadCloud className="w-12 h-12 text-slate-400" />
                  <p className="text-sm text-slate-600">Unggah foto postur kerja Anda dari samping untuk hasil evaluasi terbaik.</p>
                </div>
              )}

              <label className="inline-block bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-medium px-6 py-2 rounded-md cursor-pointer">
                Pilih Foto
                <input type="file" accept="image/*" onChange={handleFileChange} hidden />
              </label>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <div className="flex justify-between pt-4">
                <button onClick={() => setStep(1)} className="flex items-center gap-2 text-sm border border-slate-300 px-4 py-2 rounded-md text-slate-700 bg-white hover:bg-slate-50">
                  <ArrowLeft className="w-4 h-4" />
                  Kembali
                </button>
                <button onClick={handleSubmit} disabled={!file || loading} className={`flex items-center gap-2 px-6 py-2 text-sm font-medium rounded-md ${!file || loading ? 'bg-slate-300 text-white cursor-not-allowed' : 'bg-gradient-to-r from-sky-500 to-teal-500 text-white hover:brightness-110'}`}>
                  {loading ? 'Mengunggah...' : 'Upload & Analisa'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
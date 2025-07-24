'use client';

import { useState } from 'react';
import { UploadCloud, ArrowRight, ArrowLeft } from 'lucide-react';

type Props = {
  onUploaded?: (imageUrl: string) => void;
};

export default function PostureUploadForm({ onUploaded }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    setFile(selected);
    setError('');
  };

  const handleSubmit = async () => {
    if (!file) {
      setError('Silakan pilih file terlebih dahulu.');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file); // ✅ gunakan 'file' bukan 'image'

    try {
      await fetch('https://ergocheck.site/api/ergonomic/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: formData,
      });

      const previewUrl = URL.createObjectURL(file);
      onUploaded?.(previewUrl);
    } catch (err) {
      setError('Upload gagal. Pastikan Anda sudah login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 px-4 md:px-8">
      <div className="bg-white rounded-xl shadow-md p-10 space-y-6 border border-slate-200 w-full">
        <h2 className="text-lg font-semibold text-slate-700 mb-4">
          Unggah Foto Postur Kerja
        </h2>

        <div className="w-full border-2 border-dashed border-slate-300 rounded-lg py-12 flex flex-col items-center text-center space-y-4">
          <UploadCloud className="w-12 h-12 text-slate-400" />
          <p className="text-sm text-slate-600 max-w-sm">
            Unggah foto postur kerja Anda dari samping untuk mendapatkan evaluasi terbaik
          </p>
          <label className="bg-gradient-to-r from-sky-500 to-teal-500 hover:brightness-110 text-white text-sm font-semibold px-5 py-2 rounded-md cursor-pointer transition">
            Pilih Foto
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              hidden
            />
          </label>
        </div>

        {error && <p className="text-sm text-red-600 mt-4">{error}</p>}

        <div className="flex justify-between items-center mt-6">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-1 text-sm text-slate-600 hover:text-slate-800"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </button>

          <button
            onClick={handleSubmit}
            disabled={!file || loading}
            className={`flex items-center gap-2 px-6 py-2 text-sm font-medium rounded-md transition ${
              !file || loading
                ? 'bg-slate-300 text-white cursor-not-allowed'
                : 'bg-gradient-to-r from-sky-500 to-teal-500 text-white hover:brightness-110'
            }`}
          >
            {loading ? 'Mengunggah...' : 'Lanjutkan'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

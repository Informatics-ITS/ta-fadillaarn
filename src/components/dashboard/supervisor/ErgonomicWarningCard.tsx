'use client';

export default function ErgonomicWarningCard() {
  return (
    <div className="bg-orange-50 border-l-4 border-orange-400 text-orange-700 p-4 rounded-md">
      <h4 className="font-semibold">Peringatan Ergonomi</h4>
      <p className="text-sm mt-1">Evaluasi terakhir menunjukkan postur leher Anda perlu perbaikan.</p>
      <a href="#" className="text-sm mt-1 block underline text-orange-700">Lihat Rekomendasi</a>
    </div>
  );
}

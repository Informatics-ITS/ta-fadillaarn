'use client';

type EvaluationItem = {
  id?: string;
  created_at: string;
  score: number;
  risk_level?: string;
  source: string;
};

type Props = {
  data: EvaluationItem[];
  loading: boolean;
};

export default function PostureHistoryList({ data, loading }: Props) {
  return (
    <div className="w-full bg-white border rounded-xl p-4 shadow space-y-3">
      <h2 className="text-lg font-semibold text-slate-800 mb-2">Riwayat Evaluasi</h2>

      {loading ? (
        <p className="text-sm text-slate-500">Memuat data...</p>
      ) : data.length === 0 ? (
        <p className="text-sm text-slate-500">Belum ada data evaluasi</p>
      ) : (
        <ul className="divide-y text-sm">
          {data.map((item, i) => (
            <li key={i} className="flex justify-between py-2 items-center">
              <div>
                <p className="font-medium text-slate-700">
                  {new Date(item.created_at).toLocaleDateString('id-ID', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
                <p className="text-slate-500 text-xs">
                  Risiko: {item.risk_level || 'Tidak diketahui'} • {item.source}
                </p>
              </div>
              <span className="font-bold text-cyan-600">{item.score ?? '-'}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

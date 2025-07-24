'use client';

import Button from '@/components/buttons/Button';

type EvaluationDetailModalProps = {
  visible: boolean;
  onClose: () => void;
  data: {
    name: string;
    email: string;
    department: string;
    score: number;
    risk: string;
    date: string;
  } | null;
};

export default function EvaluationDetailModal({
  visible,
  onClose,
  data,
}: EvaluationDetailModalProps) {
  if (!visible || !data) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center overflow-y-auto">
      <div className="bg-white p-6 rounded-md shadow-md w-full max-w-md space-y-4">
        <h2 className="text-xl font-semibold">Detail Evaluasi Postur</h2>

        <div className="text-sm space-y-2">
          <p><span className="font-medium">Nama:</span> {data.name}</p>
          <p><span className="font-medium">Email:</span> {data.email}</p>
          <p><span className="font-medium">Departemen:</span> {data.department}</p>
          <p><span className="font-medium">Tanggal Evaluasi:</span> {data.date}</p>
          <p><span className="font-medium">Skor:</span> {data.score}</p>
          <p>
            <span className="font-medium">Risiko:</span>{' '}
            <span
              className={`inline-block px-2 py-0.5 rounded-full text-white text-xs ${
                data.risk === 'High'
                  ? 'bg-red-500'
                  : data.risk === 'Medium'
                  ? 'bg-yellow-500'
                  : 'bg-green-500'
              }`}
            >
              {data.risk}
            </span>
          </p>
        </div>

        <div className="flex justify-end">
          <Button onClick={onClose}>Tutup</Button>
        </div>
      </div>
    </div>
  );
}

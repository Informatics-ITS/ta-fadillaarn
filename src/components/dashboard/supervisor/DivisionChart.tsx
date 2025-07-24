'use client';

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

type Props = {
  data: {
    name: string;
    total: number;
  }[];
};

export default function DivisionChart({ data }: Props) {
  if (!data || data.length === 0) {
    return (
      <div className="text-sm text-slate-500">Belum ada data divisi atau karyawan.</div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="total" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

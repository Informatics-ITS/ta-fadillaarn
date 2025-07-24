'use client';

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

type RiskDistData = {
  risk: string;
  count: number;
};

type Props = {
  data: RiskDistData[];
};

const COLORS = ['#10b981', '#facc15', '#ef4444']; // hijau, kuning, merah

export default function ReportChartRiskDistribution({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={data}
          dataKey="count"
          nameKey="risk"
          outerRadius={80}
          label={({ risk, percent }) => `${risk}: ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value: number) => value.toLocaleString()} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

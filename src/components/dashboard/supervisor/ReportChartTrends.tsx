'use client';

import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

type TrendData = {
  date: string;
  avgScore: number;
};

type Props = {
  data: TrendData[];
};

export default function ReportChartTrends({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={data}>
        <CartesianGrid stroke="#f0f0f0" />
        <XAxis dataKey="date" />
        <YAxis domain={[0, 100]} />
        <Tooltip />
        <Line type="monotone" dataKey="avgScore" stroke="#0ea5e9" strokeWidth={3} />
      </LineChart>
    </ResponsiveContainer>
  );
}

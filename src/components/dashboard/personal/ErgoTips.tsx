'use client';

const tips = [
  {
    title: 'Atur Ketinggian Kursi',
    desc: 'Pastikan ketinggian kursi diatur sehingga kaki menapak dengan rata pada lantai.',
  },
  {
    title: 'Jarak Pandang Monitor',
    desc: 'Jarak ideal monitor adalah sekitar 50-70 cm dari mata Anda.',
  },
];

export default function ErgoTips() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Tips Ergonomi</h3>
      <ul className="space-y-2">
        {tips.map((tip, idx) => (
          <li key={idx} className="p-3 bg-cyan-50 rounded-md text-sm">
            <p className="font-medium text-cyan-700">{tip.title}</p>
            <p className="text-gray-600 text-sm">{tip.desc}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

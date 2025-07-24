type Props = {
  options: string[];
  onChange: (index: number, value: string) => void;
};

export default function OptionInput({ options, onChange }: Props) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-gray-700">Pilihan Jawaban</label>
      {options.map((opt, i) => (
        <input
          key={i}
          type="text"
          className="w-full border rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500"
          value={opt}
          placeholder={`Pilihan ${i + 1}`}
          onChange={(e) => onChange(i, e.target.value)}
        />
      ))}
    </div>
  );
}

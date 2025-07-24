'use client';

type QuestionCardProps = {
  question: string;
  options: string[];
  selected: string | null;
  onSelect: (option: string) => void;
};

export default function QuestionCard({ question, options, selected, onSelect }: QuestionCardProps) {
  return (
    <div className="bg-white border rounded-xl p-6 shadow space-y-4">
      <p className="font-medium text-slate-800">{question}</p>
      <div className="space-y-2">
        {options.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => onSelect(opt)}
            className={`w-full text-left px-4 py-2 rounded border transition ${
              selected === opt
                ? 'bg-cyan-500 text-white border-cyan-500'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

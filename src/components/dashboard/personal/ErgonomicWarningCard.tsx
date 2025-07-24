// ErgonomicWarningCard.tsx

interface ErgonomicWarningCardProps {
  message: string;
}

export default function ErgonomicWarningCard({ message }: ErgonomicWarningCardProps) {
  return (
    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded mb-4">
      <p>{message}</p>
    </div>
  );
}
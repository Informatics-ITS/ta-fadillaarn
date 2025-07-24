// components/PostureHistoryCard.tsx
import { Eye } from "lucide-react";

export interface PostureHistoryCardProps {
  id: string;
  model: string;
  createdAt: string;
  reba: number;
  rebaCategory: string;
  rula?: number;
  rulaCategory?: string;
  frames: number;
  duration: string;
  suggestion: string;
  onViewDetail: (id: string) => void;
}

export default function PostureHistoryCard({
  id,
  model,
  createdAt,
  reba,
  rebaCategory,
  rula,
  rulaCategory,
  frames,
  duration,
  suggestion,
  onViewDetail,
}: PostureHistoryCardProps) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm mb-4">
      <div className="flex justify-between items-start">
        <div>
          <div className="text-sm text-gray-500">{createdAt}</div>
          <div className="flex items-center mt-1">
            <div
              className={`w-8 h-8 rounded-md flex items-center justify-center ${
                model.includes("MoveNet") ? "bg-purple-100 text-purple-600" : "bg-indigo-100 text-indigo-600"
              }`}
            >
              <span className="text-sm font-bold">V</span>
            </div>
            <div className="ml-2 text-base font-semibold">Video {model}</div>
          </div>
          <div className="mt-2 space-y-1 text-sm">
            <div>
              REBA: <span className="font-semibold">{reba}</span> –{" "}
              <span className="text-green-600">{rebaCategory}</span>
            </div>
            {rula !== undefined && (
              <div>
                RULA: <span className="font-semibold">{rula}</span> –{" "}
                <span className="text-yellow-600">{rulaCategory}</span>
              </div>
            )}
            <div className="mt-1 text-gray-600">{suggestion}</div>
          </div>
        </div>
        <button onClick={() => onViewDetail(id)} className="text-teal-600 hover:text-teal-800">
          <Eye className="w-5 h-5" />
          <span className="sr-only">Lihat Detail</span>
        </button>
      </div>
      <div className="flex mt-3 text-xs text-gray-500 space-x-4">
        <div>Frames: {frames}</div>
        <div>Durasi: {duration}</div>
      </div>
    </div>
  );
}

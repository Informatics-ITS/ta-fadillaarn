'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SidebarWrapper from '@/components/dashboard/SidebarWrapper';
import {
  LayoutDashboard,
  ClipboardList,
  FileText,
  Camera,
  Award,
  UserCog,
  Eye,
  Calendar,
  TrendingUp,
  Activity,
  Clock,
  BarChart3,
  RefreshCw,
  Sparkles,
  Target,
  Play,
  Image,
  Search,
  Download,
} from 'lucide-react';
import axios from '@/lib/axios';

const userMenu = [
  { label: 'Dashboard', href: '/dashboard/user', icon: <LayoutDashboard /> },
  { label: 'Evaluasi Postur', href: '/user/evaluasi', icon: <Camera /> },
  { label: 'Progress Postur', href: '/user/progress', icon: <ClipboardList /> },
  { label: 'Kuis Ergonomi', href: '/user/quiz/kuis', icon: <FileText /> },
  { label: 'Penghargaan', href: '/user/badge', icon: <Award /> },
  { label: 'Profil', href: '/user/profile', icon: <UserCog /> },
];

const HistoryCard = ({ item, onViewDetail }: { item: any; onViewDetail: (item: any) => void }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getScoreColor = (score: number, type: string) => {
    if (type === 'REBA') {
      if (score <= 3) return 'text-emerald-600 bg-emerald-50';
      if (score <= 7) return 'text-yellow-600 bg-yellow-50';
      return 'text-red-600 bg-red-50';
    } else { // RULA
      if (score <= 2) return 'text-emerald-600 bg-emerald-50';
      if (score <= 4) return 'text-yellow-600 bg-yellow-50';
      return 'text-red-600 bg-red-50';
    }
  };

  const getRiskLevel = (score: number, type: string) => {
    if (type === 'REBA') {
      if (score <= 3) return 'Rendah';
      if (score <= 7) return 'Sedang';
      return 'Tinggi';
    } else {
      if (score <= 2) return 'Rendah';
      if (score <= 4) return 'Sedang';
      return 'Tinggi';
    }
  };

  const getSourceInfo = () => {
    if (item.source === 'Foto - OpenPose') 
      return { icon: <Image className="w-5 h-5" />, color: 'bg-teal-500', label: 'Foto OpenPose' };
    if (item.source === 'Foto - MoveNet') 
      return { icon: <Camera className="w-5 h-5" />, color: 'bg-blue-500', label: 'Foto MoveNet' };
    if (item.source === 'Video - OpenPose') 
      return { icon: <Play className="w-5 h-5" />, color: 'bg-purple-500', label: 'Video OpenPose' };
    if (item.source === 'Video - MoveNet') 
      return { icon: <Activity className="w-5 h-5" />, color: 'bg-indigo-500', label: 'Video MoveNet' };
    return { icon: <Camera className="w-5 h-5" />, color: 'bg-gray-500', label: 'Unknown' };
  };

  const getScores = () => {
    if (item.source === 'Foto - OpenPose') {
      return {
        reba: item.reba_final_score,
        rula: item.rula_final_score,
        hasRula: true
      };
    } else if (item.source === 'Foto - MoveNet') {
      return {
        reba: item.reba_score,
        rula: null,
        hasRula: false
      };
    } else if (item.source === 'Video - OpenPose') {
      return {
        reba: item.average_score_reba_final_score,
        rula: item.average_score_rula_final_score,
        hasRula: true
      };
    } else if (item.source === 'Video - MoveNet') {
      return {
        reba: item.reba_avg || item.avg_reba_score,
        rula: null,
        hasRula: false
      };
    }
    return { reba: null, rula: null, hasRula: false };
  };

  const sourceInfo = getSourceInfo();
  const scores = getScores();

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 ${sourceInfo.color} rounded-lg`}>
            <div className="text-white">
              {sourceInfo.icon}
            </div>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{sourceInfo.label}</h3>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              {formatDate(item.created_at)}
            </div>
          </div>
        </div>
        
        <button
          onClick={() => onViewDetail(item)}
          className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-teal-700 transition-colors"
        >
          <Eye className="w-4 h-4" />
          Lihat Detail
        </button>
      </div>

      {/* Scores */}
      <div className="mb-4">
        {scores.reba !== null && (
          <div className="mb-2">
            <span className="text-sm text-gray-600">REBA: </span>
            <span className={`px-2 py-1 rounded text-sm font-medium ${getScoreColor(scores.reba, 'REBA')}`}>
              {scores.reba?.toFixed(1)} - {getRiskLevel(scores.reba, 'REBA')}
            </span>
          </div>
        )}
        
        {scores.hasRula && scores.rula !== null && (
          <div>
            <span className="text-sm text-gray-600">RULA: </span>
            <span className={`px-2 py-1 rounded text-sm font-medium ${getScoreColor(scores.rula, 'RULA')}`}>
              {scores.rula?.toFixed(1)} - {getRiskLevel(scores.rula, 'RULA')}
            </span>
          </div>
        )}
      </div>

      {/* Feedback */}
      {item.feedback && (
        <div className="mb-4 p-3 bg-gray-50 rounded text-sm text-gray-700">
          {item.feedback}
        </div>
      )}

      {/* Video Info */}
      {item.source.includes('Video') && (
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Activity className="w-4 h-4" />
            Frames: {item.total_frames || item.processed_frames || '-'}
          </div>
          {item.video_duration_seconds && (
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              Durasi: {item.video_duration_seconds.toFixed(1)}s
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default function PostureProgressPage() {
  const router = useRouter();
  const [history, setHistory] = useState<any[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const handleViewDetail = (item: any) => {
    let modelParam = '';
    let jobId = '';

    if (item.source === 'Foto - OpenPose') {
      modelParam = 'openpose_image';
    } else if (item.source === 'Foto - MoveNet') {
      modelParam = 'movenet_image';
    } else if (item.source === 'Video - OpenPose') {
      modelParam = 'video_openpose';
      jobId = item.job_id;
    } else if (item.source === 'Video - MoveNet') {
      modelParam = 'video_movenet';
      jobId = item.job_id;
    }

    const params = new URLSearchParams({ model: modelParam });
    if (jobId) {
      params.append('job_id', jobId);
    }

    router.push(`/user/evaluasi/hasil?${params.toString()}`);
  };

  const fetchAllHistory = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const headers = { Authorization: `Bearer ${token}` };
      
      const [
        openposePict,
        movenetPict,
        openposeVideo,
        movenetVideo,
      ] = await Promise.all([
        axios.get('/ergonomic/ergonomic-history', { headers }),
        axios.get('/ergonomic-movenet/ergonomic-movenet-history', { headers }),
        axios.get('/ergonomic-video/ergonomic-video-history', { headers }),
        axios.get('/ergonomic-video-movenet/movenet-video-history', { headers }),
      ]);

      const allData = [
        ...(openposePict.data?.data || []).map((d: any) => ({
          ...d,
          source: 'Foto - OpenPose',
          created_at: d.created_at || d.timestamp || d.createdAt,
        })),
        ...(movenetPict.data?.data || []).map((d: any) => ({
          ...d,
          source: 'Foto - MoveNet',
          created_at: d.created_at || d.timestamp || d.createdAt,
        })),
        ...(openposeVideo.data?.data || []).map((d: any) => ({
          ...d,
          source: 'Video - OpenPose',
          created_at: d.created_at || d.timestamp || d.createdAt,
        })),
        ...(movenetVideo.data?.data || []).map((d: any) => ({
          ...d,
          source: 'Video - MoveNet',
          created_at: d.created_at || d.timestamp || d.createdAt,
        })),
      ];

      allData.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setHistory(allData);
      setFilteredHistory(allData);
      
    } catch (err) {
      console.error('Failed to fetch history:', err);
      setHistory([]);
      setFilteredHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (type: string) => {
    setFilterType(type);
    let filtered = history;

    if (type !== 'all') {
      filtered = history.filter(item => item.source.toLowerCase().includes(type.toLowerCase()));
    }

    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.feedback && item.feedback.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredHistory(filtered);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    let filtered = history;

    if (filterType !== 'all') {
      filtered = history.filter(item => item.source.toLowerCase().includes(filterType.toLowerCase()));
    }

    if (term) {
      filtered = filtered.filter(item => 
        item.source.toLowerCase().includes(term.toLowerCase()) ||
        (item.feedback && item.feedback.toLowerCase().includes(term.toLowerCase()))
      );
    }

    setFilteredHistory(filtered);
  };

  useEffect(() => {
    fetchAllHistory();
  }, []);

  const getStats = () => {
    const totalEvaluations = history.length;
    const photoEvaluations = history.filter(h => h.source.includes('Foto')).length;
    const videoEvaluations = history.filter(h => h.source.includes('Video')).length;
    const thisMonth = history.filter(h => 
      new Date(h.created_at).getMonth() === new Date().getMonth() &&
      new Date(h.created_at).getFullYear() === new Date().getFullYear()
    ).length;

    return { totalEvaluations, photoEvaluations, videoEvaluations, thisMonth };
  };

  const stats = getStats();

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <SidebarWrapper menu={userMenu} profileHref="/user/profile" />
        <main className="flex-1 ml-64 p-8">
          <div className="space-y-6">
            {/* Header Skeleton */}
            <div className="bg-white p-6 rounded-lg border animate-pulse">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                  <div>
                    <div className="h-6 bg-gray-200 rounded w-48 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                  </div>
                </div>
                <div className="h-8 bg-gray-200 rounded w-16"></div>
              </div>
            </div>

            {/* Stats Skeleton */}
            <div className="grid grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white p-4 rounded-lg border animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-12"></div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarWrapper menu={userMenu} profileHref="/user/profile" />
      <main className="flex-1 ml-64 p-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-white p-6 rounded-lg border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-teal-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-teal-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900">Progress Postur Kerja</h1>
                  <p className="text-gray-600">Pantau perkembangan skor evaluasi postur Anda</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-teal-600">{stats.totalEvaluations}</div>
                <div className="text-sm text-gray-500">Total Evaluasi</div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-6">
            <div className="bg-white p-4 rounded-lg border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Evaluasi</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalEvaluations}</p>
                </div>
                <BarChart3 className="w-8 h-8 text-blue-500" />
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Foto Evaluasi</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.photoEvaluations}</p>
                </div>
                <Camera className="w-8 h-8 text-green-500" />
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Video Evaluasi</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.videoEvaluations}</p>
                </div>
                <Play className="w-8 h-8 text-purple-500" />
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Bulan Ini</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.thisMonth}</p>
                </div>
                <Calendar className="w-8 h-8 text-orange-500" />
              </div>
            </div>
          </div>

          {history.length === 0 ? (
            <div className="bg-white p-12 rounded-lg border text-center">
              <Target className="w-16 h-16 text-teal-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Belum Ada History</h3>
              <p className="text-gray-600 mb-6">
                Lakukan evaluasi postur terlebih dahulu untuk melihat progress dan perkembangan kondisi postur Anda
              </p>
              <button
                onClick={() => router.push('/user/evaluasi')}
                className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors"
              >
                Mulai Evaluasi Sekarang
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Search and Filter */}
              <div className="bg-white p-6 rounded-lg border">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <ClipboardList className="w-6 h-6 text-teal-600" />
                    <h2 className="text-lg font-semibold text-gray-900">Riwayat Evaluasi</h2>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Cari evaluasi..."
                        className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                      />
                    </div>

                    <select
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      value={filterType}
                      onChange={(e) => handleFilter(e.target.value)}
                    >
                      <option value="all">Semua Tipe</option>
                      <option value="foto">Foto</option>
                      <option value="video">Video</option>
                    </select>

                    <button
                      onClick={fetchAllHistory}
                      className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Refresh
                    </button>
                  </div>
                </div>
              </div>

              {/* History List */}
              <div className="space-y-4">
                {filteredHistory.length === 0 ? (
                  <div className="bg-white p-12 rounded-lg border text-center">
                    <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Tidak Ada Hasil</h3>
                    <p className="text-gray-600">
                      {searchTerm || filterType !== 'all' 
                        ? 'Coba ubah filter atau kata kunci pencarian'
                        : 'Belum ada riwayat evaluasi yang tersedia'
                      }
                    </p>
                  </div>
                ) : (
                  filteredHistory.map((item, index) => (
                    <HistoryCard 
                      key={`${item.source}-${item.id || index}`} 
                      item={item} 
                      onViewDetail={handleViewDetail}
                    />
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import SidebarWrapper from '@/components/dashboard/SidebarWrapper';
import GradientButton from '@/components/buttons/GradientButton';
import { LayoutDashboard, ClipboardList, FileText, Camera, Award, User } from 'lucide-react';
import axios from '@/lib/axios';
import router from 'next/router';

const userMenu = [
  { label: 'Dashboard', href: '/dashboard/user', icon: <LayoutDashboard /> },
  { label: 'Evaluasi Postur', href: '/user/evaluasi', icon: <Camera /> },
  { label: 'Progress Postur', href: '/user/progress', icon: <ClipboardList /> },
  { label: 'Kuis Ergonomi', href: '/user/kuis', icon: <FileText /> },
  { label: 'Penghargaan', href: '/user/badge', icon: <Award /> },
  { label: 'Profil', href: '/user/profile', icon: <User /> },
];

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-sm font-semibold text-teal-600 mb-3">{children}</h2>
);

const ScoreCard = ({ label, value, description }: { label: string; value: any; description?: string }) => (
  <div className="rounded-xl border border-teal-400 bg-white px-4 py-3 text-center shadow-sm">
    <p className="text-xs text-slate-500">{label}</p>
    <p className="text-base font-bold text-slate-700">
      {value !== undefined && value !== null ? value : '-'}
    </p>
    {description && <p className="text-xs text-slate-400 mt-1">{description}</p>}
  </div>
);

const InfoCard = ({ title, content }: { title: string; content: string }) => (
  <div className="bg-white p-5 rounded-2xl border border-teal-200 shadow-sm space-y-1">
    <SectionTitle>{title}</SectionTitle>
    <p className="text-sm text-slate-700">{content || '-'}</p>
  </div>
);

export default function HasilEvaluasiPage() {
  const searchParams = useSearchParams();
  const model = searchParams.get('model') || 'openpose_image';
  const jobId = searchParams.get('job_id');

  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processingStatus, setProcessingStatus] = useState<'processing' | 'completed' | 'failed'>('processing');
  const [pollingCount, setPollingCount] = useState(0);
  const [retryCount, setRetryCount] = useState(0);

  // Debug: Log parameters
  console.log('Current URL params:', {
    model,
    jobId,
    allParams: Object.fromEntries(searchParams.entries())
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Unauthorized');

        let url = '';
        switch (model) {
          case 'openpose_image':
            url = '/ergonomic/ergonomic-history';
            break;
          case 'movenet_image':
            url = '/ergonomic-movenet/ergonomic-movenet-history';
            break;
          case 'video_openpose':
            url = `/ergonomic-video/result?job_id=${jobId}`;
            break;
          case 'video_movenet':
            url = `/ergonomic-video-movenet/result?job_id=${jobId}`;
            break;
          default:
            url = '/ergonomic/ergonomic-history';
        }

        console.log('Fetching from URL:', url);
        const res = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
        let data = res.data?.data || res.data;
        
        console.log('Raw API Response:', res.data);
        console.log('Parsed data:', data);
        
        // Reset retry count on successful request
        setRetryCount(0);
        
        if (Array.isArray(data)) data = data[0];
        if (!data) throw new Error('Data kosong');
        
        console.log('Final data:', data);

        // For video processing, check status
        if ((model === 'video_openpose' || model === 'video_movenet')) {
          console.log('Video processing detected, status:', data.status);
          
          if (data.status && (data.status === 'processing' || data.status === 'pending')) {
            console.log('Still processing, continuing polling...');
            setProcessingStatus('processing');
            setPollingCount(prev => prev + 1);
            
            // Continue polling every 5 seconds, max 120 attempts (10 minutes)
            if (pollingCount < 120) {
              setTimeout(() => {
                fetchData();
              }, 5000);
            } else {
              throw new Error('Timeout: Processing terlalu lama. Silakan coba lagi.');
            }
            return;
          } else if (!data.status || data.status === 'done' || data.status === 'completed') {
            console.log('Processing completed!');
            setProcessingStatus('completed');
          } else if (data.status === 'failed' || data.status === 'error') {
            console.log('Processing failed!');
            setProcessingStatus('failed');
            throw new Error('Processing video gagal. Silakan coba upload ulang.');
          }
        }

        console.log('Setting result and completing...');
        setResult(data);
        setLoading(false);
        setError('');
        
      } catch (err: any) {
        console.error('Fetch error:', err);
        
        // Handle 500 errors and network issues with retry
        const isServerError = err?.response?.status >= 500 || err?.code === 'NETWORK_ERROR';
        const isVideoProcessing = model === 'video_openpose' || model === 'video_movenet';
        
        if (isServerError && isVideoProcessing && retryCount < 5) {
          console.log(`Server error, retrying... (${retryCount + 1}/5)`);
          setRetryCount(prev => prev + 1);
          setPollingCount(prev => prev + 1);
          
          // Retry after 10 seconds for server errors
          setTimeout(() => {
            fetchData();
          }, 10000);
          return;
        }
        
        // If not a retryable error or max retries reached
        let errorMessage = 'Gagal memuat data evaluasi';
        if (err?.response?.status === 500) {
          errorMessage = 'Server sedang mengalami gangguan. Mohon tunggu sebentar dan coba lagi.';
        } else if (err?.response?.status === 404) {
          errorMessage = 'Data tidak ditemukan. Mungkin video masih dalam proses.';
        } else if (err?.message) {
          errorMessage = err.message;
        }
        
        setError(errorMessage);
        setLoading(false);
        setProcessingStatus('failed');
      }
    };

    fetchData();
  }, [model, jobId]); // Remove pollingCount and retryCount from dependencies

  if (loading || (processingStatus === 'processing' && (model === 'video_openpose' || model === 'video_movenet'))) {
    return (
      <div className="flex justify-center items-center min-h-screen flex-col space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
        {(model === 'video_openpose' || model === 'video_movenet') ? (
          <div className="text-center">
            <p className="text-lg font-medium text-slate-700">Sedang memproses video...</p>
            <p className="text-sm text-slate-500">Ini mungkin membutuhkan beberapa menit</p>
            <p className="text-xs text-slate-400">Percobaan: {pollingCount}/120</p>
            {retryCount > 0 && (
              <p className="text-xs text-orange-500">Mencoba ulang karena server error: {retryCount}/5</p>
            )}
          </div>
        ) : (
          <p className="text-slate-600">Memuat hasil...</p>
        )}
      </div>
    );
  }
  if (error) return (
    <div className="flex justify-center items-center min-h-screen flex-col space-y-4">
      <div className="text-center max-w-md">
        <div className="mb-4">
          {error.includes('Server') ? (
            <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">⚠️</span>
            </div>
          ) : (
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">❌</span>
            </div>
          )}
        </div>
        <h2 className="text-xl font-semibold text-red-600 mb-2">Terjadi Kesalahan</h2>
        <p className="text-red-500 mb-6">{error}</p>
        <div className="space-y-3">
          <button 
            onClick={() => window.location.reload()} 
            className="w-full bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700"
          >
            Coba Lagi
          </button>
          <button 
            onClick={() => router.push('/user/evaluasi')} 
            className="w-full bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
          >
            Kembali ke Evaluasi
          </button>
        </div>
      </div>
    </div>
  );

  const getModelTitle = () => {
    switch (model) {
      case 'openpose_image': return 'OpenPose Image';
      case 'movenet_image': return 'MoveNet Image';
      case 'video_openpose': return 'Video OpenPose';
      case 'video_movenet': return 'Video MoveNet';
      default: return 'Unknown Model';
    }
  };

  const imageSrc = result.fileUrl || result.visualization_path || result.representative_image;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarWrapper menu={userMenu} profileHref="/user/profile" />
      <main className="flex-1 ml-64 px-6 py-10 space-y-8">
        {(model === 'video_openpose' || model === 'video_movenet') && processingStatus === 'processing' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <div>
                <h3 className="text-lg font-medium text-blue-800">Video sedang diproses...</h3>
                <p className="text-sm text-blue-600">Estimasi waktu: 2-5 menit tergantung durasi video</p>
                <div className="mt-2 bg-blue-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((pollingCount / 120) * 100, 95)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-blue-500 mt-1">Percobaan: {pollingCount}/120</p>
                {retryCount > 0 && (
                  <p className="text-xs text-orange-600">Server error, mencoba ulang: {retryCount}/5</p>
                )}
              </div>
            </div>
          </div>
        )}

        <h1 className="text-2xl font-bold text-slate-800">Hasil Evaluasi - {getModelTitle()}</h1>

        {imageSrc && (
          <div className="flex justify-center">
            <img src={imageSrc} alt="Hasil Evaluasi" className="w-full max-w-2xl rounded-2xl shadow-lg" />
          </div>
        )}

        {/* ================= OpenPose Image ================= */}
        {model === 'openpose_image' && (
          <>
            <InfoCard 
              title="Feedback Deteksi Postur" 
              content={result.feedback} 
            />

            <div>
              <SectionTitle>Skor REBA & RULA</SectionTitle>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <ScoreCard label="REBA Final" value={result.reba_final_score} />
                <ScoreCard label="RULA Final" value={result.rula_final_score} />
                <ScoreCard label="REBA Leg" value={result.reba_leg_score} />
                <ScoreCard label="REBA Neck" value={result.reba_neck_score} />
              </div>
            </div>

            <div>
              <SectionTitle>Detail Skor REBA</SectionTitle>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <ScoreCard label="Trunk" value={result.reba_trunk_score} />
                <ScoreCard label="Upper Arm" value={result.reba_upper_arm_score} />
                <ScoreCard label="Lower Arm" value={result.reba_lower_arm_score} />
                <ScoreCard label="Wrist" value={result.reba_wrist_score} />
              </div>
            </div>

            <div>
              <SectionTitle>Detail Skor RULA</SectionTitle>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <ScoreCard label="Trunk" value={result.rula_trunk_score} />
                <ScoreCard label="Upper Arm" value={result.rula_upper_arm_score} />
                <ScoreCard label="Lower Arm" value={result.rula_lower_arm_score} />
                <ScoreCard label="Wrist" value={result.rula_wrist_score} />
              </div>
            </div>

            <div>
              <SectionTitle>Sudut Tubuh</SectionTitle>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <ScoreCard label="Bahu" value={`${result.details_sudut_bahu?.toFixed(1)}°`} />
                <ScoreCard label="Leher" value={`${result.details_sudut_leher?.toFixed(1)}°`} />
                <ScoreCard label="Lutut" value={`${result.details_sudut_lutut?.toFixed(1)}°`} />
                <ScoreCard label="Punggung" value={`${result.details_sudut_punggung?.toFixed(1)}°`} />
                <ScoreCard label="Siku" value={`${result.details_sudut_siku?.toFixed(1)}°`} />
                <ScoreCard label="Pergelangan" value={`${result.details_sudut_pergelangan?.toFixed(1)}°`} />
              </div>
            </div>

            <div>
              <SectionTitle>Adjustment Factors</SectionTitle>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <ScoreCard label="Arm Supported" value={result.details_adjust_arm_supported === 1 ? 'Ya' : result.details_adjust_arm_supported === -1 ? 'Tidak' : 'Netral'} />
                <ScoreCard label="Legs/Feet" value={result.details_adjust_legs_feet === 1 ? 'Ya' : 'Tidak'} />
                <ScoreCard label="Neck Twist" value={result.details_adjust_neck_twist === 1 ? 'Ya' : 'Tidak'} />
                <ScoreCard label="Shoulder Raised" value={result.details_adjust_shoulder_raised === 1 ? 'Ya' : 'Tidak'} />
                <ScoreCard label="Trunk Twist" value={result.details_adjust_trunk_twist === 1 ? 'Ya' : 'Tidak'} />
                <ScoreCard label="Wrist Twist" value={result.details_adjust_wrist_twist === 1 ? 'Ya' : 'Tidak'} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoCard 
                title="Ringkasan REBA" 
                content={result.reba_summary} 
              />
              <InfoCard 
                title="Ringkasan RULA" 
                content={result.rula_summary} 
              />
            </div>
          </>
        )}

        {/* ================= MoveNet Image ================= */}
        {model === 'movenet_image' && (
          <>
            <InfoCard 
              title="Feedback Deteksi Postur" 
              content={result.feedback} 
            />

            <div>
              <SectionTitle>Skor REBA & Komponen</SectionTitle>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <ScoreCard label="REBA Score" value={result.reba_score?.toFixed(2)} description={result.risk_level} />
                <ScoreCard label="Leg Score" value={result.component_scores_leg_score} />
                <ScoreCard label="Neck Score" value={result.component_scores_neck_score} />
                <ScoreCard label="Trunk Score" value={result.component_scores_trunk_score} />
              </div>
            </div>

            <div>
              <SectionTitle>Detail Skor Komponen</SectionTitle>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <ScoreCard label="Upper Arm" value={result.component_scores_upper_arm_score} />
                <ScoreCard label="Lower Arm" value={result.component_scores_lower_arm_score} />
                <ScoreCard label="REBA Component" value={result.component_scores_reba_score?.toFixed(2)} />
              </div>
            </div>

            <div>
              <SectionTitle>Sudut Tubuh</SectionTitle>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <ScoreCard label="Neck" value={`${result.angle_values_neck?.toFixed(1)}°`} />
                <ScoreCard label="Left Upper Arm" value={`${result.angle_values_left_upper_arm?.toFixed(1)}°`} />
                <ScoreCard label="Right Upper Arm" value={`${result.angle_values_right_upper_arm?.toFixed(1)}°`} />
                <ScoreCard label="Waist" value={`${result.angle_values_waist?.toFixed(1)}°`} />
                <ScoreCard label="Left Leg" value={`${result.angle_values_left_leg}°`} />
                <ScoreCard label="Right Leg" value={`${result.angle_values_right_leg?.toFixed(1)}°`} />
                <ScoreCard label="Left Lower Arm" value={`${result.angle_values_left_lower_arm}°`} />
                <ScoreCard label="Right Lower Arm" value={`${result.angle_values_right_lower_arm}°`} />
              </div>
            </div>
          </>
        )}

        {/* ================= Video OpenPose ================= */}
        {model === 'video_openpose' && (
          <>
            <InfoCard 
              title="Feedback Deteksi Postur" 
              content={result.most_common_feedback} 
            />

            <div>
              <SectionTitle>Ringkasan Video</SectionTitle>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <ScoreCard label="Total Frames" value={result.total_frames} />
                <ScoreCard label="Status" value={result.status} />
                <ScoreCard label="Avg REBA" value={result.average_score_reba_final_score?.toFixed(2)} />
                <ScoreCard label="Avg RULA" value={result.average_score_rula_final_score?.toFixed(2)} />
              </div>
            </div>

            <div>
              <SectionTitle>Skor Rata-rata REBA</SectionTitle>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <ScoreCard label="Final Score" value={result.average_score_reba_final_score?.toFixed(2)} />
                <ScoreCard label="Leg" value={result.average_score_leg_score?.toFixed(2)} />
                <ScoreCard label="Neck" value={result.average_score_neck_score?.toFixed(2)} />
                <ScoreCard label="Trunk" value={result.average_score_trunk_score?.toFixed(2)} />
                <ScoreCard label="Upper Arm" value={result.average_score_upper_arm_score?.toFixed(2)} />
                <ScoreCard label="Lower Arm" value={result.average_score_lower_arm_score?.toFixed(2)} />
                <ScoreCard label="Wrist" value={result.average_score_wrist_score?.toFixed(2)} />
              </div>
            </div>

            <div>
              <SectionTitle>Skor Rata-rata RULA</SectionTitle>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <ScoreCard label="Final Score" value={result.average_score_rula_final_score?.toFixed(2)} />
                <ScoreCard label="Leg" value={result.average_score_rula_leg_score?.toFixed(2)} />
                <ScoreCard label="Neck" value={result.average_score_rula_neck_score?.toFixed(2)} />
                <ScoreCard label="Trunk" value={result.average_score_rula_trunk_score?.toFixed(2)} />
                <ScoreCard label="Upper Arm" value={result.average_score_rula_upper_arm_score?.toFixed(2)} />
                <ScoreCard label="Lower Arm" value={result.average_score_rula_lower_arm_score?.toFixed(2)} />
                <ScoreCard label="Wrist" value={result.average_score_rula_wrist_score?.toFixed(2)} />
              </div>
            </div>

            <div>
              <SectionTitle>Sudut Tubuh Rata-rata</SectionTitle>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <ScoreCard label="Bahu" value={`${result.average_sudut_sudut_bahu?.toFixed(1)}°`} />
                <ScoreCard label="Leher" value={`${result.average_sudut_sudut_leher?.toFixed(1)}°`} />
                <ScoreCard label="Lutut" value={`${result.average_sudut_sudut_lutut?.toFixed(1)}°`} />
                <ScoreCard label="Punggung" value={`${result.average_sudut_sudut_punggung?.toFixed(1)}°`} />
                <ScoreCard label="Siku" value={`${result.average_sudut_sudut_siku?.toFixed(1)}°`} />
                <ScoreCard label="Pergelangan" value={`${result.average_sudut_sudut_pergelangan?.toFixed(1)}°`} />
              </div>
            </div>

            <div>
              <SectionTitle>Skor Mayoritas</SectionTitle>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <ScoreCard label="REBA Final" value={result.majority_score_reba_final_score} />
                <ScoreCard label="RULA Final" value={result.majority_score_rula_final_score} />
                <ScoreCard label="REBA Trunk" value={result.majority_score_reba_trunk_score} />
                <ScoreCard label="RULA Trunk" value={result.majority_score_rula_trunk_score} />
                <ScoreCard label="REBA Upper Arm" value={result.majority_score_reba_upper_arm_score} />
                <ScoreCard label="RULA Upper Arm" value={result.majority_score_rula_upper_arm_score} />
              </div>
            </div>

            <div>
              <SectionTitle>Skor Maksimum & Minimum</SectionTitle>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <ScoreCard label="Max REBA" value={result.max_scores_reba_final_score} />
                <ScoreCard label="Min REBA" value={result.min_scores_reba_final_score} />
                <ScoreCard label="Max RULA" value={result.max_scores_rula_final_score} />
                <ScoreCard label="Min RULA" value={result.min_scores_rula_final_score} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoCard 
                title="Ringkasan REBA" 
                content={result.reba_summary} 
              />
              <InfoCard 
                title="Ringkasan RULA" 
                content={result.rula_summary} 
              />
            </div>

            <InfoCard 
              title="Ringkasan Keseluruhan" 
              content={result.summary} 
            />
          </>
        )}

        {/* ================= Video MoveNet ================= */}
        {model === 'video_movenet' && (
          <>
            <InfoCard 
              title="Feedback Deteksi Postur" 
              content={result?.feedback || 'No feedback available'} 
            />

            <div>
              <SectionTitle>Informasi Video</SectionTitle>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <ScoreCard label="Total Frames" value={result?.video_total_frames} />
                <ScoreCard label="Processed Frames" value={result?.processed_frames} />
                <ScoreCard label="Duration" value={`${result?.video_duration_seconds?.toFixed(1)}s`} />
                <ScoreCard label="FPS" value={result?.video_fps?.toFixed(1)} />
                <ScoreCard label="Segments" value={result?.video_segments_count} />
                <ScoreCard label="Filename" value={result?.video_filename} />
              </div>
            </div>

            <div>
              <SectionTitle>Skor REBA Statistik</SectionTitle>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <ScoreCard 
                  label="Avg REBA" 
                  value={result?.avg_reba_score?.toFixed(3)} 
                  description={result?.avg_risk_level} 
                />
                <ScoreCard 
                  label="Max REBA" 
                  value={result?.max_reba_score?.toFixed(3)} 
                />
                <ScoreCard 
                  label="Max Risk Level" 
                  value={result?.max_risk_level} 
                />
              </div>
            </div>

            <div>
              <SectionTitle>Skor Komponen Rata-rata</SectionTitle>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <ScoreCard 
                  label="Neck Score" 
                  value={result?.avg_component_scores_neck?.toFixed(2)} 
                />
                <ScoreCard 
                  label="Trunk Score" 
                  value={result?.avg_component_scores_trunk?.toFixed(2)} 
                />
                <ScoreCard 
                  label="Upper Arm Score" 
                  value={result?.avg_component_scores_upper_arm?.toFixed(2)} 
                />
                <ScoreCard 
                  label="Lower Arm Score" 
                  value={result?.avg_component_scores_lower_arm?.toFixed(2)} 
                />
              </div>
            </div>

            <div>
              <SectionTitle>Skor Komponen Maksimum</SectionTitle>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <ScoreCard 
                  label="Max Neck Score" 
                  value={result?.max_component_scores_neck} 
                />
                <ScoreCard 
                  label="Max Trunk Score" 
                  value={result?.max_component_scores_trunk} 
                />
                <ScoreCard 
                  label="Max Upper Arm Score" 
                  value={result?.max_component_scores_upper_arm} 
                />
                <ScoreCard 
                  label="Max Lower Arm Score" 
                  value={result?.max_component_scores_lower_arm} 
                />
              </div>
            </div>

            <div>
              <SectionTitle>Distribusi Risiko</SectionTitle>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <ScoreCard 
                  label="High Risk Frames" 
                  value={result?.risk_distribution_high_risk_frames} 
                />
                <ScoreCard 
                  label="Low Risk Frames" 
                  value={result?.risk_distribution_low_risk_frames} 
                />
                <ScoreCard 
                  label="Medium Risk Frames" 
                  value={result?.risk_distribution_medium_risk_frames} 
                />
              </div>
            </div>

            <div>
              <SectionTitle>Segmentasi Video</SectionTitle>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <ScoreCard label="Segment Index" value={result?.segment_index} />
                <ScoreCard label="Start Frame" value={result?.segment_start_frame} />
                <ScoreCard label="End Frame" value={result?.segment_end_frame} />
                <ScoreCard label="Start Time" value={result?.segment_start_time ? `${result.segment_start_time.toFixed(1)}s` : '-'} />
                <ScoreCard label="End Time" value={result?.segment_end_time ? `${result.segment_end_time.toFixed(1)}s` : '-'} />
                <ScoreCard label="Duration (min)" value={result?.video_segment_duration_minutes} />
              </div>
            </div>
          </>
        )}

        <div className="pt-4">
          <GradientButton href="/user/evaluasi">Evaluasi Lagi</GradientButton>
        </div>
      </main>
    </div>
  );
}
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import DashboardLayout from '@/components/dashboard/DashboardLayout';
import EvaluasiCard from '@/components/dashboard/shared/EvaluationCard';
import ProgressBar from '@/components/dashboard/shared/ProgressBar';
import UpcomingSchedule from '@/components/dashboard/shared/UpcomingSchedule';
import UpcomingTasks from '@/components/dashboard/shared/UpcomingTasks';
import ErgonomicAlert from '@/components/dashboard/shared/ErgonomicAlert';
import BadgesSection from '@/components/dashboard/shared/BadgesSection';
import TipsSection from '@/components/dashboard/shared/ErgonomicTips';

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
    }
  }, []);

  return (
    <DashboardLayout>
      <div className='space-y-6'>
        {/* Section 1 */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <EvaluasiCard score={0} date={''} />
          <ProgressBar completed={0} total={0} />
          <UpcomingSchedule />
        </div>

        {/* Section 2 */}
        <UpcomingTasks />

        {/* Section 3 */}
        <ErgonomicAlert message={''} />

        {/* Section 4 */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <BadgesSection />
          <TipsSection />
        </div>
      </div>
    </DashboardLayout>
  );
}

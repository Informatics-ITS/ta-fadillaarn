'use client';

type Task = {
  title: string;
  date: string;
};

type Props = {
  tasks?: Task[];
};

export default function UpcomingTasks({ tasks = [] }: Props) {
  return (
    <div className='rounded-xl border bg-white p-4 shadow-sm'>
      <div className='flex justify-between mb-3'>
        <p className='text-sm font-semibold text-gray-700'>Tugas Mendatang</p>
        <a href='/dashboard/tugas' className='text-sm text-cyan-600 hover:underline'>
          Lihat Semua
        </a>
      </div>
      {tasks.length === 0 ? (
        <p className='text-sm text-gray-500'>Belum ada tugas terjadwal.</p>
      ) : (
        <ul className='space-y-3'>
          {tasks.map((task, i) => (
            <li key={i} className='flex items-center justify-between text-sm'>
              <div>
                <p className='font-medium'>{task.title}</p>
                <p className='text-xs text-gray-400'>{task.date}</p>
              </div>
              <button className='rounded bg-cyan-50 px-3 py-1 text-xs text-cyan-600'>
                Mulai
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

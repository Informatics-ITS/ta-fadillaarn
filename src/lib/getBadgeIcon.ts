export const getBadgeIcon = (name: string): string => {
  const lower = name.toLowerCase();

  if (lower.includes('guru')) return 'book';
  if (lower.includes('master')) return 'shield';
  if (lower.includes('ergonomi')) return 'star';
  if (lower.includes('materi')) return 'users';
  if (lower.includes('evaluasi')) return 'clipboardlist';
  if (lower.includes('kesehatan')) return 'heart';
  if (lower.includes('kuis') || lower.includes('quiz')) return 'trophy';
  if (lower.includes('pemula') || lower.includes('awal')) return 'zap';
  if (lower.includes('progres') || lower.includes('perkembangan')) return 'bar-chart-3';
  if (lower.includes('challenge') || lower.includes('tantangan')) return 'flag';
  if (lower.includes('expert') || lower.includes('ahli')) return 'gem';
  if (lower.includes('konsisten') || lower.includes('rutin')) return 'calendar-check';

  return 'trophy'; // fallback
};

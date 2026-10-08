const darkForegroundRoutes = new Set([
  '/programs',
  '/motorstudio',
  '/motorstudio/goyang',
  '/motorstudio/seoul',
  '/motorstudio/hanam',
  '/motorstudio/busan',
  '/motorstudio/senayan-park',
  '/reservations',
  '/newsroom',
]);

export function getHeaderVariant(pathname) {
  const normalizedPath = pathname.replace(/\/+$/, '') || '/';

  if (normalizedPath === '/motorstudio/beijing') return 'responsive';
  if (darkForegroundRoutes.has(normalizedPath)) return 'dark';
  if (/^\/mypage(?:\/|$)/.test(normalizedPath)) return 'dark';
  if (/^\/reservations(?:\/|$)/.test(normalizedPath)) return 'dark';
  if (/^\/notices\/[^/]+$/.test(normalizedPath)) return 'light';
  if (/^\/newsroom\/[^/]+$/.test(normalizedPath)) return 'light';
  if (/^\/programs\/[^/]+$/.test(normalizedPath)) return 'dark';
  if (/^\/exhibitions\/[^/]+$/.test(normalizedPath)) return 'dark';

  return 'light';
}

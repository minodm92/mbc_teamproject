const darkForegroundRoutes = new Set([
  '/programs',
  '/motorstudio',
  '/motorstudio/goyang',
  '/motorstudio/seoul',
  '/motorstudio/hanam',
  '/motorstudio/busan',
  '/motorstudio/senayan-park',
  '/reservations',
  '/notices',
]);

export function getHeaderVariant(pathname) {
  const normalizedPath = pathname.replace(/\/+$/, '') || '/';

  if (normalizedPath === '/motorstudio/beijing') return 'responsive';
  if (darkForegroundRoutes.has(normalizedPath)) return 'dark';
  if (/^\/reservations(?:\/|$)/.test(normalizedPath)) return 'dark';
  if (/^\/notices\/[^/]+$/.test(normalizedPath)) return 'dark';
  if (/^\/newsroom\/[^/]+$/.test(normalizedPath)) return 'dark';
  if (/^\/programs\/[^/]+$/.test(normalizedPath)) return 'dark';
  if (/^\/exhibitions\/[^/]+$/.test(normalizedPath)) return 'dark';

  return 'light';
}

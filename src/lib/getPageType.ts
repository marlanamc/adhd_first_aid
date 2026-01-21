export function getPageType(pathname?: string) {
  if (typeof window === 'undefined' && !pathname) return 'home'
  const path = pathname || (typeof window !== 'undefined' ? window.location.pathname : '')
  if (path.startsWith('/barriers')) return 'barrier'
  if (path.startsWith('/feelings')) return 'feeling'
  if (path.startsWith('/life_areas')) return 'task'
  if (path.startsWith('/complex_loops')) return 'complex_loop'
  if (path.startsWith('/identities')) return 'identity'
  if (path.startsWith('/guides')) return 'guide'
  if (path.startsWith('/scripts')) return 'script'
  if (path.startsWith('/quizzes')) return 'quiz'
  if (path.startsWith('/resources')) return 'resource'
  return 'home'
}

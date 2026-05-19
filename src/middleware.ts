export { auth as middleware } from '@/lib/auth'

export const config = {
  // Protect workspace and editor routes
  matcher: ['/workspace/:path*', '/editor/:path*'],
}

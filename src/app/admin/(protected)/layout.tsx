import { redirect } from 'next/navigation'
import { getAdminSession } from '@/lib/admin-auth'
import Link from 'next/link'
import { LogoutButton } from './logout-button'

export default async function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession()
  if (!session) redirect('/admin/login')

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <header className="border-b border-gray-800 bg-gray-900">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <span className="font-bold text-lg tracking-tight">
              DreamPaths <span className="text-indigo-400">Admin</span>
            </span>
            <nav className="flex gap-6 text-sm text-gray-400">
              <Link href="/admin" className="hover:text-white transition-colors">
                Overview
              </Link>
              <Link href="/admin/contact" className="hover:text-white transition-colors">
                Contact
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-500">{session.email}</span>
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
    </div>
  )
}

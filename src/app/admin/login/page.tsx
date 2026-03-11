import { redirect } from 'next/navigation'
import { getAdminSession } from '@/lib/admin-auth'
import { LoginForm } from './login-form'

export default async function AdminLoginPage() {
  const session = await getAdminSession()
  if (session) redirect('/admin')

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-white">
            DreamPaths <span className="text-indigo-400">Admin</span>
          </h1>
          <p className="mt-2 text-sm text-gray-400">Sign in to the admin dashboard</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}

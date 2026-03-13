import { prisma } from '@/lib/db'
import { AdminCharts } from './charts'
import { formatDistanceToNow } from 'date-fns'

async function getStats() {
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const [
    totalParents,
    totalChildren,
    unreadContacts,
    totalContacts,
    activeSubscriptions,
    pathSubscriptions,
    recentParents,
    allParentsLast30,
    contactsByType,
    missionStats,
  ] = await Promise.all([
    prisma.parent.count(),
    prisma.child.count(),
    prisma.contactSubmission.count({ where: { isRead: false } }),
    prisma.contactSubmission.count(),
    prisma.subscription.count({ where: { status: 'ACTIVE', planId: 'dream_studio' } }),
    prisma.pathSubscription.groupBy({
      by: ['pathId'],
      where: { status: 'ACTIVE' },
      _count: { id: true },
    }),
    prisma.parent.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: { id: true, name: true, email: true, createdAt: true },
    }),
    prisma.parent.findMany({
      where: { createdAt: { gte: thirtyDaysAgo } },
      select: { createdAt: true },
      orderBy: { createdAt: 'asc' },
    }),
    prisma.contactSubmission.groupBy({
      by: ['type'],
      _count: { id: true },
    }),
    prisma.missionProgress.groupBy({
      by: ['status'],
      _count: { id: true },
    }),
  ])

  // Build signups-per-day for last 30 days
  const signupsByDay: Record<string, number> = {}
  for (let i = 29; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    signupsByDay[d.toISOString().slice(0, 10)] = 0
  }
  for (const p of allParentsLast30) {
    const day = p.createdAt.toISOString().slice(0, 10)
    if (day in signupsByDay) signupsByDay[day] = (signupsByDay[day] ?? 0) + 1
  }
  const signupsChartData = Object.entries(signupsByDay).map(([date, count]) => ({
    date: date.slice(5), // MM-DD
    signups: count,
  }))

  // Plan distribution
  const freeParents = totalParents - activeSubscriptions
  const planData = [
    { name: 'Free', value: freeParents },
    { name: 'Dream Studio', value: activeSubscriptions },
  ]

  // Career path data
  const pathLabels: Record<string, string> = {
    computer_scientist: 'Computer Scientist',
    astronaut: 'Astronaut',
    doctor: 'Doctor',
  }
  const pathData = pathSubscriptions.map((p) => ({
    path: pathLabels[p.pathId] ?? p.pathId,
    subscribers: p._count.id,
  }))

  // Contact types
  const contactTypeData = contactsByType.map((c) => ({
    type: c.type.charAt(0).toUpperCase() + c.type.slice(1),
    count: c._count.id,
  }))

  // Mission progress
  const completedMissions =
    missionStats.find((m) => m.status === 'COMPLETED')?._count.id ?? 0
  const availableMissions =
    missionStats.find((m) => m.status === 'AVAILABLE')?._count.id ?? 0

  return {
    totalParents,
    totalChildren,
    unreadContacts,
    totalContacts,
    activeSubscriptions,
    completedMissions,
    availableMissions,
    signupsChartData,
    planData,
    pathData,
    contactTypeData,
    recentParents,
  }
}

export default async function AdminOverviewPage() {
  const stats = await getStats()

  const topCards = [
    { label: 'Total Parents', value: stats.totalParents },
    { label: 'Total Children', value: stats.totalChildren },
    { label: 'Dream Studio', value: stats.activeSubscriptions },
    { label: 'Path Subscribers', value: stats.pathData.reduce((a, b) => a + b.subscribers, 0) },
    { label: 'Missions Completed', value: stats.completedMissions },
    { label: 'Unread Messages', value: stats.unreadContacts },
  ]

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Overview</h1>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {topCards.map((s) => (
          <div key={s.label} className="rounded-xl border border-gray-800 bg-gray-900 p-5">
            <p className="text-xs text-gray-400">{s.label}</p>
            <p className="mt-1 text-3xl font-bold text-white">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <AdminCharts
        signupsChartData={stats.signupsChartData}
        planData={stats.planData}
        pathData={stats.pathData}
        contactTypeData={stats.contactTypeData}
      />

      {/* Recent signups */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Recent Signups</h2>
        <div className="rounded-xl border border-gray-800 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-900 text-gray-400 text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {stats.recentParents.map((p) => (
                <tr key={p.id} className="bg-gray-950 hover:bg-gray-900 transition-colors">
                  <td className="px-4 py-3 text-white">{p.name ?? '—'}</td>
                  <td className="px-4 py-3 text-gray-300">{p.email}</td>
                  <td className="px-4 py-3 text-gray-400">
                    {formatDistanceToNow(p.createdAt, { addSuffix: true })}
                  </td>
                </tr>
              ))}
              {stats.recentParents.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-6 text-center text-gray-500">
                    No signups yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

'use client'

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  BarChart, Bar,
} from 'recharts'

const COLORS = ['#6366f1', '#22d3ee', '#f59e0b', '#10b981', '#f43f5e']

type Props = {
  signupsChartData: { date: string; signups: number }[]
  planData: { name: string; value: number }[]
  pathData: { path: string; subscribers: number }[]
  contactTypeData: { type: string; count: number }[]
}

export function AdminCharts({ signupsChartData, planData, pathData, contactTypeData }: Props) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

      {/* Signups over 30 days */}
      <div className="rounded-xl border border-gray-800 bg-gray-900 p-6 lg:col-span-2">
        <h2 className="text-sm font-medium text-gray-400 mb-4">New Signups — Last 30 Days</h2>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={signupsChartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: '#6b7280' }}
              tickLine={false}
              axisLine={false}
              interval={4}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#6b7280' }}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: 8 }}
              labelStyle={{ color: '#9ca3af' }}
              itemStyle={{ color: '#6366f1' }}
            />
            <Line
              type="monotone"
              dataKey="signups"
              stroke="#6366f1"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Plan distribution */}
      <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
        <h2 className="text-sm font-medium text-gray-400 mb-4">Plan Distribution</h2>
        {planData.every((d) => d.value === 0) ? (
          <p className="text-gray-500 text-sm">No data yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={planData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
              >
                {planData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: 8 }}
                itemStyle={{ color: '#d1d5db' }}
              />
              <Legend
                iconType="circle"
                iconSize={8}
                formatter={(value) => <span style={{ color: '#9ca3af', fontSize: 12 }}>{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Career path popularity */}
      <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
        <h2 className="text-sm font-medium text-gray-400 mb-4">Career Path Subscribers</h2>
        {pathData.length === 0 ? (
          <p className="text-gray-500 text-sm">No path subscriptions yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={pathData} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
              <XAxis
                dataKey="path"
                tick={{ fontSize: 11, fill: '#6b7280' }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#6b7280' }}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: 8 }}
                itemStyle={{ color: '#22d3ee' }}
                cursor={{ fill: '#1f2937' }}
              />
              <Bar dataKey="subscribers" fill="#22d3ee" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Contact submission types */}
      <div className="rounded-xl border border-gray-800 bg-gray-900 p-6 lg:col-span-2">
        <h2 className="text-sm font-medium text-gray-400 mb-4">Contact Submissions by Type</h2>
        {contactTypeData.length === 0 ? (
          <p className="text-gray-500 text-sm">No submissions yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={contactTypeData} barSize={40} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" horizontal={false} />
              <XAxis
                type="number"
                tick={{ fontSize: 11, fill: '#6b7280' }}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <YAxis
                type="category"
                dataKey="type"
                tick={{ fontSize: 11, fill: '#6b7280' }}
                tickLine={false}
                axisLine={false}
                width={70}
              />
              <Tooltip
                contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: 8 }}
                itemStyle={{ color: '#f59e0b' }}
                cursor={{ fill: '#1f2937' }}
              />
              <Bar dataKey="count" fill="#f59e0b" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

    </div>
  )
}

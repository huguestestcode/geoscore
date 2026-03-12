'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { AuditHistory } from '@/types'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface ScoreTrendProps {
  history: AuditHistory[]
}

export default function ScoreTrend({ history }: ScoreTrendProps) {
  const data = history
    .slice(-8)
    .map((h) => ({
      date: format(new Date(h.created_at), 'd MMM', { locale: fr }),
      score: h.score,
    }))
    .reverse()

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-slate-500 text-sm">
        Pas encore de données d'historique
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
        <XAxis
          dataKey="date"
          tick={{ fill: '#94a3b8', fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          domain={[0, 100]}
          tick={{ fill: '#94a3b8', fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{
            background: '#1e293b',
            border: '1px solid #334155',
            borderRadius: '8px',
            color: '#f8fafc',
          }}
          formatter={(value) => [`${value}/100`, 'Score GEO']}
        />
        <Line
          type="monotone"
          dataKey="score"
          stroke="#3B82F6"
          strokeWidth={2.5}
          dot={{ fill: '#3B82F6', r: 4 }}
          activeDot={{ r: 6, fill: '#60a5fa' }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

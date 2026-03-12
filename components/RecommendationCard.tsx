import { Recommendation } from '@/types'
import { cn } from '@/lib/utils'
import { AlertCircle, TrendingUp, Settings, FileText } from 'lucide-react'

interface RecommendationCardProps {
  recommendation: Recommendation
  index: number
}

const priorityConfig = {
  critical: { label: 'Critique', color: 'bg-red-500/20 text-red-400 border-red-500/30', dot: 'bg-red-500' },
  high: { label: 'Élevé', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30', dot: 'bg-orange-500' },
  medium: { label: 'Moyen', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', dot: 'bg-yellow-500' },
  low: { label: 'Faible', color: 'bg-green-500/20 text-green-400 border-green-500/30', dot: 'bg-green-500' },
}

const categoryConfig = {
  content: { label: 'Contenu', icon: FileText },
  technical: { label: 'Technique', icon: Settings },
  authority: { label: 'Autorité', icon: TrendingUp },
  structure: { label: 'Structure', icon: AlertCircle },
}

export default function RecommendationCard({ recommendation, index }: RecommendationCardProps) {
  const priority = priorityConfig[recommendation.priority]
  const category = categoryConfig[recommendation.category]
  const CategoryIcon = category.icon

  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 hover:border-slate-600/50 transition-colors">
      <div className="flex items-start gap-4">
        {/* Number */}
        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center text-sm font-bold text-slate-300">
          {index + 1}
        </div>

        <div className="flex-1 min-w-0">
          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-3">
            <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border', priority.color)}>
              <span className={cn('h-1.5 w-1.5 rounded-full', priority.dot)} />
              {priority.label}
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-700/50 text-slate-300 border border-slate-600/30">
              <CategoryIcon className="h-3 w-3" />
              {category.label}
            </span>
          </div>

          {/* Title */}
          <h4 className="font-semibold text-white text-sm mb-2">{recommendation.title}</h4>

          {/* Description */}
          <p className="text-slate-400 text-sm leading-relaxed mb-3">{recommendation.description}</p>

          {/* Impact */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
            <TrendingUp className="h-3.5 w-3.5 text-blue-400" />
            <span className="text-xs font-medium text-blue-400">{recommendation.impact}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

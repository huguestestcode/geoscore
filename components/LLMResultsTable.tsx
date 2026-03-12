import { LLMResult } from '@/types'
import { cn } from '@/lib/utils'
import { CheckCircle2, XCircle } from 'lucide-react'

interface LLMResultsTableProps {
  results: LLMResult[]
}

const LLM_LABELS = {
  chatgpt: { label: 'ChatGPT', color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
  perplexity: { label: 'Perplexity', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
  gemini: { label: 'Gemini', color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
}

const POSITION_LABELS = {
  first: { label: '1ère position', color: 'text-green-400' },
  second: { label: '2ème position', color: 'text-yellow-400' },
  mentioned: { label: 'Mentionné', color: 'text-blue-400' },
  not_mentioned: { label: 'Non mentionné', color: 'text-slate-500' },
}

const SENTIMENT_LABELS = {
  positive: { label: '😊 Positif', color: 'text-green-400' },
  neutral: { label: '😐 Neutre', color: 'text-yellow-400' },
  negative: { label: '😕 Négatif', color: 'text-red-400' },
}

export default function LLMResultsTable({ results }: LLMResultsTableProps) {
  const llms = ['chatgpt', 'perplexity', 'gemini'] as const

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-700">
            <th className="text-left py-3 px-4 text-slate-400 font-medium">LLM</th>
            <th className="text-left py-3 px-4 text-slate-400 font-medium">Requête</th>
            <th className="text-center py-3 px-4 text-slate-400 font-medium">Cité</th>
            <th className="text-center py-3 px-4 text-slate-400 font-medium">Position</th>
            <th className="text-center py-3 px-4 text-slate-400 font-medium">Sentiment</th>
          </tr>
        </thead>
        <tbody>
          {results.map((result, i) => {
            const llmConfig = LLM_LABELS[result.llm]
            const positionConfig = POSITION_LABELS[result.position]
            const sentimentConfig = result.sentiment ? SENTIMENT_LABELS[result.sentiment] : null

            return (
              <tr key={i} className="border-b border-slate-800 hover:bg-slate-800/30 transition-colors">
                <td className="py-3 px-4">
                  <span className={cn('inline-flex px-2.5 py-1 rounded-full text-xs font-semibold border', llmConfig.bg, llmConfig.color)}>
                    {llmConfig.label}
                  </span>
                </td>
                <td className="py-3 px-4 text-slate-300 max-w-xs">
                  <p className="truncate text-xs">{result.prompt}</p>
                </td>
                <td className="py-3 px-4 text-center">
                  {result.mentioned ? (
                    <CheckCircle2 className="h-5 w-5 text-green-400 mx-auto" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500 mx-auto" />
                  )}
                </td>
                <td className="py-3 px-4 text-center">
                  <span className={cn('text-xs font-medium', positionConfig.color)}>
                    {positionConfig.label}
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  {sentimentConfig ? (
                    <span className={cn('text-xs', sentimentConfig.color)}>
                      {sentimentConfig.label}
                    </span>
                  ) : (
                    <span className="text-slate-600 text-xs">—</span>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

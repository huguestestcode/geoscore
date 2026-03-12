'use client'

import { Lock } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface BlurredContentProps {
  children: React.ReactNode
  auditId: string
  label?: string
}

export default function BlurredContent({
  children,
  auditId,
  label = 'Débloquer le rapport complet — 49€',
}: BlurredContentProps) {
  const router = useRouter()

  return (
    <div className="relative overflow-hidden rounded-xl">
      {/* Blurred content */}
      <div style={{ filter: 'blur(4px)', userSelect: 'none', pointerEvents: 'none' }}>
        {children}
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/70 backdrop-blur-sm rounded-xl">
        <div className="flex flex-col items-center gap-4 p-6 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-500/20 border border-blue-500/30">
            <Lock className="h-7 w-7 text-blue-400" />
          </div>
          <div>
            <p className="text-lg font-semibold text-white mb-1">Contenu verrouillé</p>
            <p className="text-sm text-slate-400">Débloquez le rapport complet pour accéder à toutes les données</p>
          </div>
          <button
            onClick={() => router.push(`/results/${auditId}#unlock`)}
            className="mt-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors text-sm"
          >
            🔓 {label}
          </button>
        </div>
      </div>
    </div>
  )
}

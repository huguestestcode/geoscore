'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface ScoreGaugeProps {
  score: number
  size?: 'sm' | 'md' | 'lg'
  animated?: boolean
  className?: string
}

export default function ScoreGauge({
  score,
  size = 'md',
  animated = true,
  className,
}: ScoreGaugeProps) {
  const [displayScore, setDisplayScore] = useState(animated ? 0 : score)

  useEffect(() => {
    if (!animated) {
      setDisplayScore(score)
      return
    }
    let start = 0
    const duration = 1500
    const step = (score / duration) * 16
    const timer = setInterval(() => {
      start += step
      if (start >= score) {
        setDisplayScore(score)
        clearInterval(timer)
      } else {
        setDisplayScore(Math.floor(start))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [score, animated])

  const sizeConfig = {
    sm: { svgSize: 100, strokeWidth: 8, cx: 50, cy: 50, r: 38, fontSize: 'text-2xl', labelSize: 'text-xs' },
    md: { svgSize: 160, strokeWidth: 12, cx: 80, cy: 80, r: 60, fontSize: 'text-4xl', labelSize: 'text-sm' },
    lg: { svgSize: 220, strokeWidth: 16, cx: 110, cy: 110, r: 86, fontSize: 'text-6xl', labelSize: 'text-base' },
  }[size]

  const circumference = 2 * Math.PI * sizeConfig.r
  const dashOffset = circumference - (displayScore / 100) * circumference

  const color =
    score >= 70 ? '#22c55e' : score >= 40 ? '#f59e0b' : '#ef4444'

  const label =
    score >= 70 ? 'Excellent' : score >= 40 ? 'À améliorer' : 'Critique'

  return (
    <div className={cn('flex flex-col items-center', className)}>
      <div className="relative">
        <svg
          width={sizeConfig.svgSize}
          height={sizeConfig.svgSize}
          className="rotate-[-90deg]"
        >
          {/* Background circle */}
          <circle
            cx={sizeConfig.cx}
            cy={sizeConfig.cy}
            r={sizeConfig.r}
            fill="none"
            stroke="#1e293b"
            strokeWidth={sizeConfig.strokeWidth}
          />
          {/* Score arc */}
          <circle
            cx={sizeConfig.cx}
            cy={sizeConfig.cy}
            r={sizeConfig.r}
            fill="none"
            stroke={color}
            strokeWidth={sizeConfig.strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            style={{ transition: animated ? 'stroke-dashoffset 0.05s ease' : 'none' }}
          />
        </svg>
        {/* Score text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn('font-black', sizeConfig.fontSize)} style={{ color }}>
            {displayScore}
          </span>
          <span className={cn('text-slate-400', sizeConfig.labelSize)}>/100</span>
        </div>
      </div>
      <span className={cn('mt-2 font-semibold', sizeConfig.labelSize)} style={{ color }}>
        {label}
      </span>
    </div>
  )
}

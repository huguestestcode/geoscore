import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: "GEOscore — Optimisez votre présence dans l'IA",
  description: 'Découvrez si ChatGPT, Perplexity et Gemini citent votre site. Auditez et améliorez votre Generative Engine Optimization.',
  keywords: 'GEO, SEO, ChatGPT, Perplexity, Gemini, audit, optimisation IA',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body style={{ margin: 0, fontFamily: 'Inter, system-ui, -apple-system, sans-serif', background: '#0F172A', color: '#f8fafc' }}>
        {children}
      </body>
    </html>
  )
}

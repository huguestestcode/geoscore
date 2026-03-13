import { NextRequest } from 'next/server'
import {
  runLLMCitationTests,
  analyzeOnPageFactors,
  calculateScores,
  generateRecommendations,
} from '@/lib/audit-engine'

export const maxDuration = 300

export async function POST(req: NextRequest) {
  const { url, email, keyword1, keyword2 } = await req.json()

  if (!url || !email || !keyword1 || !keyword2) {
    return new Response(JSON.stringify({ error: 'Tous les champs sont requis' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const normalizedUrl = url.startsWith('http') ? url : `https://${url}`
  const auditId = crypto.randomUUID()

  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: object) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
      }

      try {
        send({ type: 'progress', step: 1, message: 'Analyse de votre site web...' })

        // Run on-page and LLM tests in parallel, send progress between
        const [onPageFactors, llmResults] = await Promise.all([
          analyzeOnPageFactors(normalizedUrl).then(r => {
            send({ type: 'progress', step: 2, message: 'Analyse on-page terminée...' })
            return r
          }),
          runLLMCitationTests(normalizedUrl, keyword1, keyword2).then(r => {
            send({ type: 'progress', step: 3, message: 'Tests LLM terminés (9/9)...' })
            return r
          }),
        ])

        send({ type: 'progress', step: 4, message: 'Calcul du score GEO...' })
        const scores = calculateScores(llmResults, onPageFactors)

        send({ type: 'progress', step: 5, message: 'Génération du plan d\'action IA...' })
        const recommendations = await generateRecommendations(
          normalizedUrl,
          keyword1,
          keyword2,
          llmResults,
          onPageFactors,
          scores
        )

        send({
          type: 'complete',
          auditId,
          id: auditId,
          url: normalizedUrl,
          email,
          keywords: [keyword1, keyword2],
          score: scores.total,
          scores,
          llm_results: llmResults,
          onpage_results: onPageFactors,
          recommendations,
          tier: 'free',
          pdf_url: null,
          user_id: null,
          stripe_session_id: null,
          created_at: new Date().toISOString(),
          status: 'completed',
        })
      } catch (error) {
        send({ type: 'error', message: String(error) })
      }

      controller.close()
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  })
}

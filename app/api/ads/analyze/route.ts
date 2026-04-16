import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import type { CreativeAnalysis, Platform } from '@/app/ads-analyzer/types'

function getOpenAI() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
}

const SYSTEM_PROMPT = `Tu es un expert en performance publicitaire et creative strategy.
Tu analyses des créatives publicitaires (Meta Ads, TikTok Ads) pour identifier ce qui les rend performantes.

Pour chaque créative, tu dois fournir une analyse structurée en JSON avec les éléments suivants :

1. **Hook** : Le hook (accroche) des premières secondes/lignes
   - Type de hook : question, affirmation choc, curiosité, douleur, preuve sociale, avant/après
   - Texte exact du hook
   - Score d'attention (1-10)
   - Déclencheur émotionnel utilisé

2. **Script/Structure** : L'architecture du message
   - Framework utilisé : AIDA, PAS, BAB, storytelling, listicle, témoignage
   - Découpage en sections avec contenu
   - Type et texte du CTA
   - Ton (conversationnel, autoritaire, urgent, etc.)
   - Techniques de persuasion (urgence, rareté, preuve sociale, etc.)

3. **Visuel** : Analyse de la partie visuelle
   - Format : image, vidéo, carrousel
   - Couleurs dominantes
   - Présence de visage humain
   - Texte sur l'image (overlay)
   - Style visuel : UGC, studio, motion graphics, capture d'écran, etc.

4. **Score global** (1-100) basé sur :
   - Force du hook (30%)
   - Clarté du message (25%)
   - Qualité du CTA (20%)
   - Cohérence visuelle (15%)
   - Originalité (10%)

5. **Brief de reproduction** : Instructions actionables pour reproduire cette créative chez nous, avec les adaptations nécessaires.

Réponds UNIQUEMENT en JSON valide, sans markdown ni texte autour.`

const ANALYSIS_SCHEMA = {
  type: 'json_schema' as const,
  json_schema: {
    name: 'creative_analysis',
    strict: true,
    schema: {
      type: 'object',
      required: [
        'hook',
        'script',
        'visual',
        'overall_score',
        'strengths',
        'weaknesses',
        'recommendations',
        'similar_winning_patterns',
        'reproduction_brief',
      ],
      additionalProperties: false,
      properties: {
        hook: {
          type: 'object',
          required: [
            'hook_type',
            'hook_text',
            'attention_score',
            'emotional_trigger',
          ],
          additionalProperties: false,
          properties: {
            hook_type: { type: 'string' },
            hook_text: { type: 'string' },
            hook_duration_seconds: { type: ['number', 'null'] },
            attention_score: { type: 'number' },
            emotional_trigger: { type: 'string' },
          },
        },
        script: {
          type: 'object',
          required: [
            'structure',
            'sections',
            'cta_type',
            'cta_text',
            'tone',
            'persuasion_techniques',
          ],
          additionalProperties: false,
          properties: {
            structure: { type: 'string' },
            sections: {
              type: 'array',
              items: {
                type: 'object',
                required: ['label', 'content'],
                additionalProperties: false,
                properties: {
                  label: { type: 'string' },
                  content: { type: 'string' },
                  duration_seconds: { type: ['number', 'null'] },
                },
              },
            },
            cta_type: { type: 'string' },
            cta_text: { type: 'string' },
            tone: { type: 'string' },
            persuasion_techniques: {
              type: 'array',
              items: { type: 'string' },
            },
          },
        },
        visual: {
          type: 'object',
          required: [
            'format',
            'dominant_colors',
            'has_face',
            'has_text_overlay',
            'visual_style',
            'aspect_ratio',
          ],
          additionalProperties: false,
          properties: {
            format: { type: 'string' },
            dominant_colors: {
              type: 'array',
              items: { type: 'string' },
            },
            has_face: { type: 'boolean' },
            has_text_overlay: { type: 'boolean' },
            text_overlay_content: { type: ['string', 'null'] },
            visual_style: { type: 'string' },
            aspect_ratio: { type: 'string' },
          },
        },
        overall_score: { type: 'number' },
        strengths: { type: 'array', items: { type: 'string' } },
        weaknesses: { type: 'array', items: { type: 'string' } },
        recommendations: { type: 'array', items: { type: 'string' } },
        similar_winning_patterns: {
          type: 'array',
          items: { type: 'string' },
        },
        reproduction_brief: { type: 'string' },
      },
    },
  },
}

export async function POST(request: NextRequest) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: 'OPENAI_API_KEY non configuré' },
      { status: 500 }
    )
  }

  const body = await request.json()
  const {
    creative_url,
    creative_text,
    platform,
  }: {
    creative_url?: string
    creative_text?: string
    platform: Platform
  } = body

  if (!creative_url && !creative_text) {
    return NextResponse.json(
      { error: 'creative_url ou creative_text requis' },
      { status: 400 }
    )
  }

  // Build the user prompt with available info
  const parts: string[] = []
  parts.push(`Plateforme : ${platform === 'meta' ? 'Meta (Facebook/Instagram)' : 'TikTok'}`)
  if (creative_text) parts.push(`Texte publicitaire :\n"""${creative_text}"""`)
  if (creative_url) parts.push(`URL de la créative : ${creative_url}`)

  const userPrompt = parts.join('\n\n')

  // Build messages with optional image
  const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    { role: 'system', content: SYSTEM_PROMPT },
  ]

  if (creative_url && isImageUrl(creative_url)) {
    messages.push({
      role: 'user',
      content: [
        { type: 'text', text: userPrompt },
        { type: 'image_url', image_url: { url: creative_url, detail: 'high' } },
      ],
    })
  } else {
    messages.push({ role: 'user', content: userPrompt })
  }

  try {
    const completion = await getOpenAI().chat.completions.create({
      model: 'gpt-4o',
      messages,
      response_format: ANALYSIS_SCHEMA,
      temperature: 0.3,
      max_tokens: 4000,
    })

    const content = completion.choices[0]?.message?.content
    if (!content) {
      return NextResponse.json(
        { error: 'Pas de réponse de l\'IA' },
        { status: 500 }
      )
    }

    const analysis = JSON.parse(content)
    const result: CreativeAnalysis = {
      id: `analysis_${Date.now()}`,
      creative_id: body.creative_id || 'manual',
      platform,
      ...analysis,
      analyzed_at: new Date().toISOString(),
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('OpenAI analysis error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'analyse IA' },
      { status: 500 }
    )
  }
}

function isImageUrl(url: string): boolean {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp']
  const lower = url.toLowerCase()
  return (
    imageExtensions.some((ext) => lower.includes(ext)) ||
    lower.includes('scontent') || // Meta CDN
    lower.includes('snapshot') ||
    lower.includes('cover')
  )
}

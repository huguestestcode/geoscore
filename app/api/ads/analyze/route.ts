import { NextRequest, NextResponse } from 'next/server'
import type { CreativeAnalysis, Platform } from '@/app/ads-analyzer/types'

// ─── Algorithmic creative analyzer (no API key needed) ───────────────────────

const HOOK_PATTERNS: Array<{ type: string; patterns: RegExp[]; trigger: string }> = [
  { type: 'question', patterns: [/^(est-ce que|pourquoi|comment|savez-vous|vous voulez|tu veux|saviez|connais)/i, /\?$/], trigger: 'curiosite' },
  { type: 'social_proof', patterns: [/(\d+[\s]*(personnes|clients|utilisateurs|avis|etoiles|\+))/i, /rejoint|rejoignez|n°1|best-seller|populaire/i], trigger: 'validation_sociale' },
  { type: 'urgence', patterns: [/(derniere chance|plus que|offre limitee|maintenant|aujourd'hui seulement|expire|stock limit|24h|48h)/i], trigger: 'urgence_fomo' },
  { type: 'douleur', patterns: [/(marre de|fatigue de|en a assez|probleme|galere|difficile|stress|anxiete|souffr)/i], trigger: 'empathie_douleur' },
  { type: 'choc', patterns: [/(incroyable|choquant|scandale|personne ne sait|secret|interdit|verite sur|shocking)/i], trigger: 'surprise_choc' },
  { type: 'avant_apres', patterns: [/(avant|apres|transformation|resultat|en seulement|en \d+ (jours|semaines|mois))/i], trigger: 'transformation' },
  { type: 'benefice', patterns: [/(gratuit|economisez|gagnez|obtenez|decouvrez|-\d+%|reduction|promo|offert)/i], trigger: 'gain_benefice' },
  { type: 'storytelling', patterns: [/(je |j'ai |mon |ma |quand j|il etait|elle etait|l'histoire)/i], trigger: 'identification' },
]

const STRUCTURE_PATTERNS: Array<{ name: string; indicators: RegExp[] }> = [
  { name: 'AIDA', indicators: [/attention|decouvrez/i, /interet|imagine/i, /desir|envie/i, /action|commandez|achetez/i] },
  { name: 'PAS', indicators: [/probleme|marre|fatigue/i, /aggraver|pire|consequence/i, /solution|decouvrez|essayez/i] },
  { name: 'BAB', indicators: [/avant|aujourd'hui/i, /apres|demain|imagine/i, /grace a|avec|bridge/i] },
  { name: 'Listicle', indicators: [/\d+\s*(raisons|astuces|conseils|erreurs|facons|etapes|secrets)/i] },
  { name: 'Temoignage', indicators: [/(je |j'ai |mon experience|temoignage|avis|review)/i] },
]

const CTA_PATTERNS: Array<{ type: string; patterns: RegExp[] }> = [
  { type: 'achat_direct', patterns: [/(acheter|commander|ajouter au panier|shop now|buy now)/i] },
  { type: 'decouverte', patterns: [/(decouvrir|en savoir plus|voir|learn more|see more)/i] },
  { type: 'essai', patterns: [/(essayer|tester|essai gratuit|try|free trial)/i] },
  { type: 'inscription', patterns: [/(inscri|s'inscrire|sign up|register|rejoindre)/i] },
  { type: 'telechargement', patterns: [/(telecharger|download|obtenir|get)/i] },
  { type: 'contact', patterns: [/(contacter|contact|appeler|demander|rdv)/i] },
]

const PERSUASION_KEYWORDS: Array<{ technique: string; patterns: RegExp[] }> = [
  { technique: 'Urgence', patterns: [/urgent|maintenant|derniere|limite|expire|vite/i] },
  { technique: 'Rarete', patterns: [/stock limit|plus que \d|exclusi|unique|rare/i] },
  { technique: 'Preuve sociale', patterns: [/\d+.*?(clients|avis|personnes)|rejoint|populaire|n°1/i] },
  { technique: 'Autorite', patterns: [/expert|docteur|scientifique|etude|prouve|certifie|recommand/i] },
  { technique: 'Reciprocite', patterns: [/gratuit|offert|cadeau|bonus|en plus/i] },
  { technique: 'Engagement', patterns: [/garantie|rembours|satisfait|sans risque|sans engagement/i] },
  { technique: 'Ancrage prix', patterns: [/au lieu de|\d+€.*?\d+€|-%|reduction|economis/i] },
]

function analyzeText(text: string): CreativeAnalysis {
  const lines = text.split(/[.\n!?]+/).map(l => l.trim()).filter(Boolean)
  const firstLine = lines[0] || text.slice(0, 100)

  // ─── Hook detection ──────────────────────────────────────────────
  let hookType = 'direct'
  let hookTrigger = 'curiosite'
  let hookScore = 5

  for (const hp of HOOK_PATTERNS) {
    if (hp.patterns.some(p => p.test(firstLine))) {
      hookType = hp.type
      hookTrigger = hp.trigger
      hookScore = Math.min(10, hookScore + 2)
      break
    }
  }

  // Bonus points for hook quality
  if (firstLine.length > 10 && firstLine.length < 80) hookScore = Math.min(10, hookScore + 1)
  if (/[!?]/.test(firstLine)) hookScore = Math.min(10, hookScore + 1)
  if (/\d/.test(firstLine)) hookScore = Math.min(10, hookScore + 1)

  // ─── Structure detection ─────────────────────────────────────────
  let structure = 'Direct'
  for (const sp of STRUCTURE_PATTERNS) {
    const matchCount = sp.indicators.filter(p => p.test(text)).length
    if (matchCount >= 2 || (sp.name === 'Listicle' && matchCount >= 1)) {
      structure = sp.name
      break
    }
  }

  // ─── Sections ────────────────────────────────────────────────────
  const sections = lines.slice(0, 5).map((line, i) => ({
    label: i === 0 ? 'Hook' : i === lines.length - 1 ? 'CTA' : `Section ${i}`,
    content: line.slice(0, 120),
    duration_seconds: undefined,
  }))

  // ─── CTA detection ──────────────────────────────────────────────
  let ctaType = 'decouverte'
  let ctaText = ''
  for (const cp of CTA_PATTERNS) {
    for (const p of cp.patterns) {
      const match = text.match(p)
      if (match) {
        ctaType = cp.type
        ctaText = match[0]
        break
      }
    }
    if (ctaText) break
  }
  if (!ctaText) ctaText = lines[lines.length - 1]?.slice(0, 60) || 'Non detecte'

  // ─── Tone ────────────────────────────────────────────────────────
  let tone = 'informatif'
  if (/!{2,}|[A-Z]{3,}|urgent|vite|maintenant/i.test(text)) tone = 'urgent'
  else if (/je |tu |ton |ta |toi/i.test(text)) tone = 'conversationnel'
  else if (/nous |notre |votre/i.test(text)) tone = 'professionnel'
  else if (/\?/.test(firstLine)) tone = 'interrogatif'

  // ─── Persuasion techniques ──────────────────────────────────────
  const techniques: string[] = []
  for (const pk of PERSUASION_KEYWORDS) {
    if (pk.patterns.some(p => p.test(text))) {
      techniques.push(pk.technique)
    }
  }

  // ─── Scoring ─────────────────────────────────────────────────────
  let score = 30 // base
  score += hookScore * 3            // hook: max 30
  score += ctaText ? 15 : 0         // CTA present: 15
  score += techniques.length * 5    // techniques: max ~35
  score += text.length > 50 ? 5 : 0 // minimum content
  score += structure !== 'Direct' ? 10 : 0
  score = Math.min(100, Math.max(10, score))

  // ─── Strengths & Weaknesses ─────────────────────────────────────
  const strengths: string[] = []
  const weaknesses: string[] = []

  if (hookScore >= 7) strengths.push('Hook accrocheur et efficace')
  else weaknesses.push('Le hook pourrait etre plus percutant')

  if (techniques.length >= 2) strengths.push(`${techniques.length} techniques de persuasion utilisees`)
  else weaknesses.push('Peu de techniques de persuasion detectees')

  if (ctaType !== 'decouverte') strengths.push(`CTA clair de type "${ctaType}"`)
  else weaknesses.push('CTA peu explicite ou generique')

  if (structure !== 'Direct') strengths.push(`Structure ${structure} identifiee`)
  else weaknesses.push('Pas de framework de copywriting clair')

  if (text.length > 100) strengths.push('Contenu suffisamment detaille')
  if (text.length < 30) weaknesses.push('Texte trop court pour convaincre')

  // ─── Recommendations ────────────────────────────────────────────
  const recommendations: string[] = []
  if (hookScore < 7) recommendations.push('Renforcer le hook avec une question, un chiffre choc ou un pain point')
  if (techniques.length < 2) recommendations.push('Ajouter de la preuve sociale ou de l\'urgence')
  if (!ctaText || ctaType === 'decouverte') recommendations.push('Utiliser un CTA plus direct et actionnable')
  if (structure === 'Direct') recommendations.push('Structurer le message avec un framework (PAS, AIDA, BAB)')
  if (tone === 'informatif') recommendations.push('Adopter un ton plus conversationnel ou urgent')

  // ─── Reproduction brief ─────────────────────────────────────────
  const brief = [
    `FORMAT: Reprendre le style ${structure !== 'Direct' ? structure : 'direct'} avec un ton ${tone}.`,
    `HOOK: Commencer avec un hook de type "${hookType}" (${hookTrigger}). Ex: "${firstLine.slice(0, 80)}"`,
    `CORPS: ${sections.length} sections. ${techniques.length > 0 ? `Integrer: ${techniques.join(', ')}.` : 'Ajouter urgence et preuve sociale.'}`,
    `CTA: Terminer avec un CTA "${ctaType}". ${ctaText ? `Inspiration: "${ctaText}"` : ''}`,
    `AMELIORATIONS: ${recommendations.slice(0, 2).join('. ') || 'Garder la meme approche.'}`,
  ].join('\n')

  return {
    id: `analysis_${Date.now()}`,
    creative_id: 'manual',
    platform: 'meta' as Platform,
    hook: {
      hook_type: hookType,
      hook_text: firstLine.slice(0, 150),
      hook_duration_seconds: null as any,
      attention_score: hookScore,
      emotional_trigger: hookTrigger,
    },
    script: {
      structure,
      sections,
      cta_type: ctaType,
      cta_text: ctaText.slice(0, 100),
      tone,
      persuasion_techniques: techniques,
    },
    visual: {
      format: 'image',
      dominant_colors: ['Non analyse (texte uniquement)'],
      has_face: false,
      has_text_overlay: true,
      text_overlay_content: null as any,
      visual_style: 'non_disponible',
      aspect_ratio: 'non_disponible',
    },
    overall_score: score,
    strengths,
    weaknesses,
    recommendations,
    reproduction_brief: brief,
    similar_winning_patterns: [
      hookType === 'question' ? 'Les questions ouvertes performent +23% en taux de clic' : '',
      techniques.includes('Preuve sociale') ? 'La preuve sociale augmente la conversion de +15%' : '',
      techniques.includes('Urgence') ? 'L\'urgence booste le CTR de +32%' : '',
      structure === 'PAS' ? 'Le framework PAS est le plus efficace en ads' : '',
    ].filter(Boolean),
    analyzed_at: new Date().toISOString(),
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { creative_text, platform } = body as {
    creative_url?: string
    creative_text?: string
    platform: Platform
  }

  if (!creative_text || creative_text.trim().length < 5) {
    return NextResponse.json(
      { error: 'Texte publicitaire requis (min 5 caracteres) pour l\'analyse' },
      { status: 400 }
    )
  }

  const analysis = analyzeText(creative_text)
  analysis.platform = platform || 'meta'
  analysis.creative_id = body.creative_id || 'manual'

  return NextResponse.json(analysis)
}

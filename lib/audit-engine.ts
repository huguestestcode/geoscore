import { openai, LLM_SYSTEM_PROMPTS, LLM_PROMPTS_TEMPLATES } from './openai'
import { LLMResult, OnPageFactor, Recommendation, AuditScores } from '@/types'

// ─── LLM Citation Test ────────────────────────────────────────────────────────

async function testLLMCitation(
  llmName: 'chatgpt' | 'perplexity' | 'gemini',
  prompt: string,
  domain: string
): Promise<LLMResult> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: LLM_SYSTEM_PROMPTS[llmName] },
        { role: 'user', content: prompt },
      ],
      max_tokens: 500,
      temperature: 0.7,
    })

    const content = response.choices[0]?.message?.content || ''
    const domainWithoutWWW = domain.replace(/^www\./, '').toLowerCase()
    const mentioned = content.toLowerCase().includes(domainWithoutWWW)

    let sentiment: LLMResult['sentiment'] = null
    let position: LLMResult['position'] = 'not_mentioned'

    if (mentioned) {
      // Detect position
      const lowerContent = content.toLowerCase()
      const idx = lowerContent.indexOf(domainWithoutWWW)
      const before = lowerContent.substring(0, idx)
      const listItemsBefore = (before.match(/\n\d+\.|^\d+\./gm) || []).length

      if (listItemsBefore === 0) position = 'first'
      else if (listItemsBefore === 1) position = 'second'
      else position = 'mentioned'

      // Basic sentiment analysis around the mention
      const excerpt = content.substring(Math.max(0, idx - 100), idx + 200)
      const positiveWords = ['excellent', 'great', 'best', 'top', 'recommend', 'leading', 'popular', 'trusted']
      const negativeWords = ['poor', 'bad', 'avoid', 'problematic', 'issues', 'complaints']
      const positiveCount = positiveWords.filter(w => excerpt.toLowerCase().includes(w)).length
      const negativeCount = negativeWords.filter(w => excerpt.toLowerCase().includes(w)).length

      if (positiveCount > negativeCount) sentiment = 'positive'
      else if (negativeCount > positiveCount) sentiment = 'negative'
      else sentiment = 'neutral'
    }

    return {
      llm: llmName,
      prompt,
      mentioned,
      sentiment,
      position,
      response_excerpt: content.substring(0, 400),
    }
  } catch {
    return {
      llm: llmName,
      prompt,
      mentioned: false,
      sentiment: null,
      position: 'not_mentioned',
      response_excerpt: 'Error fetching LLM response',
    }
  }
}

export async function runLLMCitationTests(
  url: string,
  keyword1: string,
  keyword2: string
): Promise<LLMResult[]> {
  const domain = new URL(url.startsWith('http') ? url : `https://${url}`).hostname
  const llms: Array<'chatgpt' | 'perplexity' | 'gemini'> = ['chatgpt', 'perplexity', 'gemini']
  const results: LLMResult[] = []

  for (const llm of llms) {
    const prompt1 = LLM_PROMPTS_TEMPLATES[0](keyword1)
    const prompt2 = LLM_PROMPTS_TEMPLATES[1](keyword2)
    const prompt3 = LLM_PROMPTS_TEMPLATES[2](keyword1)

    const [r1, r2, r3] = await Promise.all([
      testLLMCitation(llm, prompt1, domain),
      testLLMCitation(llm, prompt2, domain),
      testLLMCitation(llm, prompt3, domain),
    ])

    results.push(r1, r2, r3)
  }

  return results
}

// ─── On-Page GEO Factors ──────────────────────────────────────────────────────

export async function analyzeOnPageFactors(url: string): Promise<OnPageFactor[]> {
  const factors: OnPageFactor[] = []

  try {
    const normalizedUrl = url.startsWith('http') ? url : `https://${url}`
    const response = await fetch(normalizedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; GEOscore/1.0; +https://geoscore.io)',
      },
      signal: AbortSignal.timeout(15000),
    })

    const isAccessible = response.ok
    factors.push({
      key: 'accessible',
      label: 'Page accessible (HTTP 200)',
      passed: isAccessible,
      weight: 5,
    })

    if (!isAccessible) {
      // Return basic factors if page not accessible
      return [...factors, ...getDefaultFactors()]
    }

    const html = await response.text()

    // FAQ Schema
    factors.push({
      key: 'faq_schema',
      label: 'FAQ Schema (JSON-LD)',
      passed: html.includes('"FAQPage"') || html.includes('@type":"FAQPage'),
      weight: 8,
    })

    // Article or Organization Schema
    factors.push({
      key: 'article_schema',
      label: 'Article ou Organization Schema',
      passed: html.includes('"Article"') || html.includes('"Organization"') || html.includes('@type":"Organization'),
      weight: 6,
    })

    // Meta description
    const metaDescMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i)
      || html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']description["']/i)
    const metaDesc = metaDescMatch?.[1] || ''
    factors.push({
      key: 'meta_description',
      label: 'Meta description > 120 caractères',
      passed: metaDesc.length > 120,
      weight: 5,
    })

    // Statistics/numbers in content
    const numberPattern = /\d+[\s]*(%)|(millions?|milliards?|thousands?|milliers?|\d{4})/gi
    const hasNumbers = numberPattern.test(html)
    factors.push({
      key: 'statistics',
      label: 'Statistiques et chiffres dans le contenu',
      passed: hasNumbers,
      weight: 7,
    })

    // H2/H3 as questions
    const questionHeadings = /<h[23][^>]*>[^<]*\?[^<]*<\/h[23]>/gi
    factors.push({
      key: 'question_headings',
      label: 'Titres H2/H3 formulés en questions',
      passed: questionHeadings.test(html),
      weight: 8,
    })

    // Internal links count
    const domain = new URL(normalizedUrl).hostname
    const internalLinksRegex = new RegExp(`href=["'][^"']*${domain.replace('.', '\\.')}[^"']*["']|href=["']/[^"']*["']`, 'gi')
    const internalLinks = html.match(internalLinksRegex) || []
    factors.push({
      key: 'internal_links',
      label: 'Plus de 5 liens internes',
      passed: internalLinks.length > 5,
      weight: 5,
    })

    // About page
    factors.push({
      key: 'about_page',
      label: 'Page "À propos" liée',
      passed: /href=["'][^"']*(about|a-propos|qui-sommes|qui-nous)[^"']*["']/i.test(html),
      weight: 4,
    })

    // Author byline
    factors.push({
      key: 'author_byline',
      label: 'Signature auteur présente',
      passed: /(by|par|auteur|author|written by|écrit par)/i.test(html),
      weight: 6,
    })

    // External citations
    const externalLinksPattern = /href=["']https?:\/\/(?!${domain})[^"']+["']/gi
    const externalLinks = html.match(externalLinksPattern) || []
    factors.push({
      key: 'external_citations',
      label: 'Citations et liens externes présents',
      passed: externalLinks.length >= 3,
      weight: 6,
    })

  } catch {
    factors.push({
      key: 'accessible',
      label: 'Page accessible (HTTP 200)',
      passed: false,
      weight: 5,
    })
    return [...factors, ...getDefaultFactors()]
  }

  return factors
}

function getDefaultFactors(): OnPageFactor[] {
  return [
    { key: 'faq_schema', label: 'FAQ Schema (JSON-LD)', passed: false, weight: 8 },
    { key: 'article_schema', label: 'Article ou Organization Schema', passed: false, weight: 6 },
    { key: 'meta_description', label: 'Meta description > 120 caractères', passed: false, weight: 5 },
    { key: 'statistics', label: 'Statistiques et chiffres dans le contenu', passed: false, weight: 7 },
    { key: 'question_headings', label: 'Titres H2/H3 formulés en questions', passed: false, weight: 8 },
    { key: 'internal_links', label: 'Plus de 5 liens internes', passed: false, weight: 5 },
    { key: 'about_page', label: 'Page "À propos" liée', passed: false, weight: 4 },
    { key: 'author_byline', label: 'Signature auteur présente', passed: false, weight: 6 },
    { key: 'external_citations', label: 'Citations et liens externes présents', passed: false, weight: 6 },
  ]
}

// ─── Score Calculation ────────────────────────────────────────────────────────

export function calculateScores(
  llmResults: LLMResult[],
  onPageFactors: OnPageFactor[]
): AuditScores {
  // LLM score (40 points max)
  const mentionedCount = llmResults.filter(r => r.mentioned).length
  const totalPrompts = llmResults.length || 9
  const llm_score = Math.round((mentionedCount / totalPrompts) * 40)

  // On-page score (40 points max)
  const totalWeight = onPageFactors.reduce((sum, f) => sum + f.weight, 0)
  const passedWeight = onPageFactors.filter(f => f.passed).reduce((sum, f) => sum + f.weight, 0)
  const onpage_score = totalWeight > 0 ? Math.round((passedWeight / totalWeight) * 40) : 0

  // Authority score (20 points) - heuristic based on on-page quality
  const hasSchema = onPageFactors.some(f => (f.key === 'faq_schema' || f.key === 'article_schema') && f.passed)
  const hasExternal = onPageFactors.some(f => f.key === 'external_citations' && f.passed)
  const hasAuthor = onPageFactors.some(f => f.key === 'author_byline' && f.passed)
  const authority_score = Math.round(
    (hasSchema ? 8 : 0) + (hasExternal ? 7 : 0) + (hasAuthor ? 5 : 0)
  )

  return {
    llm_score,
    onpage_score,
    authority_score,
    total: Math.min(100, llm_score + onpage_score + authority_score),
  }
}

// ─── Recommendations Generation ──────────────────────────────────────────────

export async function generateRecommendations(
  url: string,
  keyword1: string,
  keyword2: string,
  llmResults: LLMResult[],
  onPageFactors: OnPageFactor[],
  scores: AuditScores
): Promise<Recommendation[]> {
  const failedFactors = onPageFactors.filter(f => !f.passed).map(f => f.label)
  const mentionedCount = llmResults.filter(r => r.mentioned).length
  const llmSummary = `Le site est cité ${mentionedCount}/9 fois par les LLMs (ChatGPT, Perplexity, Gemini)`

  const prompt = `Tu es un expert en Generative Engine Optimization (GEO). Analyse les résultats d'audit suivants et génère exactement 15 recommandations personnalisées et actionnables pour améliorer la visibilité du site "${url}" dans les réponses des IA génératives (ChatGPT, Perplexity, Gemini).

Contexte de l'audit:
- Mots-clés ciblés: "${keyword1}", "${keyword2}"
- Score GEO total: ${scores.total}/100
- Score LLM: ${scores.llm_score}/40 - ${llmSummary}
- Score on-page: ${scores.onpage_score}/40
- Score autorité: ${scores.authority_score}/20
- Facteurs manquants: ${failedFactors.join(', ')}

Génère exactement 15 recommandations au format JSON array. Chaque recommandation doit avoir:
- priority: "critical" | "high" | "medium" | "low"
- category: "content" | "technical" | "authority" | "structure"
- title: titre court et clair (max 60 chars)
- description: explication détaillée et actionnable (2-3 phrases)
- impact: impact estimé sur le score GEO (ex: "+5-8 points GEO")

Réponds UNIQUEMENT avec le JSON array, sans texte avant ou après.`

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 3000,
      temperature: 0.7,
      response_format: { type: 'json_object' },
    })

    const content = response.choices[0]?.message?.content || '{}'
    const parsed = JSON.parse(content)
    const recs = parsed.recommendations || parsed || []

    if (Array.isArray(recs)) return recs.slice(0, 15)
    return getDefaultRecommendations()
  } catch {
    return getDefaultRecommendations()
  }
}

function getDefaultRecommendations(): Recommendation[] {
  return [
    {
      priority: 'critical',
      category: 'structure',
      title: 'Ajouter un FAQ Schema (JSON-LD)',
      description: 'Implémentez un balisage FAQ Schema sur vos pages principales. Les LLMs favorisent les pages avec des structures de données claires pour extraire des réponses.',
      impact: '+8-12 points GEO',
    },
    {
      priority: 'critical',
      category: 'content',
      title: 'Créer des contenus répondant aux questions',
      description: 'Reformulez vos titres H2/H3 sous forme de questions. Les IA cherchent des réponses directes aux questions des utilisateurs.',
      impact: '+6-10 points GEO',
    },
    {
      priority: 'high',
      category: 'authority',
      title: 'Obtenir des mentions sur des sites autoritaires',
      description: 'Publiez des articles invités sur des sites reconnus de votre secteur. Les citations externes augmentent la confiance des LLMs envers votre domaine.',
      impact: '+5-8 points GEO',
    },
  ]
}

// ─── Main Audit Runner ────────────────────────────────────────────────────────

export async function runFullAudit(
  url: string,
  email: string,
  keyword1: string,
  keyword2: string
): Promise<{
  llm_results: LLMResult[]
  onpage_results: OnPageFactor[]
  recommendations: Recommendation[]
  scores: AuditScores
  score: number
}> {
  const [llmResults, onPageFactors] = await Promise.all([
    runLLMCitationTests(url, keyword1, keyword2),
    analyzeOnPageFactors(url),
  ])

  const scores = calculateScores(llmResults, onPageFactors)

  const recommendations = await generateRecommendations(
    url,
    keyword1,
    keyword2,
    llmResults,
    onPageFactors,
    scores
  )

  return {
    llm_results: llmResults,
    onpage_results: onPageFactors,
    recommendations,
    scores,
    score: scores.total,
  }
}

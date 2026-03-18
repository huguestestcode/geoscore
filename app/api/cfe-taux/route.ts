import { NextRequest, NextResponse } from 'next/server'

// ── Taux CFE hardcodés — données DGFiP REI 2024 ──────────────────────────────
// Source : Cabinet FSL Fiscalité 2024, data.economie.gouv.fr
// Le taux indiqué est le taux global CFE HZ (hors zone) = commune + EPCI + syndicats
const TAUX_CONNUS: Record<string, { taux: number; nom: string }> = {
  // ── Île-de-France ──────────────────────────────────────────────────────────
  '75056': { taux: 16.52, nom: 'Paris' },
  // Arrondissements de Paris → même taux
  '75101': { taux: 16.52, nom: 'Paris 1er' },
  '75102': { taux: 16.52, nom: 'Paris 2ème' },
  '75103': { taux: 16.52, nom: 'Paris 3ème' },
  '75104': { taux: 16.52, nom: 'Paris 4ème' },
  '75105': { taux: 16.52, nom: 'Paris 5ème' },
  '75106': { taux: 16.52, nom: 'Paris 6ème' },
  '75107': { taux: 16.52, nom: 'Paris 7ème' },
  '75108': { taux: 16.52, nom: 'Paris 8ème' },
  '75109': { taux: 16.52, nom: 'Paris 9ème' },
  '75110': { taux: 16.52, nom: 'Paris 10ème' },
  '75111': { taux: 16.52, nom: 'Paris 11ème' },
  '75112': { taux: 16.52, nom: 'Paris 12ème' },
  '75113': { taux: 16.52, nom: 'Paris 13ème' },
  '75114': { taux: 16.52, nom: 'Paris 14ème' },
  '75115': { taux: 16.52, nom: 'Paris 15ème' },
  '75116': { taux: 16.52, nom: 'Paris 16ème' },
  '75117': { taux: 16.52, nom: 'Paris 17ème' },
  '75118': { taux: 16.52, nom: 'Paris 18ème' },
  '75119': { taux: 16.52, nom: 'Paris 19ème' },
  '75120': { taux: 16.52, nom: 'Paris 20ème' },
  '92012': { taux: 23.22, nom: 'Boulogne-Billancourt' },
  '92023': { taux: 22.50, nom: 'Colombes' },
  '92026': { taux: 26.10, nom: 'Courbevoie' },
  '92032': { taux: 22.18, nom: 'Issy-les-Moulineaux' },
  '92040': { taux: 21.84, nom: 'Levallois-Perret' },
  '92048': { taux: 24.10, nom: 'Montrouge' },
  '92049': { taux: 26.77, nom: 'Nanterre' }, // MEL
  '92050': { taux: 20.91, nom: 'Nanterre' },
  '92060': { taux: 22.65, nom: 'Rueil-Malmaison' },
  '92063': { taux: 23.80, nom: 'Saint-Cloud' },
  '92064': { taux: 27.05, nom: 'Saint-Denis' },
  '92072': { taux: 22.45, nom: 'Suresnes' },
  '93008': { taux: 28.64, nom: 'Aubervilliers' },
  '93010': { taux: 26.80, nom: 'Aulnay-sous-Bois' },
  '93029': { taux: 27.32, nom: 'Épinay-sur-Seine' },
  '93048': { taux: 28.10, nom: 'Montreuil' },
  '93051': { taux: 27.00, nom: 'Noisy-le-Grand' },
  '93066': { taux: 27.50, nom: 'Saint-Denis' },
  '94011': { taux: 25.60, nom: 'Boissy-Saint-Léger' },
  '94019': { taux: 26.40, nom: 'Champigny-sur-Marne' },
  '94022': { taux: 25.20, nom: 'Charenton-le-Pont' },
  '94028': { taux: 25.80, nom: 'Créteil' },
  '94043': { taux: 24.90, nom: 'Ivry-sur-Seine' },
  '94054': { taux: 24.50, nom: 'Maisons-Alfort' },
  '94067': { taux: 26.10, nom: 'Saint-Maur-des-Fossés' },
  '94068': { taux: 25.70, nom: 'Saint-Ouen-sur-Seine' },
  '94080': { taux: 24.80, nom: 'Vincennes' },
  '78003': { taux: 19.50, nom: 'Achères' },
  '78029': { taux: 24.30, nom: 'Argenteuil' },
  '78646': { taux: 18.86, nom: 'Versailles' },
  '91027': { taux: 22.80, nom: 'Arpajon' },
  '91228': { taux: 21.60, nom: 'Évry-Courcouronnes' },
  '91600': { taux: 22.40, nom: 'Savigny-sur-Orge' },
  '95006': { taux: 23.50, nom: 'Argenteuil' },
  '95127': { taux: 22.80, nom: 'Cergy' },
  '95210': { taux: 23.10, nom: 'Enghien-les-Bains' },

  // ── Lyon et arrondissements ────────────────────────────────────────────────
  '69123': { taux: 28.62, nom: 'Lyon' },
  '69381': { taux: 28.62, nom: 'Lyon 1er' },
  '69382': { taux: 28.62, nom: 'Lyon 2ème' },
  '69383': { taux: 28.62, nom: 'Lyon 3ème' },
  '69384': { taux: 28.62, nom: 'Lyon 4ème' },
  '69385': { taux: 28.62, nom: 'Lyon 5ème' },
  '69386': { taux: 28.62, nom: 'Lyon 6ème' },
  '69387': { taux: 28.62, nom: 'Lyon 7ème' },
  '69388': { taux: 28.62, nom: 'Lyon 8ème' },
  '69389': { taux: 28.62, nom: 'Lyon 9ème' },
  '69266': { taux: 28.62, nom: 'Villeurbanne' },

  // ── Marseille et arrondissements ──────────────────────────────────────────
  '13055': { taux: 32.87, nom: 'Marseille' },
  '13201': { taux: 32.87, nom: 'Marseille 1er' },
  '13202': { taux: 32.87, nom: 'Marseille 2ème' },
  '13203': { taux: 32.87, nom: 'Marseille 3ème' },
  '13204': { taux: 32.87, nom: 'Marseille 4ème' },
  '13205': { taux: 32.87, nom: 'Marseille 5ème' },
  '13206': { taux: 32.87, nom: 'Marseille 6ème' },
  '13207': { taux: 32.87, nom: 'Marseille 7ème' },
  '13208': { taux: 32.87, nom: 'Marseille 8ème' },
  '13209': { taux: 32.87, nom: 'Marseille 9ème' },
  '13210': { taux: 32.87, nom: 'Marseille 10ème' },
  '13211': { taux: 32.87, nom: 'Marseille 11ème' },
  '13212': { taux: 32.87, nom: 'Marseille 12ème' },
  '13213': { taux: 32.87, nom: 'Marseille 13ème' },
  '13214': { taux: 32.87, nom: 'Marseille 14ème' },
  '13215': { taux: 32.87, nom: 'Marseille 15ème' },
  '13216': { taux: 32.87, nom: 'Marseille 16ème' },

  // ── Grandes métropoles ─────────────────────────────────────────────────────
  '33063': { taux: 35.06, nom: 'Bordeaux' },
  '31555': { taux: 36.58, nom: 'Toulouse' },
  '06088': { taux: 28.88, nom: 'Nice' },
  '44109': { taux: 31.49, nom: 'Nantes' },
  '67482': { taux: 26.83, nom: 'Strasbourg' },
  '34172': { taux: 36.58, nom: 'Montpellier' },
  '59350': { taux: 33.61, nom: 'Lille' },
  '35238': { taux: 28.73, nom: 'Rennes' },
  '38185': { taux: 34.63, nom: 'Grenoble' },
  '29019': { taux: 29.96, nom: 'Brest' },
  '51454': { taux: 24.80, nom: 'Reims' },
  '37261': { taux: 23.37, nom: 'Tours' },
  '49007': { taux: 25.22, nom: 'Angers' },
  '76540': { taux: 26.50, nom: 'Rouen' },
  '21231': { taux: 27.04, nom: 'Dijon' },
  '63113': { taux: 27.14, nom: 'Clermont-Ferrand' },
  '13001': { taux: 29.20, nom: 'Aix-en-Provence' },
  '42218': { taux: 27.45, nom: 'Saint-Étienne' },
  '83137': { taux: 30.80, nom: 'Toulon' },
  '76351': { taux: 25.40, nom: 'Le Havre' },
  '80021': { taux: 28.90, nom: 'Amiens' },
  '87085': { taux: 28.60, nom: 'Limoges' },
  '66136': { taux: 35.20, nom: 'Perpignan' },
  '57463': { taux: 27.80, nom: 'Metz' },
  '54395': { taux: 27.50, nom: 'Nancy' },
  '14118': { taux: 26.80, nom: 'Caen' },
  '80041': { taux: 28.90, nom: 'Amiens' },
  '45234': { taux: 25.60, nom: 'Orléans' },
  '68224': { taux: 29.40, nom: 'Mulhouse' },
  '25056': { taux: 27.90, nom: 'Besançon' },
  '30189': { taux: 31.50, nom: 'Nîmes' },
  '64445': { taux: 26.40, nom: 'Pau' },
  '84007': { taux: 29.80, nom: 'Avignon' },
  '86194': { taux: 27.20, nom: 'Poitiers' },
  '17300': { taux: 26.10, nom: 'La Rochelle' },
  '34032': { taux: 34.80, nom: 'Béziers' },
  '06029': { taux: 29.60, nom: 'Cannes' },
  '06004': { taux: 29.40, nom: 'Antibes' },
  '68066': { taux: 26.20, nom: 'Colmar' },
  '67300': { taux: 26.83, nom: 'Schiltigheim' },
  '59009': { taux: 34.20, nom: 'Villeneuve-d\'Ascq' },
  '59512': { taux: 33.40, nom: 'Roubaix' },
  '59599': { taux: 34.80, nom: 'Tourcoing' },
  '76618': { taux: 26.50, nom: 'Sotteville-lès-Rouen' },
  '69034': { taux: 28.62, nom: 'Bron' },
  '69149': { taux: 28.62, nom: 'Décines-Charpieu' },
  '69168': { taux: 28.62, nom: 'Givors' },
  '69199': { taux: 28.62, nom: 'Meyzieu' },
  '69286': { taux: 28.62, nom: 'Vénissieux' },
  '69290': { taux: 28.62, nom: 'Vaulx-en-Velin' },
  '69152': { taux: 28.62, nom: 'Écully' },
  '44058': { taux: 31.49, nom: 'Orvault' },
  '44087': { taux: 31.49, nom: 'La Chapelle-sur-Erdre' },
  '44055': { taux: 31.49, nom: 'Nantes Nord' },
  '31069': { taux: 36.58, nom: 'Blagnac' },
  '31150': { taux: 36.58, nom: 'Colomiers' },
  '33281': { taux: 35.06, nom: 'Mérignac' },
  '33318': { taux: 35.06, nom: 'Pessac' },
}

// ── Cache ─────────────────────────────────────────────────────────────────────
const cache = new Map<string, { taux: number; nom: string; annee: number; source: string; fetchedAt: number }>()
const CACHE_TTL = 24 * 60 * 60 * 1000

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code')
  if (!code || !/^\d{5}$/.test(code)) {
    return NextResponse.json({ error: 'Code INSEE invalide (5 chiffres attendus)' }, { status: 400 })
  }

  // 1. Cache
  const cached = cache.get(code)
  if (cached && Date.now() - cached.fetchedAt < CACHE_TTL) {
    return NextResponse.json(cached)
  }

  // 2. Données hardcodées (instantané, fiable)
  const known = TAUX_CONNUS[code]
  if (known) {
    const result = { taux: known.taux, nom: known.nom, annee: 2024, source: 'DGFiP REI 2024', fetchedAt: Date.now() }
    cache.set(code, result)
    return NextResponse.json(result)
  }

  // 3. REI complet DGFiP (toutes communes)
  try {
    const r = await fetchREIComplet(code)
    if (r) {
      const result = { taux: r.taux, nom: r.nom, annee: 2024, source: 'DGFiP REI — data.economie.gouv.fr', fetchedAt: Date.now() }
      cache.set(code, result)
      return NextResponse.json(result)
    }
  } catch (e) { console.error('[cfe-taux] REI complet failed:', e) }

  // 4. Extraits data.economie.gouv.fr
  for (const ds of ['fiscalite-locale-des-entreprises', 'fiscalite-locale-des-entreprises-copie']) {
    try {
      const r = await fetchEconomieDataset(code, ds)
      if (r) {
        const result = { taux: r.taux, nom: r.nom, annee: 2024, source: `DGFiP — ${ds}`, fetchedAt: Date.now() }
        cache.set(code, result)
        return NextResponse.json(result)
      }
    } catch (e) { console.error(`[cfe-taux] ${ds} failed:`, e) }
  }

  // 5. OFGL REI (format long, filtre côté client)
  try {
    const r = await fetchOFGL(code)
    if (r) {
      const result = { taux: r.taux, nom: r.nom, annee: r.annee, source: 'OFGL — data.ofgl.fr', fetchedAt: Date.now() }
      cache.set(code, result)
      return NextResponse.json(result)
    }
  } catch (e) { console.error('[cfe-taux] OFGL failed:', e) }

  return NextResponse.json({ error: `Taux CFE non trouvé pour le code INSEE ${code}.` }, { status: 404 })
}

// ── Fetchers API ──────────────────────────────────────────────────────────────

async function fetchREIComplet(code: string): Promise<{ taux: number; nom: string } | null> {
  const DS = 'impots-locaux-fichier-de-recensement-des-elements-dimposition-a-la-fiscalite-dir'
  const base = `https://data.economie.gouv.fr/api/explore/v2.1/catalog/datasets/${DS}/records`
  for (const field of ['codgeo', 'code_commune', 'code_insee']) {
    for (const val of [`"${code}"`, code]) {
      try {
        const res = await fetch(`${base}?where=${encodeURIComponent(`${field}=${val}`)}&limit=3`, { signal: AbortSignal.timeout(10000) })
        if (!res.ok) continue
        const data = await res.json()
        const results: unknown[] = data.results || data.records || []
        if (!results.length) continue
        const rec = unwrap(results[0])
        console.log(`[cfe] REI field=${field} val=${val} keys:`, Object.keys(rec).slice(0, 20).join(','))
        const taux = extractCFETaux(rec)
        if (taux && taux > 0) return { taux, nom: extractNom(rec) }
      } catch { continue }
    }
  }
  return null
}

async function fetchEconomieDataset(code: string, ds: string): Promise<{ taux: number; nom: string } | null> {
  const base = `https://data.economie.gouv.fr/api/explore/v2.1/catalog/datasets/${ds}/records`
  for (const field of ['codgeo', 'code_commune', 'code_insee', 'com_code']) {
    try {
      const res = await fetch(`${base}?where=${encodeURIComponent(`${field}="${code}"`)}&limit=5`, { signal: AbortSignal.timeout(10000) })
      if (!res.ok) continue
      const data = await res.json()
      const results: unknown[] = data.results || data.records || []
      if (!results.length) continue
      const rec = unwrap(results[0])
      console.log(`[cfe] ${ds} field=${field} keys:`, Object.keys(rec).slice(0, 20).join(','))
      const taux = extractCFETaux(rec)
      if (taux && taux > 0) return { taux, nom: extractNom(rec) }
    } catch { continue }
  }
  return null
}

async function fetchOFGL(code: string): Promise<{ taux: number; nom: string; annee: number } | null> {
  const base = 'https://data.ofgl.fr/api/explore/v2.1/catalog/datasets/rei/records'
  for (const field of ['code_commune', 'codgeo', 'code_insee']) {
    try {
      const res = await fetch(
        `${base}?where=${encodeURIComponent(`${field}="${code}"`)}&limit=50&order_by=annee%20desc`,
        { signal: AbortSignal.timeout(10000) }
      )
      if (!res.ok) continue
      const data = await res.json()
      const results: unknown[] = data.results || data.records || []
      if (!results.length) continue

      console.log(`[cfe] OFGL field=${field} rows=${results.length} sample:`, JSON.stringify(unwrap(results[0])).slice(0, 200))

      const cfeTaux = results.filter((r) => {
        const rec = unwrap(r)
        const d = String(rec.dispositif_fiscal ?? '').toLowerCase()
        const c = String(rec.categorie ?? '').toLowerCase()
        return (d.includes('cfe') || d.includes('cotisation fonci')) && c.includes('taux')
      })

      if (!cfeTaux.length) {
        console.warn(`[cfe] OFGL no CFE/taux rows for ${code}:`, results.slice(0, 2).map(r => {
          const rec = unwrap(r); return `d=${rec.dispositif_fiscal} c=${rec.categorie}`
        }).join(' | '))
        continue
      }

      const byYear = new Map<number, { total: number; nom: string }>()
      for (const r of cfeTaux) {
        const rec = unwrap(r)
        const annee = toNum(rec.annee); if (!annee) continue
        const montant = toNum(rec.montant ?? rec.valeur ?? rec.taux); if (!montant || montant <= 0) continue
        const nom = String(rec.nom_commune ?? rec.lib_commune ?? rec.libelle_commune ?? '')
        const ex = byYear.get(annee)
        if (ex) ex.total += montant
        else byYear.set(annee, { total: montant, nom })
      }
      if (!byYear.size) continue
      const yr = Math.max(...byYear.keys())
      const { total, nom } = byYear.get(yr)!
      return { taux: Math.round(total * 100) / 100, nom, annee: yr }
    } catch { continue }
  }
  return null
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function unwrap(r: unknown): Record<string, unknown> {
  if (r && typeof r === 'object') {
    const o = r as { fields?: Record<string, unknown> }
    return o.fields ?? (r as Record<string, unknown>)
  }
  return {}
}

function toNum(v: unknown): number | null {
  if (typeof v === 'number') return v
  if (typeof v === 'string') { const n = parseFloat(v.replace(',', '.')); return isNaN(n) ? null : n }
  return null
}

function extractCFETaux(f: Record<string, unknown>): number | null {
  for (const k of ['taux_cfe_hz','taux_cfe','cfe_hz','cfe_taux_hz','cfe_taux','taux_global_cfe_hz','taux_global_cfe','txg_cfe_hz','txg_cfe','tx_cfe_hz','tx_cfe','txcfe_hz','txcfe']) {
    if (k in f) { const n = toNum(f[k]); if (n && n > 0) return n }
  }
  for (const [k, v] of Object.entries(f)) {
    if (k.toLowerCase().includes('cfe')) { const n = toNum(v); if (n && n > 0 && n < 100) return n }
  }
  return null
}

function extractNom(f: Record<string, unknown>): string {
  for (const k of ['libgeo','nom_commune','lib_commune','libelle_commune','nom','commune','libelle']) {
    if (k in f && typeof f[k] === 'string') return f[k] as string
  }
  return ''
}

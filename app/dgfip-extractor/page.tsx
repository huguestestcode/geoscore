'use client'
import { useState, useCallback } from 'react'

const ALL_CODES = [
  '01053','02691','03185','05061','06004','06027','06029','06030','06069','06088',
  '08105','10387','11069','11262','13001','13004','13005','13014','13047','13055',
  '13056','13081','13103','13117','13201','13202','13203','13204','13205','13206',
  '13207','13208','13209','13210','13211','13212','13213','13214','13215','13216',
  '14118','16015','17300','18033','19031','21231','22278','25056','26198','26362',
  '27229','28085','29019','29232','2A004','2B033','30007','30189','31555','31561',
  '33063','33281','33318','33522','33550','34032','34172','34301','35238','35288',
  '36044','37195','37261','38185','38364','38421','41018','42218','44109','44143',
  '44162','44184','45234','47001','49007','49080','49307','50129','51108','51454',
  '53130','54395','56121','56260','57463','57672','59009','59139','59178','59196',
  '59350','59378','59512','59599','59606','59640','60057','60159','62041','62119',
  '62160','63113','63124','64024','64102','64445','65440','66136','67482','68066',
  '68224','68297','69029','69034','69040','69044','69051','69063','69068','69081',
  '69089','69091','69100','69116','69123','69142','69143','69149','69152','69163',
  '69168','69194','69199','69202','69204','69233','69244','69250','69256','69259',
  '69266','69271','69275','69276','69278','69279','69282','69284','69286','69290',
  '69381','69382','69383','69384','69385','69386','69387','69388','69389','71076',
  '72181','73065','74010','75056','75101','75102','75103','75104','75105','75106',
  '75107','75108','75109','75110','75111','75112','75113','75114','75115','75116',
  '75117','75118','75119','75120','76275','76351','76540','77083','77284','77288',
  '78361','78517','78551','78586','78646','79191','80021','81004','81065','82121',
  '83023','83050','83061','83069','83137','84007','84054','85109','85191','86194',
  '87085','90010','91174','91228','91377','92002','92004','92012','92023','92024',
  '92025','92026','92036','92040','92044','92048','92049','92050','92051','92062',
  '92063','92073','93005','93006','93007','93008','93010','93013','93027','93029',
  '93031','93032','93047','93048','93049','93051','93057','93063','93064','93066',
  '93071','94002','94019','94022','94028','94033','94038','94043','94054','94067',
  '94076','94080','94081','95018','95127','95268','95572','95585','97100','97209',
  '97213','97416','97422','97701',
]

const DATASET = 'deliberations-de-fiscalite-directe-locale-des-communes-2025-hors-taux'
const BASE_URL = `https://data.economie.gouv.fr/api/explore/v2.1/catalog/datasets/${DATASET}/records`
const SELECT = 'depcom,libcom,bazmincfe1mt,bazmincfe2mt,bazmincfe3mt,bazmincfe4mt,bazmincfe5mt,bazmincfe6mt'

// Tranches CA : t1=≤10k, t2=10k-32.6k, t3=32.6k-100k, t4=100k-250k, t5=250k-500k, t6=>500k
const TRANCHE_FIELDS = ['bazmincfe1mt','bazmincfe2mt','bazmincfe3mt','bazmincfe4mt','bazmincfe5mt','bazmincfe6mt'] as const

type Record = {
  depcom: string
  libcom: string
  bazmincfe1mt: number | null
  bazmincfe2mt: number | null
  bazmincfe3mt: number | null
  bazmincfe4mt: number | null
  bazmincfe5mt: number | null
  bazmincfe6mt: number | null
}

export default function DGFiPExtractor() {
  const [status, setStatus] = useState('')
  const [output, setOutput] = useState('Clique sur "Lancer" pour démarrer...')
  const [done, setDone] = useState(false)
  const [running, setRunning] = useState(false)

  const run = useCallback(async () => {
    setRunning(true)
    setDone(false)
    setOutput('')

    try {
      setStatus('📡 Connexion à l\'API DGFiP...')

      // Fetch par batches de 50 codes (IN query)
      const BATCH = 50
      const allRecords: Record[] = []
      const batches: string[][] = []
      for (let i = 0; i < ALL_CODES.length; i += BATCH) {
        batches.push(ALL_CODES.slice(i, i + BATCH))
      }

      for (let b = 0; b < batches.length; b++) {
        const batch = batches[b]
        setStatus(`📥 Batch ${b + 1}/${batches.length} — ${allRecords.length} communes chargées...`)

        const inClause = batch.map(c => `"${c}"`).join(',')
        const params = new URLSearchParams({
          where: `depcom IN (${inClause})`,
          select: SELECT,
          limit: '100',
          offset: '0',
        })

        const res = await fetch(`${BASE_URL}?${params}`)
        if (!res.ok) {
          const text = await res.text()
          throw new Error(`HTTP ${res.status} batch ${b + 1}: ${text.slice(0, 200)}`)
        }
        const data = await res.json()
        const results: Record[] = data.results ?? []
        allRecords.push(...results)

        if (b < batches.length - 1) {
          await new Promise(r => setTimeout(r, 200))
        }
      }

      setStatus(`✅ ${allRecords.length} communes récupérées — génération TypeScript...`)

      const ts = buildTS(allRecords)
      setOutput(ts)
      setDone(true)
      setStatus(`🎉 ${allRecords.length}/${ALL_CODES.length} communes trouvées. Copie le résultat et colle-le dans taux-data.ts`)

    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e)
      setStatus(`❌ Erreur: ${msg}`)
      setOutput(`Erreur: ${msg}`)
    }
    setRunning(false)
  }, [])

  function buildTS(records: Record[]): string {
    const lines: string[] = []
    const date = new Date().toISOString().slice(0, 10)
    lines.push(`// AUTO-GÉNÉRÉ depuis l'API DGFiP — ${date}`)
    lines.push(`// Dataset: ${DATASET}`)
    lines.push(`// Champs: bazmincfe1mt..bazmincfe6mt = base minimale CFE par tranche CA`)
    lines.push(`// t1=CA≤10k | t2=10k-32.6k | t3=32.6k-100k | t4=100k-250k | t5=250k-500k | t6=>500k`)
    lines.push(`// ${records.length} communes récupérées sur ${ALL_CODES.length} demandées`)
    lines.push('')

    const SOURCE = `'DGFiP — délibérations fiscalité directe locale 2025'`

    // Index par code
    const byCode = new Map(records.map(r => [r.depcom, r]))

    const newEntries: string[] = []
    const nullEntries: string[] = []
    const foundCodes = new Set<string>()

    for (const code of [...ALL_CODES].sort()) {
      const r = byCode.get(code)
      if (!r) continue
      foundCodes.add(code)

      const nom = r.libcom ?? ''
      const tranches = TRANCHE_FIELDS.map(f => r[f])
      const hasAny = tranches.some(t => t !== null)

      if (!hasAny) {
        // Toutes null = pas de délibération = plancher légal
        nullEntries.push(`  // ${code} ${nom} — pas de délibération (plancher légal s'applique)`)
        continue
      }

      // Toutes identiques ?
      const nonNull = tranches.filter((t): t is number => t !== null)
      const allSame = nonNull.every(v => v === nonNull[0])

      newEntries.push(`  // ${nom}`)
      if (allSame) {
        newEntries.push(`  '${code}': { base: ${nonNull[0]}, source: ${SOURCE} },`)
      } else {
        const t1 = tranches[0] ?? nonNull[0]
        const trancheArr = `[${tranches.map(t => t ?? 'null').join(', ')}]`
        newEntries.push(`  '${code}': { base: ${t1}, source: ${SOURCE}, tranches: ${trancheArr} },`)
      }
    }

    if (newEntries.length > 0) {
      lines.push('// ── COLLER DANS BASE_MINIMALE_CONNUES ─────────────────────────────────────────')
      lines.push(...newEntries)
    }

    if (nullEntries.length > 0) {
      lines.push('')
      lines.push('// ── COMMUNES SANS DÉLIBÉRATION (plancher légal) ──────────────────────────────')
      lines.push(...nullEntries)
    }

    const notFound = ALL_CODES.filter(c => !foundCodes.has(c))
    if (notFound.length > 0) {
      lines.push('')
      lines.push(`// ── INTROUVABLES dans l'API (${notFound.length}) ─────────────────────────────`)
      lines.push(`// ${notFound.join(', ')}`)
    }

    lines.push('')
    lines.push(`// RÉSUMÉ: ${newEntries.filter(l => l.startsWith("  '")).length} entrées avec base, ${nullEntries.length} sans délibération, ${notFound.length} introuvables`)

    return lines.join('\n')
  }

  return (
    <div style={{ fontFamily: 'monospace', background: '#1e1e1e', color: '#d4d4d4', minHeight: '100vh', padding: '20px' }}>
      <h1 style={{ color: '#4fc3f7' }}>DGFiP — CFE Base Minimale 2025</h1>
      <p style={{ color: '#81c784' }}>
        Interroge <code>data.economie.gouv.fr</code> — champs <code>bazmincfe1mt..bazmincfe6mt</code> — {ALL_CODES.length} communes
      </p>

      <div style={{ marginBottom: 12 }}>
        <button
          onClick={run}
          disabled={running}
          style={{
            padding: '10px 20px', fontSize: 15, cursor: running ? 'not-allowed' : 'pointer',
            background: running ? '#555' : '#0d47a1', color: 'white', border: 'none',
            borderRadius: 4, marginRight: 8,
          }}
        >
          {running ? '⏳ En cours...' : '🚀 Lancer l\'extraction'}
        </button>
        {done && (
          <button
            onClick={() => navigator.clipboard.writeText(output)}
            style={{ padding: '10px 20px', fontSize: 15, background: '#2e7d32', color: 'white', border: 'none', borderRadius: 4 }}
          >
            📋 Copier le TypeScript
          </button>
        )}
      </div>

      {status && <div style={{ color: '#ffb74d', marginBottom: 8 }}>{status}</div>}

      <pre style={{
        background: '#2d2d2d', border: '1px solid #555', padding: 15,
        whiteSpace: 'pre-wrap', fontSize: 12, maxHeight: '70vh', overflowY: 'auto',
      }}>
        {output}
      </pre>
    </div>
  )
}

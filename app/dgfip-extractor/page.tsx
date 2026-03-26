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

const ALREADY_CONFIRMED = new Set([
  '75056','75101','75102','75103','75104','75105','75106','75107','75108','75109',
  '75110','75111','75112','75113','75114','75115','75116','75117','75118','75119','75120',
  '13055','13201','13202','13203','13204','13205','13206','13207','13208','13209',
  '13210','13211','13212','13213','13214','13215','13216',
  '13001','13005','13047','13056','13103','13117',
  '33063','33281','33318','33522','33550',
])

const DATASET = 'deliberations-de-fiscalite-directe-locale-des-communes-2025-hors-taux'
const BASE_URL = `https://data.economie.gouv.fr/api/explore/v2.1/catalog/datasets/${DATASET}/records`

export default function DGFiPExtractor() {
  const [status, setStatus] = useState('')
  const [output, setOutput] = useState('Clique sur "Lancer" pour démarrer...')
  const [done, setDone] = useState(false)
  const [running, setRunning] = useState(false)
  const [rawSample, setRawSample] = useState<unknown>(null)

  const run = useCallback(async () => {
    setRunning(true)
    setDone(false)
    setOutput('')
    setRawSample(null)

    try {
      // ── Étape 1 : explorer le schéma ──────────────────────────────────
      setStatus('📡 Connexion à l\'API DGFiP...')
      const sampleRes = await fetch(
        `${BASE_URL}?where=code_dispositif%3D%22TFB-CFE-14%22&limit=3&select=*`
      )
      if (!sampleRes.ok) {
        throw new Error(`HTTP ${sampleRes.status} — ${sampleRes.statusText}\n${await sampleRes.text()}`)
      }
      const sampleData = await sampleRes.json()
      setRawSample(sampleData)
      const total: number = sampleData.total_count ?? 0
      setStatus(`✅ API OK — ${total} enregistrements TFB-CFE-14 trouvés. Chargement...`)

      if (total === 0) {
        setOutput(
          '// ⚠️  Aucun résultat pour TFB-CFE-14\n' +
          '// Dataset peut-être nommé différemment ou code dispositif incorrect.\n' +
          '// Voici un sample brut (3 enregistrements sans filtre) pour debug :\n' +
          JSON.stringify(sampleData, null, 2)
        )
        setDone(false)
        setRunning(false)
        return
      }

      // ── Étape 2 : pagination ────────────────────────────────────────────
      const allRecords: Record<string, unknown>[] = [...(sampleData.results ?? [])]
      let offset = allRecords.length

      while (allRecords.length < total) {
        setStatus(`📥 ${allRecords.length}/${total} chargés...`)
        const res = await fetch(
          `${BASE_URL}?where=code_dispositif%3D%22TFB-CFE-14%22&limit=100&offset=${offset}&select=*`
        )
        if (!res.ok) throw new Error(`HTTP ${res.status} offset=${offset}`)
        const page = await res.json()
        const results: Record<string, unknown>[] = page.results ?? []
        if (results.length === 0) break
        allRecords.push(...results)
        offset += results.length
        if (results.length < 100) break
        await new Promise(r => setTimeout(r, 150))
      }

      setStatus(`✅ ${allRecords.length} enregistrements récupérés — génération TypeScript...`)

      // ── Étape 3 : grouper par commune ──────────────────────────────────
      const ourSet = new Set(ALL_CODES)
      const byCommune: Record<string, { nom: string; records: Record<string, unknown>[] }> = {}

      for (const r of allRecords) {
        const code = String(r.codgeo ?? '')
        if (!ourSet.has(code)) continue
        if (!byCommune[code]) byCommune[code] = { nom: String(r.libgeo ?? ''), records: [] }
        byCommune[code].records.push(r)
      }

      // ── Étape 4 : générer le TS ─────────────────────────────────────────
      const ts = buildTS(byCommune, allRecords.length)
      setOutput(ts)
      setDone(true)
      setStatus(`🎉 ${Object.keys(byCommune).length} communes trouvées. Copie le résultat et colle-le dans taux-data.ts`)

    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e)
      setStatus(`❌ Erreur: ${msg}`)
      setOutput(`Erreur: ${msg}`)
    }
    setRunning(false)
  }, [])

  function buildTS(
    byCommune: Record<string, { nom: string; records: Record<string, unknown>[] }>,
    totalFetched: number
  ): string {
    const lines: string[] = []
    lines.push(`// AUTO-GÉNÉRÉ depuis l'API DGFiP — ${new Date().toISOString().slice(0, 10)}`)
    lines.push(`// Dataset: ${DATASET}`)
    lines.push(`// TFB-CFE-14 = base minimale CFE art. 1647 D CGI`)
    lines.push(`// Total enregistrements récupérés: ${totalFetched}`)
    lines.push(`// Communes matchées sur nos ${ALL_CODES.length} codes: ${Object.keys(byCommune).length}`)
    lines.push('')

    // Inspecter les champs disponibles depuis le premier record
    const firstRecord = Object.values(byCommune)[0]?.records[0]
    if (firstRecord) {
      lines.push(`// Champs disponibles: ${Object.keys(firstRecord).join(', ')}`)
      lines.push(`// Exemple: ${JSON.stringify(firstRecord)}`)
      lines.push('')
    }

    // Tranche mapping: chercher un champ "tranche" dans les enregistrements
    const trancheField = firstRecord
      ? Object.keys(firstRecord).find(k => k.toLowerCase().includes('tranche'))
      : null
    const montantField = firstRecord
      ? Object.keys(firstRecord).find(k =>
          k === 'montant' || k === 'montant_base_min' || k === 'base_minimum' ||
          k === 'valeur' || k === 'base_minimale' || k.toLowerCase().includes('montant')
        )
      : null

    lines.push(`// Champ tranche détecté: ${trancheField ?? 'AUCUN'}`)
    lines.push(`// Champ montant détecté: ${montantField ?? 'AUCUN'}`)
    lines.push('')

    const SOURCE = `'DGFiP — délibérations fiscalité directe locale 2025'`

    const newEntries: string[] = []
    for (const [code, { nom, records }] of Object.entries(byCommune).sort()) {
      if (ALREADY_CONFIRMED.has(code)) continue

      let entryStr = ''
      if (!montantField) {
        // Pas de champ montant reconnu — dump brut
        entryStr = `  // ${code} ${nom} — champ montant non reconnu, données brutes:\n  // ${JSON.stringify(records[0])}`
      } else if (records.length === 1) {
        const val = parseFloat(String(records[0][montantField] ?? ''))
        entryStr = `  '${code}': { base: ${val}, source: ${SOURCE} },`
      } else if (trancheField && records.length > 1) {
        // Plusieurs enregistrements = un par tranche
        const TRANCHE_MAP: Record<string, number> = { '1': 0, '2': 1, '3': 2, '4': 3, '5': 4, '6': 5 }
        const tranches: (number | null)[] = [null, null, null, null, null, null]
        for (const r of records) {
          const tn = String(r[trancheField] ?? '')
          const idx = TRANCHE_MAP[tn]
          const val = parseFloat(String(r[montantField] ?? ''))
          if (idx !== undefined && !isNaN(val)) tranches[idx] = val
        }
        const allSame = tranches.every((v, _, a) => v === null || v === a.find(x => x !== null))
        const firstVal = tranches.find(t => t !== null) ?? 0
        if (allSame) {
          entryStr = `  '${code}': { base: ${firstVal}, source: ${SOURCE} },`
        } else {
          entryStr = `  '${code}': { base: ${firstVal}, source: ${SOURCE}, tranches: [${tranches.map(t => t ?? 'null').join(', ')}] },`
        }
      } else {
        const val = parseFloat(String(records[0][montantField] ?? ''))
        entryStr = `  '${code}': { base: ${val}, source: ${SOURCE} },`
      }
      newEntries.push(`  // ${nom}`)
      newEntries.push(entryStr)
    }

    if (newEntries.length > 0) {
      lines.push('// ── COLLER DANS BASE_MINIMALE_CONNUES ────────────────────────────────────────')
      lines.push(...newEntries)
    } else {
      lines.push('// Aucune nouvelle commune (toutes déjà confirmées ou non trouvées)')
    }

    // Not found
    const foundCodes = new Set(Object.keys(byCommune))
    const notFound = ALL_CODES.filter(c => !foundCodes.has(c) && !ALREADY_CONFIRMED.has(c))
    if (notFound.length > 0) {
      lines.push('')
      lines.push(`// INTROUVABLES dans l'API (${notFound.length}): ${notFound.join(', ')}`)
    }

    return lines.join('\n')
  }

  return (
    <div style={{ fontFamily: 'monospace', background: '#1e1e1e', color: '#d4d4d4', minHeight: '100vh', padding: '20px' }}>
      <h1 style={{ color: '#4fc3f7' }}>🔍 DGFiP — CFE Base Minimale 2025</h1>
      <p style={{ color: '#81c784' }}>
        Interroge directement <code>data.economie.gouv.fr</code> depuis ton navigateur
        (dataset TFB-CFE-14) pour les {ALL_CODES.length} communes du simulateur.
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

      {rawSample && (
        <details style={{ marginBottom: 8 }}>
          <summary style={{ cursor: 'pointer', color: '#90caf9' }}>🔬 Sample brut (3 enregistrements)</summary>
          <pre style={{ fontSize: 11, color: '#aaa', maxHeight: 200, overflow: 'auto' }}>
            {JSON.stringify(rawSample, null, 2)}
          </pre>
        </details>
      )}

      <pre style={{
        background: '#2d2d2d', border: '1px solid #555', padding: 15,
        whiteSpace: 'pre-wrap', fontSize: 12, maxHeight: '60vh', overflowY: 'auto',
      }}>
        {output}
      </pre>
    </div>
  )
}

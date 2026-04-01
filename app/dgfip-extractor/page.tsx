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

// Commune INSEE → EPCI SIREN (pour communes en FPU dont la base est votée par l'EPCI)
const COMMUNE_TO_EPCI: Record<string, string> = {
  // Métropole de Lyon (SIREN 200046977)
  '69029':'200046977','69034':'200046977','69040':'200046977','69044':'200046977',
  '69051':'200046977','69063':'200046977','69068':'200046977','69081':'200046977',
  '69089':'200046977','69091':'200046977','69100':'200046977','69116':'200046977',
  '69123':'200046977','69142':'200046977','69143':'200046977','69149':'200046977',
  '69152':'200046977','69163':'200046977','69168':'200046977','69194':'200046977',
  '69199':'200046977','69202':'200046977','69204':'200046977','69233':'200046977',
  '69244':'200046977','69250':'200046977','69256':'200046977','69259':'200046977',
  '69266':'200046977','69271':'200046977','69275':'200046977','69276':'200046977',
  '69278':'200046977','69279':'200046977','69282':'200046977','69284':'200046977',
  '69286':'200046977','69290':'200046977',
  '69381':'200046977','69382':'200046977','69383':'200046977','69384':'200046977',
  '69385':'200046977','69386':'200046977','69387':'200046977','69388':'200046977',
  '69389':'200046977',
  // Toulouse Métropole (SIREN 243100518)
  '31555':'243100518','31561':'243100518',
  // Nantes Métropole (SIREN 244400404)
  '44109':'244400404','44143':'244400404','44162':'244400404','44184':'244400404',
  // Métropole Européenne de Lille (SIREN 245900410)
  '59009':'245900410','59139':'245900410','59178':'245900410','59196':'245900410',
  '59350':'245900410','59378':'245900410','59512':'245900410','59599':'245900410',
  '59606':'245900410','59640':'245900410',
  // Eurométropole de Strasbourg (SIREN 246700488)
  '67482':'246700488',
  // Métropole Nice Côte d'Azur (SIREN 200030195)
  '06004':'200030195','06027':'200030195','06029':'200030195','06030':'200030195',
  '06069':'200030195','06088':'200030195',
  // Aix-Marseille-Provence (SIREN 200054807)
  '13001':'200054807','13004':'200054807','13005':'200054807','13014':'200054807',
  '13047':'200054807','13055':'200054807','13056':'200054807','13081':'200054807',
  '13103':'200054807','13117':'200054807',
  '13201':'200054807','13202':'200054807','13203':'200054807','13204':'200054807',
  '13205':'200054807','13206':'200054807','13207':'200054807','13208':'200054807',
  '13209':'200054807','13210':'200054807','13211':'200054807','13212':'200054807',
  '13213':'200054807','13214':'200054807','13215':'200054807','13216':'200054807',
  // Montpellier Méditerranée Métropole (SIREN 243400017)
  '34032':'243400017','34172':'243400017','34301':'243400017',
  // Rennes Métropole (SIREN 243500139)
  '35238':'243500139','35288':'243500139',
  // Grenoble-Alpes Métropole (SIREN 200040715)
  '38185':'200040715','38364':'200040715','38421':'200040715',
  // Clermont Auvergne Métropole (SIREN 246300701)
  '63113':'246300701','63124':'246300701',
  // Eurométropole de Metz (SIREN 200052013)
  '57463':'200052013','57672':'200052013',
  // Métropole du Grand Nancy (SIREN 200017703)
  '54395':'200017703',
  // Bordeaux Métropole (SIREN 243300316)
  '33063':'243300316','33281':'243300316','33318':'243300316',
  '33522':'243300316','33550':'243300316',
}

const EPCI_SIRENS = [...new Set(Object.values(COMMUNE_TO_EPCI))]

const DATASET_COMMUNES = 'deliberations-de-fiscalite-directe-locale-des-communes-2025-hors-taux'
const BASE_URL = `https://data.economie.gouv.fr/api/explore/v2.1/catalog/datasets`
const SELECT_COM = 'depcom,libcom,bazmincfe1mt,bazmincfe2mt,bazmincfe3mt,bazmincfe4mt,bazmincfe5mt,bazmincfe6mt'
const TRANCHE_FIELDS = ['bazmincfe1mt','bazmincfe2mt','bazmincfe3mt','bazmincfe4mt','bazmincfe5mt','bazmincfe6mt'] as const

const EPCI_CANDIDATES = [
  'deliberations-de-fiscalite-directe-locale-des-groupements-2025-hors-taux',
  'deliberations-de-fiscalite-directe-locale-des-epci-2025-hors-taux',
  'deliberations-de-fiscalite-directe-locale-des-groupements-de-communes-2025-hors-taux',
  'deliberations-de-fiscalite-directe-locale-des-groupements-a-fiscalite-propre-2025-hors-taux',
  'deliberations-de-fiscalite-directe-locale-des-epci-a-fiscalite-propre-2025-hors-taux',
]

type CfeRec = Record<string, number | string | null>

export default function DGFiPExtractor() {
  const [status, setStatus] = useState('')
  const [output, setOutput] = useState('Clique sur "Lancer" pour démarrer...')
  const [done, setDone] = useState(false)
  const [running, setRunning] = useState(false)

  const run = useCallback(async () => {
    setRunning(true)
    setDone(false)
    setOutput('')

    const log: string[] = []

    try {
      // ── Étape 1 : dataset communes ────────────────────────────────────────────
      setStatus('📡 Étape 1/3 — Chargement communes...')
      const comRecords: CfeRec[] = []
      const batches: string[][] = []
      for (let i = 0; i < ALL_CODES.length; i += 50) batches.push(ALL_CODES.slice(i, i + 50))

      for (let b = 0; b < batches.length; b++) {
        setStatus(`📥 Communes batch ${b + 1}/${batches.length} — ${comRecords.length} chargées...`)
        const inClause = batches[b].map(c => `"${c}"`).join(',')
        const params = new URLSearchParams({ where: `depcom IN (${inClause})`, select: SELECT_COM, limit: '100', offset: '0' })
        const res = await fetch(`${BASE_URL}/${DATASET_COMMUNES}/records?${params}`)
        if (!res.ok) throw new Error(`HTTP ${res.status} communes batch ${b + 1}`)
        const data = await res.json()
        comRecords.push(...(data.results ?? []))
        if (b < batches.length - 1) await new Promise(r => setTimeout(r, 200))
      }
      log.push(`${comRecords.length} communes chargées`)

      // ── Étape 2 : probe dataset EPCI ─────────────────────────────────────────
      setStatus('🔍 Étape 2/3 — Détection dataset EPCI...')
      let epciDataset: string | null = null
      let epciSirenField: string | null = null
      let epciNameField: string | null = null

      for (const candidate of EPCI_CANDIDATES) {
        setStatus(`🔍 Test: ${candidate.slice(0, 55)}...`)
        try {
          const res = await fetch(`${BASE_URL}/${candidate}/records?limit=2`)
          if (res.ok) {
            const probe = await res.json()
            if (probe.results?.length > 0) {
              epciDataset = candidate
              const keys: string[] = Object.keys(probe.results[0])
              for (const k of ['siren','sirenepci','siren_epci','depgrp','codgeo','codepci']) {
                if (keys.includes(k)) { epciSirenField = k; break }
              }
              for (const k of ['libepci','libgroupement','nom','libelle','libcom']) {
                if (keys.includes(k)) { epciNameField = k; break }
              }
              log.push(`Dataset EPCI: ${candidate}`)
              log.push(`Champs: ${keys.join(', ')}`)
              log.push(`Champ SIREN détecté: ${epciSirenField ?? '⚠️ non trouvé'}`)
              log.push(`Premier enregistrement: ${JSON.stringify(probe.results[0], null, 2)}`)
              break
            }
          }
        } catch { /* try next */ }
        await new Promise(r => setTimeout(r, 150))
      }

      if (!epciDataset) {
        log.push('⚠️ Aucun dataset EPCI trouvé parmi les candidats testés')
      }

      // ── Étape 3 : données EPCI ────────────────────────────────────────────────
      const epciData = new Map<string, CfeRec>()

      if (epciDataset && epciSirenField) {
        setStatus(`📡 Étape 3/3 — Chargement EPCIs (${EPCI_SIRENS.length} SIRENs)...`)
        const sirenBatches: string[][] = []
        for (let i = 0; i < EPCI_SIRENS.length; i += 20) sirenBatches.push(EPCI_SIRENS.slice(i, i + 20))

        for (let b = 0; b < sirenBatches.length; b++) {
          setStatus(`📥 EPCI batch ${b + 1}/${sirenBatches.length}...`)
          const inClause = sirenBatches[b].map(s => `"${s}"`).join(',')
          const selectFields = [epciSirenField, epciNameField, ...TRANCHE_FIELDS].filter(Boolean).join(',')
          const params = new URLSearchParams({
            where: `${epciSirenField} IN (${inClause})`,
            select: selectFields,
            limit: '50',
            offset: '0',
          })
          try {
            const res = await fetch(`${BASE_URL}/${epciDataset}/records?${params}`)
            if (res.ok) {
              const data = await res.json()
              for (const r of (data.results ?? [])) {
                const siren = String(r[epciSirenField] ?? '')
                if (siren) epciData.set(siren, r)
              }
            }
          } catch { /* log but continue */ }
          if (b < sirenBatches.length - 1) await new Promise(r => setTimeout(r, 200))
        }
        log.push(`EPCIs trouvés: ${epciData.size}/${EPCI_SIRENS.length}`)
      }

      const ts = buildTS(comRecords, epciData, epciSirenField, epciNameField, epciDataset, log)
      setOutput(ts)
      setDone(true)
      const withBase = (ts.match(/^\s+'[0-9A-Z]+': /gm) ?? []).length
      setStatus(`🎉 ${withBase} communes avec base. Copie et colle dans BASE_MINIMALE_CONNUES de taux-data.ts`)

    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e)
      setStatus(`❌ Erreur: ${msg}`)
      setOutput(`// Erreur: ${msg}\n// LOG:\n${log.map(l => `// ${l}`).join('\n')}`)
    }
    setRunning(false)
  }, [])

  function buildTS(
    comRecords: CfeRec[],
    epciData: Map<string, CfeRec>,
    epciSirenField: string | null,
    epciNameField: string | null,
    epciDataset: string | null,
    log: string[],
  ): string {
    const lines: string[] = []
    const date = new Date().toISOString().slice(0, 10)
    const SOURCE_COM = `'DGFiP délibérations communes 2025'`
    const SOURCE_EPCI = `'DGFiP délibérations EPCI 2025'`

    lines.push(`// AUTO-GÉNÉRÉ — ${date}`)
    lines.push(`// Dataset communes: ${DATASET_COMMUNES}`)
    if (epciDataset) lines.push(`// Dataset EPCI: ${epciDataset}`)
    lines.push(`// bazmincfe1mt..6mt : ≤10k | 10k-32.6k | 32.6k-100k | 100k-250k | 250k-500k | >500k`)
    lines.push('')

    const byCode = new Map(comRecords.map(r => [r.depcom as string, r]))
    const direct: string[] = [], fromEpci: string[] = [], noBase: string[] = [], notFound: string[] = []

    for (const code of [...ALL_CODES].sort()) {
      const r = byCode.get(code)
      if (!r) { notFound.push(code); continue }

      const nom = String(r.libcom ?? '')
      const tranches = TRANCHE_FIELDS.map(f => r[f] !== null && r[f] !== undefined ? Number(r[f]) : null)
      const hasAny = tranches.some(t => t !== null)

      if (!hasAny) {
        const siren = COMMUNE_TO_EPCI[code]
        if (siren && epciData.has(siren)) {
          const er = epciData.get(siren)!
          const et = TRANCHE_FIELDS.map(f => er[f] !== null && er[f] !== undefined ? Number(er[f]) : null)
          const etHas = et.some(t => t !== null)
          if (etHas) {
            const nonNull = et.filter((t): t is number => t !== null)
            const allSame = nonNull.every(v => v === nonNull[0])
            const epciNom = epciNameField ? String(er[epciNameField] ?? siren) : siren
            fromEpci.push(`  // ${nom} (FPU – ${epciNom})`)
            if (allSame) {
              fromEpci.push(`  '${code}': { base: ${nonNull[0]}, source: ${SOURCE_EPCI} },`)
            } else {
              const t1 = et[0] ?? nonNull[0]
              fromEpci.push(`  '${code}': { base: ${t1}, source: ${SOURCE_EPCI}, tranches: [${et.map(t => t ?? 'null').join(', ')}] },`)
            }
          } else {
            noBase.push(`  // ${code} ${nom} — EPCI ${siren} trouvé mais base nulle`)
          }
        } else {
          noBase.push(`  // ${code} ${nom} — ${siren ? `FPU EPCI ${siren} absent du dataset` : 'plancher légal'}`)
        }
        continue
      }

      const nonNull = tranches.filter((t): t is number => t !== null)
      const allSame = nonNull.every(v => v === nonNull[0])
      direct.push(`  // ${nom}`)
      if (allSame) {
        direct.push(`  '${code}': { base: ${nonNull[0]}, source: ${SOURCE_COM} },`)
      } else {
        const t1 = tranches[0] ?? nonNull[0]
        direct.push(`  '${code}': { base: ${t1}, source: ${SOURCE_COM}, tranches: [${tranches.map(t => t ?? 'null').join(', ')}] },`)
      }
    }

    if (direct.length) {
      lines.push('// ── COMMUNES (base directe) ──────────────────────────────────────────────────')
      lines.push(...direct)
    }
    if (fromEpci.length) {
      lines.push('')
      lines.push('// ── COMMUNES FPU (base via EPCI) ─────────────────────────────────────────────')
      lines.push(...fromEpci)
    }
    if (noBase.length) {
      lines.push('')
      lines.push('// ── SANS BASE CONNUE ─────────────────────────────────────────────────────────')
      lines.push(...noBase)
    }
    if (notFound.length) {
      lines.push('')
      lines.push(`// ── INTROUVABLES (${notFound.length}) ───────────────────────────────────────`)
      lines.push(`// ${notFound.join(', ')}`)
    }

    const withBase = [...direct, ...fromEpci].filter(l => l.trim().startsWith("'")).length
    lines.push('')
    lines.push(`// RÉSUMÉ: ${withBase} avec base, ${noBase.length} sans base, ${notFound.length} introuvables`)
    lines.push('')
    lines.push('// LOG:')
    for (const l of log) lines.push(`// ${l}`)

    return lines.join('\n')
  }

  return (
    <div style={{ fontFamily: 'monospace', background: '#1e1e1e', color: '#d4d4d4', minHeight: '100vh', padding: '20px' }}>
      <h1 style={{ color: '#4fc3f7' }}>DGFiP — CFE Base Minimale 2025</h1>
      <p style={{ color: '#81c784' }}>
        Communes + EPCIs FPU (Lyon, Toulouse, Nantes, Lille, Strasbourg, Nice, Marseille, Bordeaux…) — {ALL_CODES.length} communes
      </p>
      <p style={{ color: '#90caf9', fontSize: 13 }}>
        Ou appelle directement&nbsp;
        <code style={{ background: '#333', padding: '2px 6px', borderRadius: 3 }}>
          /api/cfe-taux/refresh-base
        </code>
        &nbsp;(serveur-side, même résultat)
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

// ─── COLLER DANS LA CONSOLE DU NAVIGATEUR ────────────────────────────────────
// 1. Ouvre n'importe quelle page en HTTPS (ex: https://www.google.com)
// 2. F12 → Console → colle ce script → Entrée
// ─────────────────────────────────────────────────────────────────────────────

(async () => {
const ALL_CODES = ['01053','02691','03185','05061','06004','06027','06029','06030','06069','06088','08105','10387','11069','11262','13001','13004','13005','13014','13047','13055','13056','13081','13103','13117','13201','13202','13203','13204','13205','13206','13207','13208','13209','13210','13211','13212','13213','13214','13215','13216','14118','16015','17300','18033','19031','21231','22278','25056','26198','26362','27229','28085','29019','29232','2A004','2B033','30007','30189','31555','31561','33063','33281','33318','33522','33550','34032','34172','34301','35238','35288','36044','37195','37261','38185','38364','38421','41018','42218','44109','44143','44162','44184','45234','47001','49007','49080','49307','50129','51108','51454','53130','54395','56121','56260','57463','57672','59009','59139','59178','59196','59350','59378','59512','59599','59606','59640','60057','60159','62041','62119','62160','63113','63124','64024','64102','64445','65440','66136','67482','68066','68224','68297','69029','69034','69040','69044','69051','69063','69068','69081','69089','69091','69100','69116','69123','69142','69143','69149','69152','69163','69168','69194','69199','69202','69204','69233','69244','69250','69256','69259','69266','69271','69275','69276','69278','69279','69282','69284','69286','69290','69381','69382','69383','69384','69385','69386','69387','69388','69389','71076','72181','73065','74010','75056','75101','75102','75103','75104','75105','75106','75107','75108','75109','75110','75111','75112','75113','75114','75115','75116','75117','75118','75119','75120','76275','76351','76540','77083','77284','77288','78361','78517','78551','78586','78646','79191','80021','81004','81065','82121','83023','83050','83061','83069','83137','84007','84054','85109','85191','86194','87085','90010','91174','91228','91377','92002','92004','92012','92023','92024','92025','92026','92036','92040','92044','92048','92049','92050','92051','92062','92063','92073','93005','93006','93007','93008','93010','93013','93027','93029','93031','93032','93047','93048','93049','93051','93057','93063','93064','93066','93071','94002','94019','94022','94028','94033','94038','94043','94054','94067','94076','94080','94081','95018','95127','95268','95572','95585','97100','97209','97213','97416','97422','97701'];

const COMMUNE_TO_EPCI = {'69029':'200046977','69034':'200046977','69040':'200046977','69044':'200046977','69051':'200046977','69063':'200046977','69068':'200046977','69081':'200046977','69089':'200046977','69091':'200046977','69100':'200046977','69116':'200046977','69123':'200046977','69142':'200046977','69143':'200046977','69149':'200046977','69152':'200046977','69163':'200046977','69168':'200046977','69194':'200046977','69199':'200046977','69202':'200046977','69204':'200046977','69233':'200046977','69244':'200046977','69250':'200046977','69256':'200046977','69259':'200046977','69266':'200046977','69271':'200046977','69275':'200046977','69276':'200046977','69278':'200046977','69279':'200046977','69282':'200046977','69284':'200046977','69286':'200046977','69290':'200046977','69381':'200046977','69382':'200046977','69383':'200046977','69384':'200046977','69385':'200046977','69386':'200046977','69387':'200046977','69388':'200046977','69389':'200046977','31555':'243100518','31561':'243100518','44109':'244400404','44143':'244400404','44162':'244400404','44184':'244400404','59009':'245900410','59139':'245900410','59178':'245900410','59196':'245900410','59350':'245900410','59378':'245900410','59512':'245900410','59599':'245900410','59606':'245900410','59640':'245900410','67482':'246700488','06004':'200030195','06027':'200030195','06029':'200030195','06030':'200030195','06069':'200030195','06088':'200030195','13001':'200054807','13004':'200054807','13005':'200054807','13014':'200054807','13047':'200054807','13055':'200054807','13056':'200054807','13081':'200054807','13103':'200054807','13117':'200054807','13201':'200054807','13202':'200054807','13203':'200054807','13204':'200054807','13205':'200054807','13206':'200054807','13207':'200054807','13208':'200054807','13209':'200054807','13210':'200054807','13211':'200054807','13212':'200054807','13213':'200054807','13214':'200054807','13215':'200054807','13216':'200054807','34032':'243400017','34172':'243400017','34301':'243400017','35238':'243500139','35288':'243500139','38185':'200040715','38364':'200040715','38421':'200040715','63113':'246300701','63124':'246300701','57463':'200052013','57672':'200052013','54395':'200017703','33063':'243300316','33281':'243300316','33318':'243300316','33522':'243300316','33550':'243300316'};

const EPCI_SIRENS = [...new Set(Object.values(COMMUNE_TO_EPCI))];
const BASE = 'https://data.economie.gouv.fr/api/explore/v2.1/catalog/datasets';
const DS_COM = 'deliberations-de-fiscalite-directe-locale-des-communes-2025-hors-taux';
const SEL_COM = 'depcom,libcom,bazmincfe1mt,bazmincfe2mt,bazmincfe3mt,bazmincfe4mt,bazmincfe5mt,bazmincfe6mt';
const TF = ['bazmincfe1mt','bazmincfe2mt','bazmincfe3mt','bazmincfe4mt','bazmincfe5mt','bazmincfe6mt'];
const EPCI_CANDS = ['deliberations-de-fiscalite-directe-locale-des-groupements-2025-hors-taux','deliberations-de-fiscalite-directe-locale-des-epci-2025-hors-taux','deliberations-de-fiscalite-directe-locale-des-groupements-de-communes-2025-hors-taux','deliberations-de-fiscalite-directe-locale-des-groupements-a-fiscalite-propre-2025-hors-taux','deliberations-de-fiscalite-directe-locale-des-epci-a-fiscalite-propre-2025-hors-taux'];

const sleep = ms => new Promise(r => setTimeout(r, ms));
const get = async url => { const r = await fetch(url); if(!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); };
const tr = r => TF.map(f => r[f]!==null&&r[f]!==undefined ? Number(r[f]) : null);

console.log('🚀 Démarrage — dataset communes...');

// COMMUNES
const comRecs = [];
const batches = [];
for(let i=0;i<ALL_CODES.length;i+=50) batches.push(ALL_CODES.slice(i,i+50));
for(let b=0;b<batches.length;b++){
  const inC = batches[b].map(c=>`"${c}"`).join(',');
  const p = new URLSearchParams({where:`depcom IN (${inC})`,select:SEL_COM,limit:'100',offset:'0'});
  const d = await get(`${BASE}/${DS_COM}/records?${p}`);
  comRecs.push(...(d.results||[]));
  console.log(`  communes batch ${b+1}/${batches.length}: ${comRecs.length} chargées`);
  if(b<batches.length-1) await sleep(200);
}
console.log(`✅ ${comRecs.length} communes`);

// EPCI probe
let epciDS=null, sirenF=null, nameF=null;
for(const cand of EPCI_CANDS){
  try{
    const probe = await get(`${BASE}/${cand}/records?limit=2`);
    if(probe.results?.length>0){
      epciDS=cand;
      const keys=Object.keys(probe.results[0]);
      for(const k of ['siren','sirenepci','siren_epci','depgrp','codgeo','codepci']) if(keys.includes(k)){sirenF=k;break;}
      for(const k of ['libepci','libgroupement','nom','libelle','libcom']) if(keys.includes(k)){nameF=k;break;}
      console.log(`✅ Dataset EPCI: ${cand}`);
      console.log(`   Champs: ${keys.join(', ')}`);
      console.log(`   1er enregistrement:`, probe.results[0]);
      break;
    }
  }catch(e){ console.log(`   ❌ ${cand.slice(0,50)}: ${e.message}`); }
  await sleep(150);
}

// EPCI data
const epciData = new Map();
if(epciDS && sirenF){
  const sBatches=[];
  for(let i=0;i<EPCI_SIRENS.length;i+=20) sBatches.push(EPCI_SIRENS.slice(i,i+20));
  for(let b=0;b<sBatches.length;b++){
    const inC=sBatches[b].map(s=>`"${s}"`).join(',');
    const sel=[sirenF,nameF,...TF].filter(Boolean).join(',');
    const p=new URLSearchParams({where:`${sirenF} IN (${inC})`,select:sel,limit:'50',offset:'0'});
    try{
      const d=await get(`${BASE}/${epciDS}/records?${p}`);
      for(const r of (d.results||[])){const s=String(r[sirenF]||'');if(s)epciData.set(s,r);}
      console.log(`  EPCI batch ${b+1}/${sBatches.length}: ${(d.results||[]).length} trouvés`);
    }catch(e){console.log(`  ❌ EPCI batch ${b+1}: ${e.message}`);}
    if(b<sBatches.length-1) await sleep(200);
  }
  console.log(`✅ ${epciData.size}/${EPCI_SIRENS.length} EPCIs`);
}

// Build TypeScript
const SRC_C="'DGFiP délibérations communes 2025'", SRC_E="'DGFiP délibérations EPCI 2025'";
const byCode=new Map(comRecs.map(r=>[r.depcom,r]));
const direct=[],fromEpci=[],noBase=[],notFound=[];

for(const code of [...ALL_CODES].sort()){
  const r=byCode.get(code);
  if(!r){notFound.push(code);continue;}
  const nom=String(r.libcom||'');
  const tranches=tr(r);
  const hasAny=tranches.some(t=>t!==null);
  if(!hasAny){
    const siren=COMMUNE_TO_EPCI[code];
    if(siren&&epciData.has(siren)){
      const er=epciData.get(siren);
      const et=tr(er);
      if(et.some(t=>t!==null)){
        const nn=et.filter(t=>t!==null);
        const same=nn.every(v=>v===nn[0]);
        const en=nameF?String(er[nameF]||siren):siren;
        fromEpci.push(`  // ${nom} (FPU – ${en})`);
        if(same) fromEpci.push(`  '${code}': { base: ${nn[0]}, source: ${SRC_E} },`);
        else{ const t1=et[0]??nn[0]; fromEpci.push(`  '${code}': { base: ${t1}, source: ${SRC_E}, tranches: [${et.map(t=>t??'null').join(', ')}] },`); }
      } else noBase.push(`  // ${code} ${nom} — EPCI ${siren} base nulle`);
    } else noBase.push(`  // ${code} ${nom} — ${siren?`FPU EPCI ${siren} absent`:'plancher légal'}`);
    continue;
  }
  const nn=tranches.filter(t=>t!==null);
  const same=nn.every(v=>v===nn[0]);
  direct.push(`  // ${nom}`);
  if(same) direct.push(`  '${code}': { base: ${nn[0]}, source: ${SRC_C} },`);
  else{ const t1=tranches[0]??nn[0]; direct.push(`  '${code}': { base: ${t1}, source: ${SRC_C}, tranches: [${tranches.map(t=>t??'null').join(', ')}] },`); }
}

const lines=[
  `// AUTO-GÉNÉRÉ — ${new Date().toISOString().slice(0,10)}`,
  `// Dataset communes: ${DS_COM}`,
  ...(epciDS?[`// Dataset EPCI: ${epciDS}`]:[]),
  '',
];
if(direct.length){lines.push('// ── COMMUNES (base directe) ──────────────────────────────────────');lines.push(...direct);}
if(fromEpci.length){lines.push('');lines.push('// ── COMMUNES FPU (base via EPCI) ───────────────────────────────');lines.push(...fromEpci);}
if(noBase.length){lines.push('');lines.push('// ── SANS BASE ──────────────────────────────────────────────────');lines.push(...noBase);}
if(notFound.length){lines.push('');lines.push(`// ── INTROUVABLES (${notFound.length}) ─────────────────────────`);lines.push(`// ${notFound.join(', ')}`);}
const nb=[...direct,...fromEpci].filter(l=>l.trim().startsWith("'")).length;
lines.push('');lines.push(`// RÉSUMÉ: ${nb} avec base, ${noBase.length} sans, ${notFound.length} introuvables`);

const ts=lines.join('\n');
console.log('\n📋 RÉSULTAT COPIÉ DANS LE PRESSE-PAPIER !\n');
console.log(ts.slice(0,500)+'...');
try{ await navigator.clipboard.writeText(ts); console.log('✅ Presse-papier OK'); }
catch(e){ console.log('⚠️ Clipboard échoué — copie depuis la variable window.__TS'); }
window.__TS=ts;
})();

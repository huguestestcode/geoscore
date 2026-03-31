// ── Taux CFE hardcodés — données vérifiées 2025 ──────────────────────────────
// Sources : lamicrobyflo.fr/taux-cfe-par-ville/ (taux vérifiés)
//           + membres EPCI à FPU (loi fiscalité professionnelle unique — taux identique dans la métropole)
//           + arrondissements de Paris, Lyon, Marseille (même taux que la commune principale légalement)
// UNIQUEMENT des données 100% fiables — aucun taux estimé ou inventé
// Le taux indiqué est le taux global CFE HZ (hors zone) = commune + EPCI + syndicats
export const ANNEE_TAUX = 2025

// ── Base minimale CFE hardcodée par commune — art. 1647 D CGI ─────────────────
// Sources vérifiées : délibérations communales, lamicrobyflo.fr, kandbaz.com, sofradom.fr
// base = montant en € voté par la commune (entre 243 € min légal et plafond par tranche)
// tranches = [t0,t1,t2,t3,t4,t5] = base par tranche CA : [≤10k, 10k-32.6k, 32.6k-100k, 100k-250k, 250k-500k, >500k]
// caMax = CA maximum (€) pour lequel la base unique s'applique (si pas de tranches)
export type BaseMinEntry = {
  base: number
  source: string
  caMax?: number          // CA max pour base unique (ex : Paris 100k, Marseille 32.6k)
  tranches?: (number | null)[]  // base par tranche [t0..t5], null = inconnue
}
export const BASE_MINIMALE_CONNUES: Record<string, BaseMinEntry> = {
  // Paris — source officielle DGFiP 2025 : t1(≤10k)=plancher légal, t2-t3=416€, t4-t6=2432€
  '75056': { base: 416, source: 'DGFiP délibérations 2025', tranches: [null, 416, 416, 2432, 2432, 2432] },
  '75101': { base: 416, source: 'DGFiP délibérations 2025', tranches: [null, 416, 416, 2432, 2432, 2432] },
  '75102': { base: 416, source: 'DGFiP délibérations 2025', tranches: [null, 416, 416, 2432, 2432, 2432] },
  '75103': { base: 416, source: 'DGFiP délibérations 2025', tranches: [null, 416, 416, 2432, 2432, 2432] },
  '75104': { base: 416, source: 'DGFiP délibérations 2025', tranches: [null, 416, 416, 2432, 2432, 2432] },
  '75105': { base: 416, source: 'DGFiP délibérations 2025', tranches: [null, 416, 416, 2432, 2432, 2432] },
  '75106': { base: 416, source: 'DGFiP délibérations 2025', tranches: [null, 416, 416, 2432, 2432, 2432] },
  '75107': { base: 416, source: 'DGFiP délibérations 2025', tranches: [null, 416, 416, 2432, 2432, 2432] },
  '75108': { base: 416, source: 'DGFiP délibérations 2025', tranches: [null, 416, 416, 2432, 2432, 2432] },
  '75109': { base: 416, source: 'DGFiP délibérations 2025', tranches: [null, 416, 416, 2432, 2432, 2432] },
  '75110': { base: 416, source: 'DGFiP délibérations 2025', tranches: [null, 416, 416, 2432, 2432, 2432] },
  '75111': { base: 416, source: 'DGFiP délibérations 2025', tranches: [null, 416, 416, 2432, 2432, 2432] },
  '75112': { base: 416, source: 'DGFiP délibérations 2025', tranches: [null, 416, 416, 2432, 2432, 2432] },
  '75113': { base: 416, source: 'DGFiP délibérations 2025', tranches: [null, 416, 416, 2432, 2432, 2432] },
  '75114': { base: 416, source: 'DGFiP délibérations 2025', tranches: [null, 416, 416, 2432, 2432, 2432] },
  '75115': { base: 416, source: 'DGFiP délibérations 2025', tranches: [null, 416, 416, 2432, 2432, 2432] },
  '75116': { base: 416, source: 'DGFiP délibérations 2025', tranches: [null, 416, 416, 2432, 2432, 2432] },
  '75117': { base: 416, source: 'DGFiP délibérations 2025', tranches: [null, 416, 416, 2432, 2432, 2432] },
  '75118': { base: 416, source: 'DGFiP délibérations 2025', tranches: [null, 416, 416, 2432, 2432, 2432] },
  '75119': { base: 416, source: 'DGFiP délibérations 2025', tranches: [null, 416, 416, 2432, 2432, 2432] },
  '75120': { base: 416, source: 'DGFiP délibérations 2025', tranches: [null, 416, 416, 2432, 2432, 2432] },
  // Aix-Marseille-Provence Métropole (FPU) — source officielle DGFiP EPCI 2025
  // sirepci=200054807 — tranches : 585/1169/2068/3216/4364/5512 €
  '13001': { base: 585, source: 'DGFiP délibérations EPCI 2025 (Métropole AMP)', tranches: [585, 1169, 2068, 3216, 4364, 5512] }, // Aix-en-Provence
  '13004': { base: 585, source: 'DGFiP délibérations EPCI 2025 (Métropole AMP)', tranches: [585, 1169, 2068, 3216, 4364, 5512] }, // Allauch
  '13005': { base: 585, source: 'DGFiP délibérations EPCI 2025 (Métropole AMP)', tranches: [585, 1169, 2068, 3216, 4364, 5512] }, // Aubagne
  '13014': { base: 585, source: 'DGFiP délibérations EPCI 2025 (Métropole AMP)', tranches: [585, 1169, 2068, 3216, 4364, 5512] }, // Berre-l'Étang
  '13047': { base: 585, source: 'DGFiP délibérations EPCI 2025 (Métropole AMP)', tranches: [585, 1169, 2068, 3216, 4364, 5512] }, // Istres
  '13055': { base: 585, source: 'DGFiP délibérations EPCI 2025 (Métropole AMP)', tranches: [585, 1169, 2068, 3216, 4364, 5512] }, // Marseille
  '13056': { base: 585, source: 'DGFiP délibérations EPCI 2025 (Métropole AMP)', tranches: [585, 1169, 2068, 3216, 4364, 5512] }, // Martigues
  '13081': { base: 585, source: 'DGFiP délibérations EPCI 2025 (Métropole AMP)', tranches: [585, 1169, 2068, 3216, 4364, 5512] }, // Plan-de-Cuques
  '13103': { base: 585, source: 'DGFiP délibérations EPCI 2025 (Métropole AMP)', tranches: [585, 1169, 2068, 3216, 4364, 5512] }, // Salon-de-Provence
  '13117': { base: 585, source: 'DGFiP délibérations EPCI 2025 (Métropole AMP)', tranches: [585, 1169, 2068, 3216, 4364, 5512] }, // Vitrolles
  '13201': { base: 585, source: 'DGFiP délibérations EPCI 2025 (Métropole AMP)', tranches: [585, 1169, 2068, 3216, 4364, 5512] }, // Marseille 1er
  '13202': { base: 585, source: 'DGFiP délibérations EPCI 2025 (Métropole AMP)', tranches: [585, 1169, 2068, 3216, 4364, 5512] },
  '13203': { base: 585, source: 'DGFiP délibérations EPCI 2025 (Métropole AMP)', tranches: [585, 1169, 2068, 3216, 4364, 5512] },
  '13204': { base: 585, source: 'DGFiP délibérations EPCI 2025 (Métropole AMP)', tranches: [585, 1169, 2068, 3216, 4364, 5512] },
  '13205': { base: 585, source: 'DGFiP délibérations EPCI 2025 (Métropole AMP)', tranches: [585, 1169, 2068, 3216, 4364, 5512] },
  '13206': { base: 585, source: 'DGFiP délibérations EPCI 2025 (Métropole AMP)', tranches: [585, 1169, 2068, 3216, 4364, 5512] },
  '13207': { base: 585, source: 'DGFiP délibérations EPCI 2025 (Métropole AMP)', tranches: [585, 1169, 2068, 3216, 4364, 5512] },
  '13208': { base: 585, source: 'DGFiP délibérations EPCI 2025 (Métropole AMP)', tranches: [585, 1169, 2068, 3216, 4364, 5512] },
  '13209': { base: 585, source: 'DGFiP délibérations EPCI 2025 (Métropole AMP)', tranches: [585, 1169, 2068, 3216, 4364, 5512] },
  '13210': { base: 585, source: 'DGFiP délibérations EPCI 2025 (Métropole AMP)', tranches: [585, 1169, 2068, 3216, 4364, 5512] },
  '13211': { base: 585, source: 'DGFiP délibérations EPCI 2025 (Métropole AMP)', tranches: [585, 1169, 2068, 3216, 4364, 5512] },
  '13212': { base: 585, source: 'DGFiP délibérations EPCI 2025 (Métropole AMP)', tranches: [585, 1169, 2068, 3216, 4364, 5512] },
  '13213': { base: 585, source: 'DGFiP délibérations EPCI 2025 (Métropole AMP)', tranches: [585, 1169, 2068, 3216, 4364, 5512] },
  '13214': { base: 585, source: 'DGFiP délibérations EPCI 2025 (Métropole AMP)', tranches: [585, 1169, 2068, 3216, 4364, 5512] },
  '13215': { base: 585, source: 'DGFiP délibérations EPCI 2025 (Métropole AMP)', tranches: [585, 1169, 2068, 3216, 4364, 5512] },
  '13216': { base: 585, source: 'DGFiP délibérations EPCI 2025 (Métropole AMP)', tranches: [585, 1169, 2068, 3216, 4364, 5512] }, // Marseille 16e
  // Bordeaux Métropole (FPU) — source officielle DGFiP EPCI 2025
  // sirepci=243300316 — tranches : 589/1179/2353/3303/5897/7669 €
  '33063': { base: 589, source: 'DGFiP délibérations EPCI 2025 (Bordeaux Métropole)', tranches: [589, 1179, 2353, 3303, 5897, 7669] }, // Bordeaux
  '33281': { base: 589, source: 'DGFiP délibérations EPCI 2025 (Bordeaux Métropole)', tranches: [589, 1179, 2353, 3303, 5897, 7669] }, // Mérignac
  '33318': { base: 589, source: 'DGFiP délibérations EPCI 2025 (Bordeaux Métropole)', tranches: [589, 1179, 2353, 3303, 5897, 7669] }, // Pessac
  '33522': { base: 589, source: 'DGFiP délibérations EPCI 2025 (Bordeaux Métropole)', tranches: [589, 1179, 2353, 3303, 5897, 7669] }, // Talence
  '33550': { base: 589, source: 'DGFiP délibérations EPCI 2025 (Bordeaux Métropole)', tranches: [589, 1179, 2353, 3303, 5897, 7669] }, // Villenave-d'Ornon
  // ── Nouvelles communes — source officielle DGFiP délibérations 2025 ───────────
  // t1=CA≤10k | t2=10k-32.6k | t3=32.6k-100k | t4=100k-250k | t5=250k-500k | t6=>500k
  // Loire-Authion (commune nouvelle Maine-et-Loire)
  '49307': { base: 585, source: 'DGFiP délibérations 2025', tranches: [585, 1169, 2453, 2453, 2453, 2453] },
  // Le Mans
  '72181': { base: 577, source: 'DGFiP délibérations 2025', tranches: [577, 1153, 1814, 4036, 5764, 7496] },
  // Hauts-de-Seine (92)
  '92004': { base: 350, source: 'DGFiP délibérations 2025', tranches: [350, 1168, 2454, 4092, 5845, 7599] },   // Asnières-sur-Seine
  '92024': { base: 584, source: 'DGFiP délibérations 2025', tranches: [584, 1168, 2454, 4092, 5845, 7599] },   // Clichy
  '92036': { base: 1794, source: 'DGFiP délibérations 2025', tranches: [null, 1794, 1794, 1794, 1794, 1794] }, // Gennevilliers
  // Seine-Saint-Denis (93)
  '93005': { base: 589, source: 'DGFiP délibérations 2025', tranches: [589, 1179, 2360, 3539, 4717, 5897] },   // Aulnay-sous-Bois
  '93007': { base: 584, source: 'DGFiP délibérations 2025', tranches: [584, 1168, 1753, 1753, 1753, 1753] },   // Le Blanc-Mesnil
  '93051': { base: 2474, source: 'DGFiP délibérations 2025', tranches: [null, 2474, 2474, 2474, 2474, 2474] }, // Noisy-le-Grand
  '93057': { base: 589, source: 'DGFiP délibérations 2025', tranches: [589, 1179, 1887, 1887, 5309, 7669] },   // Les Pavillons-sous-Bois
  // Val-de-Marne (94)
  '94033': { base: 584, source: 'DGFiP délibérations 2025', tranches: [584, 1168, 1763, 4092, 5845, 7599] },   // Fontenay-sous-Bois
  '94067': { base: 584, source: 'DGFiP délibérations 2025', tranches: [584, 1168, 2454, 4092, 5845, 7599] },   // Saint-Mandé
  '94080': { base: 589, source: 'DGFiP délibérations 2025', tranches: [589, 1179, 2477, 4129, 5897, 7669] },   // Vincennes

  // ── EPCIs FPU — source officielle DGFiP 2025 ──────────────────────────────────
  // Dataset : deliberations-de-fiscalite-directe-locale-des-groupements-a-fiscalite-propre-2025-hors-taux
  // t1=≤10k | t2=10k-32.6k | t3=32.6k-100k | t4=100k-250k | t5=250k-500k | t6=>500k

  // Métropole de Lyon (sirepci=200046977) — 589/1179/2123/2714/4011/5189 €
  '69029': { base: 589, source: 'DGFiP délibérations EPCI 2025 (Métropole de Lyon)', tranches: [589, 1179, 2123, 2714, 4011, 5189] }, // Caluire-et-Cuire
  '69034': { base: 589, source: 'DGFiP délibérations EPCI 2025 (Métropole de Lyon)', tranches: [589, 1179, 2123, 2714, 4011, 5189] }, // Bron
  '69040': { base: 589, source: 'DGFiP délibérations EPCI 2025 (Métropole de Lyon)', tranches: [589, 1179, 2123, 2714, 4011, 5189] }, // Champagne-au-Mont-d'Or
  '69044': { base: 589, source: 'DGFiP délibérations EPCI 2025 (Métropole de Lyon)', tranches: [589, 1179, 2123, 2714, 4011, 5189] }, // Charbonnières-les-Bains
  '69051': { base: 589, source: 'DGFiP délibérations EPCI 2025 (Métropole de Lyon)', tranches: [589, 1179, 2123, 2714, 4011, 5189] }, // Collonges-au-Mont-d'Or
  '69063': { base: 589, source: 'DGFiP délibérations EPCI 2025 (Métropole de Lyon)', tranches: [589, 1179, 2123, 2714, 4011, 5189] }, // Limonest
  '69068': { base: 589, source: 'DGFiP délibérations EPCI 2025 (Métropole de Lyon)', tranches: [589, 1179, 2123, 2714, 4011, 5189] }, // Feyzin
  '69081': { base: 589, source: 'DGFiP délibérations EPCI 2025 (Métropole de Lyon)', tranches: [589, 1179, 2123, 2714, 4011, 5189] }, // Mions
  '69089': { base: 589, source: 'DGFiP délibérations EPCI 2025 (Métropole de Lyon)', tranches: [589, 1179, 2123, 2714, 4011, 5189] }, // Neuville-sur-Saône
  '69091': { base: 589, source: 'DGFiP délibérations EPCI 2025 (Métropole de Lyon)', tranches: [589, 1179, 2123, 2714, 4011, 5189] }, // Francheville
  '69100': { base: 589, source: 'DGFiP délibérations EPCI 2025 (Métropole de Lyon)', tranches: [589, 1179, 2123, 2714, 4011, 5189] }, // Fontaines-sur-Saône
  '69116': { base: 589, source: 'DGFiP délibérations EPCI 2025 (Métropole de Lyon)', tranches: [589, 1179, 2123, 2714, 4011, 5189] }, // Craponne
  '69123': { base: 589, source: 'DGFiP délibérations EPCI 2025 (Métropole de Lyon)', tranches: [589, 1179, 2123, 2714, 4011, 5189] }, // Lyon
  '69142': { base: 589, source: 'DGFiP délibérations EPCI 2025 (Métropole de Lyon)', tranches: [589, 1179, 2123, 2714, 4011, 5189] }, // Dardilly
  '69143': { base: 589, source: 'DGFiP délibérations EPCI 2025 (Métropole de Lyon)', tranches: [589, 1179, 2123, 2714, 4011, 5189] }, // Genay
  '69149': { base: 589, source: 'DGFiP délibérations EPCI 2025 (Métropole de Lyon)', tranches: [589, 1179, 2123, 2714, 4011, 5189] }, // Décines-Charpieu
  '69152': { base: 589, source: 'DGFiP délibérations EPCI 2025 (Métropole de Lyon)', tranches: [589, 1179, 2123, 2714, 4011, 5189] }, // Écully
  '69163': { base: 589, source: 'DGFiP délibérations EPCI 2025 (Métropole de Lyon)', tranches: [589, 1179, 2123, 2714, 4011, 5189] }, // Grigny
  '69168': { base: 589, source: 'DGFiP délibérations EPCI 2025 (Métropole de Lyon)', tranches: [589, 1179, 2123, 2714, 4011, 5189] }, // Givors
  '69194': { base: 589, source: 'DGFiP délibérations EPCI 2025 (Métropole de Lyon)', tranches: [589, 1179, 2123, 2714, 4011, 5189] }, // Sathonay-Camp
  '69199': { base: 589, source: 'DGFiP délibérations EPCI 2025 (Métropole de Lyon)', tranches: [589, 1179, 2123, 2714, 4011, 5189] }, // Meyzieu
  '69202': { base: 589, source: 'DGFiP délibérations EPCI 2025 (Métropole de Lyon)', tranches: [589, 1179, 2123, 2714, 4011, 5189] }, // Oullins
  '69204': { base: 589, source: 'DGFiP délibérations EPCI 2025 (Métropole de Lyon)', tranches: [589, 1179, 2123, 2714, 4011, 5189] }, // Pierre-Bénite
  '69233': { base: 589, source: 'DGFiP délibérations EPCI 2025 (Métropole de Lyon)', tranches: [589, 1179, 2123, 2714, 4011, 5189] }, // Rillieux-la-Pape
  '69244': { base: 589, source: 'DGFiP délibérations EPCI 2025 (Métropole de Lyon)', tranches: [589, 1179, 2123, 2714, 4011, 5189] }, // Sainte-Foy-lès-Lyon
  '69250': { base: 589, source: 'DGFiP délibérations EPCI 2025 (Métropole de Lyon)', tranches: [589, 1179, 2123, 2714, 4011, 5189] }, // Saint-Priest
  '69256': { base: 589, source: 'DGFiP délibérations EPCI 2025 (Métropole de Lyon)', tranches: [589, 1179, 2123, 2714, 4011, 5189] }, // Tassin-la-Demi-Lune
  '69259': { base: 589, source: 'DGFiP délibérations EPCI 2025 (Métropole de Lyon)', tranches: [589, 1179, 2123, 2714, 4011, 5189] }, // Saint-Genis-Laval
  '69266': { base: 589, source: 'DGFiP délibérations EPCI 2025 (Métropole de Lyon)', tranches: [589, 1179, 2123, 2714, 4011, 5189] }, // Villeurbanne
  '69271': { base: 589, source: 'DGFiP délibérations EPCI 2025 (Métropole de Lyon)', tranches: [589, 1179, 2123, 2714, 4011, 5189] }, // Saint-Fons
  '69275': { base: 589, source: 'DGFiP délibérations EPCI 2025 (Métropole de Lyon)', tranches: [589, 1179, 2123, 2714, 4011, 5189] }, // Saint-Genis-les-Ollières
  '69276': { base: 589, source: 'DGFiP délibérations EPCI 2025 (Métropole de Lyon)', tranches: [589, 1179, 2123, 2714, 4011, 5189] }, // Irigny
  '69278': { base: 589, source: 'DGFiP délibérations EPCI 2025 (Métropole de Lyon)', tranches: [589, 1179, 2123, 2714, 4011, 5189] }, // Charbonnières-les-Bains
  '69279': { base: 589, source: 'DGFiP délibérations EPCI 2025 (Métropole de Lyon)', tranches: [589, 1179, 2123, 2714, 4011, 5189] }, // Marcy-l'Étoile
  '69282': { base: 589, source: 'DGFiP délibérations EPCI 2025 (Métropole de Lyon)', tranches: [589, 1179, 2123, 2714, 4011, 5189] }, // Solaize
  '69284': { base: 589, source: 'DGFiP délibérations EPCI 2025 (Métropole de Lyon)', tranches: [589, 1179, 2123, 2714, 4011, 5189] }, // Corbas
  '69286': { base: 589, source: 'DGFiP délibérations EPCI 2025 (Métropole de Lyon)', tranches: [589, 1179, 2123, 2714, 4011, 5189] }, // Vénissieux
  '69290': { base: 589, source: 'DGFiP délibérations EPCI 2025 (Métropole de Lyon)', tranches: [589, 1179, 2123, 2714, 4011, 5189] }, // Vaulx-en-Velin
  '69381': { base: 589, source: 'DGFiP délibérations EPCI 2025 (Métropole de Lyon)', tranches: [589, 1179, 2123, 2714, 4011, 5189] }, // Lyon 1er
  '69382': { base: 589, source: 'DGFiP délibérations EPCI 2025 (Métropole de Lyon)', tranches: [589, 1179, 2123, 2714, 4011, 5189] },
  '69383': { base: 589, source: 'DGFiP délibérations EPCI 2025 (Métropole de Lyon)', tranches: [589, 1179, 2123, 2714, 4011, 5189] },
  '69384': { base: 589, source: 'DGFiP délibérations EPCI 2025 (Métropole de Lyon)', tranches: [589, 1179, 2123, 2714, 4011, 5189] },
  '69385': { base: 589, source: 'DGFiP délibérations EPCI 2025 (Métropole de Lyon)', tranches: [589, 1179, 2123, 2714, 4011, 5189] },
  '69386': { base: 589, source: 'DGFiP délibérations EPCI 2025 (Métropole de Lyon)', tranches: [589, 1179, 2123, 2714, 4011, 5189] },
  '69387': { base: 589, source: 'DGFiP délibérations EPCI 2025 (Métropole de Lyon)', tranches: [589, 1179, 2123, 2714, 4011, 5189] },
  '69388': { base: 589, source: 'DGFiP délibérations EPCI 2025 (Métropole de Lyon)', tranches: [589, 1179, 2123, 2714, 4011, 5189] },
  '69389': { base: 589, source: 'DGFiP délibérations EPCI 2025 (Métropole de Lyon)', tranches: [589, 1179, 2123, 2714, 4011, 5189] }, // Lyon 9e

  // Toulouse Métropole (sirepci=243100518) — null/null/1906/3649/5528/7599 €
  '31555': { base: 1906, source: 'DGFiP délibérations EPCI 2025 (Toulouse Métropole)', tranches: [null, null, 1906, 3649, 5528, 7599] }, // Toulouse
  '31561': { base: 1906, source: 'DGFiP délibérations EPCI 2025 (Toulouse Métropole)', tranches: [null, null, 1906, 3649, 5528, 7599] }, // Tournefeuille

  // Nantes Métropole (sirepci=244400404) — 584/1168/1966/3273/4676/6081 €
  '44109': { base: 584, source: 'DGFiP délibérations EPCI 2025 (Nantes Métropole)', tranches: [584, 1168, 1966, 3273, 4676, 6081] }, // Nantes
  '44143': { base: 584, source: 'DGFiP délibérations EPCI 2025 (Nantes Métropole)', tranches: [584, 1168, 1966, 3273, 4676, 6081] }, // Rezé
  '44162': { base: 584, source: 'DGFiP délibérations EPCI 2025 (Nantes Métropole)', tranches: [584, 1168, 1966, 3273, 4676, 6081] }, // Saint-Herblain
  '44184': { base: 584, source: 'DGFiP délibérations EPCI 2025 (Nantes Métropole)', tranches: [584, 1168, 1966, 3273, 4676, 6081] }, // Saint-Nazaire

  // Eurométropole de Strasbourg (sirepci=246700488) — 584/1167/2444/2444/4732/4732 €
  '67482': { base: 584, source: 'DGFiP délibérations EPCI 2025 (Eurométropole Strasbourg)', tranches: [584, 1167, 2444, 2444, 4732, 4732] }, // Strasbourg

  // Métropole Nice Côte d'Azur (sirepci=200030195) — 575/1150/2417/4028/5754/7481 €
  '06004': { base: 575, source: 'DGFiP délibérations EPCI 2025 (Nice Côte d\'Azur)', tranches: [575, 1150, 2417, 4028, 5754, 7481] }, // Antibes
  '06027': { base: 575, source: 'DGFiP délibérations EPCI 2025 (Nice Côte d\'Azur)', tranches: [575, 1150, 2417, 4028, 5754, 7481] }, // Cagnes-sur-Mer
  '06029': { base: 575, source: 'DGFiP délibérations EPCI 2025 (Nice Côte d\'Azur)', tranches: [575, 1150, 2417, 4028, 5754, 7481] }, // Cannes
  '06030': { base: 575, source: 'DGFiP délibérations EPCI 2025 (Nice Côte d\'Azur)', tranches: [575, 1150, 2417, 4028, 5754, 7481] }, // Carros
  '06069': { base: 575, source: 'DGFiP délibérations EPCI 2025 (Nice Côte d\'Azur)', tranches: [575, 1150, 2417, 4028, 5754, 7481] }, // Nice
  '06088': { base: 575, source: 'DGFiP délibérations EPCI 2025 (Nice Côte d\'Azur)', tranches: [575, 1150, 2417, 4028, 5754, 7481] }, // Saint-Laurent-du-Var

  // Montpellier Méditerranée Métropole (sirepci=243400017) — 524/916/1266/2540/3492/5243 €
  '34032': { base: 524, source: 'DGFiP délibérations EPCI 2025 (Montpellier Méditerranée Métropole)', tranches: [524, 916, 1266, 2540, 3492, 5243] }, // Castelnau-le-Lez
  '34172': { base: 524, source: 'DGFiP délibérations EPCI 2025 (Montpellier Méditerranée Métropole)', tranches: [524, 916, 1266, 2540, 3492, 5243] }, // Montpellier
  '34301': { base: 524, source: 'DGFiP délibérations EPCI 2025 (Montpellier Méditerranée Métropole)', tranches: [524, 916, 1266, 2540, 3492, 5243] }, // Palavas-les-Flots

  // Rennes Métropole (sirepci=243500139) — 589/1179/2258/2258/2258/2258 €
  '35238': { base: 589, source: 'DGFiP délibérations EPCI 2025 (Rennes Métropole)', tranches: [589, 1179, 2258, 2258, 2258, 2258] }, // Rennes
  '35288': { base: 589, source: 'DGFiP délibérations EPCI 2025 (Rennes Métropole)', tranches: [589, 1179, 2258, 2258, 2258, 2258] }, // Saint-Malo

  // Grenoble-Alpes Métropole (sirepci=200040715) — 505/1010/1323/3329/4458/5796 €
  '38185': { base: 505, source: 'DGFiP délibérations EPCI 2025 (Grenoble-Alpes Métropole)', tranches: [505, 1010, 1323, 3329, 4458, 5796] }, // Grenoble
  '38364': { base: 505, source: 'DGFiP délibérations EPCI 2025 (Grenoble-Alpes Métropole)', tranches: [505, 1010, 1323, 3329, 4458, 5796] }, // Saint-Martin-d'Hères
  '38421': { base: 505, source: 'DGFiP délibérations EPCI 2025 (Grenoble-Alpes Métropole)', tranches: [505, 1010, 1323, 3329, 4458, 5796] }, // Échirolles

  // Clermont Auvergne Métropole (sirepci=246300701) — null/1179/1717/3248/4423/5752 €
  '63113': { base: 1179, source: 'DGFiP délibérations EPCI 2025 (Clermont Auvergne Métropole)', tranches: [null, 1179, 1717, 3248, 4423, 5752] }, // Clermont-Ferrand
  '63124': { base: 1179, source: 'DGFiP délibérations EPCI 2025 (Clermont Auvergne Métropole)', tranches: [null, 1179, 1717, 3248, 4423, 5752] }, // Cournon-d'Auvergne
}
export const TAUX_CONNUS: Record<string, { taux: number; nom: string }> = {
  // ══════════════════════════════════════════════════════════════════════════════
  // ── PARIS ET ARRONDISSEMENTS ─────────────────────────────────────────────────
  // ══════════════════════════════════════════════════════════════════════════════
  '75056': { taux: 16.52, nom: 'Paris' },
  '75101': { taux: 16.52, nom: 'Paris 1er' },
  '75102': { taux: 16.52, nom: 'Paris 2e' },
  '75103': { taux: 16.52, nom: 'Paris 3e' },
  '75104': { taux: 16.52, nom: 'Paris 4e' },
  '75105': { taux: 16.52, nom: 'Paris 5e' },
  '75106': { taux: 16.52, nom: 'Paris 6e' },
  '75107': { taux: 16.52, nom: 'Paris 7e' },
  '75108': { taux: 16.52, nom: 'Paris 8e' },
  '75109': { taux: 16.52, nom: 'Paris 9e' },
  '75110': { taux: 16.52, nom: 'Paris 10e' },
  '75111': { taux: 16.52, nom: 'Paris 11e' },
  '75112': { taux: 16.52, nom: 'Paris 12e' },
  '75113': { taux: 16.52, nom: 'Paris 13e' },
  '75114': { taux: 16.52, nom: 'Paris 14e' },
  '75115': { taux: 16.52, nom: 'Paris 15e' },
  '75116': { taux: 16.52, nom: 'Paris 16e' },
  '75117': { taux: 16.52, nom: 'Paris 17e' },
  '75118': { taux: 16.52, nom: 'Paris 18e' },
  '75119': { taux: 16.52, nom: 'Paris 19e' },
  '75120': { taux: 16.52, nom: 'Paris 20e' },

  // ══════════════════════════════════════════════════════════════════════════════
  // ── LYON MÉTROPOLE ET ARRONDISSEMENTS (30.43 % depuis budget voté mars 2025) ──
  // ══════════════════════════════════════════════════════════════════════════════
  '69123': { taux: 30.43, nom: 'Lyon' },
  '69381': { taux: 30.43, nom: 'Lyon 1er' },
  '69382': { taux: 30.43, nom: 'Lyon 2e' },
  '69383': { taux: 30.43, nom: 'Lyon 3e' },
  '69384': { taux: 30.43, nom: 'Lyon 4e' },
  '69385': { taux: 30.43, nom: 'Lyon 5e' },
  '69386': { taux: 30.43, nom: 'Lyon 6e' },
  '69387': { taux: 30.43, nom: 'Lyon 7e' },
  '69388': { taux: 30.43, nom: 'Lyon 8e' },
  '69389': { taux: 30.43, nom: 'Lyon 9e' },
  '69266': { taux: 30.43, nom: 'Villeurbanne' },
  '69034': { taux: 30.43, nom: 'Bron' },
  '69286': { taux: 30.43, nom: 'Vénissieux' },
  '69290': { taux: 30.43, nom: 'Vaulx-en-Velin' },
  '69149': { taux: 30.43, nom: 'Décines-Charpieu' },
  '69199': { taux: 30.43, nom: 'Meyzieu' },
  '69152': { taux: 30.43, nom: 'Écully' },
  '69168': { taux: 30.43, nom: 'Givors' },
  '69256': { taux: 30.43, nom: 'Tassin-la-Demi-Lune' },
  '69244': { taux: 30.43, nom: 'Sainte-Foy-lès-Lyon' },
  '69029': { taux: 30.43, nom: 'Caluire-et-Cuire' },
  '69202': { taux: 30.43, nom: 'Oullins' },
  '69204': { taux: 30.43, nom: 'Pierre-Bénite' },
  '69233': { taux: 30.43, nom: 'Rillieux-la-Pape' },
  '69250': { taux: 30.43, nom: 'Saint-Priest' },
  '69142': { taux: 30.43, nom: 'Dardilly' },
  '69091': { taux: 30.43, nom: 'Francheville' },
  '69040': { taux: 30.43, nom: 'Champagne-au-Mont-d\'Or' },
  '69116': { taux: 30.43, nom: 'Craponne' },
  '69259': { taux: 30.43, nom: 'Saint-Genis-Laval' },
  '69271': { taux: 30.43, nom: 'Saint-Fons' },
  '69275': { taux: 30.43, nom: 'Saint-Genis-les-Ollières' },
  '69284': { taux: 30.43, nom: 'Corbas' },
  '69068': { taux: 30.43, nom: 'Feyzin' },
  '69081': { taux: 30.43, nom: 'Mions' },
  '69282': { taux: 30.43, nom: 'Solaize' },
  '69276': { taux: 30.43, nom: 'Irigny' },
  '69278': { taux: 30.43, nom: 'Charbonnières-les-Bains' },
  '69279': { taux: 30.43, nom: 'Marcy-l\'Étoile' },
  '69063': { taux: 30.43, nom: 'Limonest' },
  '69051': { taux: 30.43, nom: 'Collonges-au-Mont-d\'Or' },
  '69163': { taux: 30.43, nom: 'Grigny' },
  '69143': { taux: 30.43, nom: 'Genay' },
  '69089': { taux: 30.43, nom: 'Neuville-sur-Saône' },
  '69100': { taux: 30.43, nom: 'Fontaines-sur-Saône' },
  '69194': { taux: 30.43, nom: 'Sathonay-Camp' },

  // ══════════════════════════════════════════════════════════════════════════════
  // ── MARSEILLE ET ARRONDISSEMENTS (32.87 %) ───────────────────────────────────
  // ══════════════════════════════════════════════════════════════════════════════
  '13055': { taux: 32.87, nom: 'Marseille' },
  '13201': { taux: 32.87, nom: 'Marseille 1er' },
  '13202': { taux: 32.87, nom: 'Marseille 2e' },
  '13203': { taux: 32.87, nom: 'Marseille 3e' },
  '13204': { taux: 32.87, nom: 'Marseille 4e' },
  '13205': { taux: 32.87, nom: 'Marseille 5e' },
  '13206': { taux: 32.87, nom: 'Marseille 6e' },
  '13207': { taux: 32.87, nom: 'Marseille 7e' },
  '13208': { taux: 32.87, nom: 'Marseille 8e' },
  '13209': { taux: 32.87, nom: 'Marseille 9e' },
  '13210': { taux: 32.87, nom: 'Marseille 10e' },
  '13211': { taux: 32.87, nom: 'Marseille 11e' },
  '13212': { taux: 32.87, nom: 'Marseille 12e' },
  '13213': { taux: 32.87, nom: 'Marseille 13e' },
  '13214': { taux: 32.87, nom: 'Marseille 14e' },
  '13215': { taux: 32.87, nom: 'Marseille 15e' },
  '13216': { taux: 32.87, nom: 'Marseille 16e' },

  // ══════════════════════════════════════════════════════════════════════════════
  // ── ÎLE-DE-FRANCE (hors Paris) ──────────────────────────────────────────────
  // ══════════════════════════════════════════════════════════════════════════════
  // -- Hauts-de-Seine (92) --
  '92012': { taux: 20.87, nom: 'Boulogne-Billancourt' },
  '92002': { taux: 26.99, nom: 'Antony' },
  '92004': { taux: 25.84, nom: 'Asnières-sur-Seine' },
  '92023': { taux: 26.99, nom: 'Clamart' },
  '92024': { taux: 25.84, nom: 'Clichy' },
  '92025': { taux: 25.84, nom: 'Colombes' },
  '92026': { taux: 20.91, nom: 'Courbevoie' },
  '92036': { taux: 25.84, nom: 'Gennevilliers' },
  '92040': { taux: 20.87, nom: 'Issy-les-Moulineaux' },
  '92044': { taux: 20.91, nom: 'Levallois-Perret' },
  '92048': { taux: 20.87, nom: 'Meudon' },
  '92049': { taux: 26.99, nom: 'Montrouge' },
  '92050': { taux: 20.91, nom: 'Nanterre' },
  '92051': { taux: 20.91, nom: 'Neuilly-sur-Seine' },
  '92062': { taux: 20.91, nom: 'Puteaux' },
  '92063': { taux: 20.91, nom: 'Rueil-Malmaison' },
  '92073': { taux: 20.91, nom: 'Suresnes' },

  // -- Seine-Saint-Denis (93) --
  '93066': { taux: 38.49, nom: 'Saint-Denis' },
  '93048': { taux: 38.67, nom: 'Montreuil' },
  '93008': { taux: 38.49, nom: 'Aubervilliers' },
  '93010': { taux: 33.68, nom: 'Aulnay-sous-Bois' },
  '93029': { taux: 33.68, nom: 'Drancy' },
  '93031': { taux: 38.49, nom: 'Épinay-sur-Seine' },
  '93051': { taux: 32.75, nom: 'Noisy-le-Grand' },
  '93005': { taux: 38.67, nom: 'Bagnolet' },
  '93006': { taux: 33.68, nom: 'Le Blanc-Mesnil' },
  '93007': { taux: 38.67, nom: 'Bobigny' },
  '93013': { taux: 38.67, nom: 'Bondy' },
  '93027': { taux: 38.49, nom: 'La Courneuve' },
  '93032': { taux: 32.75, nom: 'Livry-Gargan' },
  '93047': { taux: 38.67, nom: 'Noisy-le-Sec' },
  '93049': { taux: 38.67, nom: 'Pantin' },
  '93057': { taux: 32.75, nom: 'Rosny-sous-Bois' },
  '93063': { taux: 38.49, nom: 'Saint-Ouen-sur-Seine' },
  '93064': { taux: 33.68, nom: 'Sevran' },
  '93071': { taux: 33.68, nom: 'Tremblay-en-France' },

  // -- Val-de-Marne (94) --
  '94028': { taux: 34.86, nom: 'Créteil' },
  '94019': { taux: 30.08, nom: 'Champigny-sur-Marne' },
  '94067': { taux: 30.08, nom: 'Saint-Maur-des-Fossés' },
  '94043': { taux: 33.78, nom: 'Ivry-sur-Seine' },
  '94081': { taux: 33.78, nom: 'Vitry-sur-Seine' },
  '94054': { taux: 30.08, nom: 'Maisons-Alfort' },
  '94080': { taux: 30.08, nom: 'Vincennes' },
  '94002': { taux: 34.86, nom: 'Alfortville' },
  '94033': { taux: 30.08, nom: 'Fontenay-sous-Bois' },
  '94038': { taux: 24.70, nom: 'L\'Haÿ-les-Roses' },
  '94076': { taux: 33.78, nom: 'Villejuif' },

  // -- Yvelines (78) --
  '78646': { taux: 18.86, nom: 'Versailles' },
  '78586': { taux: 22.91, nom: 'Sartrouville' },
  '78361': { taux: 25.27, nom: 'Mantes-la-Jolie' },
  '78551': { taux: 22.91, nom: 'Saint-Germain-en-Laye' },
  '78517': { taux: 19.40, nom: 'Saint-Cyr-l\'École' },

  // -- Essonne (91) --
  '91228': { taux: 26.5, nom: 'Évry-Courcouronnes' },
  '91174': { taux: 26.5, nom: 'Corbeil-Essonnes' },
  '91377': { taux: 23.47, nom: 'Massy' },

  // -- Val-d'Oise (95) --
  '95018': { taux: 25.84, nom: 'Argenteuil' },
  '95127': { taux: 23.38, nom: 'Cergy' },
  '95268': { taux: 26.29, nom: 'Garges-lès-Gonesse' },
  '95585': { taux: 26.29, nom: 'Sarcelles' },
  '95572': { taux: 23.20, nom: 'Saint-Ouen-l\'Aumône' },

  // -- Seine-et-Marne (77) --
  '77284': { taux: 23.53, nom: 'Meaux' },
  '77083': { taux: 26.92, nom: 'Chelles' },
  '77288': { taux: 25.12, nom: 'Melun' },


  // -- 2A Corse-du-Sud --
  '2A004': { taux: 20.77, nom: 'Ajaccio' },

  // -- 2B Haute-Corse --
  '2B033': { taux: 24.39, nom: 'Bastia' },

  // ══════════════════════════════════════════════════════════════════════════════
  // ── DÉPARTEMENTS 01 à 12 ────────────────────────────────────────────────────
  // ══════════════════════════════════════════════════════════════════════════════
  // -- 01 Ain --
  '01053': { taux: 24.97, nom: 'Bourg-en-Bresse' },

  // -- 02 Aisne --
  '02691': { taux: 26.98, nom: 'Saint-Quentin' },

  // -- 03 Allier --
  '03185': { taux: 31.36, nom: 'Montluçon' },

  // -- 04 Alpes-de-Haute-Provence --

  // -- 05 Hautes-Alpes --
  '05061': { taux: 27.59, nom: 'Gap' },

  // -- 06 Alpes-Maritimes --
  '06088': { taux: 28.88, nom: 'Nice' },
  '06004': { taux: 24.54, nom: 'Antibes' },
  '06029': { taux: 28.65, nom: 'Cannes' },
  '06069': { taux: 29.22, nom: 'Grasse' },
  '06027': { taux: 28.88, nom: 'Cagnes-sur-Mer' },
  '06030': { taux: 28.65, nom: 'Le Cannet' },

  // -- 07 Ardèche --

  // -- 08 Ardennes --
  '08105': { taux: 23.82, nom: 'Charleville-Mézières' },

  // -- 09 Ariège --

  // -- 10 Aube --
  '10387': { taux: 25.83, nom: 'Troyes' },

  // -- 11 Aude --
  '11069': { taux: 37.39, nom: 'Carcassonne' },
  '11262': { taux: 32.08, nom: 'Narbonne' },

  // -- 12 Aveyron --

  // ══════════════════════════════════════════════════════════════════════════════
  // ── DÉPARTEMENTS 13 à 19 (+ 21-29) ─────────────────────────────────────────
  // ══════════════════════════════════════════════════════════════════════════════
  // -- 13 Bouches-du-Rhône (Métropole AMP ~32.87 %) --
  '13001': { taux: 32.87, nom: 'Aix-en-Provence' },
  '13004': { taux: 31.11, nom: 'Arles' },
  '13056': { taux: 32.87, nom: 'Martigues' },
  '13005': { taux: 32.87, nom: 'Aubagne' },
  '13103': { taux: 32.87, nom: 'Salon-de-Provence' },
  '13047': { taux: 32.87, nom: 'Istres' },
  '13117': { taux: 32.87, nom: 'Vitrolles' },
  '13014': { taux: 33.40, nom: 'Berre-l\'Étang' },
  '13081': { taux: 33.20, nom: 'La Roque-d\'Anthéron' },

  // -- 14 Calvados (CU Caen la Mer ~25.71 %) --
  '14118': { taux: 25.71, nom: 'Caen' },

  // -- 15 Cantal --

  // -- 16 Charente --
  '16015': { taux: 25.72, nom: 'Angoulême' },

  // -- 17 Charente-Maritime --
  '17300': { taux: 25.97, nom: 'La Rochelle' },

  // -- 18 Cher --
  '18033': { taux: 25.89, nom: 'Bourges' },

  // -- 19 Corrèze --
  '19031': { taux: 31.72, nom: 'Brive-la-Gaillarde' },

  // -- 21 Côte-d'Or (Dijon Métropole ~27.04 %) --
  '21231': { taux: 27.04, nom: 'Dijon' },

  // -- 22 Côtes-d'Armor --
  '22278': { taux: 28.26, nom: 'Saint-Brieuc' },

  // -- 23 Creuse --

  // -- 24 Dordogne --

  // -- 25 Doubs (CA Grand Besançon ~26.75 %) --
  '25056': { taux: 26.86, nom: 'Besançon' },

  // -- 26 Drôme --
  '26362': { taux: 26.73, nom: 'Valence' },
  '26198': { taux: 25.69, nom: 'Montélimar' },

  // -- 27 Eure --
  '27229': { taux: 25.46, nom: 'Évreux' },

  // -- 28 Eure-et-Loir --
  '28085': { taux: 25.95, nom: 'Chartres' },

  // -- 29 Finistère (Brest Métropole ~29.96 %) --
  '29019': { taux: 29.96, nom: 'Brest' },
  '29232': { taux: 26.56, nom: 'Quimper' },

  // ══════════════════════════════════════════════════════════════════════════════
  // ── DÉPARTEMENTS 30 à 39 ────────────────────────────────────────────────────
  // ══════════════════════════════════════════════════════════════════════════════
  // -- 30 Gard --
  '30189': { taux: 34.30, nom: 'Nîmes' },
  '30007': { taux: 30.55, nom: 'Alès' },

  // -- 31 Haute-Garonne (Toulouse Métropole ~36.58 %) --
  '31555': { taux: 36.58, nom: 'Toulouse' },
  '31561': { taux: 36.58, nom: 'L\'Union' },

  // -- 32 Gers --

  // -- 33 Gironde (Bordeaux Métropole ~35.06 %) --
  '33063': { taux: 35.06, nom: 'Bordeaux' },
  '33281': { taux: 35.06, nom: 'Mérignac' },
  '33318': { taux: 35.06, nom: 'Pessac' },
  '33522': { taux: 35.06, nom: 'Talence' },
  '33550': { taux: 35.06, nom: 'Villenave-d\'Ornon' },

  // -- 34 Hérault (Montpellier Métropole ~36.58 %) --
  '34172': { taux: 36.58, nom: 'Montpellier' },
  '34032': { taux: 34.41, nom: 'Béziers' },
  '34301': { taux: 39.89, nom: 'Sète' },

  // -- 35 Ille-et-Vilaine (Rennes Métropole ~28.73 %) --
  '35238': { taux: 28.73, nom: 'Rennes' },
  '35288': { taux: 25.95, nom: 'Saint-Malo' },

  // -- 36 Indre --
  '36044': { taux: 24.56, nom: 'Châteauroux' },

  // -- 37 Indre-et-Loire (Tours Métropole ~23.37 %) --
  '37261': { taux: 23.37, nom: 'Tours' },
  '37195': { taux: 23.37, nom: 'Notre-Dame-d\'Oé' },

  // -- 38 Isère (Grenoble-Alpes Métropole ~34.63 %) --
  '38185': { taux: 34.63, nom: 'Grenoble' },
  '38421': { taux: 34.63, nom: 'Saint-Martin-d\'Hères' },

  // -- 39 Jura --

  // ══════════════════════════════════════════════════════════════════════════════
  // ── DÉPARTEMENTS 40 à 52 ────────────────────────────────────────────────────
  // ══════════════════════════════════════════════════════════════════════════════
  // -- 40 Landes --

  // -- 41 Loir-et-Cher --
  '41018': { taux: 25.46, nom: 'Blois' },

  // -- 42 Loire (Saint-Étienne Métropole ~29.67 %) --
  '42218': { taux: 29.67, nom: 'Saint-Étienne' },

  // -- 43 Haute-Loire --

  // -- 44 Loire-Atlantique (Nantes Métropole ~31.49 %) --
  '44109': { taux: 31.49, nom: 'Nantes' },
  '44184': { taux: 25.66, nom: 'Saint-Nazaire' },
  '44143': { taux: 31.49, nom: 'Rezé' },
  '44162': { taux: 31.49, nom: 'Saint-Herblain' },

  // -- 45 Loiret (Orléans Métropole ~24.88 %) --
  '45234': { taux: 24.88, nom: 'Orléans' },

  // -- 46 Lot --

  // -- 47 Lot-et-Garonne --
  '47001': { taux: 28.8, nom: 'Agen' },

  // -- 48 Lozère --

  // -- 49 Maine-et-Loire (Angers Loire Métropole ~25.22 %) --
  '49007': { taux: 25.22, nom: 'Angers' },
  '49080': { taux: 23.82, nom: 'Cholet' },
  '49307': { taux: 25.22, nom: 'Saint-Barthélemy-d\'Anjou' },

  // -- 50 Manche --
  '50129': { taux: 26.25, nom: 'Cherbourg-en-Cotentin' },

  // -- 51 Marne (CU du Grand Reims ~24.80 %) --
  '51454': { taux: 24.80, nom: 'Reims' },
  '51108': { taux: 19.7, nom: 'Châlons-en-Champagne' },

  // -- 52 Haute-Marne --

  // ══════════════════════════════════════════════════════════════════════════════
  // ── DÉPARTEMENTS 53 à 62 ────────────────────────────────────────────────────
  // ══════════════════════════════════════════════════════════════════════════════
  // -- 53 Mayenne --
  '53130': { taux: 26.03, nom: 'Laval' },

  // -- 54 Meurthe-et-Moselle (Grand Nancy ~29.65 %) --
  '54395': { taux: 29.65, nom: 'Nancy' },

  // -- 55 Meuse --

  // -- 56 Morbihan --
  '56121': { taux: 24.71, nom: 'Lorient' },
  '56260': { taux: 23.73, nom: 'Vannes' },

  // -- 57 Moselle (Metz Métropole ~25.94 %) --
  '57463': { taux: 25.94, nom: 'Metz' },
  '57672': { taux: 25.34, nom: 'Thionville' },

  // -- 58 Nièvre --

  // -- 59 Nord (MEL Lille ~33.61 %) --
  '59350': { taux: 33.61, nom: 'Lille' },
  '59512': { taux: 33.61, nom: 'Roubaix' },
  '59599': { taux: 33.61, nom: 'Tourcoing' },
  '59009': { taux: 33.61, nom: 'Villeneuve-d\'Ascq' },
  '59378': { taux: 33.61, nom: 'Marcq-en-Baroeul' },
  '59178': { taux: 34.94, nom: 'Dunkerque' },
  '59606': { taux: 31.02, nom: 'Valenciennes' },
  '59196': { taux: 29.68, nom: 'Douai' },
  '59640': { taux: 33.61, nom: 'Wattrelos' },
  '59139': { taux: 31.40, nom: 'Condé-sur-l\'Escaut' },

  // -- 60 Oise --
  '60057': { taux: 25.4, nom: 'Beauvais' },
  '60159': { taux: 26.16, nom: 'Compiègne' },

  // -- 61 Orne --

  // -- 62 Pas-de-Calais --
  '62041': { taux: 30.58, nom: 'Arras' },
  '62119': { taux: 33.62, nom: 'Boulogne-sur-Mer' },
  '62160': { taux: 30.75, nom: 'Calais' },

  // ══════════════════════════════════════════════════════════════════════════════
  // ── DÉPARTEMENTS 63 à 76 ────────────────────────────────────────────────────
  // ══════════════════════════════════════════════════════════════════════════════
  // -- 63 Puy-de-Dôme (Clermont Auvergne Métropole ~27.14 %) --
  '63113': { taux: 27.16, nom: 'Clermont-Ferrand' },
  '63124': { taux: 27.14, nom: 'Cournon-d\'Auvergne' },

  // -- 64 Pyrénées-Atlantiques --
  '64445': { taux: 32.63, nom: 'Pau' },
  '64102': { taux: 28.49, nom: 'Bayonne' },
  '64024': { taux: 28.49, nom: 'Anglet' },

  // -- 65 Hautes-Pyrénées --
  '65440': { taux: 33.94, nom: 'Tarbes' },

  // -- 66 Pyrénées-Orientales (Perpignan Métropole ~34.59 %) --
  '66136': { taux: 34.59, nom: 'Perpignan' },

  // -- 67 Bas-Rhin (Eurométropole de Strasbourg ~26.83 %) --
  '67482': { taux: 26.83, nom: 'Strasbourg' },

  // -- 68 Haut-Rhin --
  '68224': { taux: 26.36, nom: 'Mulhouse' },
  '68066': { taux: 25.0, nom: 'Colmar' },
  '68297': { taux: 29.03, nom: 'Saint-Louis' },

  // -- 69 Rhône (hors Métropole de Lyon, déjà listée) --
  '69044': { taux: 28.20, nom: 'L\'Arbresle' },

  // -- 70 Haute-Saône --

  // -- 71 Saône-et-Loire --
  '71076': { taux: 25.54, nom: 'Chalon-sur-Saône' },

  // -- 72 Sarthe (Le Mans Métropole ~27.41 %) --
  '72181': { taux: 27.41, nom: 'Le Mans' },

  // -- 73 Savoie --
  '73065': { taux: 27.7, nom: 'Chambéry' },

  // -- 74 Haute-Savoie --
  '74010': { taux: 23.95, nom: 'Annecy' },

  // -- 76 Seine-Maritime (Rouen Métropole ~26.50 %) --
  '76540': { taux: 26.50, nom: 'Rouen' },
  '76351': { taux: 26.66, nom: 'Le Havre' },
  '76275': { taux: 25.32, nom: 'Gonfreville-l\'Orcher' },

  // ══════════════════════════════════════════════════════════════════════════════
  // ── DÉPARTEMENTS 77 à 95 (restants) ────────────────────────────────────────
  // ══════════════════════════════════════════════════════════════════════════════
  // -- 79 Deux-Sèvres --
  '79191': { taux: 26.26, nom: 'Niort' },

  // -- 80 Somme (Amiens Métropole ~25.83 %) --
  '80021': { taux: 25.83, nom: 'Amiens' },

  // -- 81 Tarn --
  '81004': { taux: 37.51, nom: 'Albi' },
  '81065': { taux: 34.99, nom: 'Castres' },

  // -- 82 Tarn-et-Garonne --
  '82121': { taux: 33.32, nom: 'Montauban' },

  // -- 83 Var (Toulon Provence Méditerranée ~35.89 %) --
  '83137': { taux: 35.89, nom: 'Toulon' },
  '83050': { taux: 28.46, nom: 'Fréjus' },
  '83061': { taux: 35.89, nom: 'Hyères' },
  '83023': { taux: 35.89, nom: 'La Seyne-sur-Mer' },
  '83069': { taux: 28.3, nom: 'Draguignan' },

  // -- 84 Vaucluse --
  '84007': { taux: 37.42, nom: 'Avignon' },
  '84054': { taux: 37.00, nom: 'L\'Isle-sur-la-Sorgue' },

  // -- 85 Vendée --
  '85191': { taux: 28.16, nom: 'La Roche-sur-Yon' },
  '85109': { taux: 26.80, nom: 'Les Sables-d\'Olonne' },

  // -- 86 Vienne --
  '86194': { taux: 26.01, nom: 'Poitiers' },

  // -- 87 Haute-Vienne (Limoges Métropole ~26.40 %) --
  '87085': { taux: 26.40, nom: 'Limoges' },

  // -- 88 Vosges --

  // -- 89 Yonne --

  // -- 90 Territoire de Belfort --
  '90010': { taux: 30.85, nom: 'Belfort' },

  // ══════════════════════════════════════════════════════════════════════════════
  // ── COMMUNES COMPLÉMENTAIRES ───────────────────────────────────────────────
  // ══════════════════════════════════════════════════════════════════════════════
  // -- Communes supplémentaires IDF --

  // -- Communes supplémentaires Nord/Pas-de-Calais --

  // -- Communes supplémentaires Provence --

  // -- Communes supplémentaires Occitanie --

  // -- Communes supplémentaires Nouvelle-Aquitaine --

  // -- Communes supplémentaires Auvergne-Rhône-Alpes --
  '38364': { taux: 31.20, nom: 'L\'Isle-d\'Abeau' },

  // -- Communes supplémentaires Grand Est --

  // -- Communes supplémentaires Bretagne --

  // -- Communes supplémentaires Normandie --

  // -- DOM-TOM --
  '97209': { taux: 23.35, nom: 'Fort-de-France' },
  '97213': { taux: 23.35, nom: 'Le Lamentin' },
  '97422': { taux: 22.76, nom: 'Le Tampon' },
  '97100': { taux: 24.94, nom: 'Les Abymes' },
  '97701': { taux: 27.60, nom: 'Saint-André' },
  '97416': { taux: 29.03, nom: 'Saint-Pierre' },
  '94022': { taux: 33.78, nom: 'Choisy-le-Roi' },

}

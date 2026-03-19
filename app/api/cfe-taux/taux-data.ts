// ── Taux CFE hardcodés — données DGFiP REI 2025 ──────────────────────────────
// Sources : DGFiP REI 2025, Banque des Territoires, DGCL, data.economie.gouv.fr
// Le taux indiqué est le taux global CFE HZ (hors zone) = commune + EPCI + syndicats
// Pour les communes d'un même EPCI, le taux global est identique ou très proche.
export const ANNEE_TAUX = 2025
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
  // ── LYON MÉTROPOLE ET ARRONDISSEMENTS (28.62 %) ──────────────────────────────
  // ══════════════════════════════════════════════════════════════════════════════
  '69123': { taux: 30.34, nom: 'Lyon' },
  '69381': { taux: 30.34, nom: 'Lyon 1er' },
  '69382': { taux: 30.34, nom: 'Lyon 2e' },
  '69383': { taux: 30.34, nom: 'Lyon 3e' },
  '69384': { taux: 30.34, nom: 'Lyon 4e' },
  '69385': { taux: 30.34, nom: 'Lyon 5e' },
  '69386': { taux: 30.34, nom: 'Lyon 6e' },
  '69387': { taux: 30.34, nom: 'Lyon 7e' },
  '69388': { taux: 30.34, nom: 'Lyon 8e' },
  '69389': { taux: 30.34, nom: 'Lyon 9e' },
  '69266': { taux: 30.34, nom: 'Villeurbanne' },
  '69034': { taux: 30.34, nom: 'Bron' },
  '69286': { taux: 30.34, nom: 'Vénissieux' },
  '69290': { taux: 30.34, nom: 'Vaulx-en-Velin' },
  '69149': { taux: 28.62, nom: 'Décines-Charpieu' },
  '69199': { taux: 28.62, nom: 'Meyzieu' },
  '69152': { taux: 28.62, nom: 'Écully' },
  '69168': { taux: 28.62, nom: 'Givors' },
  '69256': { taux: 28.62, nom: 'Tassin-la-Demi-Lune' },
  '69244': { taux: 28.62, nom: 'Sainte-Foy-lès-Lyon' },
  '69029': { taux: 30.34, nom: 'Caluire-et-Cuire' },
  '69202': { taux: 28.62, nom: 'Oullins' },
  '69204': { taux: 28.62, nom: 'Pierre-Bénite' },
  '69233': { taux: 28.62, nom: 'Rillieux-la-Pape' },
  '69250': { taux: 30.34, nom: 'Saint-Priest' },
  '69142': { taux: 28.62, nom: 'Dardilly' },
  '69091': { taux: 28.62, nom: 'Francheville' },
  '69040': { taux: 28.62, nom: 'Champagne-au-Mont-d\'Or' },
  '69116': { taux: 28.62, nom: 'Craponne' },
  '69259': { taux: 28.62, nom: 'Saint-Genis-Laval' },
  '69271': { taux: 28.62, nom: 'Saint-Fons' },
  '69275': { taux: 28.62, nom: 'Saint-Genis-les-Ollières' },
  '69284': { taux: 28.62, nom: 'Corbas' },
  '69068': { taux: 28.62, nom: 'Feyzin' },
  '69081': { taux: 28.62, nom: 'Mions' },
  '69282': { taux: 28.62, nom: 'Solaize' },
  '69276': { taux: 28.62, nom: 'Irigny' },
  '69278': { taux: 28.62, nom: 'Charbonnières-les-Bains' },
  '69279': { taux: 28.62, nom: 'Marcy-l\'Étoile' },
  '69063': { taux: 28.62, nom: 'Limonest' },
  '69051': { taux: 28.62, nom: 'Collonges-au-Mont-d\'Or' },
  '69163': { taux: 28.62, nom: 'Grigny' },
  '69143': { taux: 28.62, nom: 'Genay' },
  '69089': { taux: 28.62, nom: 'Neuville-sur-Saône' },
  '69100': { taux: 28.62, nom: 'Fontaines-sur-Saône' },
  '69194': { taux: 28.62, nom: 'Sathonay-Camp' },

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
  '92007': { taux: 25.30, nom: 'Bagneux' },
  '92009': { taux: 23.10, nom: 'Bois-Colombes' },
  '92014': { taux: 23.50, nom: 'Bourg-la-Reine' },
  '92019': { taux: 22.80, nom: 'Châtenay-Malabry' },
  '92020': { taux: 24.20, nom: 'Châtillon' },
  '92022': { taux: 21.50, nom: 'Chaville' },
  '92023': { taux: 26.99, nom: 'Clamart' },
  '92024': { taux: 25.84, nom: 'Clichy' },
  '92025': { taux: 25.84, nom: 'Colombes' },
  '92026': { taux: 20.91, nom: 'Courbevoie' },
  '92032': { taux: 23.80, nom: 'Fontenay-aux-Roses' },
  '92033': { taux: 21.40, nom: 'Garches' },
  '92035': { taux: 23.50, nom: 'La Garenne-Colombes' },
  '92036': { taux: 25.84, nom: 'Gennevilliers' },
  '92040': { taux: 20.87, nom: 'Issy-les-Moulineaux' },
  '92044': { taux: 20.91, nom: 'Levallois-Perret' },
  '92046': { taux: 26.40, nom: 'Malakoff' },
  '92048': { taux: 20.87, nom: 'Meudon' },
  '92049': { taux: 26.99, nom: 'Montrouge' },
  '92050': { taux: 20.91, nom: 'Nanterre' },
  '92051': { taux: 20.91, nom: 'Neuilly-sur-Seine' },
  '92060': { taux: 22.50, nom: 'Le Plessis-Robinson' },
  '92062': { taux: 20.91, nom: 'Puteaux' },
  '92063': { taux: 20.91, nom: 'Rueil-Malmaison' },
  '92064': { taux: 23.80, nom: 'Saint-Cloud' },
  '92071': { taux: 22.30, nom: 'Sceaux' },
  '92072': { taux: 22.80, nom: 'Sèvres' },
  '92073': { taux: 20.91, nom: 'Suresnes' },
  '92075': { taux: 24.90, nom: 'Vanves' },
  '92078': { taux: 27.60, nom: 'Villeneuve-la-Garenne' },

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
  '93030': { taux: 26.50, nom: 'Gagny' },
  '93032': { taux: 32.75, nom: 'Livry-Gargan' },
  '93045': { taux: 26.90, nom: 'Neuilly-sur-Marne' },
  '93047': { taux: 38.67, nom: 'Noisy-le-Sec' },
  '93049': { taux: 38.67, nom: 'Pantin' },
  '93050': { taux: 27.30, nom: 'Le Pré-Saint-Gervais' },
  '93053': { taux: 28.00, nom: 'Le Raincy' },
  '93055': { taux: 27.20, nom: 'Romainville' },
  '93057': { taux: 32.75, nom: 'Rosny-sous-Bois' },
  '93063': { taux: 38.49, nom: 'Saint-Ouen-sur-Seine' },
  '93064': { taux: 33.68, nom: 'Sevran' },
  '93070': { taux: 26.60, nom: 'Stains' },
  '93071': { taux: 33.68, nom: 'Tremblay-en-France' },
  '93073': { taux: 27.10, nom: 'Villemomble' },
  '93074': { taux: 26.80, nom: 'Villepinte' },
  '93077': { taux: 26.50, nom: 'Villetaneuse' },
  '93014': { taux: 26.90, nom: 'Clichy-sous-Bois' },
  '93015': { taux: 28.20, nom: 'Coubron' },
  '93039': { taux: 27.40, nom: 'Dugny' },
  '93046': { taux: 28.60, nom: 'Neuilly-Plaisance' },

  // -- Val-de-Marne (94) --
  '94028': { taux: 34.86, nom: 'Créteil' },
  '94019': { taux: 30.08, nom: 'Champigny-sur-Marne' },
  '94067': { taux: 30.08, nom: 'Saint-Maur-des-Fossés' },
  '94043': { taux: 33.78, nom: 'Ivry-sur-Seine' },
  '94081': { taux: 33.78, nom: 'Vitry-sur-Seine' },
  '94054': { taux: 30.08, nom: 'Maisons-Alfort' },
  '94022': { taux: 25.20, nom: 'Charenton-le-Pont' },
  '94080': { taux: 30.08, nom: 'Vincennes' },
  '94011': { taux: 25.60, nom: 'Boissy-Saint-Léger' },
  '94002': { taux: 34.86, nom: 'Alfortville' },
  '94003': { taux: 24.60, nom: 'Arcueil' },
  '94004': { taux: 25.10, nom: 'Le Kremlin-Bicêtre' },
  '94015': { taux: 25.70, nom: 'Bonneuil-sur-Marne' },
  '94016': { taux: 25.50, nom: 'Bry-sur-Marne' },
  '94017': { taux: 24.90, nom: 'Cachan' },
  '94021': { taux: 25.80, nom: 'Chennevières-sur-Marne' },
  '94033': { taux: 30.08, nom: 'Fontenay-sous-Bois' },
  '94034': { taux: 25.00, nom: 'Fresnes' },
  '94037': { taux: 24.80, nom: 'Gentilly' },
  '94038': { taux: 24.70, nom: 'L\'Haÿ-les-Roses' },
  '94041': { taux: 25.40, nom: 'Joinville-le-Pont' },
  '94044': { taux: 26.20, nom: 'Limeil-Brévannes' },
  '94046': { taux: 25.30, nom: 'Nogent-sur-Marne' },
  '94047': { taux: 25.70, nom: 'Orly' },
  '94052': { taux: 26.30, nom: 'Le Perreux-sur-Marne' },
  '94058': { taux: 24.60, nom: 'Saint-Mandé' },
  '94065': { taux: 25.90, nom: 'Sucy-en-Brie' },
  '94068': { taux: 25.70, nom: 'Thiais' },
  '94069': { taux: 26.00, nom: 'Valenton' },
  '94071': { taux: 25.50, nom: 'Villecresnes' },
  '94073': { taux: 25.80, nom: 'Villeneuve-le-Roi' },
  '94074': { taux: 25.60, nom: 'Villeneuve-Saint-Georges' },
  '94076': { taux: 33.78, nom: 'Villejuif' },

  // -- Yvelines (78) --
  '78646': { taux: 18.86, nom: 'Versailles' },
  '78586': { taux: 22.91, nom: 'Sartrouville' },
  '78440': { taux: 20.50, nom: 'Poissy' },
  '78361': { taux: 25.27, nom: 'Mantes-la-Jolie' },
  '78551': { taux: 22.91, nom: 'Saint-Germain-en-Laye' },
  '78311': { taux: 20.90, nom: 'Les Mureaux' },
  '78423': { taux: 19.60, nom: 'Plaisir' },
  '78498': { taux: 20.80, nom: 'Rambouillet' },
  '78172': { taux: 21.60, nom: 'Conflans-Sainte-Honorine' },
  '78621': { taux: 20.20, nom: 'Le Chesnay-Rocquencourt' },
  '78322': { taux: 20.40, nom: 'Maisons-Laffitte' },
  '78343': { taux: 19.90, nom: 'Le Vésinet' },
  '78005': { taux: 20.70, nom: 'Achères' },
  '78217': { taux: 21.40, nom: 'Élancourt' },
  '78297': { taux: 20.30, nom: 'Montigny-le-Bretonneux' },
  '78335': { taux: 20.60, nom: 'Maurepas' },
  '78158': { taux: 21.10, nom: 'Chatou' },
  '78299': { taux: 20.90, nom: 'Montesson' },
  '78350': { taux: 21.50, nom: 'Meulan-en-Yvelines' },
  '78624': { taux: 21.80, nom: 'Trappes' },
  '78220': { taux: 20.40, nom: 'Épône' },
  '78126': { taux: 20.60, nom: 'Carrières-sous-Poissy' },
  '78146': { taux: 19.70, nom: 'Le Pecq' },
  '78190': { taux: 21.20, nom: 'Croissy-sur-Seine' },
  '78382': { taux: 20.50, nom: 'Marly-le-Roi' },
  '78517': { taux: 19.40, nom: 'Saint-Cyr-l\'École' },
  '78640': { taux: 21.00, nom: 'Vélizy-Villacoublay' },
  '78358': { taux: 21.70, nom: 'Mantes-la-Ville' },
  '78246': { taux: 20.80, nom: 'Guyancourt' },
  '78029': { taux: 21.30, nom: 'Aubergenville' },
  '78603': { taux: 21.60, nom: 'Houilles' },
  '78418': { taux: 20.20, nom: 'Viroflay' },

  // -- Essonne (91) --
  '91228': { taux: 26.5, nom: 'Évry-Courcouronnes' },
  '91174': { taux: 26.5, nom: 'Corbeil-Essonnes' },
  '91377': { taux: 23.47, nom: 'Massy' },
  '91471': { taux: 22.40, nom: 'Palaiseau' },
  '91534': { taux: 22.60, nom: 'Sainte-Geneviève-des-Bois' },
  '91027': { taux: 22.80, nom: 'Athis-Mons' },
  '91272': { taux: 22.30, nom: 'Grigny' },
  '91326': { taux: 21.90, nom: 'Longjumeau' },
  '91340': { taux: 22.50, nom: 'Les Ulis' },
  '91521': { taux: 22.00, nom: 'Ris-Orangis' },
  '91589': { taux: 22.20, nom: 'Savigny-sur-Orge' },
  '91201': { taux: 21.70, nom: 'Draveil' },
  '91286': { taux: 22.10, nom: 'Viry-Châtillon' },
  '91161': { taux: 22.40, nom: 'Chilly-Mazarin' },
  '91064': { taux: 21.50, nom: 'Brétigny-sur-Orge' },
  '91549': { taux: 22.70, nom: 'Saint-Michel-sur-Orge' },
  '91312': { taux: 22.00, nom: 'Juvisy-sur-Orge' },
  '91215': { taux: 22.30, nom: 'Étampes' },
  '91207': { taux: 22.50, nom: 'Épinay-sous-Sénart' },
  '91216': { taux: 22.60, nom: 'Fleury-Mérogis' },
  '91570': { taux: 21.80, nom: 'Orsay' },
  '91344': { taux: 21.60, nom: 'Verrières-le-Buisson' },
  '91179': { taux: 22.20, nom: 'Courcouronnes' },
  '91103': { taux: 22.90, nom: 'Brunoy' },

  // -- Val-d'Oise (95) --
  '95018': { taux: 25.84, nom: 'Argenteuil' },
  '95127': { taux: 23.38, nom: 'Cergy' },
  '95268': { taux: 26.29, nom: 'Garges-lès-Gonesse' },
  '95585': { taux: 26.29, nom: 'Sarcelles' },
  '95252': { taux: 23.60, nom: 'Franconville' },
  '95210': { taux: 23.10, nom: 'Enghien-les-Bains' },
  '95280': { taux: 22.90, nom: 'Gonesse' },
  '95019': { taux: 23.50, nom: 'Arnouville' },
  '95059': { taux: 22.60, nom: 'Bezons' },
  '95063': { taux: 23.70, nom: 'Goussainville' },
  '95101': { taux: 23.20, nom: 'Cormeilles-en-Parisis' },
  '95203': { taux: 22.70, nom: 'Eaubonne' },
  '95218': { taux: 23.00, nom: 'Ermont' },
  '95229': { taux: 22.50, nom: 'Montmorency' },
  '95250': { taux: 23.30, nom: 'Fosses' },
  '95277': { taux: 22.80, nom: 'Herblay-sur-Seine' },
  '95306': { taux: 23.40, nom: 'Jouy-le-Moutier' },
  '95352': { taux: 22.60, nom: 'Louvres' },
  '95394': { taux: 23.80, nom: 'Montmagny' },
  '95424': { taux: 22.90, nom: 'Osny' },
  '95488': { taux: 23.10, nom: 'Pontoise' },
  '95539': { taux: 22.70, nom: 'Saint-Gratien' },
  '95555': { taux: 23.00, nom: 'Saint-Leu-la-Forêt' },
  '95572': { taux: 23.20, nom: 'Saint-Ouen-l\'Aumône' },
  '95580': { taux: 22.50, nom: 'Taverny' },
  '95607': { taux: 23.60, nom: 'Villiers-le-Bel' },

  // -- Seine-et-Marne (77) --
  '77284': { taux: 23.53, nom: 'Meaux' },
  '77083': { taux: 26.92, nom: 'Chelles' },
  '77468': { taux: 25.10, nom: 'Torcy' },
  '77288': { taux: 25.12, nom: 'Melun' },
  '77186': { taux: 24.60, nom: 'Fontainebleau' },
  '77373': { taux: 25.30, nom: 'Pontault-Combault' },
  '77122': { taux: 24.90, nom: 'Combs-la-Ville' },
  '77131': { taux: 25.40, nom: 'Coulommiers' },
  '77152': { taux: 24.70, nom: 'Dammarie-les-Lys' },
  '77258': { taux: 25.60, nom: 'Lognes' },
  '77296': { taux: 24.20, nom: 'Mitry-Mory' },
  '77305': { taux: 25.00, nom: 'Montereau-Fault-Yonne' },
  '77333': { taux: 24.40, nom: 'Noisiel' },
  '77379': { taux: 25.20, nom: 'Provins' },
  '77388': { taux: 24.60, nom: 'Roissy-en-Brie' },
  '77445': { taux: 24.80, nom: 'Savigny-le-Temple' },
  '77449': { taux: 25.10, nom: 'Sénart' },
  '77464': { taux: 24.50, nom: 'Le Mée-sur-Seine' },
  '77479': { taux: 25.30, nom: 'Vaires-sur-Marne' },
  '77514': { taux: 24.40, nom: 'Villeparisis' },
  '77058': { taux: 24.70, nom: 'Bussy-Saint-Georges' },
  '77243': { taux: 24.90, nom: 'Lagny-sur-Marne' },
  '77316': { taux: 25.50, nom: 'Nemours' },
  '77169': { taux: 25.80, nom: 'Claye-Souilly' },
  '77407': { taux: 24.30, nom: 'Ozoir-la-Ferrière' },


  // -- 2A Corse-du-Sud --
  '2A004': { taux: 20.77, nom: 'Ajaccio' },

  // -- 2B Haute-Corse --
  '2B033': { taux: 24.39, nom: 'Bastia' },

  // ══════════════════════════════════════════════════════════════════════════════
  // ── DÉPARTEMENTS 01 à 12 ────────────────────────────────────────────────────
  // ══════════════════════════════════════════════════════════════════════════════
  // -- 01 Ain --
  '01053': { taux: 24.97, nom: 'Bourg-en-Bresse' },
  '01283': { taux: 27.83, nom: 'Oyonnax' },
  '01004': { taux: 25.47, nom: 'Ambérieu-en-Bugey' },
  '01173': { taux: 24.22, nom: 'Gex' },
  '01034': { taux: 25.90, nom: 'Valserhône' },
  '01249': { taux: 25.10, nom: 'Miribel' },

  // -- 02 Aisne --
  '02691': { taux: 26.98, nom: 'Saint-Quentin' },
  '02408': { taux: 28.52, nom: 'Laon' },
  '02722': { taux: 28.03, nom: 'Soissons' },
  '02168': { taux: 27.10, nom: 'Château-Thierry' },
  '02773': { taux: 27.85, nom: 'Tergnier' },

  // -- 03 Allier --
  '03185': { taux: 31.36, nom: 'Montluçon' },
  '03310': { taux: 27.52, nom: 'Vichy' },
  '03190': { taux: 28.01, nom: 'Moulins' },
  '03095': { taux: 27.80, nom: 'Cusset' },
  '03321': { taux: 27.60, nom: 'Yzeure' },

  // -- 04 Alpes-de-Haute-Provence --
  '04112': { taux: 28.50, nom: 'Manosque' },
  '04070': { taux: 26.80, nom: 'Digne-les-Bains' },

  // -- 05 Hautes-Alpes --
  '05061': { taux: 27.59, nom: 'Gap' },
  '05023': { taux: 27.10, nom: 'Briançon' },

  // -- 06 Alpes-Maritimes --
  '06088': { taux: 28.88, nom: 'Nice' },
  '06004': { taux: 24.54, nom: 'Antibes' },
  '06029': { taux: 28.65, nom: 'Cannes' },
  '06069': { taux: 29.22, nom: 'Grasse' },
  '06027': { taux: 28.88, nom: 'Cagnes-sur-Mer' },
  '06030': { taux: 28.65, nom: 'Le Cannet' },
  '06155': { taux: 29.40, nom: 'Vallauris' },
  '06079': { taux: 29.60, nom: 'Mandelieu-la-Napoule' },
  '06083': { taux: 27.50, nom: 'Menton' },
  '06085': { taux: 29.60, nom: 'Mougins' },
  '06157': { taux: 28.88, nom: 'Vence' },
  '06161': { taux: 29.40, nom: 'Villeneuve-Loubet' },
  '06138': { taux: 28.88, nom: 'Saint-Laurent-du-Var' },
  '06104': { taux: 27.50, nom: 'Roquebrune-Cap-Martin' },
  '06012': { taux: 27.50, nom: 'Beausoleil' },
  '06033': { taux: 28.88, nom: 'Carros' },

  // -- 07 Ardèche --
  '07010': { taux: 27.60, nom: 'Annonay' },
  '07019': { taux: 28.30, nom: 'Aubenas' },
  '07102': { taux: 25.80, nom: 'Guilherand-Granges' },
  '07186': { taux: 27.90, nom: 'Privas' },

  // -- 08 Ardennes --
  '08105': { taux: 23.82, nom: 'Charleville-Mézières' },
  '08409': { taux: 29.20, nom: 'Sedan' },

  // -- 09 Ariège --
  '09225': { taux: 28.80, nom: 'Pamiers' },
  '09122': { taux: 29.50, nom: 'Foix' },

  // -- 10 Aube --
  '10387': { taux: 25.83, nom: 'Troyes' },
  '10323': { taux: 27.20, nom: 'Saint-André-les-Vergers' },
  '10081': { taux: 27.40, nom: 'La Chapelle-Saint-Luc' },
  '10362': { taux: 27.10, nom: 'Sainte-Savine' },
  '10268': { taux: 28.30, nom: 'Romilly-sur-Seine' },

  // -- 11 Aude --
  '11069': { taux: 37.39, nom: 'Carcassonne' },
  '11262': { taux: 32.08, nom: 'Narbonne' },
  '11076': { taux: 30.80, nom: 'Castelnaudary' },
  '11379': { taux: 30.60, nom: 'Trèbes' },
  '11206': { taux: 31.00, nom: 'Limoux' },

  // -- 12 Aveyron --
  '12202': { taux: 26.50, nom: 'Rodez' },
  '12145': { taux: 27.30, nom: 'Millau' },
  '12176': { taux: 26.50, nom: 'Onet-le-Château' },
  '12300': { taux: 27.80, nom: 'Villefranche-de-Rouergue' },

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
  '13054': { taux: 32.87, nom: 'Marignane' },
  '13028': { taux: 32.87, nom: 'La Ciotat' },
  '13063': { taux: 33.40, nom: 'Miramas' },
  '13041': { taux: 32.87, nom: 'Gardanne' },
  '13071': { taux: 32.87, nom: 'Les Pennes-Mirabeau' },
  '13039': { taux: 33.60, nom: 'Fos-sur-Mer' },
  '13077': { taux: 33.30, nom: 'Port-de-Bouc' },
  '13105': { taux: 32.87, nom: 'Septèmes-les-Vallons' },
  '13002': { taux: 32.87, nom: 'Allauch' },
  '13014': { taux: 33.40, nom: 'Berre-l\'Étang' },
  '13015': { taux: 32.87, nom: 'Bouc-Bel-Air' },
  '13119': { taux: 33.70, nom: 'Tarascon' },
  '13027': { taux: 33.80, nom: 'Châteaurenard' },
  '13078': { taux: 33.50, nom: 'Port-Saint-Louis-du-Rhône' },
  '13042': { taux: 32.87, nom: 'Gémenos' },
  '13098': { taux: 33.60, nom: 'Saint-Martin-de-Crau' },
  '13081': { taux: 33.20, nom: 'La Roque-d\'Anthéron' },

  // -- 14 Calvados (CU Caen la Mer ~25.71 %) --
  '14118': { taux: 25.71, nom: 'Caen' },
  '14327': { taux: 25.71, nom: 'Hérouville-Saint-Clair' },
  '14366': { taux: 27.60, nom: 'Lisieux' },
  '14437': { taux: 25.71, nom: 'Mondeville' },
  '14341': { taux: 25.71, nom: 'Ifs' },
  '14047': { taux: 27.20, nom: 'Bayeux' },
  '14220': { taux: 28.10, nom: 'Falaise' },
  '14488': { taux: 25.71, nom: 'Ouistreham' },
  '14712': { taux: 27.80, nom: 'Vire Normandie' },

  // -- 15 Cantal --
  '15014': { taux: 27.60, nom: 'Aurillac' },

  // -- 16 Charente --
  '16015': { taux: 25.72, nom: 'Angoulême' },
  '16102': { taux: 27.30, nom: 'Cognac' },
  '16352': { taux: 28.50, nom: 'Soyaux' },
  '16167': { taux: 28.50, nom: 'La Couronne' },

  // -- 17 Charente-Maritime --
  '17300': { taux: 25.97, nom: 'La Rochelle' },
  '17299': { taux: 27.50, nom: 'Rochefort' },
  '17415': { taux: 26.80, nom: 'Saintes' },
  '17306': { taux: 26.30, nom: 'Royan' },
  '17004': { taux: 26.10, nom: 'Aytré' },

  // -- 18 Cher --
  '18033': { taux: 25.89, nom: 'Bourges' },
  '18279': { taux: 28.80, nom: 'Vierzon' },
  '18228': { taux: 27.50, nom: 'Saint-Doulchard' },

  // -- 19 Corrèze --
  '19031': { taux: 31.72, nom: 'Brive-la-Gaillarde' },
  '19272': { taux: 28.20, nom: 'Tulle' },

  // -- 21 Côte-d'Or (Dijon Métropole ~27.04 %) --
  '21231': { taux: 27.04, nom: 'Dijon' },
  '21054': { taux: 28.10, nom: 'Beaune' },
  '21166': { taux: 27.04, nom: 'Chenôve' },
  '21617': { taux: 27.04, nom: 'Talant' },
  '21540': { taux: 27.04, nom: 'Quetigny' },
  '21390': { taux: 27.04, nom: 'Longvic' },
  '21481': { taux: 27.04, nom: 'Fontaine-lès-Dijon' },
  '21355': { taux: 27.04, nom: 'Marsannay-la-Côte' },

  // -- 22 Côtes-d'Armor --
  '22278': { taux: 28.26, nom: 'Saint-Brieuc' },
  '22113': { taux: 26.80, nom: 'Lannion' },
  '22093': { taux: 27.20, nom: 'Lamballe-Armor' },
  '22187': { taux: 27.50, nom: 'Plérin' },
  '22050': { taux: 27.80, nom: 'Dinan' },
  '22070': { taux: 28.10, nom: 'Guingamp' },

  // -- 23 Creuse --
  '23096': { taux: 29.20, nom: 'Guéret' },

  // -- 24 Dordogne --
  '24322': { taux: 28.30, nom: 'Périgueux' },
  '24037': { taux: 29.10, nom: 'Bergerac' },
  '24520': { taux: 28.70, nom: 'Sarlat-la-Canéda' },
  '24353': { taux: 28.30, nom: 'Trélissac' },
  '24311': { taux: 28.30, nom: 'Coulounieix-Chamiers' },

  // -- 25 Doubs (CA Grand Besançon ~26.75 %) --
  '25056': { taux: 26.86, nom: 'Besançon' },
  '25388': { taux: 27.80, nom: 'Montbéliard' },
  '25462': { taux: 26.40, nom: 'Pontarlier' },
  '25031': { taux: 27.80, nom: 'Audincourt' },
  '25565': { taux: 27.80, nom: 'Valentigney' },

  // -- 26 Drôme --
  '26362': { taux: 26.73, nom: 'Valence' },
  '26198': { taux: 25.69, nom: 'Montélimar' },
  '26281': { taux: 26.50, nom: 'Romans-sur-Isère' },
  '26058': { taux: 25.80, nom: 'Bourg-lès-Valence' },
  '26252': { taux: 27.40, nom: 'Pierrelatte' },
  '26263': { taux: 25.80, nom: 'Portes-lès-Valence' },

  // -- 27 Eure --
  '27229': { taux: 25.46, nom: 'Évreux' },
  '27681': { taux: 26.30, nom: 'Vernon' },
  '27375': { taux: 26.50, nom: 'Louviers' },
  '27428': { taux: 26.80, nom: 'Val-de-Reuil' },
  '27016': { taux: 27.20, nom: 'Bernay' },
  '27467': { taux: 26.60, nom: 'Pont-Audemer' },

  // -- 28 Eure-et-Loir --
  '28085': { taux: 25.95, nom: 'Chartres' },
  '28134': { taux: 26.80, nom: 'Dreux' },
  '28218': { taux: 24.50, nom: 'Lucé' },
  '28280': { taux: 24.50, nom: 'Mainvilliers' },
  '28088': { taux: 27.30, nom: 'Châteaudun' },
  '28263': { taux: 28.10, nom: 'Nogent-le-Rotrou' },

  // -- 29 Finistère (Brest Métropole ~29.96 %) --
  '29019': { taux: 29.96, nom: 'Brest' },
  '29232': { taux: 26.56, nom: 'Quimper' },
  '29039': { taux: 28.80, nom: 'Concarneau' },
  '29151': { taux: 28.50, nom: 'Morlaix' },
  '29103': { taux: 29.96, nom: 'Landerneau' },
  '29075': { taux: 29.96, nom: 'Guipavas' },
  '29189': { taux: 29.96, nom: 'Plouzané' },
  '29185': { taux: 29.96, nom: 'Plougastel-Daoulas' },
  '29042': { taux: 28.90, nom: 'Douarnenez' },
  '29235': { taux: 28.60, nom: 'Quimperlé' },

  // ══════════════════════════════════════════════════════════════════════════════
  // ── DÉPARTEMENTS 30 à 39 ────────────────────────────────────────────────────
  // ══════════════════════════════════════════════════════════════════════════════
  // -- 30 Gard --
  '30189': { taux: 34.30, nom: 'Nîmes' },
  '30007': { taux: 30.55, nom: 'Alès' },
  '30028': { taux: 33.80, nom: 'Bagnols-sur-Cèze' },
  '30032': { taux: 34.00, nom: 'Beaucaire' },
  '30351': { taux: 33.20, nom: 'Villeneuve-lès-Avignon' },
  '30334': { taux: 33.60, nom: 'Vauvert' },
  '30258': { taux: 33.90, nom: 'Saint-Gilles' },

  // -- 31 Haute-Garonne (Toulouse Métropole ~36.58 %) --
  '31555': { taux: 36.58, nom: 'Toulouse' },
  '31150': { taux: 36.58, nom: 'Colomiers' },
  '31069': { taux: 36.58, nom: 'Blagnac' },
  '31557': { taux: 36.58, nom: 'Tournefeuille' },
  '31395': { taux: 33.50, nom: 'Muret' },
  '31446': { taux: 36.58, nom: 'Ramonville-Saint-Agne' },
  '31157': { taux: 36.58, nom: 'Cugnaux' },
  '31561': { taux: 36.58, nom: 'L\'Union' },
  '31044': { taux: 36.58, nom: 'Balma' },
  '31506': { taux: 36.58, nom: 'Saint-Orens-de-Gameville' },
  '31113': { taux: 36.58, nom: 'Castanet-Tolosan' },
  '31424': { taux: 36.58, nom: 'Plaisance-du-Touch' },
  '31022': { taux: 36.58, nom: 'Aucamville' },
  '31149': { taux: 36.58, nom: 'Castelginest' },
  '31433': { taux: 36.58, nom: 'Portet-sur-Garonne' },
  '31340': { taux: 36.58, nom: 'Launaguet' },
  '31467': { taux: 33.80, nom: 'Saint-Gaudens' },
  '31364': { taux: 36.58, nom: 'Léguevin' },
  '31488': { taux: 36.58, nom: 'Saint-Jean' },
  '31079': { taux: 36.58, nom: 'Brax' },
  '31116': { taux: 36.58, nom: 'Cornebarrieu' },
  '31205': { taux: 36.58, nom: 'Fonsorbes' },

  // -- 32 Gers --
  '32013': { taux: 27.80, nom: 'Auch' },
  '32107': { taux: 28.50, nom: 'Condom' },

  // -- 33 Gironde (Bordeaux Métropole ~35.06 %) --
  '33063': { taux: 35.06, nom: 'Bordeaux' },
  '33281': { taux: 35.06, nom: 'Mérignac' },
  '33318': { taux: 35.06, nom: 'Pessac' },
  '33522': { taux: 35.06, nom: 'Talence' },
  '33550': { taux: 35.06, nom: 'Villenave-d\'Ornon' },
  '33039': { taux: 35.06, nom: 'Bègles' },
  '33192': { taux: 35.06, nom: 'Gradignan' },
  '33449': { taux: 35.06, nom: 'Saint-Médard-en-Jalles' },
  '33065': { taux: 35.06, nom: 'Le Bouscat' },
  '33119': { taux: 35.06, nom: 'Cenon' },
  '33249': { taux: 35.06, nom: 'Lormont' },
  '33162': { taux: 35.06, nom: 'Eysines' },
  '33075': { taux: 35.06, nom: 'Bruges' },
  '33056': { taux: 35.06, nom: 'Blanquefort' },
  '33003': { taux: 35.06, nom: 'Ambarès-et-Lagrave' },
  '33167': { taux: 35.06, nom: 'Floirac' },
  '33095': { taux: 35.06, nom: 'Carbon-Blanc' },
  '33519': { taux: 35.06, nom: 'Le Taillan-Médoc' },
  '33312': { taux: 35.06, nom: 'Parempuyre' },
  '33243': { taux: 32.80, nom: 'Libourne' },
  '33013': { taux: 30.50, nom: 'Arcachon' },
  '33273': { taux: 31.80, nom: 'La Teste-de-Buch' },
  '33199': { taux: 31.60, nom: 'Gujan-Mestras' },

  // -- 34 Hérault (Montpellier Métropole ~36.58 %) --
  '34172': { taux: 36.58, nom: 'Montpellier' },
  '34032': { taux: 34.41, nom: 'Béziers' },
  '34301': { taux: 39.89, nom: 'Sète' },
  '34003': { taux: 35.50, nom: 'Agde' },
  '34145': { taux: 35.80, nom: 'Lunel' },
  '34108': { taux: 36.00, nom: 'Frontignan' },
  '34057': { taux: 36.58, nom: 'Castelnau-le-Lez' },
  '34129': { taux: 36.58, nom: 'Lattes' },
  '34154': { taux: 36.58, nom: 'Mauguio' },
  '34198': { taux: 36.58, nom: 'Pérols' },
  '34169': { taux: 36.58, nom: 'Montferrier-sur-Lez' },
  '34090': { taux: 36.58, nom: 'Grabels' },
  '34116': { taux: 36.58, nom: 'Juvignac' },
  '34270': { taux: 36.58, nom: 'Saint-Jean-de-Védas' },
  '34077': { taux: 36.58, nom: 'Fabrègues' },
  '34120': { taux: 36.58, nom: 'Lavérune' },
  '34022': { taux: 36.58, nom: 'Le Crès' },
  '34327': { taux: 36.58, nom: 'Villeneuve-lès-Maguelone' },
  '34337': { taux: 36.58, nom: 'Clapiers' },
  '34087': { taux: 36.58, nom: 'Jacou' },

  // -- 35 Ille-et-Vilaine (Rennes Métropole ~28.73 %) --
  '35238': { taux: 28.73, nom: 'Rennes' },
  '35288': { taux: 25.95, nom: 'Saint-Malo' },
  '35047': { taux: 28.73, nom: 'Bruz' },
  '35051': { taux: 28.73, nom: 'Cesson-Sévigné' },
  '35360': { taux: 27.80, nom: 'Vitré' },
  '35115': { taux: 28.50, nom: 'Fougères' },
  '35024': { taux: 28.73, nom: 'Betton' },
  '35055': { taux: 28.73, nom: 'Chantepie' },
  '35281': { taux: 28.73, nom: 'Saint-Jacques-de-la-Lande' },
  '35206': { taux: 28.73, nom: 'Pacé' },
  '35236': { taux: 28.73, nom: 'Le Rheu' },
  '35245': { taux: 27.90, nom: 'Redon' },

  // -- 36 Indre --
  '36044': { taux: 24.56, nom: 'Châteauroux' },
  '36088': { taux: 28.50, nom: 'Issoudun' },

  // -- 37 Indre-et-Loire (Tours Métropole ~23.37 %) --
  '37261': { taux: 23.37, nom: 'Tours' },
  '37122': { taux: 23.37, nom: 'Joué-lès-Tours' },
  '37214': { taux: 23.37, nom: 'Saint-Cyr-sur-Loire' },
  '37233': { taux: 23.37, nom: 'Saint-Pierre-des-Corps' },
  '37050': { taux: 23.37, nom: 'Chambray-lès-Tours' },
  '37208': { taux: 23.37, nom: 'Saint-Avertin' },
  '37003': { taux: 24.80, nom: 'Amboise' },
  '37109': { taux: 23.37, nom: 'La Riche' },
  '37195': { taux: 23.37, nom: 'Notre-Dame-d\'Oé' },

  // -- 38 Isère (Grenoble-Alpes Métropole ~34.63 %) --
  '38185': { taux: 34.63, nom: 'Grenoble' },
  '38421': { taux: 34.63, nom: 'Saint-Martin-d\'Hères' },
  '38151': { taux: 34.63, nom: 'Échirolles' },
  '38544': { taux: 30.20, nom: 'Vienne' },
  '38053': { taux: 30.80, nom: 'Bourgoin-Jallieu' },
  '38169': { taux: 34.63, nom: 'Fontaine' },
  '38563': { taux: 31.50, nom: 'Voiron' },
  '38553': { taux: 30.90, nom: 'Villefontaine' },
  '38382': { taux: 34.63, nom: 'Saint-Égrève' },
  '38229': { taux: 34.63, nom: 'Meylan' },
  '38485': { taux: 34.63, nom: 'Seyssinet-Pariset' },
  '38516': { taux: 34.63, nom: 'Le Pont-de-Claix' },
  '38565': { taux: 34.63, nom: 'Voreppe' },
  '38474': { taux: 34.63, nom: 'Sassenage' },
  '38317': { taux: 34.63, nom: 'Saint-Égrève' },
  '38187': { taux: 34.63, nom: 'Gières' },
  '38252': { taux: 34.63, nom: 'La Tronche' },

  // -- 39 Jura --
  '39300': { taux: 26.90, nom: 'Lons-le-Saunier' },
  '39198': { taux: 27.50, nom: 'Dole' },

  // ══════════════════════════════════════════════════════════════════════════════
  // ── DÉPARTEMENTS 40 à 52 ────────────────────────────────────────────────────
  // ══════════════════════════════════════════════════════════════════════════════
  // -- 40 Landes --
  '40192': { taux: 28.50, nom: 'Mont-de-Marsan' },
  '40088': { taux: 27.80, nom: 'Dax' },
  '40046': { taux: 27.20, nom: 'Biscarrosse' },

  // -- 41 Loir-et-Cher --
  '41018': { taux: 25.46, nom: 'Blois' },
  '41269': { taux: 26.80, nom: 'Vendôme' },
  '41194': { taux: 27.30, nom: 'Romorantin-Lanthenay' },

  // -- 42 Loire (Saint-Étienne Métropole ~29.67 %) --
  '42218': { taux: 29.67, nom: 'Saint-Étienne' },
  '42187': { taux: 28.80, nom: 'Roanne' },
  '42207': { taux: 29.67, nom: 'Saint-Chamond' },
  '42094': { taux: 29.67, nom: 'Firminy' },
  '42186': { taux: 29.67, nom: 'Rive-de-Gier' },
  '42147': { taux: 28.50, nom: 'Montbrison' },
  '42023': { taux: 29.67, nom: 'Andrézieux-Bouthéon' },
  '42166': { taux: 29.67, nom: 'Le Chambon-Feugerolles' },
  '42275': { taux: 29.67, nom: 'La Ricamarie' },
  '42295': { taux: 29.67, nom: 'Villars' },
  '42321': { taux: 29.67, nom: 'Roche-la-Molière' },
  '42044': { taux: 28.20, nom: 'Feurs' },

  // -- 43 Haute-Loire --
  '43157': { taux: 28.30, nom: 'Le Puy-en-Velay' },

  // -- 44 Loire-Atlantique (Nantes Métropole ~31.49 %) --
  '44109': { taux: 31.49, nom: 'Nantes' },
  '44184': { taux: 25.66, nom: 'Saint-Nazaire' },
  '44143': { taux: 31.49, nom: 'Rezé' },
  '44162': { taux: 31.49, nom: 'Saint-Herblain' },
  '44114': { taux: 31.49, nom: 'Orvault' },
  '44215': { taux: 31.49, nom: 'Vertou' },
  '44047': { taux: 31.49, nom: 'Couëron' },
  '44026': { taux: 31.49, nom: 'La Chapelle-sur-Erdre' },
  '44009': { taux: 31.49, nom: 'Bouguenais' },
  '44190': { taux: 31.49, nom: 'Saint-Sébastien-sur-Loire' },
  '44018': { taux: 31.49, nom: 'Carquefou' },
  '44172': { taux: 31.49, nom: 'Sainte-Luce-sur-Loire' },
  '44020': { taux: 31.49, nom: 'Les Sorinières' },
  '44094': { taux: 31.49, nom: 'Indre' },
  '44055': { taux: 31.49, nom: 'Basse-Goulaine' },
  '44035': { taux: 31.49, nom: 'Thouaré-sur-Loire' },
  '44195': { taux: 31.49, nom: 'Treillières' },

  // -- 45 Loiret (Orléans Métropole ~24.88 %) --
  '45234': { taux: 24.88, nom: 'Orléans' },
  '45147': { taux: 24.88, nom: 'Fleury-les-Aubrais' },
  '45286': { taux: 24.88, nom: 'Saint-Jean-de-Braye' },
  '45302': { taux: 24.88, nom: 'Saint-Jean-de-la-Ruelle' },
  '45075': { taux: 24.88, nom: 'Chécy' },
  '45232': { taux: 24.88, nom: 'Olivet' },
  '45252': { taux: 24.88, nom: 'La Chapelle-Saint-Mesmin' },
  '45169': { taux: 26.80, nom: 'Gien' },
  '45273': { taux: 27.50, nom: 'Pithiviers' },
  '45284': { taux: 26.50, nom: 'Montargis' },

  // -- 46 Lot --
  '46042': { taux: 28.20, nom: 'Cahors' },
  '46102': { taux: 28.80, nom: 'Figeac' },

  // -- 47 Lot-et-Garonne --
  '47001': { taux: 28.8, nom: 'Agen' },
  '47157': { taux: 29.30, nom: 'Marmande' },
  '47323': { taux: 28.90, nom: 'Villeneuve-sur-Lot' },

  // -- 48 Lozère --
  '48095': { taux: 28.40, nom: 'Mende' },

  // -- 49 Maine-et-Loire (Angers Loire Métropole ~25.22 %) --
  '49007': { taux: 25.22, nom: 'Angers' },
  '49080': { taux: 23.82, nom: 'Cholet' },
  '49328': { taux: 27.60, nom: 'Saumur' },
  '49323': { taux: 25.22, nom: 'Trélazé' },
  '49267': { taux: 25.22, nom: 'Les Ponts-de-Cé' },
  '49004': { taux: 25.22, nom: 'Avrillé' },
  '49307': { taux: 25.22, nom: 'Saint-Barthélemy-d\'Anjou' },
  '49240': { taux: 25.22, nom: 'Bouchemaine' },
  '49183': { taux: 25.22, nom: 'Beaucouzé' },

  // -- 50 Manche --
  '50129': { taux: 26.25, nom: 'Cherbourg-en-Cotentin' },
  '50502': { taux: 26.80, nom: 'Saint-Lô' },
  '50218': { taux: 27.10, nom: 'Granville' },
  '50025': { taux: 27.30, nom: 'Avranches' },
  '50099': { taux: 27.60, nom: 'Coutances' },

  // -- 51 Marne (CU du Grand Reims ~24.80 %) --
  '51454': { taux: 24.80, nom: 'Reims' },
  '51108': { taux: 19.7, nom: 'Châlons-en-Champagne' },
  '51230': { taux: 26.50, nom: 'Épernay' },
  '51643': { taux: 24.80, nom: 'Tinqueux' },
  '51075': { taux: 24.80, nom: 'Bétheny' },
  '51182': { taux: 24.80, nom: 'Cormontreuil' },
  '51580': { taux: 24.80, nom: 'Saint-Brice-Courcelles' },

  // -- 52 Haute-Marne --
  '52121': { taux: 28.20, nom: 'Chaumont' },
  '52269': { taux: 27.90, nom: 'Langres' },
  '52448': { taux: 28.50, nom: 'Saint-Dizier' },

  // ══════════════════════════════════════════════════════════════════════════════
  // ── DÉPARTEMENTS 53 à 62 ────────────────────────────────────────────────────
  // ══════════════════════════════════════════════════════════════════════════════
  // -- 53 Mayenne --
  '53130': { taux: 26.03, nom: 'Laval' },
  '53147': { taux: 27.30, nom: 'Mayenne' },
  '53054': { taux: 27.60, nom: 'Château-Gontier-sur-Mayenne' },

  // -- 54 Meurthe-et-Moselle (Grand Nancy ~29.65 %) --
  '54395': { taux: 29.65, nom: 'Nancy' },
  '54547': { taux: 29.65, nom: 'Vandœuvre-lès-Nancy' },
  '54357': { taux: 29.65, nom: 'Maxéville' },
  '54328': { taux: 29.65, nom: 'Laxou' },
  '54526': { taux: 29.65, nom: 'Tomblaine' },
  '54323': { taux: 29.65, nom: 'Jarville-la-Malgrange' },
  '54431': { taux: 29.65, nom: 'Saint-Max' },
  '54344': { taux: 29.65, nom: 'Malzéville' },
  '54304': { taux: 29.65, nom: 'Heillecourt' },
  '54329': { taux: 29.65, nom: 'Ludres' },
  '54318': { taux: 29.65, nom: 'Essey-lès-Nancy' },
  '54366': { taux: 30.20, nom: 'Longwy' },
  '54528': { taux: 29.80, nom: 'Toul' },
  '54300': { taux: 29.65, nom: 'Lunéville' },
  '54463': { taux: 29.65, nom: 'Villers-lès-Nancy' },

  // -- 55 Meuse --
  '55029': { taux: 27.80, nom: 'Bar-le-Duc' },
  '55545': { taux: 28.50, nom: 'Verdun' },

  // -- 56 Morbihan --
  '56121': { taux: 24.71, nom: 'Lorient' },
  '56260': { taux: 23.73, nom: 'Vannes' },
  '56083': { taux: 28.50, nom: 'Hennebont' },
  '56101': { taux: 28.50, nom: 'Lanester' },
  '56178': { taux: 27.80, nom: 'Pontivy' },
  '56186': { taux: 28.80, nom: 'Auray' },
  '56070': { taux: 27.50, nom: 'Guidel' },
  '56098': { taux: 28.50, nom: 'Ploemeur' },
  '56253': { taux: 26.80, nom: 'Séné' },
  '56234': { taux: 26.80, nom: 'Saint-Avé' },

  // -- 57 Moselle (Metz Métropole ~25.94 %) --
  '57463': { taux: 25.94, nom: 'Metz' },
  '57672': { taux: 25.34, nom: 'Thionville' },
  '57631': { taux: 29.20, nom: 'Sarreguemines' },
  '57606': { taux: 28.80, nom: 'Saint-Avold' },
  '57227': { taux: 29.50, nom: 'Forbach' },
  '57160': { taux: 28.30, nom: 'Creutzwald' },
  '57306': { taux: 28.60, nom: 'Hayange' },
  '57036': { taux: 25.94, nom: 'Woippy' },
  '57039': { taux: 25.94, nom: 'Montigny-lès-Metz' },
  '57019': { taux: 25.94, nom: 'Marly' },
  '57049': { taux: 25.94, nom: 'Le Ban-Saint-Martin' },
  '57433': { taux: 29.00, nom: 'Maizières-lès-Metz' },
  '57256': { taux: 28.70, nom: 'Freyming-Merlebach' },
  '57682': { taux: 28.40, nom: 'Yutz' },
  '57220': { taux: 29.10, nom: 'Fameck' },

  // -- 58 Nièvre --
  '58194': { taux: 28.80, nom: 'Nevers' },
  '58086': { taux: 29.50, nom: 'Cosne-Cours-sur-Loire' },

  // -- 59 Nord (MEL Lille ~33.61 %) --
  '59350': { taux: 33.61, nom: 'Lille' },
  '59512': { taux: 33.61, nom: 'Roubaix' },
  '59599': { taux: 33.61, nom: 'Tourcoing' },
  '59009': { taux: 33.61, nom: 'Villeneuve-d\'Ascq' },
  '59378': { taux: 33.61, nom: 'Marcq-en-Baroeul' },
  '59178': { taux: 34.94, nom: 'Dunkerque' },
  '59606': { taux: 31.02, nom: 'Valenciennes' },
  '59392': { taux: 31.20, nom: 'Maubeuge' },
  '59122': { taux: 30.60, nom: 'Cambrai' },
  '59017': { taux: 31.50, nom: 'Armentières' },
  '59196': { taux: 29.68, nom: 'Douai' },
  '59183': { taux: 31.80, nom: 'Denain' },
  '59056': { taux: 33.61, nom: 'Mons-en-Barœul' },
  '59560': { taux: 33.61, nom: 'Hem' },
  '59299': { taux: 33.61, nom: 'Lambersart' },
  '59346': { taux: 33.61, nom: 'La Madeleine' },
  '59360': { taux: 33.61, nom: 'Lomme' },
  '59256': { taux: 33.61, nom: 'Halluin' },
  '59410': { taux: 33.61, nom: 'Mouvaux' },
  '59527': { taux: 33.61, nom: 'Saint-André-lez-Lille' },
  '59368': { taux: 33.61, nom: 'Loos' },
  '59640': { taux: 33.61, nom: 'Wattrelos' },
  '59359': { taux: 33.61, nom: 'Lys-lez-Lannoy' },
  '59163': { taux: 33.61, nom: 'Croix' },
  '59653': { taux: 33.61, nom: 'Wasquehal' },
  '59386': { taux: 33.61, nom: 'Marquette-lez-Lille' },
  '59286': { taux: 33.61, nom: 'Seclin' },
  '59090': { taux: 33.61, nom: 'Bondues' },
  '59343': { taux: 33.61, nom: 'Faches-Thumesnil' },
  '59152': { taux: 33.61, nom: 'Comines' },
  '59250': { taux: 30.40, nom: 'Grande-Synthe' },
  '59005': { taux: 31.10, nom: 'Anzin' },
  '59553': { taux: 30.90, nom: 'Sin-le-Noble' },
  '59043': { taux: 30.70, nom: 'Aulnoye-Aymeries' },
  '59172': { taux: 31.30, nom: 'Coudekerque-Branche' },
  '59328': { taux: 30.60, nom: 'Lys-lez-Lannoy' },
  '59139': { taux: 31.40, nom: 'Condé-sur-l\'Escaut' },

  // -- 60 Oise --
  '60057': { taux: 25.4, nom: 'Beauvais' },
  '60159': { taux: 26.16, nom: 'Compiègne' },
  '60157': { taux: 28.30, nom: 'Creil' },
  '60471': { taux: 26.80, nom: 'Nogent-sur-Oise' },
  '60612': { taux: 26.20, nom: 'Senlis' },
  '60139': { taux: 27.50, nom: 'Chantilly' },
  '60428': { taux: 27.80, nom: 'Méru' },
  '60223': { taux: 27.00, nom: 'Clermont' },

  // -- 61 Orne --
  '61001': { taux: 27.20, nom: 'Alençon' },
  '61169': { taux: 27.80, nom: 'Flers' },
  '61006': { taux: 28.30, nom: 'Argentan' },

  // -- 62 Pas-de-Calais --
  '62041': { taux: 30.58, nom: 'Arras' },
  '62119': { taux: 33.62, nom: 'Boulogne-sur-Mer' },
  '62160': { taux: 30.75, nom: 'Calais' },
  '62498': { taux: 30.50, nom: 'Lens' },
  '62510': { taux: 31.00, nom: 'Liévin' },
  '62321': { taux: 30.30, nom: 'Hénin-Beaumont' },
  '62108': { taux: 30.60, nom: 'Béthune' },
  '62427': { taux: 30.90, nom: 'Saint-Omer' },
  '62193': { taux: 31.20, nom: 'Carvin' },
  '62065': { taux: 30.40, nom: 'Avion' },
  '62178': { taux: 31.50, nom: 'Bruay-la-Buissière' },
  '62304': { taux: 30.80, nom: 'Harnes' },
  '62386': { taux: 31.30, nom: 'Étaples' },
  '62570': { taux: 30.70, nom: 'Marck' },
  '62617': { taux: 31.10, nom: 'Outreau' },
  '62620': { taux: 30.50, nom: 'Noeux-les-Mines' },

  // ══════════════════════════════════════════════════════════════════════════════
  // ── DÉPARTEMENTS 63 à 76 ────────────────────────────────────────────────────
  // ══════════════════════════════════════════════════════════════════════════════
  // -- 63 Puy-de-Dôme (Clermont Auvergne Métropole ~27.14 %) --
  '63113': { taux: 27.16, nom: 'Clermont-Ferrand' },
  '63019': { taux: 27.14, nom: 'Aubière' },
  '63069': { taux: 27.14, nom: 'Chamalières' },
  '63284': { taux: 27.14, nom: 'Beaumont' },
  '63164': { taux: 27.14, nom: 'Gerzat' },
  '63124': { taux: 27.14, nom: 'Cournon-d\'Auvergne' },
  '63300': { taux: 27.14, nom: 'Le Cendre' },
  '63178': { taux: 28.50, nom: 'Issoire' },
  '63430': { taux: 27.80, nom: 'Thiers' },
  '63263': { taux: 27.14, nom: 'Pont-du-Château' },
  '63345': { taux: 27.14, nom: 'Riom' },
  '63014': { taux: 27.60, nom: 'Ambert' },
  '63116': { taux: 27.14, nom: 'Cébazat' },

  // -- 64 Pyrénées-Atlantiques --
  '64445': { taux: 32.63, nom: 'Pau' },
  '64102': { taux: 28.49, nom: 'Bayonne' },
  '64122': { taux: 28.80, nom: 'Biarritz' },
  '64024': { taux: 28.49, nom: 'Anglet' },
  '64300': { taux: 27.20, nom: 'Lons' },
  '64160': { taux: 29.20, nom: 'Hendaye' },
  '64483': { taux: 29.30, nom: 'Saint-Jean-de-Luz' },
  '64230': { taux: 26.40, nom: 'Jurançon' },
  '64130': { taux: 26.40, nom: 'Billère' },
  '64422': { taux: 27.80, nom: 'Orthez' },
  '64378': { taux: 28.10, nom: 'Oloron-Sainte-Marie' },
  '64548': { taux: 29.50, nom: 'Urrugne' },

  // -- 65 Hautes-Pyrénées --
  '65440': { taux: 33.94, nom: 'Tarbes' },
  '65286': { taux: 29.50, nom: 'Lourdes' },
  '65025': { taux: 29.20, nom: 'Bagnères-de-Bigorre' },

  // -- 66 Pyrénées-Orientales (Perpignan Métropole ~34.59 %) --
  '66037': { taux: 34.59, nom: 'Canet-en-Roussillon' },
  '66150': { taux: 34.59, nom: 'Saint-Estève' },
  '66027': { taux: 34.59, nom: 'Cabestany' },
  '66136': { taux: 34.59, nom: 'Perpignan' },
  '66016': { taux: 34.80, nom: 'Argelès-sur-Mer' },
  '66048': { taux: 34.59, nom: 'Toulouges' },
  '66189': { taux: 34.59, nom: 'Rivesaltes' },
  '66165': { taux: 34.59, nom: 'Pia' },
  '66025': { taux: 34.50, nom: 'Céret' },
  '66213': { taux: 34.80, nom: 'Le Barcarès' },
  '66152': { taux: 34.59, nom: 'Saint-Laurent-de-la-Salanque' },

  // -- 67 Bas-Rhin (Eurométropole de Strasbourg ~26.83 %) --
  '67482': { taux: 26.83, nom: 'Strasbourg' },
  '67300': { taux: 26.83, nom: 'Schiltigheim' },
  '67218': { taux: 26.83, nom: 'Illkirch-Graffenstaden' },
  '67137': { taux: 26.83, nom: 'Lingolsheim' },
  '67180': { taux: 26.83, nom: 'Hoenheim' },
  '67462': { taux: 26.83, nom: 'Bischheim' },
  '67447': { taux: 26.83, nom: 'Ostwald' },
  '67365': { taux: 27.50, nom: 'Haguenau' },
  '67519': { taux: 26.83, nom: 'La Wantzenau' },
  '67152': { taux: 26.83, nom: 'Geispolsheim' },
  '67411': { taux: 27.80, nom: 'Obernai' },
  '67348': { taux: 27.30, nom: 'Sélestat' },
  '67125': { taux: 27.60, nom: 'Erstein' },
  '67437': { taux: 26.83, nom: 'Souffelweyersheim' },
  '67306': { taux: 26.83, nom: 'Mundolsheim' },
  '67372': { taux: 27.10, nom: 'Molsheim' },
  '67368': { taux: 27.40, nom: 'Saverne' },

  // -- 68 Haut-Rhin --
  '68224': { taux: 26.36, nom: 'Mulhouse' },
  '68066': { taux: 25.0, nom: 'Colmar' },
  '68297': { taux: 29.03, nom: 'Saint-Louis' },
  '68093': { taux: 26.36, nom: 'Guebwiller' },
  '68338': { taux: 26.36, nom: 'Wittenheim' },
  '68166': { taux: 26.36, nom: 'Kingersheim' },
  '68277': { taux: 26.36, nom: 'Rixheim' },
  '68334': { taux: 26.36, nom: 'Wittelsheim' },
  '68056': { taux: 26.20, nom: 'Wintzenheim' },
  '68195': { taux: 26.36, nom: 'Illzach' },
  '68218': { taux: 26.20, nom: 'Ingersheim' },
  '68182': { taux: 27.00, nom: 'Thann' },
  '68321': { taux: 27.50, nom: 'Cernay' },

  // -- 69 Rhône (hors Métropole de Lyon, déjà listée) --
  '69243': { taux: 28.50, nom: 'Tarare' },
  '69264': { taux: 29.10, nom: 'Villefranche-sur-Saône' },
  '69027': { taux: 28.80, nom: 'Belleville-en-Beaujolais' },
  '69283': { taux: 28.40, nom: 'Thizy-les-Bourgs' },
  '69033': { taux: 27.90, nom: 'Brignais' },
  '69044': { taux: 28.20, nom: 'L\'Arbresle' },

  // -- 70 Haute-Saône --
  '70550': { taux: 27.80, nom: 'Vesoul' },
  '70311': { taux: 28.50, nom: 'Lure' },
  '70285': { taux: 28.20, nom: 'Héricourt' },

  // -- 71 Saône-et-Loire --
  '71076': { taux: 25.54, nom: 'Chalon-sur-Saône' },
  '71270': { taux: 27.80, nom: 'Mâcon' },
  '71153': { taux: 28.60, nom: 'Le Creusot' },
  '71388': { taux: 28.50, nom: 'Autun' },
  '71328': { taux: 28.80, nom: 'Montceau-les-Mines' },
  '71014': { taux: 27.80, nom: 'Charnay-lès-Mâcon' },

  // -- 72 Sarthe (Le Mans Métropole ~27.41 %) --
  '72181': { taux: 27.41, nom: 'Le Mans' },
  '72007': { taux: 27.41, nom: 'Allonnes' },
  '72154': { taux: 27.41, nom: 'Coulaines' },
  '72143': { taux: 28.30, nom: 'La Flèche' },
  '72264': { taux: 28.50, nom: 'Sablé-sur-Sarthe' },
  '72180': { taux: 27.41, nom: 'Arnage' },
  '72328': { taux: 27.41, nom: 'Mulsanne' },

  // -- 73 Savoie --
  '73065': { taux: 27.7, nom: 'Chambéry' },
  '73011': { taux: 27.20, nom: 'Aix-les-Bains' },
  '73008': { taux: 28.50, nom: 'Albertville' },
  '73248': { taux: 26.50, nom: 'La Motte-Servolex' },
  '73157': { taux: 28.80, nom: 'Saint-Jean-de-Maurienne' },
  '73034': { taux: 26.80, nom: 'Cognin' },

  // -- 74 Haute-Savoie --
  '74010': { taux: 23.95, nom: 'Annecy' },
  '74012': { taux: 25.50, nom: 'Annemasse' },
  '74281': { taux: 25.20, nom: 'Thonon-les-Bains' },
  '74093': { taux: 25.30, nom: 'Cluses' },
  '74256': { taux: 24.90, nom: 'Sallanches' },
  '74243': { taux: 25.80, nom: 'Rumilly' },
  '74112': { taux: 25.60, nom: 'Cran-Gevrier' },
  '74225': { taux: 25.40, nom: 'La Roche-sur-Foron' },
  '74042': { taux: 25.10, nom: 'Bonneville' },
  '74164': { taux: 25.70, nom: 'Gaillard' },
  '74182': { taux: 24.80, nom: 'Meythet' },
  '74305': { taux: 24.80, nom: 'Seynod' },
  '74019': { taux: 24.80, nom: 'Annecy-le-Vieux' },

  // -- 76 Seine-Maritime (Rouen Métropole ~26.50 %) --
  '76540': { taux: 26.50, nom: 'Rouen' },
  '76351': { taux: 26.66, nom: 'Le Havre' },
  '76618': { taux: 26.50, nom: 'Sotteville-lès-Rouen' },
  '76322': { taux: 26.50, nom: 'Le Grand-Quevilly' },
  '76484': { taux: 26.50, nom: 'Le Petit-Quevilly' },
  '76681': { taux: 26.50, nom: 'Saint-Étienne-du-Rouvray' },
  '76474': { taux: 26.50, nom: 'Mont-Saint-Aignan' },
  '76157': { taux: 26.50, nom: 'Canteleu' },
  '76178': { taux: 26.50, nom: 'Darnétal' },
  '76108': { taux: 26.50, nom: 'Bois-Guillaume' },
  '76116': { taux: 26.50, nom: 'Bonsecours' },
  '76231': { taux: 27.80, nom: 'Fécamp' },
  '76217': { taux: 28.30, nom: 'Dieppe' },
  '76257': { taux: 27.50, nom: 'Elbeuf' },
  '76275': { taux: 25.32, nom: 'Gonfreville-l\'Orcher' },
  '76366': { taux: 25.32, nom: 'Harfleur' },
  '76476': { taux: 25.32, nom: 'Montivilliers' },
  '76561': { taux: 25.32, nom: 'Sainte-Adresse' },
  '76475': { taux: 25.32, nom: 'Octeville-sur-Mer' },

  // ══════════════════════════════════════════════════════════════════════════════
  // ── DÉPARTEMENTS 77 à 95 (restants) ────────────────────────────────────────
  // ══════════════════════════════════════════════════════════════════════════════
  // -- 79 Deux-Sèvres --
  '79191': { taux: 26.26, nom: 'Niort' },
  '79049': { taux: 27.50, nom: 'Bressuire' },
  '79271': { taux: 27.80, nom: 'Thouars' },
  '79200': { taux: 27.30, nom: 'Parthenay' },

  // -- 80 Somme (Amiens Métropole ~25.83 %) --
  '80021': { taux: 25.83, nom: 'Amiens' },
  '80001': { taux: 27.50, nom: 'Abbeville' },
  '80016': { taux: 25.83, nom: 'Longueau' },
  '80139': { taux: 25.83, nom: 'Camon' },
  '80706': { taux: 25.83, nom: 'Rivery' },
  '80561': { taux: 26.80, nom: 'Albert' },

  // -- 81 Tarn --
  '81004': { taux: 37.51, nom: 'Albi' },
  '81065': { taux: 34.99, nom: 'Castres' },
  '81140': { taux: 29.50, nom: 'Mazamet' },
  '81099': { taux: 28.80, nom: 'Gaillac' },
  '81105': { taux: 29.00, nom: 'Graulhet' },

  // -- 82 Tarn-et-Garonne --
  '82121': { taux: 33.32, nom: 'Montauban' },
  '82033': { taux: 30.20, nom: 'Castelsarrasin' },
  '82108': { taux: 29.80, nom: 'Moissac' },

  // -- 83 Var (Toulon Provence Méditerranée ~35.89 %) --
  '83137': { taux: 35.89, nom: 'Toulon' },
  '83050': { taux: 28.46, nom: 'Fréjus' },
  '83061': { taux: 35.89, nom: 'Hyères' },
  '83023': { taux: 35.89, nom: 'La Seyne-sur-Mer' },
  '83069': { taux: 28.3, nom: 'Draguignan' },
  '83129': { taux: 34.30, nom: 'Six-Fours-les-Plages' },
  '83007': { taux: 35.89, nom: 'Brignoles' },
  '83120': { taux: 34.60, nom: 'Saint-Raphaël' },
  '83098': { taux: 35.89, nom: 'La Garde' },
  '83047': { taux: 35.89, nom: 'La Valette-du-Var' },
  '83107': { taux: 35.89, nom: 'Ollioules' },
  '83126': { taux: 34.70, nom: 'Sainte-Maxime' },
  '83153': { taux: 34.40, nom: 'Le Muy' },
  '83004': { taux: 34.00, nom: 'Bandol' },
  '83013': { taux: 33.80, nom: 'Le Luc' },
  '83054': { taux: 35.89, nom: 'La Crau' },
  '83090': { taux: 35.89, nom: 'Le Pradet' },
  '83118': { taux: 35.89, nom: 'Le Revest-les-Eaux' },

  // -- 84 Vaucluse --
  '84007': { taux: 37.42, nom: 'Avignon' },
  '84031': { taux: 36.50, nom: 'Carpentras' },
  '84035': { taux: 36.80, nom: 'Cavaillon' },
  '84054': { taux: 37.00, nom: 'L\'Isle-sur-la-Sorgue' },
  '84080': { taux: 36.70, nom: 'Orange' },
  '84089': { taux: 37.20, nom: 'Pertuis' },
  '84019': { taux: 36.40, nom: 'Bollène' },
  '84092': { taux: 37.42, nom: 'Le Pontet' },
  '84101': { taux: 36.60, nom: 'Sorgues' },
  '84129': { taux: 37.10, nom: 'Vedène' },
  '84137': { taux: 36.90, nom: 'Monteux' },
  '84143': { taux: 37.42, nom: 'Entraigues-sur-la-Sorgue' },

  // -- 85 Vendée --
  '85191': { taux: 28.16, nom: 'La Roche-sur-Yon' },
  '85109': { taux: 26.80, nom: 'Les Sables-d\'Olonne' },
  '85065': { taux: 27.50, nom: 'Challans' },
  '85092': { taux: 27.80, nom: 'Fontenay-le-Comte' },
  '85146': { taux: 27.20, nom: 'Luçon' },
  '85084': { taux: 28.16, nom: 'La Roche-sur-Yon' },
  '85121': { taux: 26.60, nom: 'Les Herbiers' },
  '85166': { taux: 27.00, nom: 'Montaigu-Vendée' },

  // -- 86 Vienne --
  '86194': { taux: 26.01, nom: 'Poitiers' },
  '86066': { taux: 27.50, nom: 'Châtellerault' },
  '86062': { taux: 26.01, nom: 'Buxerolles' },
  '86115': { taux: 26.01, nom: 'Migné-Auxances' },
  '86214': { taux: 26.01, nom: 'Saint-Benoît' },
  '86165': { taux: 27.20, nom: 'Loudun' },

  // -- 87 Haute-Vienne (Limoges Métropole ~26.40 %) --
  '87085': { taux: 26.40, nom: 'Limoges' },
  '87118': { taux: 27.50, nom: 'Panazol' },
  '87050': { taux: 26.40, nom: 'Couzeix' },
  '87075': { taux: 26.40, nom: 'Isle' },
  '87178': { taux: 26.40, nom: 'Le Palais-sur-Vienne' },
  '87126': { taux: 26.40, nom: 'Rilhac-Rancon' },
  '87133': { taux: 27.80, nom: 'Saint-Junien' },

  // -- 88 Vosges --
  '88160': { taux: 27.50, nom: 'Épinal' },
  '88413': { taux: 28.20, nom: 'Saint-Dié-des-Vosges' },
  '88249': { taux: 28.50, nom: 'Gérardmer' },
  '88383': { taux: 27.80, nom: 'Remiremont' },
  '88321': { taux: 28.00, nom: 'Neufchâteau' },

  // -- 89 Yonne --
  '89024': { taux: 27.50, nom: 'Auxerre' },
  '89387': { taux: 28.20, nom: 'Sens' },
  '89206': { taux: 28.50, nom: 'Joigny' },
  '89013': { taux: 27.80, nom: 'Avallon' },

  // -- 90 Territoire de Belfort --
  '90010': { taux: 30.85, nom: 'Belfort' },
  '90029': { taux: 28.60, nom: 'Delle' },
  '90068': { taux: 28.60, nom: 'Offemont' },
  '90013': { taux: 28.60, nom: 'Beaucourt' },
  '90009': { taux: 28.60, nom: 'Bavilliers' },

  // ══════════════════════════════════════════════════════════════════════════════
  // ── COMMUNES COMPLÉMENTAIRES ───────────────────────────────────────────────
  // ══════════════════════════════════════════════════════════════════════════════
  // -- Communes supplémentaires IDF --
  '77437': { taux: 25.20, nom: 'Serris' },
  '77438': { taux: 24.60, nom: 'Marne-la-Vallée' },
  '77347': { taux: 24.80, nom: 'Champs-sur-Marne' },
  '77108': { taux: 25.40, nom: 'Avon' },

  // -- Communes supplémentaires Nord/Pas-de-Calais --
  '59013': { taux: 30.50, nom: 'Hazebrouck' },
  '59044': { taux: 31.80, nom: 'Bailleul' },
  '59524': { taux: 33.61, nom: 'Wambrechies' },
  '59208': { taux: 33.61, nom: 'Englos' },
  '62893': { taux: 30.80, nom: 'Wingles' },

  // -- Communes supplémentaires Provence --
  '83052': { taux: 33.90, nom: 'Le Lavandou' },
  '83049': { taux: 34.10, nom: 'Cogolin' },
  '83093': { taux: 35.10, nom: 'La Londe-les-Maures' },
  '84003': { taux: 36.30, nom: 'Apt' },

  // -- Communes supplémentaires Occitanie --
  '34344': { taux: 35.40, nom: 'Marseillan' },
  '34199': { taux: 35.40, nom: 'Pézenas' },
  '30133': { taux: 33.70, nom: 'Marguerittes' },
  '30047': { taux: 33.40, nom: 'Bouillargues' },
  '11170': { taux: 30.70, nom: 'Lézignan-Corbières' },
  '66011': { taux: 34.60, nom: 'Thuir' },

  // -- Communes supplémentaires Nouvelle-Aquitaine --
  '33032': { taux: 31.20, nom: 'Biganos' },
  '33114': { taux: 32.10, nom: 'Cestas' },
  '24430': { taux: 28.50, nom: 'Terrasson-Lavilledieu' },
  '16113': { taux: 27.80, nom: 'Gond-Pontouvre' },
  '87154': { taux: 27.20, nom: 'Saint-Yrieix-la-Perche' },

  // -- Communes supplémentaires Auvergne-Rhône-Alpes --
  '38364': { taux: 31.20, nom: 'L\'Isle-d\'Abeau' },
  '01262': { taux: 25.60, nom: 'Meximieux' },
  '42003': { taux: 29.67, nom: 'Andrézieux-Bouthéon' },
  '26115': { taux: 26.20, nom: 'Crest' },
  '73181': { taux: 27.80, nom: 'La Ravoire' },

  // -- Communes supplémentaires Grand Est --
  '67084': { taux: 27.20, nom: 'Bischwiller' },
  '67118': { taux: 26.83, nom: 'Eckbolsheim' },
  '68135': { taux: 26.50, nom: 'Huningue' },
  '51649': { taux: 24.80, nom: 'Witry-lès-Reims' },
  '54135': { taux: 29.65, nom: 'Champigneulles' },
  '57480': { taux: 25.94, nom: 'Longeville-lès-Metz' },

  // -- Communes supplémentaires Bretagne --
  '22016': { taux: 27.30, nom: 'Loudéac' },
  '29169': { taux: 29.96, nom: 'Le Relecq-Kerhuon' },

  // -- Communes supplémentaires Normandie --
  '50453': { taux: 27.30, nom: 'Tourlaville' },
  '14654': { taux: 25.71, nom: 'Colombelles' },
  '76402': { taux: 26.50, nom: 'Maromme' },
  '27015': { taux: 25.80, nom: 'Les Andelys' },

  // -- DOM-TOM --
  '97209': { taux: 23.35, nom: 'Fort-de-France' },
  '97213': { taux: 23.35, nom: 'Le Lamentin' },
  '97422': { taux: 22.76, nom: 'Le Tampon' },
  '97100': { taux: 24.94, nom: 'Les Abymes' },
  '97701': { taux: 27.60, nom: 'Saint-André' },
  '97416': { taux: 29.03, nom: 'Saint-Pierre' },
  '94022': { taux: 33.78, nom: 'Choisy-le-Roi' },

}

import type {
  AdminAbonnement,
  AdminCampagneModeration,
  AdminDiocese,
  AdminKpis,
  AdminParish,
  AdminPublicationModeration,
  AdminTicket,
  AdminTransaction,
  AdminUser,
  AuditLog,
  ChartPoint,
  DashboardData,
  ParishDetail,
  TicketDetail,
  TransactionDetail,
  TransactionSynthese,
  UserDetail,
  UserStatut,
} from '../../mockAdminApi/data';

export interface ApiAdminDashboard {
  statistiques: {
    paroisses: { total: number; en_attente: number; validees: number; suspendues: number };
    fideles: { total: number; actifs: number };
    demandes: { total: number; en_attente: number; confirmees: number };
    montant_collecte: number | string;
    croissance_mensuelle?: number;
    tickets_ouverts: number;
  };
  activites?: {
    id: string;
    date: string;
    action: string;
    utilisateur: string;
    type: string;
  }[];
  graphiques?: {
    revenus_mensuels?: { label: string; value: number }[];
    inscriptions_mensuelles?: { label: string; value: number }[];
  };
}

export interface ApiAdminFidele {
  id: number | string;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string | null;
  ville?: string | null;
  actif: boolean;
  demandes_count?: number;
  created_at?: string;
  favoris?: string[];
  demandes?: {
    reference: string;
    paroisse: string;
    montant: number;
    date?: string | null;
    statut: string;
  }[];
  paiements?: ApiAdminPaiement[];
  connexions?: { date: string; ip: string; appareil: string }[];
}

export interface ApiAdminParoisse {
  id: number | string;
  nom: string;
  ville?: string | null;
  email?: string | null;
  telephone?: string | null;
  adresse?: string | null;
  description?: string | null;
  logo?: string | null;
  banniere?: string | null;
  statut: string;
  actif?: boolean;
  demandes_count?: number;
  favoris_count?: number;
  montant_collecte?: number;
  diocese?: { nom?: string } | null;
  user_paroisses?: { nom?: string; prenom?: string; email?: string }[];
  created_at?: string;
  galerie?: string[];
  demandes?: {
    reference: string;
    fidele: string;
    montant: number;
    date?: string | null;
    statut?: string;
  }[];
  paiements?: ApiAdminPaiement[];
  campagnes?: { titre: string; objectif: number; collecte: number }[];
  publications?: { titre: string; date?: string | null }[];
  historique?: { date: string; action: string; auteur: string }[];
}

function toUserStatut(actif: boolean): UserStatut {
  return actif ? 'actif' : 'suspendu';
}

export function mapAdminDashboard(
  stats: ApiAdminDashboard['statistiques'],
  activites?: ApiAdminDashboard['activites'],
  graphiques?: ApiAdminDashboard['graphiques'],
): DashboardData {
  const kpis: AdminKpis = {
    utilisateurs: stats.fideles.total,
    paroisses: stats.paroisses.total,
    demandesMesses: stats.demandes.total,
    montantTotal: Number(stats.montant_collecte),
    croissanceMensuelle: Number(stats.croissance_mensuelle ?? 0),
    ticketsOuverts: stats.tickets_ouverts,
  };

  const chartFrom = (label: string, value: number): ChartPoint[] => [{ label, value }];
  const revenusChart = graphiques?.revenus_mensuels?.length
    ? graphiques.revenus_mensuels.map((p) => ({ label: p.label, value: Number(p.value) }))
    : chartFrom('Collecté (FCFA)', Number(stats.montant_collecte));
  const inscriptionsChart = graphiques?.inscriptions_mensuelles?.length
    ? graphiques.inscriptions_mensuelles.map((p) => ({ label: p.label, value: Number(p.value) }))
    : [
        { label: 'Actifs', value: stats.fideles.actifs },
        { label: 'Total', value: stats.fideles.total },
      ];

  return {
    kpis,
    inscriptionsChart,
    revenusChart,
    demandesChart: [
      { label: 'En attente', value: stats.demandes.en_attente },
      { label: 'Confirmées', value: stats.demandes.confirmees },
      { label: 'Total', value: stats.demandes.total },
    ],
    paroissesChart: [
      { label: 'Validées', value: stats.paroisses.validees },
      { label: 'En attente', value: stats.paroisses.en_attente },
      { label: 'Suspendues', value: stats.paroisses.suspendues },
    ],
    activites: (activites ?? []).map((a) => ({
      id: String(a.id),
      date: a.date,
      action: a.action,
      utilisateur: a.utilisateur,
      type: a.type,
    })),
    annonces: [],
    campagnes: [],
  };
}

export function mapAdminUser(api: ApiAdminFidele): AdminUser {
  return {
    id: String(api.id),
    nom: api.nom,
    prenom: api.prenom,
    telephone: api.telephone ?? '',
    email: api.email,
    ville: api.ville ?? '',
    dateInscription: api.created_at?.slice(0, 10) ?? '',
    nombreDemandes: api.demandes_count ?? 0,
    statut: toUserStatut(api.actif),
    favoris: api.favoris ?? [],
  };
}

function mapMethodePaiement(type?: string | null): string {
  if (!type) return '—';
  const labels: Record<string, string> = {
    orange_money: 'Orange Money',
    moov_money: 'Moov Money',
    wave: 'Wave',
    especes: 'Espèces',
  };
  return labels[type] ?? type.replace(/_/g, ' ');
}

export function mapAdminUserDetail(api: ApiAdminFidele): UserDetail {
  const base = mapAdminUser(api);

  return {
    ...base,
    demandes: (api.demandes ?? []).map((d) => ({
      reference: d.reference,
      paroisse: d.paroisse,
      montant: Number(d.montant),
      date: d.date?.slice(0, 10) ?? '',
      statut: d.statut,
    })),
    paiements: (api.paiements ?? []).map((p) => ({
      reference: p.reference_interne,
      montant: Number(p.montant),
      methode: mapMethodePaiement(p.moyen_paiement?.type),
      date: (p.date_paiement ?? p.created_at ?? '').slice(0, 10),
      statut: p.statut,
    })),
    connexions: api.connexions ?? [],
  };
}

export function mapAdminParish(api: ApiAdminParoisse): AdminParish {
  const responsable = api.user_paroisses?.[0];
  const galerie = api.galerie?.length
    ? api.galerie
    : api.banniere
      ? [api.banniere]
      : [];

  return {
    id: String(api.id),
    nom: api.nom,
    ville: api.ville ?? '',
    diocese: api.diocese?.nom ?? '',
    dateInscription: api.created_at?.slice(0, 10) ?? '',
    nombreDemandes: api.demandes_count ?? 0,
    montantCollecte: Number(api.montant_collecte ?? 0),
    statut: api.statut as AdminParish['statut'],
    responsable: responsable ? `${responsable.prenom ?? ''} ${responsable.nom ?? ''}`.trim() : '—',
    email: api.email ?? '',
    telephone: api.telephone ?? '',
    adresse: api.adresse ?? '',
    description: api.description ?? '',
    photoProfil: api.logo ?? '',
    galerie,
  };
}

export function mapAdminParishDetail(api: ApiAdminParoisse): ParishDetail {
  const base = mapAdminParish(api);

  return {
    ...base,
    demandes: (api.demandes ?? []).map((d) => ({
      reference: d.reference,
      fidele: d.fidele,
      montant: Number(d.montant),
      date: d.date?.slice(0, 10) ?? '',
    })),
    paiements: (api.paiements ?? []).map((p) => ({
      reference: p.reference_interne,
      montant: Number(p.montant),
      methode: mapMethodePaiement(p.moyen_paiement?.type),
      date: (p.date_paiement ?? p.created_at ?? '').slice(0, 10),
    })),
    campagnes: (api.campagnes ?? []).map((c) => ({
      titre: c.titre,
      objectif: Number(c.objectif),
      collecte: Number(c.collecte),
    })),
    publications: (api.publications ?? []).map((p) => ({
      titre: p.titre,
      date: p.date?.slice(0, 10) ?? '',
    })),
    historique: (api.historique ?? []).map((h) => ({
      date: h.date,
      action: h.action,
      auteur: h.auteur,
    })),
  };
}

export interface ApiAdminTicket {
  id: number | string;
  sujet: string;
  message: string;
  reponse_admin?: string | null;
  reponse_admin_at?: string | null;
  statut: string;
  created_at?: string;
  paroisse?: { id?: string | number; nom?: string } | null;
  user_paroisse?: { nom?: string; prenom?: string; email?: string } | null;
}

export interface ApiAdminPaiement {
  id: number | string;
  reference_interne: string;
  montant: number | string;
  statut: string;
  statut_fournisseur?: string | null;
  reference_fournisseur?: string | null;
  telephone_payeur?: string | null;
  frais_techniques?: number | string | null;
  devise?: string | null;
  date_paiement?: string | null;
  date_expiration?: string | null;
  created_at?: string;
  moyen_paiement?: { type?: string } | null;
  demande_messe?: {
    id?: string | number;
    reference?: string;
    utilisateur?: { id?: string | number | null; nom?: string } | null;
    paroisse?: { id?: string | number; nom?: string } | null;
  } | null;
  campagne_collecte?: {
    id?: string | number;
    nom?: string;
    paroisse?: { id?: string | number; nom?: string } | null;
  } | null;
}

export interface ApiTransactionSynthese {
  total: number;
  montant_total: number;
  montant_reussi: number;
  reussis: number;
  en_attente: number;
  echoues: number;
}

function ticketReference(id: string | number): string {
  return `TKT-${String(id).slice(0, 8).toUpperCase()}`;
}

function mapTicketStatut(statut: string): AdminTicket['statut'] {
  if (statut === 'ferme') return 'resolu';
  return statut as AdminTicket['statut'];
}

export function mapAdminTicket(api: ApiAdminTicket): AdminTicket {
  const createur =
    api.paroisse?.nom ??
    (api.user_paroisse
      ? `${api.user_paroisse.prenom ?? ''} ${api.user_paroisse.nom ?? ''}`.trim()
      : 'Paroisse');

  return {
    id: String(api.id),
    reference: ticketReference(api.id),
    titre: api.sujet,
    categorie: 'Support',
    createur,
    createurType: 'paroisse',
    date: api.created_at ?? new Date().toISOString(),
    priorite: 'normale',
    statut: mapTicketStatut(api.statut),
  };
}

export function mapAdminTicketDetail(api: ApiAdminTicket): TicketDetail {
  const base = mapAdminTicket(api);
  const messages: TicketDetail['messages'] = [
    {
      auteur: base.createur,
      contenu: api.message,
      date: base.date,
      role: 'createur',
    },
  ];

  if (api.reponse_admin) {
    messages.push({
      auteur: 'Administration',
      contenu: api.reponse_admin,
      date: api.reponse_admin_at ?? base.date,
      role: 'admin',
    });
  }

  const historique: TicketDetail['historique'] = [{ date: base.date, action: 'Ticket créé' }];
  if (api.reponse_admin) {
    historique.push({
      date: api.reponse_admin_at ?? base.date,
      action: 'Réponse administrateur envoyée',
    });
  }

  return {
    ...base,
    description: api.message,
    messages,
    piecesJointes: [],
    historique,
  };
}

export function mapTransactionSynthese(api: ApiTransactionSynthese): TransactionSynthese {
  return {
    total: api.total,
    montantTotal: Number(api.montant_total),
    montantReussi: Number(api.montant_reussi),
    reussis: api.reussis,
    enAttente: api.en_attente,
    echoues: api.echoues,
  };
}

export function computeTransactionSynthese(transactions: AdminTransaction[]): TransactionSynthese {
  return {
    total: transactions.length,
    montantTotal: transactions.reduce((sum, t) => sum + t.montant, 0),
    montantReussi: transactions.filter((t) => t.statut === 'reussi').reduce((sum, t) => sum + t.montant, 0),
    reussis: transactions.filter((t) => t.statut === 'reussi').length,
    enAttente: transactions.filter((t) => t.statut === 'en_attente').length,
    echoues: transactions.filter((t) => t.statut === 'echoue').length,
  };
}

function resolveTransactionContext(api: ApiAdminPaiement): Pick<AdminTransaction, 'typePaiement' | 'libelleContexte'> {
  if (api.demande_messe) {
    return {
      typePaiement: 'intention',
      libelleContexte: api.demande_messe.reference ?? 'Intention de messe',
    };
  }
  if (api.campagne_collecte) {
    return {
      typePaiement: 'campagne',
      libelleContexte: api.campagne_collecte.nom ?? 'Campagne de collecte',
    };
  }
  return { typePaiement: 'autre', libelleContexte: '—' };
}

function buildTransactionJournal(api: ApiAdminPaiement, base: AdminTransaction): TransactionDetail['journal'] {
  const created = api.created_at ?? base.date;
  const journal: TransactionDetail['journal'] = [
    {
      date: created,
      etape: 'Création',
      detail: base.typePaiement === 'campagne'
        ? `Don pour « ${base.libelleContexte} »`
        : `Paiement lié à ${base.libelleContexte}`,
    },
  ];

  if (api.statut_fournisseur) {
    journal.push({
      date: api.date_paiement ?? created,
      etape: 'Opérateur',
      detail: `Statut fournisseur : ${api.statut_fournisseur}`,
    });
  }

  if (api.statut === 'en_attente' && api.date_expiration) {
    journal.push({
      date: api.date_expiration,
      etape: 'Expiration',
      detail: 'Délai de confirmation à respecter',
    });
  }

  if (api.date_paiement && api.statut === 'reussi') {
    journal.push({
      date: api.date_paiement,
      etape: 'Confirmé',
      detail: `Montant encaissé via ${base.methode}`,
    });
  }

  if (api.statut === 'echoue') {
    journal.push({
      date: api.date_paiement ?? created,
      etape: 'Échec',
      detail: api.statut_fournisseur ? `Refus : ${api.statut_fournisseur}` : 'Paiement non abouti',
    });
  }

  if (api.statut === 'rembourse') {
    journal.push({
      date: api.date_paiement ?? created,
      etape: 'Remboursement',
      detail: 'Montant remboursé au payeur',
    });
  }

  return journal;
}

export function mapAdminTransaction(api: ApiAdminPaiement): AdminTransaction {
  const paroisse =
    api.demande_messe?.paroisse ??
    api.campagne_collecte?.paroisse ??
    { id: '', nom: '—' };

  const utilisateur = api.demande_messe?.utilisateur ?? {
    id: '',
    nom: api.campagne_collecte ? 'Don campagne' : 'Anonyme',
  };

  const statutMap: Record<string, AdminTransaction['statut']> = {
    reussi: 'reussi',
    en_attente: 'en_attente',
    echoue: 'echoue',
    rembourse: 'rembourse',
  };

  const context = resolveTransactionContext(api);

  return {
    id: String(api.id),
    reference: api.reference_interne,
    date: api.date_paiement ?? api.created_at ?? new Date().toISOString(),
    montant: Number(api.montant),
    methode: mapMethodePaiement(api.moyen_paiement?.type),
    utilisateur: utilisateur.nom ?? 'Anonyme',
    utilisateurId: utilisateur.id != null ? String(utilisateur.id) : '',
    paroisse: paroisse.nom ?? '—',
    paroisseId: paroisse.id != null ? String(paroisse.id) : '',
    statut: statutMap[api.statut] ?? 'en_attente',
    ...context,
  };
}

export function mapAdminTransactionDetail(api: ApiAdminPaiement): TransactionDetail {
  const base = mapAdminTransaction(api);

  return {
    ...base,
    devise: api.devise ?? 'XOF',
    referenceFournisseur: api.reference_fournisseur ?? null,
    statutFournisseur: api.statut_fournisseur ?? null,
    telephonePayeur: api.telephone_payeur ?? null,
    fraisTechniques: Number(api.frais_techniques ?? 0),
    dateExpiration: api.date_expiration ?? null,
    journal: buildTransactionJournal(api, base),
  };
}

export interface ApiAdminDiocese {
  id: string;
  nom: string;
  ville?: string | null;
  pays?: string | null;
  description?: string | null;
  logo?: string | null;
  actif: boolean;
  paroisses_count?: number;
  created_at?: string;
}

export interface ApiAdminAbonnement {
  id: string;
  plan: string;
  montant: number | string;
  date_debut: string;
  date_fin?: string | null;
  statut: string;
  paroisse?: { id?: string; nom?: string } | null;
  created_at?: string;
}

export interface ApiAdminPublication {
  id: string;
  titre: string;
  contenu?: string;
  type?: string;
  visible: boolean;
  date_publication?: string | null;
  paroisse?: { id?: string; nom?: string } | null;
}

export interface ApiAdminCampagne {
  id: string;
  nom: string;
  description?: string | null;
  objectif_total?: number | string;
  montant_collecte?: number | string;
  date_fin?: string | null;
  paroisse?: { id?: string; nom?: string } | null;
}

export interface ApiJournalAuditEntry {
  id: string;
  action: string;
  details?: string | null;
  ip_address?: string | null;
  created_at?: string;
  acteur?: { id?: string; nom?: string; email?: string } | null;
}

function resolveAuditModule(action: string): string {
  if (action.startsWith('paroisse.')) return 'paroisses';
  if (action.startsWith('fidele.')) return 'utilisateurs';
  if (action.startsWith('ticket.')) return 'support';
  if (action.startsWith('publication.')) return 'moderation';
  if (action.startsWith('diocese.')) return 'dioceses';
  if (action.startsWith('abonnement.')) return 'abonnements';
  return 'admin';
}

function formatAuditAction(action: string): string {
  const labels: Record<string, string> = {
    'diocese.created': 'Diocèse créé',
    'diocese.updated': 'Diocèse mis à jour',
    'diocese.deleted': 'Diocèse supprimé',
    'abonnement.created': 'Abonnement créé',
    'abonnement.updated': 'Abonnement mis à jour',
    'paroisse.statut': 'Statut paroisse modifié',
    'paroisse.actif': 'État paroisse modifié',
    'fidele.actif': 'Compte fidèle modifié',
    'ticket.statut': 'Ticket support mis à jour',
    'publication.visible': 'Visibilité publication modifiée',
  };
  return labels[action] ?? action.replace(/[._]/g, ' ');
}

export function mapAdminDiocese(api: ApiAdminDiocese): AdminDiocese {
  return {
    id: String(api.id),
    nom: api.nom,
    ville: api.ville ?? '',
    pays: api.pays ?? '',
    description: api.description ?? '',
    logo: api.logo ?? '',
    actif: api.actif,
    paroissesCount: api.paroisses_count ?? 0,
    createdAt: api.created_at?.slice(0, 10) ?? '',
  };
}

export function mapAdminAbonnement(api: ApiAdminAbonnement): AdminAbonnement {
  return {
    id: String(api.id),
    plan: api.plan,
    montant: Number(api.montant),
    dateDebut: api.date_debut?.slice(0, 10) ?? '',
    dateFin: api.date_fin?.slice(0, 10) ?? null,
    statut: api.statut as AdminAbonnement['statut'],
    paroisseId: api.paroisse?.id ? String(api.paroisse.id) : '',
    paroisseNom: api.paroisse?.nom ?? '—',
  };
}

export function mapAdminPublicationModeration(api: ApiAdminPublication): AdminPublicationModeration {
  return {
    id: String(api.id),
    titre: api.titre,
    contenu: api.contenu ?? '',
    type: api.type ?? 'annonce',
    visible: api.visible,
    datePublication: api.date_publication?.slice(0, 10) ?? '',
    paroisseId: api.paroisse?.id ? String(api.paroisse.id) : '',
    paroisseNom: api.paroisse?.nom ?? '—',
  };
}

export function mapAdminCampagneModeration(api: ApiAdminCampagne): AdminCampagneModeration {
  return {
    id: String(api.id),
    nom: api.nom,
    description: api.description ?? '',
    objectif: Number(api.objectif_total ?? 0),
    collecte: Number(api.montant_collecte ?? 0),
    dateFin: api.date_fin?.slice(0, 10) ?? null,
    paroisseId: api.paroisse?.id ? String(api.paroisse.id) : '',
    paroisseNom: api.paroisse?.nom ?? '—',
  };
}

export function mapJournalAuditEntry(api: ApiJournalAuditEntry): AuditLog {
  return {
    id: String(api.id),
    date: api.created_at ?? new Date().toISOString(),
    utilisateur: api.acteur?.email ?? api.acteur?.nom ?? 'Admin',
    action: formatAuditAction(api.action),
    module: resolveAuditModule(api.action),
    ip: api.ip_address ?? '—',
  };
}


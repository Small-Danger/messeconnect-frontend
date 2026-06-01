import type {
  AdminAbonnement,
  AdminCampagneModeration,
  AdminDiocese,
  AdminParish,
  AdminPublicationModeration,
  AdminTicket,
  AdminTransaction,
  AdminUser,
  AuditLog,
  DashboardData,
  ParishDetail,
  SystemAnnonce,
  SystemCampagne,
  TicketDetail,
  TransactionDetail,
  TransactionSynthese,
  UserDetail,
} from './data';
import {
  MOCK_ACTIVITES,
  MOCK_ADMIN,
  MOCK_ANNONCES,
  MOCK_AUDIT_LOGS,
  MOCK_CAMPAGNES,
  MOCK_DEMANDES_CHART,
  MOCK_INSCRIPTIONS_CHART,
  MOCK_KPIS,
  MOCK_PARISHES,
  MOCK_PAROISSES_CHART,
  MOCK_REVENUS_CHART,
  MOCK_TICKETS,
  MOCK_TRANSACTIONS,
  MOCK_USERS,
} from './data';

const delay = (ms = 350) => new Promise((r) => setTimeout(r, ms));

let users = [...MOCK_USERS];
let parishes = [...MOCK_PARISHES];
let transactions = [...MOCK_TRANSACTIONS];
let tickets = [...MOCK_TICKETS];
let annonces = [...MOCK_ANNONCES];
let campagnes = [...MOCK_CAMPAGNES];
let auditLogs = [...MOCK_AUDIT_LOGS];

let dioceses: AdminDiocese[] = [
  { id: 'd1', nom: 'Ouagadougou', ville: 'Ouagadougou', pays: 'Burkina Faso', description: '', logo: '', actif: true, paroissesCount: 3, createdAt: '2024-01-01' },
  { id: 'd2', nom: 'Bobo-Dioulasso', ville: 'Bobo-Dioulasso', pays: 'Burkina Faso', description: '', logo: '', actif: true, paroissesCount: 1, createdAt: '2024-01-01' },
];

let abonnements: AdminAbonnement[] = [
  { id: 'ab1', plan: 'standard', montant: 15000, dateDebut: '2026-01-01', dateFin: null, statut: 'actif', paroisseId: 'p1', paroisseNom: 'Paroisse Saint Pierre' },
];

let publicationsModeration: AdminPublicationModeration[] = [
  { id: 'pub1', titre: 'Messe dominicale', contenu: 'Annonce paroissiale', type: 'annonce', visible: true, datePublication: '2026-05-25', paroisseId: 'p1', paroisseNom: 'Paroisse Saint Pierre' },
];

let campagnesModeration: AdminCampagneModeration[] = [
  { id: 'cm1', nom: 'Rénovation église', description: 'Campagne locale', objectif: 5000000, collecte: 2100000, dateFin: '2026-12-31', paroisseId: 'p1', paroisseNom: 'Paroisse Saint Pierre' },
];

export const adminMockApi = {
  async login(email: string, password: string) {
    await delay();
    if (email === MOCK_ADMIN.email && password === MOCK_ADMIN.password) {
      return { token: 'mock-admin-token', email };
    }
    throw new Error('Identifiants invalides');
  },

  async getDashboard(): Promise<DashboardData> {
    await delay();
    return {
      kpis: MOCK_KPIS,
      inscriptionsChart: MOCK_INSCRIPTIONS_CHART,
      revenusChart: MOCK_REVENUS_CHART,
      demandesChart: MOCK_DEMANDES_CHART,
      paroissesChart: MOCK_PAROISSES_CHART,
      activites: MOCK_ACTIVITES,
      annonces,
      campagnes,
    };
  },

  async getUsers(filters?: { q?: string; statut?: string }): Promise<AdminUser[]> {
    await delay();
    let result = [...users];
    if (filters?.q) {
      const q = filters.q.toLowerCase();
      result = result.filter(
        (u) =>
          u.nom.toLowerCase().includes(q) ||
          u.prenom.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.ville.toLowerCase().includes(q),
      );
    }
    if (filters?.statut && filters.statut !== 'tous') {
      result = result.filter((u) => u.statut === filters.statut);
    }
    return result;
  },

  async getUserDetail(id: string): Promise<UserDetail | null> {
    await delay();
    const user = users.find((u) => u.id === id);
    if (!user) return null;
    return {
      ...user,
      demandes: [
        { reference: 'DM-2026-0089', paroisse: 'Paroisse Saint Pierre', montant: 15000, date: '2026-05-28', statut: 'payee' },
        { reference: 'DM-2026-0076', paroisse: 'Paroisse Saint Joseph', montant: 30000, date: '2026-05-20', statut: 'confirmee' },
      ],
      paiements: transactions
        .filter((t) => t.utilisateurId === id)
        .map((t) => ({ reference: t.reference, montant: t.montant, methode: t.methode, date: t.date, statut: t.statut })),
      connexions: [
        { date: '2026-05-30T08:00:00', ip: '196.200.45.12', appareil: 'Chrome / Android' },
        { date: '2026-05-29T19:30:00', ip: '196.200.45.12', appareil: 'Safari / iPhone' },
        { date: '2026-05-28T07:15:00', ip: '102.89.34.56', appareil: 'Firefox / Windows' },
      ],
    };
  },

  async suspendUser(id: string, motif: string, duree: string) {
    await delay();
    users = users.map((u) => (u.id === id ? { ...u, statut: 'suspendu' as const } : u));
    auditLogs.unshift({
      id: `al-${Date.now()}`,
      date: new Date().toISOString(),
      utilisateur: MOCK_ADMIN.email,
      action: `Suspension utilisateur ${id} — ${motif} (${duree})`,
      module: 'utilisateurs',
      ip: '196.28.1.45',
    });
  },

  async reactivateUser(id: string) {
    await delay();
    users = users.map((u) => (u.id === id ? { ...u, statut: 'actif' as const } : u));
  },

  async getParishes(filters?: { q?: string; statut?: string }): Promise<AdminParish[]> {
    await delay();
    let result = [...parishes];
    if (filters?.q) {
      const q = filters.q.toLowerCase();
      result = result.filter(
        (p) =>
          p.nom.toLowerCase().includes(q) ||
          p.ville.toLowerCase().includes(q) ||
          p.diocese.toLowerCase().includes(q),
      );
    }
    if (filters?.statut && filters.statut !== 'tous') {
      result = result.filter((p) => p.statut === filters.statut);
    }
    return result;
  },

  async getParishDetail(id: string): Promise<ParishDetail | null> {
    await delay();
    const parish = parishes.find((p) => p.id === id);
    if (!parish) return null;
    return {
      ...parish,
      galerie: [
        'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Ouagadougou_Cathedral.jpg/320px-Ouagadougou_Cathedral.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Koudougou_market.jpg/320px-Koudougou_market.jpg',
      ],
      demandes: [
        { reference: 'DM-2026-0089', fidele: 'Marie Ouédraogo', montant: 15000, date: '2026-05-28' },
        { reference: 'DM-2026-0085', fidele: 'Fatou Sawadogo', montant: 25000, date: '2026-05-25' },
      ],
      paiements: transactions
        .filter((t) => t.paroisseId === id)
        .slice(0, 5)
        .map((t) => ({ reference: t.reference, montant: t.montant, methode: t.methode, date: t.date })),
      campagnes: [{ titre: 'Rénovation église', objectif: 5000000, collecte: 2100000 }],
      publications: [{ titre: 'Messe dominicale', date: '2026-05-25' }],
      historique: [
        { date: '2024-08-15', action: 'Inscription', auteur: parish.responsable },
        { date: '2024-08-20', action: 'Validation', auteur: 'Admin Système' },
      ],
    };
  },

  async validateParish(id: string, action: 'valider' | 'refuser', commentaire: string) {
    await delay();
    parishes = parishes.map((p) =>
      p.id === id
        ? { ...p, statut: action === 'valider' ? ('validee' as const) : ('rejetee' as const) }
        : p,
    );
    auditLogs.unshift({
      id: `al-${Date.now()}`,
      date: new Date().toISOString(),
      utilisateur: MOCK_ADMIN.email,
      action: `${action === 'valider' ? 'Validation' : 'Refus'} paroisse ${id} — ${commentaire}`,
      module: 'paroisses',
      ip: '196.28.1.45',
    });
  },

  async suspendParish(id: string, commentaire: string) {
    await delay();
    parishes = parishes.map((p) => (p.id === id ? { ...p, statut: 'suspendue' as const } : p));
    auditLogs.unshift({
      id: `al-${Date.now()}`,
      date: new Date().toISOString(),
      utilisateur: MOCK_ADMIN.email,
      action: `Suspension paroisse ${id} — ${commentaire}`,
      module: 'paroisses',
      ip: '196.28.1.45',
    });
  },

  async reactivateParish(id: string) {
    await delay();
    parishes = parishes.map((p) => (p.id === id ? { ...p, statut: 'validee' as const } : p));
  },

  async getDioceses(filters?: { q?: string; actif?: boolean }): Promise<AdminDiocese[]> {
    await delay();
    let result = [...dioceses];
    if (filters?.q) {
      const q = filters.q.toLowerCase();
      result = result.filter((d) => d.nom.toLowerCase().includes(q) || d.ville.toLowerCase().includes(q));
    }
    if (filters?.actif != null) {
      result = result.filter((d) => d.actif === filters.actif);
    }
    return result;
  },

  async createDiocese(data: { nom: string; ville?: string; pays?: string; description?: string; actif?: boolean }) {
    await delay();
    const diocese: AdminDiocese = {
      id: `d-${Date.now()}`,
      nom: data.nom,
      ville: data.ville ?? '',
      pays: data.pays ?? 'Burkina Faso',
      description: data.description ?? '',
      logo: '',
      actif: data.actif ?? true,
      paroissesCount: 0,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    dioceses = [diocese, ...dioceses];
    return diocese;
  },

  async updateDiocese(id: string, data: Partial<{ nom: string; ville: string; pays: string; description: string; actif: boolean }>) {
    await delay();
    dioceses = dioceses.map((d) => (d.id === id ? { ...d, ...data } : d));
    return dioceses.find((d) => d.id === id)!;
  },

  async deleteDiocese(id: string) {
    await delay();
    dioceses = dioceses.filter((d) => d.id !== id);
  },

  async getAbonnements(filters?: { paroisseId?: string; statut?: string }): Promise<AdminAbonnement[]> {
    await delay();
    let result = [...abonnements];
    if (filters?.paroisseId) result = result.filter((a) => a.paroisseId === filters.paroisseId);
    if (filters?.statut) result = result.filter((a) => a.statut === filters.statut);
    return result;
  },

  async createAbonnement(data: {
    paroisse_id: string;
    plan: string;
    montant: number;
    date_debut: string;
    date_fin?: string;
    statut?: string;
  }) {
    await delay();
    const parish = parishes.find((p) => p.id === data.paroisse_id);
    const abonnement: AdminAbonnement = {
      id: `ab-${Date.now()}`,
      plan: data.plan,
      montant: data.montant,
      dateDebut: data.date_debut,
      dateFin: data.date_fin ?? null,
      statut: (data.statut as AdminAbonnement['statut']) ?? 'actif',
      paroisseId: data.paroisse_id,
      paroisseNom: parish?.nom ?? 'Paroisse',
    };
    abonnements = [abonnement, ...abonnements];
    return abonnement;
  },

  async updateAbonnement(
    id: string,
    data: Partial<{ plan: string; montant: number; date_debut: string; date_fin: string | null; statut: string }>,
  ) {
    await delay();
    abonnements = abonnements.map((a) =>
      a.id === id ? { ...a, ...data, statut: (data.statut as AdminAbonnement['statut']) ?? a.statut } : a,
    );
    return abonnements.find((a) => a.id === id)!;
  },

  async getPublications(visible?: boolean): Promise<AdminPublicationModeration[]> {
    await delay();
    if (visible == null) return [...publicationsModeration];
    return publicationsModeration.filter((p) => p.visible === visible);
  },

  async updatePublicationVisible(id: string, visible: boolean) {
    await delay();
    publicationsModeration = publicationsModeration.map((p) => (p.id === id ? { ...p, visible } : p));
  },

  async getCampagnesModeration(_activesOnly = false): Promise<AdminCampagneModeration[]> {
    await delay();
    return [...campagnesModeration];
  },

  async getTransactions(filters?: {
    q?: string;
    statut?: string;
    methode?: string;
    dateDebut?: string;
    dateFin?: string;
    montantMin?: number;
    montantMax?: number;
  }): Promise<{ transactions: AdminTransaction[]; synthese: TransactionSynthese }> {
    await delay();
    let result = [...transactions];
    if (filters?.q) {
      const q = filters.q.toLowerCase();
      result = result.filter(
        (t) =>
          t.reference.toLowerCase().includes(q) ||
          t.utilisateur.toLowerCase().includes(q) ||
          t.paroisse.toLowerCase().includes(q) ||
          t.libelleContexte.toLowerCase().includes(q),
      );
    }
    if (filters?.statut && filters.statut !== 'tous') {
      result = result.filter((t) => t.statut === filters.statut);
    }
    if (filters?.methode && filters.methode !== 'tous') {
      const m = filters.methode.toLowerCase();
      result = result.filter((t) => t.methode.toLowerCase().includes(m.replace('_', ' ')));
    }
    if (filters?.dateDebut) {
      result = result.filter((t) => t.date >= filters.dateDebut!);
    }
    if (filters?.dateFin) {
      result = result.filter((t) => t.date <= `${filters.dateFin}T23:59:59`);
    }
    if (filters?.montantMin != null) {
      result = result.filter((t) => t.montant >= filters.montantMin!);
    }
    if (filters?.montantMax != null) {
      result = result.filter((t) => t.montant <= filters.montantMax!);
    }

    const synthese: TransactionSynthese = {
      total: result.length,
      montantTotal: result.reduce((sum, t) => sum + t.montant, 0),
      montantReussi: result.filter((t) => t.statut === 'reussi').reduce((sum, t) => sum + t.montant, 0),
      reussis: result.filter((t) => t.statut === 'reussi').length,
      enAttente: result.filter((t) => t.statut === 'en_attente').length,
      echoues: result.filter((t) => t.statut === 'echoue').length,
    };

    return { transactions: result, synthese };
  },

  async getTransactionDetail(id: string): Promise<TransactionDetail | null> {
    await delay();
    const tx = transactions.find((t) => t.id === id);
    if (!tx) return null;
    return {
      ...tx,
      devise: 'XOF',
      referenceFournisseur: tx.statut === 'reussi' ? `OM-${tx.reference.slice(-6)}` : null,
      statutFournisseur: tx.statut === 'reussi' ? 'SUCCESS' : tx.statut === 'echoue' ? 'FAILED' : 'PENDING',
      telephonePayeur: '+22670000000',
      fraisTechniques: Math.round(tx.montant * 0.025),
      dateExpiration: tx.statut === 'en_attente' ? tx.date : null,
      journal: [
        { date: tx.date, etape: 'Création', detail: `Paiement lié à ${tx.libelleContexte}` },
        { date: tx.date, etape: 'Traitement', detail: `Passage par ${tx.methode}` },
        { date: tx.date, etape: tx.statut === 'reussi' ? 'Confirmé' : 'Statut', detail: `Statut final : ${tx.statut}` },
      ],
    };
  },

  async getTickets(filters?: { statut?: string; priorite?: string }): Promise<AdminTicket[]> {
    await delay();
    let result = [...tickets];
    if (filters?.statut && filters.statut !== 'tous') {
      result = result.filter((t) => t.statut === filters.statut);
    }
    if (filters?.priorite && filters.priorite !== 'tous') {
      result = result.filter((t) => t.priorite === filters.priorite);
    }
    return result;
  },

  async getTicketDetail(id: string): Promise<TicketDetail | null> {
    await delay();
    const ticket = tickets.find((t) => t.id === id);
    if (!ticket) return null;
    return {
      ...ticket,
      description: 'Description détaillée du problème rencontré par l\'utilisateur.',
      messages: [
        { auteur: ticket.createur, contenu: 'Bonjour, j\'ai un problème avec mon paiement.', date: ticket.date, role: 'createur' },
        { auteur: 'Support MesseConnect', contenu: 'Bonjour, nous examinons votre demande.', date: '2026-05-29T18:00:00', role: 'admin' },
      ],
      piecesJointes: [{ nom: 'capture-ecran.png', taille: '245 Ko' }],
      historique: [
        { date: ticket.date, action: 'Ticket créé' },
        { date: '2026-05-29T18:00:00', action: 'Prise en charge par support' },
      ],
    };
  },

  async replyTicket(id: string, message: string, statut: string) {
    await delay();
    tickets = tickets.map((t) =>
      t.id === id ? { ...t, statut: statut as AdminTicket['statut'] } : t,
    );
    auditLogs.unshift({
      id: `al-${Date.now()}`,
      date: new Date().toISOString(),
      utilisateur: MOCK_ADMIN.email,
      action: `Réponse ticket ${id} — ${message.slice(0, 50)}...`,
      module: 'support',
      ip: '196.28.1.45',
    });
  },

  async addAnnonce(data: Omit<SystemAnnonce, 'id' | 'actif'>) {
    await delay();
    annonces.unshift({ ...data, id: `an-${Date.now()}`, actif: true });
  },

  async addCampagne(data: Omit<SystemCampagne, 'id' | 'collecte'>) {
    await delay();
    campagnes.unshift({ ...data, id: `c-${Date.now()}`, collecte: 0 });
  },

  async getAuditLogs(): Promise<AuditLog[]> {
    await delay();
    return auditLogs;
  },
};

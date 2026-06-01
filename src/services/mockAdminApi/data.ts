export type UserStatut = 'actif' | 'suspendu' | 'inactif';
export type ParishStatut = 'en_attente' | 'validee' | 'suspendue' | 'rejetee';
export type TransactionStatut = 'reussi' | 'en_attente' | 'echoue' | 'rembourse';
export type TicketPriorite = 'basse' | 'normale' | 'haute' | 'urgente';
export type TicketStatut = 'ouvert' | 'en_cours' | 'resolu';
export type AnnoncePriorite = 'info' | 'important' | 'urgent';

export interface AdminKpis {
  utilisateurs: number;
  paroisses: number;
  demandesMesses: number;
  montantTotal: number;
  croissanceMensuelle: number;
  ticketsOuverts: number;
}

export interface ChartPoint {
  label: string;
  value: number;
}

export interface ActiviteRecente {
  id: string;
  date: string;
  action: string;
  utilisateur: string;
  type: string;
}

export interface AdminUser {
  id: string;
  nom: string;
  prenom: string;
  telephone: string;
  email: string;
  ville: string;
  dateInscription: string;
  nombreDemandes: number;
  statut: UserStatut;
  favoris: string[];
}

export interface UserDetail extends AdminUser {
  demandes: { reference: string; paroisse: string; montant: number; date: string; statut: string }[];
  paiements: { reference: string; montant: number; methode: string; date: string; statut: string }[];
  connexions: { date: string; ip: string; appareil: string }[];
}

export interface AdminParish {
  id: string;
  nom: string;
  ville: string;
  diocese: string;
  dateInscription: string;
  nombreDemandes: number;
  montantCollecte: number;
  statut: ParishStatut;
  responsable: string;
  email: string;
  telephone: string;
  adresse: string;
  description: string;
  photoProfil: string;
  galerie: string[];
}

export interface ParishDetail extends AdminParish {
  demandes: { reference: string; fidele: string; montant: number; date: string }[];
  paiements: { reference: string; montant: number; methode: string; date: string }[];
  campagnes: { titre: string; objectif: number; collecte: number }[];
  publications: { titre: string; date: string }[];
  historique: { date: string; action: string; auteur: string }[];
}

export interface AdminTransaction {
  id: string;
  reference: string;
  date: string;
  montant: number;
  methode: string;
  utilisateur: string;
  utilisateurId: string;
  paroisse: string;
  paroisseId: string;
  statut: TransactionStatut;
  typePaiement: 'intention' | 'campagne' | 'autre';
  libelleContexte: string;
}

export interface TransactionSynthese {
  total: number;
  montantTotal: number;
  montantReussi: number;
  reussis: number;
  enAttente: number;
  echoues: number;
}

export interface TransactionDetail extends AdminTransaction {
  devise: string;
  referenceFournisseur: string | null;
  statutFournisseur: string | null;
  telephonePayeur: string | null;
  fraisTechniques: number;
  dateExpiration: string | null;
  journal: { date: string; etape: string; detail: string }[];
}

export interface AdminTicket {
  id: string;
  reference: string;
  titre: string;
  categorie: string;
  createur: string;
  createurType: 'fidele' | 'paroisse';
  date: string;
  priorite: TicketPriorite;
  statut: TicketStatut;
}

export interface TicketDetail extends AdminTicket {
  description: string;
  messages: { auteur: string; contenu: string; date: string; role: 'createur' | 'admin' }[];
  piecesJointes: { nom: string; taille: string }[];
  historique: { date: string; action: string }[];
}

export interface SystemAnnonce {
  id: string;
  titre: string;
  contenu: string;
  datePublication: string;
  dateExpiration: string;
  priorite: AnnoncePriorite;
  actif: boolean;
}

export interface SystemCampagne {
  id: string;
  titre: string;
  description: string;
  objectif: number;
  collecte: number;
  image: string;
  dateDebut: string;
  dateFin: string;
}

export interface AuditLog {
  id: string;
  date: string;
  utilisateur: string;
  action: string;
  module: string;
  ip: string;
}

export interface AdminDiocese {
  id: string;
  nom: string;
  ville: string;
  pays: string;
  description: string;
  logo: string;
  actif: boolean;
  paroissesCount: number;
  createdAt: string;
}

export interface AdminAbonnement {
  id: string;
  plan: string;
  montant: number;
  dateDebut: string;
  dateFin: string | null;
  statut: 'actif' | 'expire' | 'suspendu';
  paroisseId: string;
  paroisseNom: string;
}

export interface AdminPublicationModeration {
  id: string;
  titre: string;
  contenu: string;
  type: string;
  visible: boolean;
  datePublication: string;
  paroisseId: string;
  paroisseNom: string;
}

export interface AdminCampagneModeration {
  id: string;
  nom: string;
  description: string;
  objectif: number;
  collecte: number;
  dateFin: string | null;
  paroisseId: string;
  paroisseNom: string;
}

export interface DashboardData {
  kpis: AdminKpis;
  inscriptionsChart: ChartPoint[];
  revenusChart: ChartPoint[];
  demandesChart: ChartPoint[];
  paroissesChart: ChartPoint[];
  activites: ActiviteRecente[];
  annonces: SystemAnnonce[];
  campagnes: SystemCampagne[];
}

export const MOCK_ADMIN = {
  email: 'admin@messeconnect.test',
  password: 'password',
};

export const MOCK_KPIS: AdminKpis = {
  utilisateurs: 2847,
  paroisses: 156,
  demandesMesses: 1243,
  montantTotal: 48750000,
  croissanceMensuelle: 12.4,
  ticketsOuverts: 23,
};

export const MOCK_INSCRIPTIONS_CHART: ChartPoint[] = [
  { label: 'Jan', value: 120 },
  { label: 'Fév', value: 145 },
  { label: 'Mar', value: 168 },
  { label: 'Avr', value: 192 },
  { label: 'Mai', value: 210 },
  { label: 'Juin', value: 238 },
];

export const MOCK_REVENUS_CHART: ChartPoint[] = [
  { label: 'Jan', value: 5200000 },
  { label: 'Fév', value: 6100000 },
  { label: 'Mar', value: 5800000 },
  { label: 'Avr', value: 7200000 },
  { label: 'Mai', value: 8100000 },
  { label: 'Juin', value: 9450000 },
];

export const MOCK_DEMANDES_CHART: ChartPoint[] = [
  { label: 'Action de grâce', value: 420 },
  { label: 'Défunt', value: 380 },
  { label: 'Mariage', value: 145 },
  { label: 'Anniversaire', value: 98 },
  { label: 'Intention', value: 200 },
];

export const MOCK_PAROISSES_CHART: ChartPoint[] = [
  { label: 'Ouagadougou', value: 42 },
  { label: 'Bobo-Dioulasso', value: 28 },
  { label: 'Koudougou', value: 18 },
  { label: 'Ouahigouya', value: 15 },
  { label: 'Autres', value: 53 },
];

export const MOCK_ACTIVITES: ActiviteRecente[] = [
  { id: 'a1', date: '2026-05-30T09:15:00', action: 'Nouvelle inscription paroisse', utilisateur: 'Paroisse Saint Pierre', type: 'paroisse' },
  { id: 'a2', date: '2026-05-30T08:42:00', action: 'Paiement validé', utilisateur: 'Marie Ouédraogo', type: 'transaction' },
  { id: 'a3', date: '2026-05-29T17:30:00', action: 'Ticket support ouvert', utilisateur: 'Jean Kaboré', type: 'support' },
  { id: 'a4', date: '2026-05-29T14:20:00', action: 'Demande de messe créée', utilisateur: 'Fatou Sawadogo', type: 'demande' },
  { id: 'a5', date: '2026-05-29T11:05:00', action: 'Paroisse validée', utilisateur: 'Admin Système', type: 'paroisse' },
];

export const MOCK_USERS: AdminUser[] = [
  { id: 'u1', nom: 'Ouédraogo', prenom: 'Marie', telephone: '+226 70 12 34 56', email: 'marie.ouedraogo@mail.bf', ville: 'Ouagadougou', dateInscription: '2025-03-12', nombreDemandes: 8, statut: 'actif', favoris: ['Paroisse Saint Pierre', 'Cathédrale de Ouaga'] },
  { id: 'u2', nom: 'Kaboré', prenom: 'Jean', telephone: '+226 76 98 76 54', email: 'jean.kabore@mail.bf', ville: 'Bobo-Dioulasso', dateInscription: '2025-06-20', nombreDemandes: 3, statut: 'actif', favoris: ['Paroisse Notre-Dame'] },
  { id: 'u3', nom: 'Sawadogo', prenom: 'Fatou', telephone: '+226 78 11 22 33', email: 'fatou.s@mail.bf', ville: 'Koudougou', dateInscription: '2025-09-05', nombreDemandes: 12, statut: 'actif', favoris: ['Paroisse Saint Joseph'] },
  { id: 'u4', nom: 'Traoré', prenom: 'Ibrahim', telephone: '+226 65 44 55 66', email: 'ibrahim.t@mail.bf', ville: 'Ouagadougou', dateInscription: '2024-11-18', nombreDemandes: 1, statut: 'suspendu', favoris: [] },
  { id: 'u5', nom: 'Zongo', prenom: 'Aminata', telephone: '+226 71 33 44 55', email: 'aminata.z@mail.bf', ville: 'Ouahigouya', dateInscription: '2026-01-10', nombreDemandes: 5, statut: 'actif', favoris: ['Paroisse Sainte Anne'] },
  { id: 'u6', nom: 'Compaoré', prenom: 'Paul', telephone: '+226 68 77 88 99', email: 'paul.c@mail.bf', ville: 'Banfora', dateInscription: '2025-12-02', nombreDemandes: 0, statut: 'inactif', favoris: [] },
];

export const MOCK_PARISHES: AdminParish[] = [
  { id: 'p1', nom: 'Paroisse Saint Pierre', ville: 'Ouagadougou', diocese: 'Ouagadougou', dateInscription: '2024-08-15', nombreDemandes: 342, montantCollecte: 8750000, statut: 'validee', responsable: 'Père Thomas Nikiéma', email: 'contact@stpierre-ouaga.bf', telephone: '+226 25 30 12 34', adresse: 'Secteur 15, Ouagadougou', description: 'Paroisse centrale au cœur de la capitale.', photoProfil: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Ouagadougou_Cathedral.jpg/320px-Ouagadougou_Cathedral.jpg', galerie: [] },
  { id: 'p2', nom: 'Paroisse Notre-Dame', ville: 'Bobo-Dioulasso', diocese: 'Bobo-Dioulasso', dateInscription: '2024-10-22', nombreDemandes: 198, montantCollecte: 4200000, statut: 'validee', responsable: 'Père Jean-Baptiste', email: 'notredame@bobo.bf', telephone: '+226 20 98 76 54', adresse: 'Centre-ville, Bobo-Dioulasso', description: 'Communauté dynamique au sud-ouest.', photoProfil: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Bobo-Dioulasso_grand_mosque.jpg/320px-Bobo-Dioulasso_grand_mosque.jpg', galerie: [] },
  { id: 'p3', nom: 'Paroisse Sainte Anne', ville: 'Koudougou', diocese: 'Koudougou', dateInscription: '2026-05-28', nombreDemandes: 0, montantCollecte: 0, statut: 'en_attente', responsable: 'Sœur Claire Yaméogo', email: 'steanne@koudougou.bf', telephone: '+226 25 44 33 22', adresse: 'Quartier Centre, Koudougou', description: 'Nouvelle paroisse en attente de validation.', photoProfil: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Koudougou_market.jpg/320px-Koudougou_market.jpg', galerie: [] },
  { id: 'p4', nom: 'Paroisse Saint Joseph', ville: 'Ouagadougou', diocese: 'Ouagadougou', dateInscription: '2025-02-10', nombreDemandes: 156, montantCollecte: 3100000, statut: 'validee', responsable: 'Père Michel Zongo', email: 'stjoseph@ouaga.bf', telephone: '+226 25 36 78 90', adresse: 'Gounghin, Ouagadougou', description: 'Paroisse de quartier très active.', photoProfil: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Ouagadougou_Cathedral.jpg/320px-Ouagadougou_Cathedral.jpg', galerie: [] },
  { id: 'p5', nom: 'Paroisse Immaculée Conception', ville: 'Ouahigouya', diocese: 'Ouahigouya', dateInscription: '2025-07-01', nombreDemandes: 45, montantCollecte: 980000, statut: 'suspendue', responsable: 'Père André Compaoré', email: 'immaculee@ouahigouya.bf', telephone: '+226 24 55 66 77', adresse: 'Centre, Ouahigouya', description: 'Paroisse suspendue pour vérification.', photoProfil: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Ouahigouya_market.jpg/320px-Ouahigouya_market.jpg', galerie: [] },
];

export const MOCK_TRANSACTIONS: AdminTransaction[] = [
  { id: 't1', reference: 'PAY-2026-001234', date: '2026-05-30T08:42:00', montant: 15000, methode: 'Orange Money', utilisateur: 'Marie Ouédraogo', utilisateurId: 'u1', paroisse: 'Paroisse Saint Pierre', paroisseId: 'p1', statut: 'reussi', typePaiement: 'intention', libelleContexte: 'DM-2026-0089' },
  { id: 't2', reference: 'PAY-2026-001235', date: '2026-05-29T16:20:00', montant: 25000, methode: 'Wave', utilisateur: 'Fatou Sawadogo', utilisateurId: 'u3', paroisse: 'Paroisse Saint Joseph', paroisseId: 'p4', statut: 'reussi', typePaiement: 'intention', libelleContexte: 'DM-2026-0085' },
  { id: 't3', reference: 'PAY-2026-001236', date: '2026-05-29T11:05:00', montant: 10000, methode: 'Moov Money', utilisateur: 'Jean Kaboré', utilisateurId: 'u2', paroisse: 'Paroisse Notre-Dame', paroisseId: 'p2', statut: 'en_attente', typePaiement: 'intention', libelleContexte: 'DM-2026-0091' },
  { id: 't4', reference: 'PAY-2026-001237', date: '2026-05-28T09:30:00', montant: 50000, methode: 'Orange Money', utilisateur: 'Aminata Zongo', utilisateurId: 'u5', paroisse: 'Paroisse Saint Pierre', paroisseId: 'p1', statut: 'reussi', typePaiement: 'campagne', libelleContexte: 'Rénovation église' },
  { id: 't5', reference: 'PAY-2026-001238', date: '2026-05-27T14:15:00', montant: 8000, methode: 'Espèces', utilisateur: 'Ibrahim Traoré', utilisateurId: 'u4', paroisse: 'Paroisse Notre-Dame', paroisseId: 'p2', statut: 'echoue', typePaiement: 'intention', libelleContexte: 'DM-2026-0078' },
  { id: 't6', reference: 'PAY-2026-001239', date: '2026-05-26T10:00:00', montant: 30000, methode: 'Wave', utilisateur: 'Marie Ouédraogo', utilisateurId: 'u1', paroisse: 'Paroisse Saint Joseph', paroisseId: 'p4', statut: 'rembourse', typePaiement: 'campagne', libelleContexte: 'Aide paroisses rurales' },
];

export const MOCK_TICKETS: AdminTicket[] = [
  { id: 'tk1', reference: 'TK-2026-0045', titre: 'Problème de paiement Orange Money', categorie: 'Paiement', createur: 'Jean Kaboré', createurType: 'fidele', date: '2026-05-29T17:30:00', priorite: 'haute', statut: 'ouvert' },
  { id: 'tk2', reference: 'TK-2026-0044', titre: 'Validation paroisse en retard', categorie: 'Paroisse', createur: 'Sœur Claire Yaméogo', createurType: 'paroisse', date: '2026-05-28T10:15:00', priorite: 'normale', statut: 'en_cours' },
  { id: 'tk3', reference: 'TK-2026-0043', titre: 'Demande de réactivation compte', categorie: 'Compte', createur: 'Ibrahim Traoré', createurType: 'fidele', date: '2026-05-27T08:45:00', priorite: 'basse', statut: 'resolu' },
  { id: 'tk4', reference: 'TK-2026-0042', titre: 'Bug affichage calendrier', categorie: 'Technique', createur: 'Paroisse Saint Pierre', createurType: 'paroisse', date: '2026-05-26T14:20:00', priorite: 'urgente', statut: 'ouvert' },
];

export const MOCK_ANNONCES: SystemAnnonce[] = [
  { id: 'an1', titre: 'Maintenance planifiée', contenu: 'Une maintenance est prévue le 5 juin de 2h à 4h.', datePublication: '2026-05-28', dateExpiration: '2026-06-05', priorite: 'important', actif: true },
  { id: 'an2', titre: 'Nouvelle fonctionnalité campagnes', contenu: 'Les campagnes de collecte sont disponibles pour toutes les paroisses validées.', datePublication: '2026-05-20', dateExpiration: '2026-07-20', priorite: 'info', actif: true },
];

export const MOCK_CAMPAGNES: SystemCampagne[] = [
  { id: 'c1', titre: 'Restauration Cathédrale', description: 'Campagne nationale pour la restauration de la cathédrale.', objectif: 50000000, collecte: 12500000, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Ouagadougou_Cathedral.jpg/320px-Ouagadougou_Cathedral.jpg', dateDebut: '2026-01-01', dateFin: '2026-12-31' },
  { id: 'c2', titre: 'Aide aux paroisses rurales', description: 'Soutien aux paroisses en zone rurale.', objectif: 20000000, collecte: 8700000, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Koudougou_market.jpg/320px-Koudougou_market.jpg', dateDebut: '2026-03-01', dateFin: '2026-09-30' },
];

export const MOCK_AUDIT_LOGS: AuditLog[] = [
  { id: 'al1', date: '2026-05-30T09:15:00', utilisateur: 'admin@messeconnect.bf', action: 'Validation paroisse p3', module: 'paroisses', ip: '196.28.1.45' },
  { id: 'al2', date: '2026-05-29T16:45:00', utilisateur: 'admin@messeconnect.bf', action: 'Suspension utilisateur u4', module: 'utilisateurs', ip: '196.28.1.45' },
  { id: 'al3', date: '2026-05-29T11:20:00', utilisateur: 'admin@messeconnect.bf', action: 'Réponse ticket TK-2026-0044', module: 'support', ip: '196.28.1.45' },
  { id: 'al4', date: '2026-05-28T08:00:00', utilisateur: 'admin@messeconnect.bf', action: 'Publication annonce système', module: 'annonces', ip: '196.28.1.45' },
  { id: 'al5', date: '2026-05-27T14:30:00', utilisateur: 'admin@messeconnect.bf', action: 'Modification paramètres paiement', module: 'parametres', ip: '196.28.1.45' },
];

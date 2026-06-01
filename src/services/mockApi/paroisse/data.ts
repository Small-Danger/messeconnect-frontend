export type DemandeStatut = 'en_attente' | 'confirmee' | 'payee' | 'celebree' | 'rejetee' | 'annulee';
export type TicketStatut = 'ouvert' | 'en_cours' | 'resolu';

export interface ParoisseProfile {
  id: string;
  nom: string;
  diocese: string;
  adresse: string;
  ville: string;
  pays: string;
  telephone: string;
  email: string;
  siteWeb: string;
  description: string;
  photoCouverture: string;
  photoProfil: string;
  responsable: string;
  horaires: string[];
}

export interface ParoisseDemande {
  id: string;
  reference: string;
  fideleNom: string;
  typeOffrande: string;
  intention: string;
  date: string;
  heure: string;
  montant: number;
  statut: DemandeStatut;
  paiementStatut: 'reussi' | 'en_attente' | 'echoue';
  paiementMethode: string;
  urgent: boolean;
  motifRejet?: string;
  createdAt?: string;
  messeId?: string;
  messeTitre?: string;
}

export interface ParoisseMesse {
  id: string;
  titre: string;
  date: string;
  heure: string;
  pretre: string;
  lieu: string;
  intentions: string[];
  participants: number;
  capacite_max?: number | null;
  statut: 'planifiee' | 'en_cours' | 'celebree' | 'annulee';
}

export interface ParoisseMedia {
  id: string;
  url: string;
  titre: string;
  description: string;
  type?: 'image' | 'video';
  createdAt: string;
}

export interface MoyenPaiementParoisse {
  id: string;
  type: 'orange' | 'moov' | 'wave' | 'especes';
  numero: string;
  nomCompte: string;
  actif: boolean;
}

export interface TypeOffrandeParoisse {
  id: string;
  nom: string;
  montantConseille: number;
  description: string;
  actif: boolean;
}

export interface PublicationParoisse {
  id: string;
  titre: string;
  contenu: string;
  image: string;
  images: string[];
  datePublication: string;
}

export interface CampagneParoisse {
  id: string;
  titre: string;
  description: string;
  objectif: number;
  collecte: number;
  dateDebut: string;
  dateFin: string;
  image: string;
}

export interface DonCampagneParoisse {
  id: string;
  montant: number;
  statut: 'reussi' | 'en_attente' | 'echoue' | 'rembourse';
  reference: string;
  telephone: string | null;
  datePaiement: string | null;
  dateCreation: string;
  methodePaiement: 'orange' | 'moov' | 'wave' | 'especes';
}

export interface CampagneDonsResume {
  totalConfirmes: number;
  nombreConfirmes: number;
  nombreEnAttente: number;
}

export interface TicketSupport {
  id: string;
  reference: string;
  titre: string;
  categorie: string;
  description: string;
  statut: TicketStatut;
  createdAt: string;
}

export interface DashboardKpis {
  demandesRecues: number;
  offrandesRecues: number;
  messesAVenir: number;
  fidelesInscrits: number;
}

export interface ActiviteRecente {
  id: string;
  label: string;
  date: string;
  type: 'demande' | 'paiement' | 'messe' | 'publication';
}

export const mockParoisseProfile: ParoisseProfile = {
  id: 'p1',
  nom: 'Paroisse Saint-Pierre',
  diocese: 'Archidiocèse de Ouagadougou',
  adresse: 'Avenue de la Démocratie, Ouagadougou',
  ville: 'Ouagadougou',
  pays: 'Burkina Faso',
  telephone: '+226 70 00 00 01',
  email: 'secretaire@paroisse-saint-pierre.test',
  siteWeb: 'https://saint-pierre.bf',
  description: 'Paroisse historique au cœur de la capitale, au service des fidèles depuis 1962.',
  photoCouverture: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/Cath%C3%A9drale_de_Ouagadougou.jpg',
  photoProfil: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Messe_%C3%A0_Yagma.jpg/400px-Messe_%C3%A0_Yagma.jpg',
  responsable: 'Père Jean-Baptiste Ouédraogo',
  horaires: ['Lun-Ven : 8h - 17h', 'Sam : 9h - 12h', 'Dim : avant les messes'],
};

export const mockDemandes: ParoisseDemande[] = [
  {
    id: 'd1',
    reference: 'MC-2026-A8F3K2M1',
    fideleNom: 'Amadou Konaté',
    typeOffrande: 'Action de grâce',
    intention: 'Action de grâce pour ma famille',
    date: '2026-06-08',
    heure: '09:00',
    montant: 10000,
    statut: 'confirmee',
    paiementStatut: 'reussi',
    paiementMethode: 'Orange Money',
    urgent: true,
    messeId: 'm1',
    messeTitre: 'Messe dominicale',
  },
  {
    id: 'd2',
    reference: 'MC-2026-B2K9M1P4',
    fideleNom: 'Anonyme',
    typeOffrande: 'Défunt',
    intention: 'Requiem pour feu Jean Ouédraogo',
    date: '2026-06-10',
    heure: '07:00',
    montant: 5000,
    statut: 'en_attente',
    paiementStatut: 'en_attente',
    paiementMethode: 'Wave',
    urgent: true,
    messeId: 'm2',
    messeTitre: 'Messe du matin',
  },
  {
    id: 'd3',
    reference: 'MC-2026-C7L2N8Q3',
    fideleNom: 'Fatou Traoré',
    typeOffrande: 'Mariage',
    intention: 'Bénédiction nuptiale',
    date: '2026-06-15',
    heure: '11:00',
    montant: 20000,
    statut: 'payee',
    paiementStatut: 'reussi',
    paiementMethode: 'Moov Money',
    urgent: false,
  },
  {
    id: 'd4',
    reference: 'MC-2026-D1M5P2R6',
    fideleNom: 'Issa Sawadogo',
    typeOffrande: 'Intention',
    intention: 'Guérison',
    date: '2026-06-12',
    heure: '18:00',
    montant: 5000,
    statut: 'en_attente',
    paiementStatut: 'reussi',
    paiementMethode: 'Espèces',
    urgent: false,
    messeId: 'm3',
    messeTitre: 'Messe du soir',
  },
  {
    id: 'd5',
    reference: 'MC-2026-E8CASH01',
    fideleNom: 'Anonyme',
    typeOffrande: 'Défunt',
    intention: 'Requiem pour feu Paul Zongo',
    date: '2026-06-08',
    heure: '09:00',
    montant: 5000,
    statut: 'en_attente',
    paiementStatut: 'en_attente',
    paiementMethode: 'Espèces',
    urgent: false,
    messeId: 'm1',
    messeTitre: 'Messe dominicale',
  },
  {
    id: 'd6',
    reference: 'MC-2026-PAST001',
    fideleNom: 'Mariam Sanou',
    typeOffrande: 'Action de grâce',
    intention: 'Remerciements pour un nouveau-né',
    date: '2026-04-20',
    heure: '09:00',
    montant: 7500,
    statut: 'celebree',
    paiementStatut: 'reussi',
    paiementMethode: 'Orange Money',
    urgent: false,
    messeId: 'm4',
    messeTitre: 'Messe dominicale — avril',
  },
  {
    id: 'd7',
    reference: 'MC-2026-PAST002',
    fideleNom: 'Anonyme',
    typeOffrande: 'Défunt',
    intention: 'Requiem pour feu Pierre Kaboré',
    date: '2026-03-15',
    heure: '18:00',
    montant: 5000,
    statut: 'celebree',
    paiementStatut: 'reussi',
    paiementMethode: 'Wave',
    urgent: false,
    messeId: 'm5',
    messeTitre: 'Messe du vendredi',
  },
  {
    id: 'd8',
    reference: 'MC-2026-PAST003',
    fideleNom: 'Lucien Bado',
    typeOffrande: 'Intention',
    intention: 'Intention particulière',
    date: '2026-02-10',
    heure: '07:00',
    montant: 5000,
    statut: 'rejetee',
    paiementStatut: 'echoue',
    paiementMethode: 'Espèces',
    urgent: false,
    messeId: 'm6',
    messeTitre: 'Messe du matin',
  },
];

export const mockMesses: ParoisseMesse[] = [
  {
    id: 'm1',
    titre: 'Messe dominicale',
    date: '2026-06-08',
    heure: '09:00',
    pretre: 'Père Jean-Baptiste',
    lieu: 'Église principale',
    intentions: ['Action de grâce — Konaté', 'Défunt — Ouédraogo'],
    participants: 45,
    statut: 'planifiee',
  },
  {
    id: 'm2',
    titre: 'Messe du matin',
    date: '2026-06-09',
    heure: '07:00',
    pretre: 'Père Luc',
    lieu: 'Chapelle annexe',
    intentions: ['Intention particulière'],
    participants: 12,
    statut: 'planifiee',
  },
  {
    id: 'm3',
    titre: 'Messe du soir',
    date: '2026-06-10',
    heure: '18:00',
    pretre: 'Père Jean-Baptiste',
    lieu: 'Église principale',
    intentions: [],
    participants: 28,
    statut: 'planifiee',
  },
  {
    id: 'm4',
    titre: 'Messe dominicale — avril',
    date: '2026-04-20',
    heure: '09:00',
    pretre: 'Père Jean-Baptiste',
    lieu: 'Église principale',
    intentions: ['Action de grâce — Sanou'],
    participants: 52,
    statut: 'celebree',
  },
  {
    id: 'm5',
    titre: 'Messe du vendredi',
    date: '2026-03-15',
    heure: '18:00',
    pretre: 'Père Luc',
    lieu: 'Église principale',
    intentions: ['Requiem — Kaboré'],
    participants: 35,
    statut: 'celebree',
  },
  {
    id: 'm6',
    titre: 'Messe du matin',
    date: '2026-02-10',
    heure: '07:00',
    pretre: 'Père Luc',
    lieu: 'Chapelle annexe',
    intentions: [],
    participants: 8,
    statut: 'celebree',
  },
];

export const mockMedias: ParoisseMedia[] = [
  {
    id: 'med1',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Messe_%C3%A0_Yagma.jpg/800px-Messe_%C3%A0_Yagma.jpg',
    titre: 'Messe dominicale',
    description: 'Célébration du dimanche',
    createdAt: '2026-05-20',
  },
  {
    id: 'med2',
    url: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/Cath%C3%A9drale_de_Ouagadougou.jpg',
    titre: 'Façade de l\'église',
    description: 'Vue extérieure',
    createdAt: '2026-05-15',
  },
];

export const mockMoyensPaiement: MoyenPaiementParoisse[] = [
  { id: 'mp1', type: 'orange', numero: '+226 70 00 00 01', nomCompte: 'Paroisse Saint-Pierre', actif: true },
  { id: 'mp2', type: 'wave', numero: '+226 70 00 00 02', nomCompte: 'Paroisse Saint-Pierre', actif: true },
  { id: 'mp3', type: 'especes', numero: 'Secrétariat paroissial', nomCompte: 'Caisse paroisse', actif: true },
];

export const mockTypesOffrandes: TypeOffrandeParoisse[] = [
  { id: 'to1', nom: 'Action de grâce', montantConseille: 10000, description: 'Remerciement au Seigneur', actif: true },
  { id: 'to2', nom: 'Défunt', montantConseille: 5000, description: 'Messe pour le repos de l\'âme', actif: true },
  { id: 'to3', nom: 'Mariage', montantConseille: 20000, description: 'Bénédiction nuptiale', actif: true },
  { id: 'to4', nom: 'Anniversaire', montantConseille: 5000, description: 'Action de grâce pour un anniversaire', actif: true },
  { id: 'to5', nom: 'Intention', montantConseille: 5000, description: 'Intention particulière', actif: true },
];

export const mockPublications: PublicationParoisse[] = [
  {
    id: 'pub1',
    titre: 'Grande messe de Pentecôte',
    contenu: 'Venez nombreux célébrer la descente du Saint-Esprit.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Messe_%C3%A0_Yagma.jpg/800px-Messe_%C3%A0_Yagma.jpg',
    images: ['https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Messe_%C3%A0_Yagma.jpg/800px-Messe_%C3%A0_Yagma.jpg'],
    datePublication: '2026-05-28',
  },
  {
    id: 'pub2',
    titre: 'Retraite paroissiale',
    contenu: 'Week-end de retraite spirituelle les 14-15 juin.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/Cath%C3%A9drale_de_Ouagadougou.jpg',
    images: ['https://upload.wikimedia.org/wikipedia/commons/2/2e/Cath%C3%A9drale_de_Ouagadougou.jpg'],
    datePublication: '2026-05-20',
  },
];

export const mockCampagnes: CampagneParoisse[] = [
  {
    id: 'c1',
    titre: 'Rénovation du clocher',
    description: 'Restauration du clocher historique de la paroisse.',
    objectif: 5000000,
    collecte: 3200000,
    dateDebut: '2026-04-01',
    dateFin: '2026-12-31',
    image: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/Cath%C3%A9drale_de_Ouagadougou.jpg',
  },
];

export const mockCampagneDons: Record<string, DonCampagneParoisse[]> = {
  c1: [
    {
      id: 'd1',
      montant: 500_000,
      statut: 'reussi',
      reference: 'PAY-DEMO-CLOCHER-01',
      telephone: '+22670123456',
      datePaiement: '2026-05-28T10:30:00',
      dateCreation: '2026-05-28T10:28:00',
      methodePaiement: 'orange',
    },
    {
      id: 'd2',
      montant: 250_000,
      statut: 'reussi',
      reference: 'PAY-DEMO-CLOCHER-02',
      telephone: '+22676987654',
      datePaiement: '2026-05-25T16:15:00',
      dateCreation: '2026-05-25T16:12:00',
      methodePaiement: 'wave',
    },
    {
      id: 'd3',
      montant: 100_000,
      statut: 'reussi',
      reference: 'PAY-DEMO-CLOCHER-03',
      telephone: '+22678112233',
      datePaiement: '2026-05-22T09:00:00',
      dateCreation: '2026-05-22T08:58:00',
      methodePaiement: 'moov',
    },
    {
      id: 'd4',
      montant: 75_000,
      statut: 'reussi',
      reference: 'PAY-DEMO-CLOCHER-04',
      telephone: null,
      datePaiement: '2026-05-20T14:45:00',
      dateCreation: '2026-05-20T14:40:00',
      methodePaiement: 'orange',
    },
    {
      id: 'd5',
      montant: 50_000,
      statut: 'en_attente',
      reference: 'PAY-DEMO-CLOCHER-05',
      telephone: '+22670199887',
      datePaiement: null,
      dateCreation: '2026-05-30T08:10:00',
      methodePaiement: 'wave',
    },
  ],
};

export const mockTickets: TicketSupport[] = [
  {
    id: 't1',
    reference: 'TKT-2026-001',
    titre: 'Problème affichage calendrier',
    categorie: 'Technique',
    description: 'Les messes du mois de juin ne s\'affichent pas correctement.',
    statut: 'ouvert',
    createdAt: '2026-05-29',
  },
  {
    id: 't2',
    reference: 'TKT-2026-002',
    titre: 'Question sur les paiements Wave',
    categorie: 'Paiement',
    description: 'Comment configurer le webhook Wave ?',
    statut: 'en_cours',
    createdAt: '2026-05-25',
  },
  {
    id: 't3',
    reference: 'TKT-2026-003',
    titre: 'Demande de formation',
    categorie: 'Formation',
    description: 'Session de formation pour le secrétariat.',
    statut: 'resolu',
    createdAt: '2026-05-10',
  },
];

export const mockActivites: ActiviteRecente[] = [
  { id: 'a1', label: 'Nouvelle demande MC-2026-B2K9M1P4', date: '2026-05-30 09:12', type: 'demande' },
  { id: 'a2', label: 'Paiement reçu — 10 000 FCFA', date: '2026-05-30 08:45', type: 'paiement' },
  { id: 'a3', label: 'Publication « Retraite paroissiale »', date: '2026-05-29 16:30', type: 'publication' },
  { id: 'a4', label: 'Messe programmée — 8 juin 09h', date: '2026-05-29 14:00', type: 'messe' },
];

export const mockKpis: DashboardKpis = {
  demandesRecues: 24,
  offrandesRecues: 385000,
  messesAVenir: 8,
  fidelesInscrits: 156,
};

import { appImages, paroisseImages } from '../../lib/images';

export interface MockUser {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  stats: {
    demandes: number;
    montantTotal: number;
    favoris: number;
  };
}

export interface MockParoisse {
  id: string;
  nom: string;
  ville: string;
  diocese: string;
  pays: string;
  distance: string;
  image: string;
  description: string;
  telephone: string;
  siteWeb?: string;
  adresse: string;
  horaires: string[];
  estFavori: boolean;
}

export interface MockMesse {
  id: string;
  paroisseId: string;
  date: string;
  heure: string;
  titre: string;
  placesRestantes: number;
  capacite: number;
}

export interface MockPublication {
  id: string;
  paroisseId: string;
  titre: string;
  description: string;
  image: string;
  images?: string[];
  datePublication: string;
}

export interface MockCampagne {
  id: string;
  paroisseId: string;
  titre: string;
  objectif: number;
  collecte: number;
  image: string;
}

export interface MockDemande {
  id: string;
  reference: string;
  paroisseId: string;
  paroisseNom: string;
  typeMesse: string;
  intention: string;
  date: string;
  creneau: string;
  montant: number;
  statut: 'en_attente' | 'confirmee' | 'payee' | 'celebree';
  estAnonyme: boolean;
  createdAt: string;
}

export interface MockPaiement {
  id: string;
  demandeId: string;
  reference: string;
  montant: number;
  methode: string;
  statut: 'reussi' | 'en_attente' | 'echoue';
  date: string;
}

export const mockUser: MockUser = {
  id: '1',
  nom: 'Konaté',
  prenom: 'Amadou',
  email: 'fidele@messeconnect.test',
  telephone: '+226 70 00 00 02',
  stats: { demandes: 12, montantTotal: 85000, favoris: 4 },
};

export const mockParoisses: MockParoisse[] = [
  {
    id: 'p1',
    nom: 'Paroisse Saint-Pierre',
    ville: 'Ouagadougou',
    diocese: 'Archidiocèse de Ouagadougou',
    pays: 'Burkina Faso',
    distance: '2,3 km',
    image: paroisseImages.p1,
    description: 'Paroisse historique au cœur de la capitale.',
    telephone: '+226 70 00 00 01',
    siteWeb: 'https://saint-pierre.bf',
    adresse: 'Avenue de la Démocratie, Ouagadougou',
    horaires: ['Lun-Ven : 8h - 17h', 'Sam : 9h - 12h', 'Dim : avant les messes'],
    estFavori: true,
  },
  {
    id: 'p2',
    nom: 'Paroisse Notre-Dame de la Paix',
    ville: 'Bobo-Dioulasso',
    diocese: 'Diocèse de Bobo-Dioulasso',
    pays: 'Burkina Faso',
    distance: '320 km',
    image: paroisseImages.p2,
    description: 'Communauté vivante et accueillante.',
    telephone: '+226 70 11 22 33',
    adresse: 'Quartier Dafra, Bobo-Dioulasso',
    horaires: ['Lun-Sam : 8h - 16h', 'Dim : 7h - 12h'],
    estFavori: true,
  },
  {
    id: 'p3',
    nom: 'Paroisse Sacré-Cœur',
    ville: 'Ouagadougou',
    diocese: 'Archidiocèse de Ouagadougou',
    pays: 'Burkina Faso',
    distance: '5,8 km',
    image: paroisseImages.p3,
    description: 'Centre spirituel de la zone sud.',
    telephone: '+226 70 44 55 66',
    adresse: 'Zone du Bois, Ouagadougou',
    horaires: ['Mar-Sam : 9h - 18h', 'Dim : messes dominicales'],
    estFavori: false,
  },
  {
    id: 'p4',
    nom: 'Paroisse Saint-Joseph',
    ville: 'Koudougou',
    diocese: 'Diocèse de Koudougou',
    pays: 'Burkina Faso',
    distance: '98 km',
    image: paroisseImages.p4,
    description: 'Paroisse dynamique au service des fidèles.',
    telephone: '+226 70 77 88 99',
    adresse: 'Centre-ville, Koudougou',
    horaires: ['Lun-Ven : 7h30 - 17h30'],
    estFavori: true,
  },
];

export const mockMesses: MockMesse[] = [
  { id: 'm1', paroisseId: 'p1', date: '2026-06-01', heure: '07:00', titre: 'Messe du matin', placesRestantes: 8, capacite: 20 },
  { id: 'm2', paroisseId: 'p1', date: '2026-06-01', heure: '09:00', titre: 'Messe dominicale', placesRestantes: 3, capacite: 30 },
  { id: 'm3', paroisseId: 'p1', date: '2026-06-01', heure: '18:00', titre: 'Messe du soir', placesRestantes: 12, capacite: 25 },
  { id: 'm4', paroisseId: 'p1', date: '2026-06-02', heure: '07:00', titre: 'Messe du matin', placesRestantes: 15, capacite: 20 },
];

export const mockPublications: MockPublication[] = [
  {
    id: 'pub1',
    paroisseId: 'p1',
    titre: 'Grande messe de Pâques',
    description: 'Venez nombreux célébrer la résurrection du Seigneur.',
    image: appImages.messeYagma,
    datePublication: '2026-05-28',
  },
  {
    id: 'pub2',
    paroisseId: 'p1',
    titre: 'Retraite paroissiale',
    description: 'Week-end de retraite spirituelle pour toute la famille.',
    image: appImages.cathedraleOuaga,
    datePublication: '2026-05-20',
  },
];

export const mockCampagnes: MockCampagne[] = [
  {
    id: 'c1',
    paroisseId: 'p1',
    titre: 'Rénovation du clocher',
    objectif: 5000000,
    collecte: 3200000,
    image: appImages.cathedraleOuaga,
  },
  {
    id: 'c2',
    paroisseId: 'p2',
    titre: 'Aide aux familles démunies',
    objectif: 2000000,
    collecte: 850000,
    image: appImages.ouagadougou,
  },
];

export const mockDemandes: MockDemande[] = [
  {
    id: 'd1',
    reference: 'MSS-2026-A8F3K2',
    paroisseId: 'p1',
    paroisseNom: 'Paroisse Saint-Pierre',
    typeMesse: 'Intention',
    intention: 'Action de grâce pour ma famille',
    date: '2026-06-01',
    creneau: '09:00',
    montant: 10000,
    statut: 'confirmee',
    estAnonyme: false,
    createdAt: '2026-05-25',
  },
  {
    id: 'd2',
    reference: 'MSS-2026-B2K9M1',
    paroisseId: 'p1',
    paroisseNom: 'Paroisse Saint-Pierre',
    typeMesse: 'Défunt',
    intention: 'Requiem pour feu Jean Ouédraogo',
    date: '2026-06-08',
    creneau: '07:00',
    montant: 5000,
    statut: 'en_attente',
    estAnonyme: true,
    createdAt: '2026-05-29',
  },
];

export const mockPaiements: MockPaiement[] = [
  {
    id: 'pay1',
    demandeId: 'd1',
    reference: 'PAY-20260525-X7K2',
    montant: 10000,
    methode: 'Orange Money',
    statut: 'reussi',
    date: '2026-05-25',
  },
  {
    id: 'pay2',
    demandeId: 'd2',
    reference: 'PAY-20260529-M3P1',
    montant: 5000,
    methode: 'Wave',
    statut: 'en_attente',
    date: '2026-05-29',
  },
];

export const typesMesse = [
  'Intention',
  'Défunt',
  'Action de grâce',
  'Anniversaire',
  'Mariage',
  'Autre',
] as const;

export const montantsRapides = [5000, 10000, 20000] as const;

export const methodesPaiement = [
  { id: 'orange', label: 'Orange Money', subtitle: 'Paiement mobile instantané' },
  { id: 'moov', label: 'Moov Money', subtitle: 'Compte Moov Burkina Faso' },
  { id: 'wave', label: 'Wave', subtitle: 'Transfert sécurisé Wave' },
  { id: 'especes', label: 'Espèces au secrétariat', subtitle: 'Règlement sur place à la paroisse' },
] as const;

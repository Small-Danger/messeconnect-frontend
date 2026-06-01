import {
  mockCampagnes,
  mockDemandes,
  mockMesses,
  mockPaiements,
  mockParoisses,
  mockPublications,
  mockUser,
  type MockCampagne,
  type MockDemande,
  type MockMesse,
  type MockPaiement,
  type MockParoisse,
  type MockPublication,
  type MockUser,
  methodesPaiement,
} from './data';
import type { FideleNotification } from '../../types/fidele';

const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

let paroisses = [...mockParoisses];
let demandes = [...mockDemandes];
let paiements = [...mockPaiements];
let campagnes = [...mockCampagnes];
let currentUser: MockUser | null = mockUser;

const mockNotifications: FideleNotification[] = [
  {
    id: 'notif-1',
    type: 'confirmation',
    titre: 'Demande enregistrée',
    contenu: 'Votre demande MC-2026-RRWVKXKO a été enregistrée.',
    statut: 'envoyee',
    demandeMesseId: mockDemandes[0]?.id ?? null,
    dateEnvoi: new Date().toISOString(),
  },
  {
    id: 'notif-2',
    type: 'paiement',
    titre: 'Paiement confirmé',
    contenu: 'Votre offrande de 20 000 FCFA a bien été reçue.',
    statut: 'lue',
    demandeMesseId: mockDemandes[0]?.id ?? null,
    dateEnvoi: new Date(Date.now() - 86400000).toISOString(),
  },
];

export const mockApi = {
  async login(email: string, _password: string) {
    await delay();
    if (email) {
      currentUser = { ...mockUser, email };
      return { user: currentUser, token: 'mock-token-fidele' };
    }
    throw new Error('Identifiants invalides');
  },

  async register(data: Record<string, string>) {
    await delay();
    currentUser = {
      id: `mock-${Date.now()}`,
      nom: data.nom,
      prenom: data.prenom,
      email: data.email,
      telephone: data.telephone,
      stats: { demandes: 0, montantTotal: 0, favoris: 0 },
    };
    demandes = [];
    paiements = [];
    return { user: currentUser, token: 'mock-token-fidele' };
  },

  async loginWithGoogle(_idToken: string) {
    await delay();
    currentUser = { ...mockUser, email: 'google.user@gmail.com', prenom: 'Utilisateur', nom: 'Google' };
    return { user: currentUser, token: 'mock-token-fidele-google' };
  },

  async getProfile() {
    await delay(200);
    return currentUser;
  },

  async logout() {
    await delay(200);
    currentUser = null;
  },

  async getParoisses(filters?: { q?: string; ville?: string; diocese?: string }) {
    await delay();
    let result = [...paroisses];
    if (filters?.q) {
      const q = filters.q.toLowerCase();
      result = result.filter((p) => p.nom.toLowerCase().includes(q) || p.ville.toLowerCase().includes(q));
    }
    if (filters?.ville && filters.ville !== 'Toutes') {
      const villeMap: Record<string, string> = {
        Ouaga: 'Ouagadougou',
        Bobo: 'Bobo',
        Koudougou: 'Koudougou',
      };
      const ville = villeMap[filters.ville] ?? filters.ville;
      result = result.filter((p) => p.ville.includes(ville));
    }
    return result;
  },

  async getParoisse(id: string) {
    await delay();
    const paroisse = paroisses.find((p) => p.id === id);
    if (!paroisse) throw new Error('Paroisse introuvable');
    return paroisse;
  },

  async toggleFavori(paroisseId: string) {
    await delay(200);
    paroisses = paroisses.map((p) =>
      p.id === paroisseId ? { ...p, estFavori: !p.estFavori } : p,
    );
    return paroisses.find((p) => p.id === paroisseId)!;
  },

  async getFavoris() {
    await delay();
    return paroisses.filter((p) => p.estFavori);
  },

  async getMesses(paroisseId: string, date?: string) {
    await delay();
    return mockMesses.filter(
      (m) => m.paroisseId === paroisseId && (!date || m.date === date),
    );
  },

  async getPublications(paroisseId: string) {
    await delay();
    return mockPublications.filter((p) => p.paroisseId === paroisseId);
  },

  async getCampagnes() {
    await delay();
    return campagnes;
  },

  async getDemandes() {
    await delay();
    return demandes;
  },

  async getDemande(id: string) {
    await delay();
    const demande = demandes.find((d) => d.id === id);
    if (!demande) throw new Error('Demande introuvable');
    return demande;
  },

  async getDemandeByReference(reference: string) {
    await delay();
    const demande = demandes.find((d) => d.reference === reference);
    if (!demande) throw new Error('Référence introuvable');
    return demande;
  },

  async createDemande(data: Omit<MockDemande, 'id' | 'reference' | 'createdAt' | 'statut'>) {
    await delay(600);
    const demande: MockDemande = {
      ...data,
      id: `d${Date.now()}`,
      reference: `MSS-2026-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      statut: 'en_attente',
      createdAt: new Date().toISOString().split('T')[0],
    };
    demandes = [demande, ...demandes];
    return demande;
  },

  async getPaiements() {
    await delay();
    return paiements;
  },

  async processPayment(demandeId: string, methode: string) {
    await delay(800);
    const demande = demandes.find((d) => d.id === demandeId);
    if (!demande) throw new Error('Demande introuvable');

    const methodeLabel = methodesPaiement.find((m) => m.id === methode)?.label ?? methode;

    const paiement: MockPaiement = {
      id: `pay${Date.now()}`,
      demandeId,
      reference: `PAY-${Date.now()}`,
      montant: demande.montant,
      methode: methodeLabel,
      statut: 'reussi',
      date: new Date().toISOString().split('T')[0],
    };
    paiements = [paiement, ...paiements];
    demandes = demandes.map((d) =>
      d.id === demandeId ? { ...d, statut: 'confirmee' as const } : d,
    );
    return { paiement, demande: demandes.find((d) => d.id === demandeId)! };
  },

  async processCampagneDonation(campagneId: string, montant: number, methode: string) {
    await delay(800);
    const campagne = campagnes.find((c) => c.id === campagneId);
    if (!campagne) throw new Error('Campagne introuvable');

    const methodeLabel = methodesPaiement.find((m) => m.id === methode)?.label ?? methode;

    const paiement: MockPaiement = {
      id: `pay${Date.now()}`,
      demandeId: '',
      reference: `DON-${Date.now()}`,
      montant,
      methode: methodeLabel,
      statut: 'reussi',
      date: new Date().toISOString().split('T')[0],
    };
    paiements = [paiement, ...paiements];
    campagnes = campagnes.map((c) =>
      c.id === campagneId ? { ...c, collecte: c.collecte + montant } : c,
    );

    return { paiement, campagne: campagnes.find((c) => c.id === campagneId)! };
  },

  async getNotifications() {
    await delay(300);
    if (!currentUser) return [];
    return [...mockNotifications].sort(
      (a, b) => new Date(b.dateEnvoi).getTime() - new Date(a.dateEnvoi).getTime(),
    );
  },

  async markNotificationRead(id: string) {
    await delay(200);
    const index = mockNotifications.findIndex((n) => n.id === id);
    if (index === -1) throw new Error('Notification introuvable');
    mockNotifications[index] = { ...mockNotifications[index], statut: 'lue' };
    return mockNotifications[index];
  },
};

export type {
  MockCampagne,
  MockDemande,
  MockMesse,
  MockPaiement,
  MockParoisse,
  MockPublication,
  MockUser,
};

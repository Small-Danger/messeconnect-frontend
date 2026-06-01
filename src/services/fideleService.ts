import { USE_MOCK_API } from '../config/env';
import { fideleApi, type CreateDemandePayload } from './api/fidele';
import { resolveMoyenPaiementId } from './api/mappers/paiement';
import { mapFideleUser } from './api/mappers/fidele';
import { mapFideleNotification } from './api/mappers/fideleNotification';
import { mapFideleCampagne, mapFidelePublication } from './api/mappers/fideleContent';
import { mockApi } from './mockApi';
import type { MockDemande, MockMesse, MockParoisse, MockPaiement, MockUser, MockPublication, MockCampagne } from './mockApi/data';
import type { FideleNotification } from '../types/fidele';

export const fideleService = {
  async login(email: string, password: string): Promise<{ user: MockUser; token: string }> {
    if (USE_MOCK_API) return mockApi.login(email, password);
    const res = await fideleApi.login(email, password);
    return { user: mapFideleUser(res.user), token: res.token };
  },

  async register(data: Record<string, string>): Promise<{ user: MockUser; token: string }> {
    if (USE_MOCK_API) return mockApi.register(data);
    const payload = {
      ...data,
      password_confirmation: data.password_confirmation ?? data.password,
    };
    const res = await fideleApi.register(payload);
    return { user: mapFideleUser(res.user), token: res.token };
  },

  async loginWithGoogle(idToken: string): Promise<{ user: MockUser; token: string }> {
    if (USE_MOCK_API) return mockApi.loginWithGoogle(idToken);
    const res = await fideleApi.loginWithGoogle(idToken);
    return { user: mapFideleUser(res.user), token: res.token };
  },

  async logout(token: string | null): Promise<void> {
    if (USE_MOCK_API) {
      await mockApi.logout();
      return;
    }
    if (token) await fideleApi.logout(token);
  },

  async getProfile(token: string | null): Promise<MockUser | null> {
    if (USE_MOCK_API) return mockApi.getProfile();
    if (!token) return null;
    const res = await fideleApi.me(token);
    const user = mapFideleUser(res.user);
    const [demandes, favoris, paiements] = await Promise.all([
      fideleApi.getDemandes(token),
      fideleApi.getFavoris(token),
      fideleApi.getPaiements(token),
    ]);
    user.stats = {
      demandes: demandes.length,
      favoris: favoris.length,
      montantTotal: paiements
        .filter((p) => p.statut === 'reussi')
        .reduce((sum, p) => sum + p.montant, 0),
    };
    return user;
  },

  async updateProfile(
    token: string | null,
    data: Partial<Pick<MockUser, 'nom' | 'prenom' | 'email' | 'telephone'>>,
  ): Promise<MockUser> {
    if (USE_MOCK_API) {
      const user = await mockApi.getProfile();
      if (!user) throw new Error('Non connecté');
      return { ...user, ...data };
    }
    if (!token) throw new Error('Non authentifié');
    await fideleApi.updateProfile(token, data as Record<string, string>);
    const res = await fideleApi.me(token);
    const user = mapFideleUser(res.user);
    const [demandes, favoris, paiements] = await Promise.all([
      fideleApi.getDemandes(token),
      fideleApi.getFavoris(token),
      fideleApi.getPaiements(token),
    ]);
    user.stats = {
      demandes: demandes.length,
      favoris: favoris.length,
      montantTotal: paiements
        .filter((p) => p.statut === 'reussi')
        .reduce((sum, p) => sum + p.montant, 0),
    };
    return user;
  },

  async getParoisses(
    filters?: { q?: string; ville?: string },
    token?: string | null,
  ): Promise<MockParoisse[]> {
    if (USE_MOCK_API) return mockApi.getParoisses(filters);
    return fideleApi.getParoisses(filters, token);
  },

  async getParoisse(id: string, token?: string | null): Promise<MockParoisse> {
    if (USE_MOCK_API) return mockApi.getParoisse(id);
    return fideleApi.getParoisse(id, token);
  },

  async getFavoris(token: string | null): Promise<MockParoisse[]> {
    if (USE_MOCK_API) return mockApi.getFavoris();
    if (!token) return [];
    return fideleApi.getFavoris(token);
  },

  async toggleFavori(id: string, token: string | null): Promise<MockParoisse> {
    if (USE_MOCK_API) return mockApi.toggleFavori(id);
    if (!token) throw new Error('Connexion requise pour les favoris');
    const paroisse = await fideleApi.getParoisse(id, token);
    if (paroisse.estFavori) {
      await fideleApi.removeFavori(id, token);
    } else {
      await fideleApi.addFavori(id, token);
    }
    return fideleApi.getParoisse(id, token);
  },

  async getTypeOffrandes(paroisseId: string, token?: string | null) {
    if (USE_MOCK_API) return null;
    return fideleApi.getTypeOffrandes(paroisseId, token);
  },

  async getMesses(paroisseId: string, date?: string, token?: string | null): Promise<MockMesse[]> {
    if (USE_MOCK_API) return mockApi.getMesses(paroisseId, date);
    const messes = await fideleApi.getMesses(paroisseId, token);
    return date ? messes.filter((m) => m.date === date) : messes;
  },

  async getPublications(paroisseId: string, token?: string | null): Promise<MockPublication[]> {
    if (USE_MOCK_API) return mockApi.getPublications(paroisseId);
    const pubs = await fideleApi.getPublications(paroisseId, token);
    return pubs.map((p) => mapFidelePublication(p, paroisseId));
  },

  async getCampagnes(token?: string | null): Promise<MockCampagne[]> {
    if (USE_MOCK_API) return mockApi.getCampagnes();
    const paroisses = await fideleApi.getParoisses(undefined, token);
    const batches = await Promise.all(
      paroisses.map(async (p) => {
        const camps = await fideleApi.getCampagnesForParoisse(p.id, token);
        return camps.map((c) => mapFideleCampagne(c, p.id));
      }),
    );
    return batches.flat();
  },

  async getCampagne(campagneId: string, token?: string | null): Promise<MockCampagne | null> {
    const campagnes = await this.getCampagnes(token);
    return campagnes.find((c) => c.id === campagneId) ?? null;
  },

  async getDemandes(token: string | null): Promise<MockDemande[]> {
    if (USE_MOCK_API) return mockApi.getDemandes();
    if (!token) return [];
    return fideleApi.getDemandes(token);
  },

  async getDemande(id: string, token?: string | null): Promise<MockDemande> {
    if (USE_MOCK_API) return mockApi.getDemande(id);
    if (token) return fideleApi.getDemande(id, token);
    throw new Error('Connexion requise pour consulter cette demande');
  },

  async getDemandeByReference(reference: string): Promise<MockDemande> {
    if (USE_MOCK_API) return mockApi.getDemandeByReference(reference);
    return fideleApi.getDemandeByReference(reference);
  },

  async createDemande(
    data: Omit<MockDemande, 'id' | 'reference' | 'createdAt' | 'statut'> & {
      messeId?: string;
      typeOffrandeId?: string;
    },
    token?: string | null,
  ): Promise<MockDemande> {
    if (USE_MOCK_API) return mockApi.createDemande(data);

    if (!data.messeId || !data.typeOffrandeId) {
      throw new Error('Messe et type d\'offrande requis');
    }

    const payload: CreateDemandePayload = {
      paroisse_id: data.paroisseId,
      messe_id: data.messeId,
      type_offrande_id: data.typeOffrandeId,
      montant: data.montant,
      intention: data.intention,
      est_anonyme: data.estAnonyme,
    };

    return fideleApi.createDemande(payload, token);
  },

  async getPaiements(token: string | null): Promise<MockPaiement[]> {
    if (USE_MOCK_API) return mockApi.getPaiements();
    if (!token) return [];
    return fideleApi.getPaiements(token);
  },

  async getNotifications(token: string | null): Promise<FideleNotification[]> {
    if (USE_MOCK_API) return mockApi.getNotifications();
    if (!token) return [];
    const res = await fideleApi.getNotifications(token);
    return res.notifications.map(mapFideleNotification);
  },

  async markNotificationRead(token: string | null, id: string): Promise<FideleNotification> {
    if (USE_MOCK_API) return mockApi.markNotificationRead(id);
    if (!token) throw new Error('Non authentifié');
    const res = await fideleApi.markNotificationRead(token, id);
    return mapFideleNotification(res.notification);
  },

  async processPayment(
    demandeId: string,
    methode: string,
    token?: string | null,
    options?: { paroisseId?: string; reference?: string },
  ): Promise<{ paiement: MockPaiement; demande: MockDemande }> {
    if (USE_MOCK_API) return mockApi.processPayment(demandeId, methode);

    let demande: MockDemande | null = null;
    if (token) {
      try {
        demande = await fideleApi.getDemande(demandeId, token);
      } catch {
        /* fidèle non connecté ou demande anonyme */
      }
    }

    const paroisseId = demande?.paroisseId ?? options?.paroisseId;
    if (!paroisseId) throw new Error('Informations de demande manquantes');

    const moyens = await fideleApi.getMoyenPaiements(paroisseId, token);
    const moyenId = resolveMoyenPaiementId(methode, moyens);
    if (!moyenId) throw new Error('Moyen de paiement indisponible pour cette paroisse');

    const paiementApi = await fideleApi.initierPaiement(demandeId, moyenId, token);
    await fideleApi.confirmerPaiement(String(paiementApi.id));

    let updated: MockDemande;
    if (token) {
      try {
        updated = await fideleApi.getDemande(demandeId, token);
      } catch {
        updated = await fideleApi.getDemandeByReference(options?.reference ?? demande!.reference);
      }
    } else if (options?.reference) {
      updated = await fideleApi.getDemandeByReference(options.reference);
    } else if (demande) {
      updated = { ...demande, statut: 'confirmee' };
    } else {
      throw new Error('Impossible de récupérer la demande après paiement');
    }

    return {
      paiement: {
        id: String(paiementApi.id),
        demandeId,
        reference: paiementApi.reference_interne ?? String(paiementApi.id),
        montant: Number(paiementApi.montant),
        methode,
        statut: 'reussi',
        date: new Date().toISOString().slice(0, 10),
      },
      demande: updated,
    };
  },

  async processCampagneDonation(
    campagneId: string,
    paroisseId: string,
    montant: number,
    methode: string,
    token?: string | null,
  ): Promise<{ paiement: MockPaiement; campagne: MockCampagne }> {
    if (USE_MOCK_API) return mockApi.processCampagneDonation(campagneId, montant, methode);

    const moyens = await fideleApi.getMoyenPaiements(paroisseId, token);
    const moyenId = resolveMoyenPaiementId(methode, moyens);
    if (!moyenId) throw new Error('Moyen de paiement indisponible pour cette paroisse');

    const paiementApi = await fideleApi.initierPaiementCampagne(campagneId, montant, moyenId, token);
    await fideleApi.confirmerPaiement(String(paiementApi.id));

    const campagne = await this.getCampagne(campagneId, token);
    if (!campagne) throw new Error('Campagne introuvable après le don');

    return {
      paiement: {
        id: String(paiementApi.id),
        demandeId: '',
        reference: paiementApi.reference_interne ?? String(paiementApi.id),
        montant: Number(paiementApi.montant),
        methode,
        statut: 'reussi',
        date: new Date().toISOString().slice(0, 10),
      },
      campagne,
    };
  },
};

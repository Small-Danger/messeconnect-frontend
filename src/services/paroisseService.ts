import { USE_MOCK_API } from '../config/env';
import {
  paroisseApi,
  type MesseWithDemandes,
  type ParoisseDashboardData,
  type ParoisseRegisterPayload,
  type RegistrationDiocese,
} from './api/paroisse';
import { mapParoisseProfile } from './api/mappers/paroisse';
import type {
  CampagneParoisse,
  CampagneDonsResume,
  DonCampagneParoisse,
  MoyenPaiementParoisse,
  ParoisseDemande,
  ParoisseMedia,
  ParoisseMesse,
  ParoisseProfile,
  PublicationParoisse,
  TicketSupport,
  TypeOffrandeParoisse,
} from './mockApi/paroisse/data';
import { paroisseMockApi } from './mockApi/paroisse';
import type { GuichetIntentionInput, HistoriqueFilters, PlanningFilters } from '../types/paroisseIntentions';

export const paroisseService = {
  async getRegistrationDioceses(): Promise<RegistrationDiocese[]> {
    if (USE_MOCK_API) {
      return [
        { id: 'mock-ouaga', nom: 'Archidiocèse de Ouagadougou', ville: 'Ouagadougou' },
        { id: 'mock-bobo', nom: 'Diocèse de Bobo-Dioulasso', ville: 'Bobo-Dioulasso' },
      ];
    }
    const res = await paroisseApi.getRegistrationDioceses();
    return res.dioceses;
  },

  async registerParoisse(data: ParoisseRegisterPayload): Promise<void> {
    if (USE_MOCK_API) {
      await paroisseMockApi.register({});
      return;
    }
    await paroisseApi.register(data);
  },

  async login(email: string, password: string): Promise<{ token: string }> {
    if (USE_MOCK_API) {
      const res = await paroisseMockApi.login(email, password);
      return { token: res.token };
    }
    const res = await paroisseApi.login(email, password);
    return { token: res.token };
  },

  async logout(token: string | null): Promise<void> {
    if (USE_MOCK_API || !token) return;
    try {
      await paroisseApi.logout(token);
    } catch {
      // Session déjà expirée côté serveur.
    }
  },

  async getProfile(token: string | null): Promise<ParoisseProfile | null> {
    if (USE_MOCK_API) return paroisseMockApi.getProfile();
    if (!token) return null;
    return paroisseApi.getProfile(token);
  },

  async updateProfile(token: string | null, data: Partial<ParoisseProfile>): Promise<ParoisseProfile> {
    if (USE_MOCK_API) return paroisseMockApi.updateProfile(data);
    if (!token) throw new Error('Non authentifié');
    return paroisseApi.updateProfile(token, data);
  },

  async uploadProfileImage(
    token: string | null,
    type: 'logo' | 'banniere',
    file: File,
  ): Promise<ParoisseProfile> {
    if (USE_MOCK_API) {
      await new Promise((r) => setTimeout(r, 400));
      const url = `https://picsum.photos/seed/${Date.now()}/800/600`;
      const field = type === 'logo' ? 'photoProfil' : 'photoCouverture';
      return paroisseMockApi.updateProfile({ [field]: url });
    }
    if (!token) throw new Error('Non authentifié');
    const res = await paroisseApi.uploadProfileImage(token, type, file);
    return res.profile;
  },

  async getDashboard(token: string | null): Promise<ParoisseDashboardData | null> {
    if (USE_MOCK_API) return paroisseMockApi.getDashboard();
    if (!token) return null;
    return paroisseApi.getDashboard(token);
  },

  async getDemandes(
    token: string | null,
    filters?: {
      q?: string;
      statut?: string;
      date?: string;
      messeId?: string;
      vue?: string;
      from?: string;
      to?: string;
    },
  ): Promise<ParoisseDemande[]> {
    if (USE_MOCK_API) return paroisseMockApi.getDemandes(filters);
    if (!token) return [];
    return paroisseApi.getDemandes(token, filters);
  },

  async getMesseWithDemandes(token: string | null, messeId: string): Promise<MesseWithDemandes> {
    if (USE_MOCK_API) return paroisseMockApi.getMesseWithDemandes(messeId);
    if (!token) throw new Error('Non authentifié');
    return paroisseApi.getMesseWithDemandes(token, messeId);
  },

  async celebrerDemande(token: string | null, id: string): Promise<void> {
    if (USE_MOCK_API) {
      await paroisseMockApi.celebrerDemande(id);
      return;
    }
    if (!token) throw new Error('Non authentifié');
    await paroisseApi.updateDemandeStatut(token, id, 'celebree');
  },

  async celebrerMesse(token: string | null, messeId: string): Promise<MesseWithDemandes> {
    if (USE_MOCK_API) return paroisseMockApi.celebrerMesse(messeId);
    if (!token) throw new Error('Non authentifié');
    return paroisseApi.celebrerMesse(token, messeId);
  },

  async validerDemande(token: string | null, id: string): Promise<void> {
    if (USE_MOCK_API) {
      await paroisseMockApi.validerDemande(id);
      return;
    }
    if (!token) throw new Error('Non authentifié');
    await paroisseApi.updateDemandeStatut(token, id, 'confirmee');
  },

  async rejeterDemande(token: string | null, id: string, motif: string): Promise<void> {
    if (USE_MOCK_API) {
      await paroisseMockApi.rejeterDemande(id, motif);
      return;
    }
    if (!token) throw new Error('Non authentifié');
    await paroisseApi.updateDemandeStatut(token, id, 'annulee', motif);
  },

  async getMesses(token: string | null): Promise<ParoisseMesse[]> {
    if (USE_MOCK_API) return paroisseMockApi.getMesses();
    if (!token) return [];
    return paroisseApi.getMesses(token);
  },

  async addMesse(
    token: string | null,
    data: Omit<ParoisseMesse, 'id' | 'intentions' | 'participants' | 'statut'>,
  ): Promise<void> {
    if (USE_MOCK_API) {
      await paroisseMockApi.addMesse(data);
      return;
    }
    if (!token) throw new Error('Non authentifié');
    await paroisseApi.createMesse(token, data);
  },

  async updateMesse(
    token: string | null,
    id: string,
    data: {
      titre?: string;
      date?: string;
      heure?: string;
      capacite_max?: number | null;
    },
  ): Promise<ParoisseMesse> {
    if (USE_MOCK_API) return paroisseMockApi.updateMesse(id, data);
    if (!token) throw new Error('Non authentifié');
    return paroisseApi.updateMesse(token, id, data);
  },

  async deleteMesse(token: string | null, id: string): Promise<void> {
    if (USE_MOCK_API) return paroisseMockApi.deleteMesse(id);
    if (!token) throw new Error('Non authentifié');
    await paroisseApi.deleteMesse(token, id);
  },

  async annulerMesse(token: string | null, id: string): Promise<MesseWithDemandes> {
    if (USE_MOCK_API) return paroisseMockApi.annulerMesse(id);
    if (!token) throw new Error('Non authentifié');
    return paroisseApi.annulerMesse(token, id);
  },

  async scheduleRecurringMesses(
    token: string | null,
    data: {
      titre: string;
      jour_semaine: number;
      heure: string;
      semaines: number;
      capacite_max?: number;
      reservable?: boolean;
      pretre?: string;
      lieu?: string;
    },
  ): Promise<number> {
    if (USE_MOCK_API) {
      return paroisseMockApi.addRecurringMesses(data);
    }
    if (!token) throw new Error('Non authentifié');

    const descriptionParts = [data.pretre ? `Prêtre: ${data.pretre}` : '', data.lieu ? `Lieu: ${data.lieu}` : '']
      .filter(Boolean)
      .join('\n');

    return paroisseApi.createModeleMesseAndGenerate(token, {
      titre: data.titre,
      jour_semaine: data.jour_semaine,
      heure: data.heure,
      semaines: data.semaines,
      capacite_max: data.capacite_max,
      reservable: data.reservable ?? true,
      description: descriptionParts || undefined,
      date_debut: new Date().toISOString().slice(0, 10),
    });
  },

  async getMedias(token: string | null): Promise<ParoisseMedia[]> {
    if (USE_MOCK_API) return paroisseMockApi.getMedias();
    if (!token) return [];
    return paroisseApi.getMedias(token);
  },

  async addMedia(
    token: string | null,
    data: { url: string; type?: 'image' | 'video'; ordre?: number },
  ): Promise<void> {
    if (USE_MOCK_API) {
      await paroisseMockApi.addMedia({
        url: data.url,
        titre: data.type === 'video' ? 'Vidéo paroisse' : 'Photo paroisse',
        description: data.url,
      });
      return;
    }
    if (!token) throw new Error('Non authentifié');
    await paroisseApi.addMedia(token, data);
  },

  async updateMedia(
    token: string | null,
    id: string,
    data: { url?: string; type?: 'image' | 'video'; ordre?: number },
  ): Promise<void> {
    if (USE_MOCK_API) {
      await paroisseMockApi.updateMedia(id, data);
      return;
    }
    if (!token) throw new Error('Non authentifié');
    await paroisseApi.updateMedia(token, id, data);
  },

  async deleteMedia(token: string | null, id: string): Promise<void> {
    if (USE_MOCK_API) {
      await paroisseMockApi.deleteMedia(id);
      return;
    }
    if (!token) throw new Error('Non authentifié');
    await paroisseApi.deleteMedia(token, id);
  },

  async getMoyensPaiement(token: string | null): Promise<MoyenPaiementParoisse[]> {
    if (USE_MOCK_API) return paroisseMockApi.getMoyensPaiement();
    if (!token) return [];
    return paroisseApi.getMoyensPaiement(token);
  },

  async addMoyenPaiement(token: string | null, data: Omit<MoyenPaiementParoisse, 'id'>): Promise<void> {
    if (USE_MOCK_API) {
      await paroisseMockApi.addMoyenPaiement(data);
      return;
    }
    if (!token) throw new Error('Non authentifié');
    await paroisseApi.addMoyenPaiement(token, data);
  },

  async updateMoyenPaiement(
    token: string | null,
    id: string,
    data: Partial<Omit<MoyenPaiementParoisse, 'id'>>,
  ): Promise<void> {
    if (USE_MOCK_API) {
      await paroisseMockApi.updateMoyenPaiement(id, data);
      return;
    }
    if (!token) throw new Error('Non authentifié');
    await paroisseApi.updateMoyenPaiement(token, id, data);
  },

  async deleteMoyenPaiement(token: string | null, id: string): Promise<void> {
    if (USE_MOCK_API) {
      await paroisseMockApi.deleteMoyenPaiement(id);
      return;
    }
    if (!token) throw new Error('Non authentifié');
    await paroisseApi.deleteMoyenPaiement(token, id);
  },

  async getTypesOffrandes(token: string | null): Promise<TypeOffrandeParoisse[]> {
    if (USE_MOCK_API) return paroisseMockApi.getTypesOffrandes();
    if (!token) return [];
    return paroisseApi.getTypesOffrandes(token);
  },

  async addTypeOffrande(
    token: string | null,
    data: Omit<TypeOffrandeParoisse, 'id' | 'actif'>,
  ): Promise<void> {
    if (USE_MOCK_API) {
      await paroisseMockApi.addTypeOffrande(data);
      return;
    }
    if (!token) throw new Error('Non authentifié');
    await paroisseApi.addTypeOffrande(token, data);
  },

  async updateTypeOffrande(
    token: string | null,
    id: string,
    data: Partial<Omit<TypeOffrandeParoisse, 'id'>>,
  ): Promise<void> {
    if (USE_MOCK_API) {
      await paroisseMockApi.updateTypeOffrande(id, data);
      return;
    }
    if (!token) throw new Error('Non authentifié');
    await paroisseApi.updateTypeOffrande(token, id, data);
  },

  async deleteTypeOffrande(token: string | null, id: string): Promise<void> {
    if (USE_MOCK_API) {
      await paroisseMockApi.deleteTypeOffrande(id);
      return;
    }
    if (!token) throw new Error('Non authentifié');
    await paroisseApi.deleteTypeOffrande(token, id);
  },

  async getPublications(token: string | null): Promise<PublicationParoisse[]> {
    if (USE_MOCK_API) return paroisseMockApi.getPublications();
    if (!token) return [];
    return paroisseApi.getPublications(token);
  },

  async addPublication(token: string | null, data: Omit<PublicationParoisse, 'id'>): Promise<void> {
    if (USE_MOCK_API) {
      await paroisseMockApi.addPublication(data);
      return;
    }
    if (!token) throw new Error('Non authentifié');
    await paroisseApi.addPublication(token, data);
  },

  async uploadPublicationImages(token: string | null, files: File[]): Promise<string[]> {
    if (USE_MOCK_API) {
      await new Promise((r) => setTimeout(r, 400));
      return files.map((_, index) => `https://picsum.photos/seed/${Date.now()}-${index}/800/600`);
    }
    if (!token) throw new Error('Non authentifié');
    return paroisseApi.uploadPublicationImages(token, files);
  },

  async uploadCampagneImage(token: string | null, file: File): Promise<string> {
    if (USE_MOCK_API) {
      await new Promise((r) => setTimeout(r, 400));
      return `https://picsum.photos/seed/${Date.now()}/800/600`;
    }
    if (!token) throw new Error('Non authentifié');
    return paroisseApi.uploadCampagneImage(token, file);
  },

  async updatePublication(
    token: string | null,
    id: string,
    data: Partial<Omit<PublicationParoisse, 'id'>>,
  ): Promise<PublicationParoisse> {
    if (USE_MOCK_API) return paroisseMockApi.updatePublication(id, data);
    if (!token) throw new Error('Non authentifié');
    return paroisseApi.updatePublication(token, id, data);
  },

  async deletePublication(token: string | null, id: string): Promise<void> {
    if (USE_MOCK_API) {
      await paroisseMockApi.deletePublication(id);
      return;
    }
    if (!token) throw new Error('Non authentifié');
    await paroisseApi.deletePublication(token, id);
  },

  async getCampagnes(token: string | null): Promise<CampagneParoisse[]> {
    if (USE_MOCK_API) return paroisseMockApi.getCampagnes();
    if (!token) return [];
    return paroisseApi.getCampagnes(token);
  },

  async addCampagne(
    token: string | null,
    data: Omit<CampagneParoisse, 'id' | 'collecte'>,
  ): Promise<void> {
    if (USE_MOCK_API) {
      await paroisseMockApi.addCampagne(data);
      return;
    }
    if (!token) throw new Error('Non authentifié');
    await paroisseApi.addCampagne(token, data);
  },

  async updateCampagne(
    token: string | null,
    id: string,
    data: Partial<Omit<CampagneParoisse, 'id'>>,
  ): Promise<CampagneParoisse> {
    if (USE_MOCK_API) return paroisseMockApi.updateCampagne(id, data);
    if (!token) throw new Error('Non authentifié');
    return paroisseApi.updateCampagne(token, id, data);
  },

  async deleteCampagne(token: string | null, id: string): Promise<void> {
    if (USE_MOCK_API) {
      await paroisseMockApi.deleteCampagne(id);
      return;
    }
    if (!token) throw new Error('Non authentifié');
    await paroisseApi.deleteCampagne(token, id);
  },

  async getCampagneDons(
    token: string | null,
    campagneId: string,
  ): Promise<{ dons: DonCampagneParoisse[]; resume: CampagneDonsResume }> {
    if (USE_MOCK_API) return paroisseMockApi.getCampagneDons(campagneId);
    if (!token) throw new Error('Non authentifié');
    return paroisseApi.getCampagneDons(token, campagneId);
  },

  async getTickets(token: string | null): Promise<TicketSupport[]> {
    if (USE_MOCK_API) return paroisseMockApi.getTickets();
    if (!token) return [];
    return paroisseApi.getTickets(token);
  },

  async addTicket(
    token: string | null,
    data: { titre: string; categorie: string; description: string },
  ): Promise<TicketSupport> {
    if (USE_MOCK_API) {
      return paroisseMockApi.addTicket(data);
    }
    if (!token) throw new Error('Non authentifié');
    return paroisseApi.addTicket(token, data);
  },

  async getPlanningIntentions(token: string | null, filters?: PlanningFilters) {
    if (USE_MOCK_API) return paroisseMockApi.getPlanningIntentions(filters);
    if (!token) return [];
    return paroisseApi.getPlanningIntentions(token, filters);
  },

  async getHistoriqueDemandes(token: string | null, filters?: HistoriqueFilters) {
    if (USE_MOCK_API) return paroisseMockApi.getHistoriqueDemandes(filters);
    if (!token) return [];
    return paroisseApi.getDemandes(token, {
      vue: filters?.vue ?? 'historique',
      from: filters?.from,
      to: filters?.to,
      q: filters?.q,
    });
  },

  async getCashPendingPayments(token: string | null) {
    if (USE_MOCK_API) return paroisseMockApi.getCashPendingPayments();
    if (!token) return [];
    return paroisseApi.getCashPendingPayments(token);
  },

  async confirmCashPayment(token: string | null, paiementId: string) {
    if (USE_MOCK_API) {
      await paroisseMockApi.confirmCashPayment(paiementId);
      return;
    }
    if (!token) throw new Error('Non authentifié');
    await paroisseApi.confirmCashPayment(token, paiementId);
  },

  async cancelCashPayment(token: string | null, paiementId: string) {
    if (USE_MOCK_API) {
      await paroisseMockApi.cancelCashPayment(paiementId);
      return;
    }
    if (!token) throw new Error('Non authentifié');
    await paroisseApi.cancelCashPayment(token, paiementId);
  },

  async createGuichetIntention(token: string | null, data: GuichetIntentionInput) {
    if (USE_MOCK_API) return paroisseMockApi.createGuichetIntention(data);
    if (!token) throw new Error('Non authentifié');
    return paroisseApi.createGuichetIntention(token, data);
  },
};

export { mapParoisseProfile };

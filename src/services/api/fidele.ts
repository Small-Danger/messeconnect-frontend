import { apiRequest } from './client';
import { mapFideleParoisse } from './mappers/fidele';
import {
  type ApiFideleCampagne,
  type ApiFidelePublication,
} from './mappers/fideleContent';
import {
  mapFideleDemande,
  mapFideleMesse,
  mapFidelePaiement,
  type ApiFideleDemande,
  type ApiMesse,
  type ApiMoyenPaiement,
  type ApiPaiement,
  type ApiTypeOffrande,
} from './mappers/fideleDemande';
import type { MockDemande, MockMesse, MockParoisse, MockPaiement, MockUser } from '../mockApi/data';
import type { ApiFideleParoisse, ApiFideleUser, AuthResponse } from './types';

export interface ApiFideleNotification {
  id: string;
  type: string;
  titre: string;
  contenu: string;
  statut: string;
  demande_messe_id?: string | null;
  date_envoi: string;
  created_at?: string;
}

export interface CreateDemandePayload {
  paroisse_id: string;
  messe_id: string;
  type_offrande_id: string;
  montant: number;
  intention?: string;
  est_anonyme?: boolean;
  nom_demandeur?: string;
  telephone_demandeur?: string;
  email_demandeur?: string;
}

export const fideleApi = {
  login(email: string, password: string) {
    return apiRequest<AuthResponse<ApiFideleUser>>('/fidele/login', {
      method: 'POST',
      body: { email, password },
    });
  },

  register(data: Record<string, string>) {
    return apiRequest<AuthResponse<ApiFideleUser>>('/fidele/register', {
      method: 'POST',
      body: data,
    });
  },

  loginWithGoogle(idToken: string) {
    return apiRequest<AuthResponse<ApiFideleUser>>('/fidele/auth/google', {
      method: 'POST',
      body: { id_token: idToken },
    });
  },

  me(token: string) {
    return apiRequest<{ user: ApiFideleUser }>('/fidele/me', { token });
  },

  updateProfile(token: string, data: Record<string, string>) {
    return apiRequest<{ user: ApiFideleUser }>('/fidele/profile', {
      method: 'PUT',
      body: data,
      token,
    });
  },

  logout(token: string) {
    return apiRequest<{ message: string }>('/fidele/logout', {
      method: 'POST',
      token,
    });
  },

  getNotifications(token: string) {
    return apiRequest<{ notifications: ApiFideleNotification[] }>('/fidele/notifications', { token });
  },

  markNotificationRead(token: string, id: string) {
    return apiRequest<{ notification: ApiFideleNotification }>(`/fidele/notifications/${id}/lue`, {
      method: 'PATCH',
      token,
    });
  },

  async getParoisses(filters?: { q?: string; ville?: string }, token?: string | null) {
    const params = new URLSearchParams();
    if (filters?.q) params.set('q', filters.q);
    if (filters?.ville && filters.ville !== 'Toutes') {
      const villeMap: Record<string, string> = {
        Ouaga: 'Ouagadougou',
        Bobo: 'Bobo',
        Koudougou: 'Koudougou',
      };
      const ville = villeMap[filters.ville] ?? filters.ville;
      if (ville) params.set('ville', ville);
    }
    const qs = params.toString();
    const res = await apiRequest<{ paroisses: ApiFideleParoisse[] }>(
      `/fidele/paroisses${qs ? `?${qs}` : ''}`,
      { token: token ?? undefined },
    );
    return res.paroisses.map(mapFideleParoisse);
  },

  async getParoisse(id: string, token?: string | null): Promise<MockParoisse> {
    const res = await apiRequest<{ paroisse: ApiFideleParoisse }>(`/fidele/paroisses/${id}`, {
      token: token ?? undefined,
    });
    return mapFideleParoisse(res.paroisse);
  },

  async getFavoris(token: string): Promise<MockParoisse[]> {
    const res = await apiRequest<{ paroisses: ApiFideleParoisse[] }>('/fidele/favoris', { token });
    return res.paroisses.map(mapFideleParoisse);
  },

  async addFavori(paroisseId: string, token: string) {
    await apiRequest(`/fidele/favoris/${paroisseId}`, { method: 'POST', token });
  },

  async removeFavori(paroisseId: string, token: string) {
    await apiRequest(`/fidele/favoris/${paroisseId}`, { method: 'DELETE', token });
  },

  async getTypeOffrandes(paroisseId: string, token?: string | null): Promise<ApiTypeOffrande[]> {
    const res = await apiRequest<{ type_offrandes: ApiTypeOffrande[] }>(
      `/fidele/paroisses/${paroisseId}/type-offrandes`,
      { token: token ?? undefined },
    );
    return res.type_offrandes;
  },

  async getMesses(paroisseId: string, token?: string | null): Promise<MockMesse[]> {
    const res = await apiRequest<{ messes: ApiMesse[] }>(
      `/fidele/paroisses/${paroisseId}/messes`,
      { token: token ?? undefined },
    );
    return res.messes.map((m) => mapFideleMesse(m, paroisseId));
  },

  async getMoyenPaiements(paroisseId: string, token?: string | null): Promise<ApiMoyenPaiement[]> {
    const res = await apiRequest<{ moyen_paiements: ApiMoyenPaiement[] }>(
      `/fidele/paroisses/${paroisseId}/moyen-paiements`,
      { token: token ?? undefined },
    );
    return res.moyen_paiements;
  },

  async getDemandes(token: string): Promise<MockDemande[]> {
    const res = await apiRequest<{ demandes: ApiFideleDemande[] }>('/fidele/demandes', { token });
    return res.demandes.map(mapFideleDemande);
  },

  async getDemande(id: string, token: string): Promise<MockDemande> {
    const res = await apiRequest<{ demande: ApiFideleDemande }>(`/fidele/demandes/${id}`, { token });
    return mapFideleDemande(res.demande);
  },

  async getDemandeByReference(reference: string): Promise<MockDemande> {
    const res = await apiRequest<{ demande: ApiFideleDemande }>(
      `/fidele/demandes/reference/${encodeURIComponent(reference)}`,
    );
    return mapFideleDemande(res.demande);
  },

  async createDemande(payload: CreateDemandePayload, token?: string | null): Promise<MockDemande> {
    const res = await apiRequest<{ demande: ApiFideleDemande }>('/fidele/demandes', {
      method: 'POST',
      body: payload,
      token: token ?? undefined,
    });
    return mapFideleDemande(res.demande);
  },

  async getPaiements(token: string): Promise<MockPaiement[]> {
    const res = await apiRequest<{ paiements: ApiPaiement[] }>('/fidele/paiements', { token });
    return res.paiements.map((p) => mapFidelePaiement(p, ''));
  },

  async initierPaiement(
    demandeId: string,
    moyenPaiementId: string,
    token?: string | null,
  ): Promise<ApiPaiement> {
    const res = await apiRequest<{ paiement: ApiPaiement }>(
      `/fidele/demandes/${demandeId}/paiements`,
      {
        method: 'POST',
        body: { moyen_paiement_id: moyenPaiementId },
        token: token ?? undefined,
      },
    );
    return res.paiement;
  },

  async confirmerPaiement(paiementId: string): Promise<ApiPaiement> {
    const res = await apiRequest<{ paiement: ApiPaiement }>(
      `/fidele/paiements/${paiementId}/confirmer`,
      { method: 'POST' },
    );
    return res.paiement;
  },

  async getPublications(paroisseId: string, token?: string | null) {
    const res = await apiRequest<{ publications: ApiFidelePublication[] }>(
      `/fidele/paroisses/${paroisseId}/publications`,
      { token: token ?? undefined },
    );
    return res.publications;
  },

  async getCampagnesForParoisse(paroisseId: string, token?: string | null) {
    const res = await apiRequest<{ campagnes: ApiFideleCampagne[] }>(
      `/fidele/paroisses/${paroisseId}/campagnes`,
      { token: token ?? undefined },
    );
    return res.campagnes;
  },

  async initierPaiementCampagne(
    campagneId: string,
    montant: number,
    moyenPaiementId: string,
    token?: string | null,
  ): Promise<ApiPaiement> {
    const res = await apiRequest<{ paiement: ApiPaiement }>(
      `/fidele/campagnes/${campagneId}/paiements`,
      {
        method: 'POST',
        body: { montant, moyen_paiement_id: moyenPaiementId },
        token: token ?? undefined,
      },
    );
    return res.paiement;
  },
};

export type { MockUser, MockParoisse };

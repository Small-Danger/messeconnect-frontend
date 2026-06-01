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
  TicketDetail,
  TransactionDetail,
  TransactionSynthese,
  UserDetail,
} from '../mockAdminApi/data';
import { apiRequest } from './client';
import {
  mapAdminDashboard,
  mapAdminParish,
  mapAdminParishDetail,
  mapAdminUser,
  mapAdminUserDetail,
  mapAdminTicket,
  mapAdminTicketDetail,
  mapAdminTransaction,
  mapAdminTransactionDetail,
  mapTransactionSynthese,
  computeTransactionSynthese,
  mapAdminDiocese,
  mapAdminAbonnement,
  mapAdminPublicationModeration,
  mapAdminCampagneModeration,
  mapJournalAuditEntry,
  type ApiAdminDashboard,
  type ApiAdminDiocese,
  type ApiAdminAbonnement,
  type ApiAdminPublication,
  type ApiAdminCampagne,
  type ApiJournalAuditEntry,
  type ApiAdminFidele,
  type ApiAdminPaiement,
  type ApiTransactionSynthese,
  type ApiAdminParoisse,
  type ApiAdminTicket,
} from './mappers/admin';
import type { ApiAdminUser, AuthResponse } from './types';

function asResourceList<T>(value: T[] | { data: T[] } | undefined): T[] {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === 'object' && 'data' in value && Array.isArray(value.data)) {
    return value.data;
  }
  return [];
}

export const adminApi = {
  login(email: string, password: string) {
    return apiRequest<AuthResponse<ApiAdminUser>>('/admin/login', {
      method: 'POST',
      body: { email, password },
    });
  },

  me(token: string) {
    return apiRequest<{ user: ApiAdminUser }>('/admin/me', { token });
  },

  logout(token: string) {
    return apiRequest<{ message: string }>('/admin/logout', {
      method: 'POST',
      token,
    });
  },

  async getDashboard(token: string): Promise<DashboardData> {
    const res = await apiRequest<ApiAdminDashboard>('/admin/dashboard', { token });
    return mapAdminDashboard(res.statistiques, res.activites, res.graphiques);
  },

  async getUsers(token: string, filters?: { q?: string; statut?: string }): Promise<AdminUser[]> {
    const params = new URLSearchParams();
    if (filters?.q) params.set('q', filters.q);
    if (filters?.statut && filters.statut !== 'tous') {
      params.set('actif', filters.statut === 'actif' ? '1' : '0');
    }
    const qs = params.toString();
    const res = await apiRequest<{ fideles: ApiAdminFidele[] | { data: ApiAdminFidele[] } }>(
      `/admin/fideles${qs ? `?${qs}` : ''}`,
      { token },
    );
    return asResourceList(res.fideles).map(mapAdminUser);
  },

  async getUser(token: string, id: string): Promise<UserDetail | null> {
    try {
      const res = await apiRequest<{ fidele: ApiAdminFidele }>(`/admin/fideles/${id}`, { token });
      return mapAdminUserDetail(res.fidele);
    } catch {
      return null;
    }
  },

  async updateUserActif(token: string, id: string, actif: boolean): Promise<void> {
    await apiRequest(`/admin/fideles/${id}/actif`, {
      method: 'PATCH',
      body: { actif },
      token,
    });
  },

  async getParishes(token: string, filters?: { q?: string; statut?: string }): Promise<AdminParish[]> {
    const params = new URLSearchParams();
    if (filters?.q) params.set('q', filters.q);
    if (filters?.statut && filters.statut !== 'tous') params.set('statut', filters.statut);
    const qs = params.toString();
    const res = await apiRequest<{ paroisses: ApiAdminParoisse[] | { data: ApiAdminParoisse[] } }>(
      `/admin/paroisses${qs ? `?${qs}` : ''}`,
      { token },
    );
    return asResourceList(res.paroisses).map(mapAdminParish);
  },

  async getParish(token: string, id: string): Promise<ParishDetail | null> {
    try {
      const res = await apiRequest<{ paroisse: ApiAdminParoisse }>(`/admin/paroisses/${id}`, { token });
      return mapAdminParishDetail(res.paroisse);
    } catch {
      return null;
    }
  },

  async updateParishStatut(
    token: string,
    id: string,
    statut: string,
    commentaire?: string,
  ): Promise<void> {
    await apiRequest(`/admin/paroisses/${id}/statut`, {
      method: 'PATCH',
      body: { statut, commentaire },
      token,
    });
  },

  async updateParishActif(token: string, id: string, actif: boolean): Promise<void> {
    await apiRequest(`/admin/paroisses/${id}/actif`, {
      method: 'PATCH',
      body: { actif },
      token,
    });
  },

  async getDioceses(token: string, filters?: { q?: string; actif?: boolean }): Promise<AdminDiocese[]> {
    const params = new URLSearchParams();
    if (filters?.q) params.set('q', filters.q);
    if (filters?.actif != null) params.set('actif', filters.actif ? '1' : '0');
    const qs = params.toString();
    const res = await apiRequest<{ dioceses: ApiAdminDiocese[] }>(
      `/admin/dioceses${qs ? `?${qs}` : ''}`,
      { token },
    );
    return res.dioceses.map(mapAdminDiocese);
  },

  async createDiocese(
    token: string,
    data: { nom: string; ville?: string; pays?: string; description?: string; actif?: boolean },
  ): Promise<AdminDiocese> {
    const res = await apiRequest<{ diocese: ApiAdminDiocese }>('/admin/dioceses', {
      method: 'POST',
      body: data,
      token,
    });
    return mapAdminDiocese(res.diocese);
  },

  async updateDiocese(
    token: string,
    id: string,
    data: Partial<{ nom: string; ville: string; pays: string; description: string; actif: boolean }>,
  ): Promise<AdminDiocese> {
    const res = await apiRequest<{ diocese: ApiAdminDiocese }>(`/admin/dioceses/${id}`, {
      method: 'PUT',
      body: data,
      token,
    });
    return mapAdminDiocese(res.diocese);
  },

  async deleteDiocese(token: string, id: string): Promise<void> {
    await apiRequest(`/admin/dioceses/${id}`, { method: 'DELETE', token });
  },

  async getAbonnements(token: string, filters?: { paroisseId?: string; statut?: string }): Promise<AdminAbonnement[]> {
    const params = new URLSearchParams();
    if (filters?.paroisseId) params.set('paroisse_id', filters.paroisseId);
    if (filters?.statut) params.set('statut', filters.statut);
    const qs = params.toString();
    const res = await apiRequest<{ abonnements: ApiAdminAbonnement[] }>(
      `/admin/abonnements${qs ? `?${qs}` : ''}`,
      { token },
    );
    return res.abonnements.map(mapAdminAbonnement);
  },

  async createAbonnement(
    token: string,
    data: {
      paroisse_id: string;
      plan: string;
      montant: number;
      date_debut: string;
      date_fin?: string;
      statut?: string;
    },
  ): Promise<AdminAbonnement> {
    const res = await apiRequest<{ abonnement: ApiAdminAbonnement }>('/admin/abonnements', {
      method: 'POST',
      body: data,
      token,
    });
    return mapAdminAbonnement(res.abonnement);
  },

  async updateAbonnement(
    token: string,
    id: string,
    data: Partial<{ plan: string; montant: number; date_debut: string; date_fin: string | null; statut: string }>,
  ): Promise<AdminAbonnement> {
    const res = await apiRequest<{ abonnement: ApiAdminAbonnement }>(`/admin/abonnements/${id}`, {
      method: 'PUT',
      body: data,
      token,
    });
    return mapAdminAbonnement(res.abonnement);
  },

  async getPublications(token: string, visible?: boolean): Promise<AdminPublicationModeration[]> {
    const params = new URLSearchParams();
    if (visible != null) params.set('visible', visible ? '1' : '0');
    const qs = params.toString();
    const res = await apiRequest<{ publications: ApiAdminPublication[] }>(
      `/admin/publications${qs ? `?${qs}` : ''}`,
      { token },
    );
    return res.publications.map(mapAdminPublicationModeration);
  },

  async updatePublicationVisible(token: string, id: string, visible: boolean): Promise<void> {
    await apiRequest(`/admin/publications/${id}/visible`, {
      method: 'PATCH',
      body: { visible },
      token,
    });
  },

  async getCampagnes(token: string, activesOnly = false): Promise<AdminCampagneModeration[]> {
    const qs = activesOnly ? '?actives=1' : '';
    const res = await apiRequest<{ campagnes: ApiAdminCampagne[] }>(`/admin/campagnes${qs}`, { token });
    return res.campagnes.map(mapAdminCampagneModeration);
  },

  async getJournalAudit(token: string, limit = 50): Promise<AuditLog[]> {
    const res = await apiRequest<{ journal: ApiJournalAuditEntry[] }>(
      `/admin/journal-audit?limit=${limit}`,
      { token },
    );
    return res.journal.map(mapJournalAuditEntry);
  },

  async getTickets(token: string, filters?: { statut?: string }): Promise<AdminTicket[]> {
    const params = new URLSearchParams();
    if (filters?.statut && filters.statut !== 'tous') params.set('statut', filters.statut);
    const qs = params.toString();
    const res = await apiRequest<{ tickets: ApiAdminTicket[] }>(
      `/admin/tickets-support${qs ? `?${qs}` : ''}`,
      { token },
    );
    return res.tickets.map(mapAdminTicket);
  },

  async getTicket(token: string, id: string): Promise<TicketDetail | null> {
    try {
      const res = await apiRequest<{ ticket: ApiAdminTicket }>(`/admin/tickets-support/${id}`, { token });
      return mapAdminTicketDetail(res.ticket);
    } catch {
      return null;
    }
  },

  async updateTicketStatut(token: string, id: string, statut: string, reponse?: string): Promise<void> {
    await apiRequest(`/admin/tickets-support/${id}/statut`, {
      method: 'PATCH',
      body: { statut, reponse },
      token,
    });
  },

  async getTransactions(
    token: string,
    filters?: {
      q?: string;
      statut?: string;
      methode?: string;
      dateDebut?: string;
      dateFin?: string;
      montantMin?: number;
      montantMax?: number;
    },
  ): Promise<{ transactions: AdminTransaction[]; synthese: TransactionSynthese }> {
    const params = new URLSearchParams();
    if (filters?.q) params.set('q', filters.q);
    if (filters?.statut && filters.statut !== 'tous') params.set('statut', filters.statut);
    if (filters?.methode && filters.methode !== 'tous') params.set('methode', filters.methode);
    if (filters?.dateDebut) params.set('date_debut', filters.dateDebut);
    if (filters?.dateFin) params.set('date_fin', filters.dateFin);
    if (filters?.montantMin != null) params.set('montant_min', String(filters.montantMin));
    if (filters?.montantMax != null) params.set('montant_max', String(filters.montantMax));
    const qs = params.toString();
    const res = await apiRequest<{
      paiements: ApiAdminPaiement[] | { data: ApiAdminPaiement[] };
      synthese?: ApiTransactionSynthese;
    }>(`/admin/paiements${qs ? `?${qs}` : ''}`, { token });
    const transactions = asResourceList(res.paiements).map(mapAdminTransaction);
    return {
      transactions,
      synthese: res.synthese ? mapTransactionSynthese(res.synthese) : computeTransactionSynthese(transactions),
    };
  },

  async getTransaction(token: string, id: string): Promise<TransactionDetail | null> {
    try {
      const res = await apiRequest<{ paiement: ApiAdminPaiement }>(`/admin/paiements/${id}`, { token });
      return mapAdminTransactionDetail(res.paiement);
    } catch {
      return null;
    }
  },
};

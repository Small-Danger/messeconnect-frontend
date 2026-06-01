import { USE_MOCK_API } from '../config/env';
import { adminApi } from './api/admin';
import { adminMockApi } from './mockAdminApi';
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
} from './mockAdminApi/data';

export const adminService = {
  async login(email: string, password: string): Promise<{ token: string; email: string }> {
    if (USE_MOCK_API) {
      const res = await adminMockApi.login(email, password);
      return { token: res.token, email: res.email ?? email };
    }
    const res = await adminApi.login(email, password);
    return { token: res.token, email: res.user.email };
  },

  async logout(token: string | null): Promise<void> {
    if (USE_MOCK_API) return;
    if (token) await adminApi.logout(token);
  },

  async validateSession(token: string | null): Promise<boolean> {
    if (!token) return false;
    if (USE_MOCK_API) return true;
    try {
      await adminApi.me(token);
      return true;
    } catch {
      return false;
    }
  },

  async getDashboard(token: string | null): Promise<DashboardData | null> {
    if (USE_MOCK_API) return adminMockApi.getDashboard();
    if (!token) return null;
    return adminApi.getDashboard(token);
  },

  async getUsers(token: string | null, filters?: { q?: string; statut?: string }): Promise<AdminUser[]> {
    if (USE_MOCK_API) return adminMockApi.getUsers(filters);
    if (!token) return [];
    return adminApi.getUsers(token, filters);
  },

  async getUserDetail(token: string | null, id: string): Promise<UserDetail | null> {
    if (USE_MOCK_API) return adminMockApi.getUserDetail(id);
    if (!token) return null;
    return adminApi.getUser(token, id);
  },

  async suspendUser(token: string | null, id: string, _motif: string, _duree: string): Promise<void> {
    if (USE_MOCK_API) {
      await adminMockApi.suspendUser(id, _motif, _duree);
      return;
    }
    if (!token) throw new Error('Non authentifié');
    await adminApi.updateUserActif(token, id, false);
  },

  async reactivateUser(token: string | null, id: string): Promise<void> {
    if (USE_MOCK_API) {
      await adminMockApi.reactivateUser(id);
      return;
    }
    if (!token) throw new Error('Non authentifié');
    await adminApi.updateUserActif(token, id, true);
  },

  async getParishes(token: string | null, filters?: { q?: string; statut?: string }): Promise<AdminParish[]> {
    if (USE_MOCK_API) return adminMockApi.getParishes(filters);
    if (!token) return [];
    return adminApi.getParishes(token, filters);
  },

  async getParishDetail(token: string | null, id: string): Promise<ParishDetail | null> {
    if (USE_MOCK_API) return adminMockApi.getParishDetail(id);
    if (!token) return null;
    return adminApi.getParish(token, id);
  },

  async validateParish(
    token: string | null,
    id: string,
    action: 'valider' | 'refuser',
    commentaire: string,
  ): Promise<void> {
    if (USE_MOCK_API) {
      await adminMockApi.validateParish(id, action, commentaire);
      return;
    }
    if (!token) throw new Error('Non authentifié');
    const statut = action === 'valider' ? 'validee' : 'rejetee';
    await adminApi.updateParishStatut(token, id, statut, commentaire);
  },

  async suspendParish(token: string | null, id: string, commentaire: string): Promise<void> {
    if (USE_MOCK_API) {
      await adminMockApi.suspendParish(id, commentaire);
      return;
    }
    if (!token) throw new Error('Non authentifié');
    await adminApi.updateParishStatut(token, id, 'suspendue', commentaire);
    await adminApi.updateParishActif(token, id, false);
  },

  async reactivateParish(token: string | null, id: string, commentaire?: string): Promise<void> {
    if (USE_MOCK_API) {
      await adminMockApi.reactivateParish(id);
      return;
    }
    if (!token) throw new Error('Non authentifié');
    await adminApi.updateParishStatut(token, id, 'validee', commentaire);
    await adminApi.updateParishActif(token, id, true);
  },

  async getDioceses(token: string | null, filters?: { q?: string; actif?: boolean }): Promise<AdminDiocese[]> {
    if (USE_MOCK_API) return adminMockApi.getDioceses(filters);
    if (!token) return [];
    return adminApi.getDioceses(token, filters);
  },

  async createDiocese(
    token: string | null,
    data: { nom: string; ville?: string; pays?: string; description?: string; actif?: boolean },
  ): Promise<AdminDiocese> {
    if (USE_MOCK_API) return adminMockApi.createDiocese(data);
    if (!token) throw new Error('Non authentifié');
    return adminApi.createDiocese(token, data);
  },

  async updateDiocese(
    token: string | null,
    id: string,
    data: Partial<{ nom: string; ville: string; pays: string; description: string; actif: boolean }>,
  ): Promise<AdminDiocese> {
    if (USE_MOCK_API) return adminMockApi.updateDiocese(id, data);
    if (!token) throw new Error('Non authentifié');
    return adminApi.updateDiocese(token, id, data);
  },

  async deleteDiocese(token: string | null, id: string): Promise<void> {
    if (USE_MOCK_API) {
      await adminMockApi.deleteDiocese(id);
      return;
    }
    if (!token) throw new Error('Non authentifié');
    await adminApi.deleteDiocese(token, id);
  },

  async getAbonnements(
    token: string | null,
    filters?: { paroisseId?: string; statut?: string },
  ): Promise<AdminAbonnement[]> {
    if (USE_MOCK_API) return adminMockApi.getAbonnements(filters);
    if (!token) return [];
    return adminApi.getAbonnements(token, filters);
  },

  async createAbonnement(
    token: string | null,
    data: {
      paroisse_id: string;
      plan: string;
      montant: number;
      date_debut: string;
      date_fin?: string;
      statut?: string;
    },
  ): Promise<AdminAbonnement> {
    if (USE_MOCK_API) return adminMockApi.createAbonnement(data);
    if (!token) throw new Error('Non authentifié');
    return adminApi.createAbonnement(token, data);
  },

  async updateAbonnement(
    token: string | null,
    id: string,
    data: Partial<{ plan: string; montant: number; date_debut: string; date_fin: string | null; statut: string }>,
  ): Promise<AdminAbonnement> {
    if (USE_MOCK_API) return adminMockApi.updateAbonnement(id, data);
    if (!token) throw new Error('Non authentifié');
    return adminApi.updateAbonnement(token, id, data);
  },

  async getPublications(token: string | null, visible?: boolean): Promise<AdminPublicationModeration[]> {
    if (USE_MOCK_API) return adminMockApi.getPublications(visible);
    if (!token) return [];
    return adminApi.getPublications(token, visible);
  },

  async updatePublicationVisible(token: string | null, id: string, visible: boolean): Promise<void> {
    if (USE_MOCK_API) {
      await adminMockApi.updatePublicationVisible(id, visible);
      return;
    }
    if (!token) throw new Error('Non authentifié');
    await adminApi.updatePublicationVisible(token, id, visible);
  },

  async getCampagnesModeration(token: string | null, activesOnly = false): Promise<AdminCampagneModeration[]> {
    if (USE_MOCK_API) return adminMockApi.getCampagnesModeration(activesOnly);
    if (!token) return [];
    return adminApi.getCampagnes(token, activesOnly);
  },

  async getAuditLogs(token: string | null, limit = 50): Promise<AuditLog[]> {
    if (USE_MOCK_API) return adminMockApi.getAuditLogs();
    if (!token) return [];
    return adminApi.getJournalAudit(token, limit);
  },

  async addAnnonce(_token: string | null, _data: Omit<SystemAnnonce, 'id' | 'actif'>): Promise<void> {
    if (USE_MOCK_API) {
      await adminMockApi.addAnnonce(_data);
      return;
    }
    throw new Error('Annonces système — disponible en mode démo uniquement');
  },

  async addCampagne(_token: string | null, _data: Omit<SystemCampagne, 'id' | 'collecte'>): Promise<void> {
    if (USE_MOCK_API) {
      await adminMockApi.addCampagne(_data);
      return;
    }
    throw new Error('Campagnes système — disponible en mode démo uniquement');
  },

  async getTickets(token: string | null, filters?: { statut?: string }): Promise<AdminTicket[]> {
    if (USE_MOCK_API) return adminMockApi.getTickets(filters);
    if (!token) return [];
    return adminApi.getTickets(token, filters);
  },

  async getTicketDetail(token: string | null, id: string): Promise<TicketDetail | null> {
    if (USE_MOCK_API) return adminMockApi.getTicketDetail(id);
    if (!token) return null;
    return adminApi.getTicket(token, id);
  },

  async replyTicket(token: string | null, id: string, message: string, statut: string): Promise<void> {
    if (USE_MOCK_API) {
      await adminMockApi.replyTicket(id, message, statut);
      return;
    }
    if (!token) throw new Error('Non authentifié');
    const apiStatut = statut === 'resolu' ? 'resolu' : statut;
    await adminApi.updateTicketStatut(token, id, apiStatut, message);
  },

  async getTransactions(
    token: string | null,
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
    if (USE_MOCK_API) return adminMockApi.getTransactions(filters);
    if (!token) {
      return {
        transactions: [],
        synthese: { total: 0, montantTotal: 0, montantReussi: 0, reussis: 0, enAttente: 0, echoues: 0 },
      };
    }
    return adminApi.getTransactions(token, filters);
  },

  async getTransactionDetail(token: string | null, id: string): Promise<TransactionDetail | null> {
    if (USE_MOCK_API) return adminMockApi.getTransactionDetail(id);
    if (!token) return null;
    return adminApi.getTransaction(token, id);
  },
};

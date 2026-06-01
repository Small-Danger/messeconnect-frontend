import type {
  ActiviteRecente,
  CampagneDonsResume,
  CampagneParoisse,
  DonCampagneParoisse,
  DashboardKpis,
  MoyenPaiementParoisse,
  ParoisseDemande,
  ParoisseMedia,
  ParoisseMesse,
  ParoisseProfile,
  PublicationParoisse,
  TypeOffrandeParoisse,
} from '../mockApi/paroisse/data';
import { apiRequest, apiUpload } from './client';
import { mapParoisseProfile } from './mappers/paroisse';
import {
  buildActivitesFromDemandes,
  mapDashboardKpis,
  mapParoisseDemande,
  mapParoisseMesse,
  type ApiParoisseDashboard,
  type ApiParoisseDemande,
  type ApiParoisseMesse,
  type MesseWithDemandes,
} from './mappers/paroisseDemande';
import {
  mapParoisseCampagne,
  mapParoisseCampagneDon,
  mapParoisseCampagneDonsResume,
  mapParoisseMedia,
  mapParoisseMesseFromApi,
  mapParoisseMoyenPaiement,
  mapParoissePublication,
  mapParoisseTypeOffrande,
  toApiMoyenPaiementType,
  type ApiParoisseCampagne,
  type ApiParoisseCampagneDon,
  type ApiParoisseCampagneDonsResume,
  type ApiParoisseMedia,
  type ApiParoisseMoyenPaiement,
  type ApiParoissePublication,
  type ApiParoisseTypeOffrande,
} from './mappers/paroisseContent';
import type { TicketSupport } from '../mockApi/paroisse/data';
import type { ApiParoisseParish, ApiParoisseUser, AuthResponse } from './types';
import type {
  CreneauIntentions,
  GuichetIntentionInput,
  PaiementEspecesEnAttente,
  PlanningFilters,
} from '../../types/paroisseIntentions';

export interface ParoisseDashboardData {
  kpis: DashboardKpis;
  demandesUrgentes: ParoisseDemande[];
  messesAVenir: ParoisseMesse[];
  activites: ActiviteRecente[];
}

export type { MesseWithDemandes } from './mappers/paroisseDemande';

export interface RegistrationDiocese {
  id: string;
  nom: string;
  ville: string | null;
}

export interface ParoisseRegisterPayload {
  paroisse: {
    nom: string;
    email: string;
    telephone?: string;
    adresse?: string;
    ville?: string;
    pays?: string;
    site_web?: string;
    diocese_id?: string;
  };
  responsable: {
    nom: string;
    email: string;
    password: string;
    password_confirmation: string;
  };
}

export const paroisseApi = {
  getRegistrationDioceses() {
    return apiRequest<{ dioceses: RegistrationDiocese[] }>('/paroisse/dioceses');
  },

  register(data: ParoisseRegisterPayload) {
    return apiRequest<{ message: string }>('/paroisse/register', {
      method: 'POST',
      body: data,
    });
  },

  login(email: string, password: string) {
    return apiRequest<AuthResponse<ApiParoisseUser>>('/paroisse/login', {
      method: 'POST',
      body: { email, password },
    });
  },

  me(token: string) {
    return apiRequest<{ user: ApiParoisseUser }>('/paroisse/me', { token });
  },

  logout(token: string) {
    return apiRequest<{ message: string }>('/paroisse/logout', {
      method: 'POST',
      token,
    });
  },

  async getProfile(token: string): Promise<ParoisseProfile> {
    const res = await apiRequest<{ paroisse: ApiParoisseParish }>('/paroisse/profile', { token });
    return mapParoisseProfile(res.paroisse);
  },

  async getDashboard(token: string): Promise<ParoisseDashboardData> {
    const res = await apiRequest<ApiParoisseDashboard>('/paroisse/dashboard', { token });

    const [demandesRes, messesRes] = await Promise.all([
      apiRequest<{ demandes: ApiParoisseDemande[] }>('/paroisse/demandes?statut=en_attente', { token }),
      apiRequest<{ messes: ApiParoisseMesse[] }>(
        `/paroisse/messes?from=${new Date().toISOString().slice(0, 10)}`,
        { token },
      ),
    ]);

    const demandes = demandesRes.demandes.map(mapParoisseDemande);
    const upcomingMesses = messesRes.messes.map(mapParoisseMesse);

    return {
      kpis: {
        ...mapDashboardKpis(res.statistiques),
        messesAVenir: upcomingMesses.length,
      },
      demandesUrgentes: demandes.filter((d) => d.statut === 'en_attente'),
      messesAVenir: upcomingMesses.slice(0, 3),
      activites: buildActivitesFromDemandes(demandes),
    };
  },

  async getDemandes(
    token: string,
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
    const params = new URLSearchParams();
    if (filters?.statut && filters.statut !== 'tous') {
      params.set('statut', filters.statut === 'rejetee' ? 'annulee' : filters.statut);
    }
    if (filters?.messeId) {
      params.set('messe_id', filters.messeId);
    }
    if (filters?.vue) {
      params.set('vue', filters.vue);
    }
    if (filters?.from) {
      params.set('from', filters.from);
    }
    if (filters?.to) {
      params.set('to', filters.to);
    }
    if (filters?.q) {
      params.set('q', filters.q);
    }
    const qs = params.toString();
    const res = await apiRequest<{ demandes: ApiParoisseDemande[] }>(
      `/paroisse/demandes${qs ? `?${qs}` : ''}`,
      { token },
    );
    let result = res.demandes.map(mapParoisseDemande);

    if (filters?.q) {
      const q = filters.q.toLowerCase();
      result = result.filter(
        (d) =>
          d.reference.toLowerCase().includes(q) ||
          d.fideleNom.toLowerCase().includes(q) ||
          d.intention.toLowerCase().includes(q),
      );
    }
    if (filters?.date) {
      result = result.filter((d) => d.date.slice(0, 10) === filters.date);
    }

    return result;
  },

  async getMesseWithDemandes(token: string, messeId: string): Promise<MesseWithDemandes> {
    const res = await apiRequest<{ messe: ApiParoisseMesse }>(`/paroisse/messes/${messeId}`, { token });
    const messe = mapParoisseMesse(res.messe);
    const demandes = (res.messe.demandes ?? []).map(mapParoisseDemande);

    return { messe, demandes };
  },

  async celebrerMesse(token: string, messeId: string): Promise<MesseWithDemandes> {
    const res = await apiRequest<{ messe: ApiParoisseMesse }>(`/paroisse/messes/${messeId}/celebrer`, {
      method: 'POST',
      token,
    });

    return {
      messe: mapParoisseMesse(res.messe),
      demandes: (res.messe.demandes ?? []).map(mapParoisseDemande),
    };
  },

  async annulerMesse(token: string, messeId: string): Promise<MesseWithDemandes> {
    const res = await apiRequest<{ messe: ApiParoisseMesse }>(`/paroisse/messes/${messeId}/annuler`, {
      method: 'POST',
      token,
    });

    return {
      messe: mapParoisseMesse(res.messe),
      demandes: (res.messe.demandes ?? []).map(mapParoisseDemande),
    };
  },

  async updateDemandeStatut(
    token: string,
    id: string,
    statut: string,
    commentaire?: string,
  ): Promise<ParoisseDemande> {
    const res = await apiRequest<{ demande: ApiParoisseDemande }>(`/paroisse/demandes/${id}/statut`, {
      method: 'PATCH',
      body: { statut, commentaire },
      token,
    });
    return mapParoisseDemande(res.demande);
  },

  async updateProfile(token: string, data: Partial<ParoisseProfile>): Promise<ParoisseProfile> {
    const body: Record<string, unknown> = {};
    if (data.nom !== undefined) body.nom = data.nom;
    if (data.description !== undefined) body.description = data.description;
    if (data.telephone !== undefined) body.telephone = data.telephone;
    if (data.email !== undefined) body.email = data.email;
    if (data.adresse !== undefined) body.adresse = data.adresse;
    if (data.ville !== undefined) body.ville = data.ville;
    if (data.pays !== undefined) body.pays = data.pays;
    if (data.siteWeb !== undefined) body.site_web = data.siteWeb;
    if (data.horaires !== undefined) body.horaires = data.horaires;
    if (data.photoProfil !== undefined) body.logo = data.photoProfil;
    if (data.photoCouverture !== undefined) body.banniere = data.photoCouverture;

    const res = await apiRequest<{ paroisse: ApiParoisseParish }>('/paroisse/profile', {
      method: 'PUT',
      body,
      token,
    });
    return mapParoisseProfile(res.paroisse);
  },

  async uploadProfileImage(
    token: string,
    type: 'logo' | 'banniere',
    file: File,
  ): Promise<{ url: string; profile: ParoisseProfile }> {
    const formData = new FormData();
    formData.append('type', type);
    formData.append('image', file);
    const res = await apiUpload<{ url: string; paroisse: ApiParoisseParish }>(
      '/paroisse/profile/image',
      formData,
      token,
    );
    return {
      url: res.url,
      profile: mapParoisseProfile(res.paroisse),
    };
  },

  async getMesses(token: string): Promise<ParoisseMesse[]> {
    const res = await apiRequest<{ messes: ApiParoisseMesse[] }>('/paroisse/messes', { token });
    return res.messes.map(mapParoisseMesseFromApi);
  },

  async createMesse(
    token: string,
    data: Omit<ParoisseMesse, 'id' | 'intentions' | 'participants' | 'statut'>,
  ): Promise<ParoisseMesse> {
    const res = await apiRequest<{ messe: ApiParoisseMesse }>('/paroisse/messes', {
      method: 'POST',
      body: {
        titre: data.titre,
        date: data.date,
        heure: data.heure,
        pretre: data.pretre,
        lieu: data.lieu,
      },
      token,
    });
    return mapParoisseMesseFromApi(res.messe);
  },

  async createModeleMesseAndGenerate(
    token: string,
    data: {
      titre: string;
      jour_semaine: number;
      heure: string;
      semaines: number;
      capacite_max?: number;
      reservable?: boolean;
      description?: string;
      date_debut?: string;
    },
  ): Promise<number> {
    const modeleRes = await apiRequest<{ modele_messe: { id: string } }>('/paroisse/modele-messes', {
      method: 'POST',
      body: {
        titre: data.titre,
        description: data.description,
        jour_semaine: data.jour_semaine,
        heure: data.heure,
        reservable: data.reservable ?? true,
        capacite_max: data.capacite_max,
        date_debut: data.date_debut,
        actif: true,
      },
      token,
    });

    const genRes = await apiRequest<{ messes_creees: number }>(
      `/paroisse/modele-messes/${modeleRes.modele_messe.id}/generer`,
      {
        method: 'POST',
        body: { semaines: data.semaines },
        token,
      },
    );

    return genRes.messes_creees;
  },

  async updateMesse(
    token: string,
    id: string,
    data: {
      titre?: string;
      date?: string;
      heure?: string;
      capacite_max?: number | null;
    },
  ): Promise<ParoisseMesse> {
    const res = await apiRequest<{ messe: ApiParoisseMesse }>(`/paroisse/messes/${id}`, {
      method: 'PUT',
      body: data,
      token,
    });
    return mapParoisseMesse(res.messe);
  },

  async deleteMesse(token: string, id: string): Promise<void> {
    await apiRequest<{ message: string }>(`/paroisse/messes/${id}`, {
      method: 'DELETE',
      token,
    });
  },

  async getMedias(token: string): Promise<ParoisseMedia[]> {
    const res = await apiRequest<{ medias: ApiParoisseMedia[] }>('/paroisse/medias', { token });
    return res.medias.map(mapParoisseMedia);
  },

  async addMedia(token: string, data: { url: string; type?: 'image' | 'video'; ordre?: number }): Promise<void> {
    await apiRequest('/paroisse/medias', {
      method: 'POST',
      body: { type: data.type ?? 'image', url: data.url, ordre: data.ordre ?? 0 },
      token,
    });
  },

  async updateMedia(
    token: string,
    id: string,
    data: { url?: string; type?: 'image' | 'video'; ordre?: number },
  ): Promise<void> {
    await apiRequest(`/paroisse/medias/${id}`, {
      method: 'PUT',
      body: data,
      token,
    });
  },

  async deleteMedia(token: string, id: string): Promise<void> {
    await apiRequest(`/paroisse/medias/${id}`, { method: 'DELETE', token });
  },

  async getMoyensPaiement(token: string): Promise<MoyenPaiementParoisse[]> {
    const res = await apiRequest<{ moyen_paiements: ApiParoisseMoyenPaiement[] }>(
      '/paroisse/moyen-paiements',
      { token },
    );
    return res.moyen_paiements.map(mapParoisseMoyenPaiement);
  },

  async addMoyenPaiement(token: string, data: Omit<MoyenPaiementParoisse, 'id'>): Promise<void> {
    await apiRequest('/paroisse/moyen-paiements', {
      method: 'POST',
      body: {
        type: toApiMoyenPaiementType(data.type),
        numero: data.numero,
        actif: data.actif,
      },
      token,
    });
  },

  async updateMoyenPaiement(
    token: string,
    id: string,
    data: Partial<Omit<MoyenPaiementParoisse, 'id'>>,
  ): Promise<void> {
    const body: Record<string, unknown> = {};
    if (data.type !== undefined) body.type = toApiMoyenPaiementType(data.type);
    if (data.numero !== undefined) body.numero = data.numero;
    if (data.actif !== undefined) body.actif = data.actif;

    await apiRequest(`/paroisse/moyen-paiements/${id}`, {
      method: 'PUT',
      body,
      token,
    });
  },

  async deleteMoyenPaiement(token: string, id: string): Promise<void> {
    await apiRequest(`/paroisse/moyen-paiements/${id}`, { method: 'DELETE', token });
  },

  async getTypesOffrandes(token: string): Promise<TypeOffrandeParoisse[]> {
    const res = await apiRequest<{ type_offrandes: ApiParoisseTypeOffrande[] }>(
      '/paroisse/type-offrandes',
      { token },
    );
    return res.type_offrandes.map(mapParoisseTypeOffrande);
  },

  async addTypeOffrande(
    token: string,
    data: Omit<TypeOffrandeParoisse, 'id' | 'actif'>,
  ): Promise<void> {
    await apiRequest('/paroisse/type-offrandes', {
      method: 'POST',
      body: {
        nom: data.nom,
        description: data.description,
        montant_propose: data.montantConseille,
        actif: true,
      },
      token,
    });
  },

  async updateTypeOffrande(
    token: string,
    id: string,
    data: Partial<Omit<TypeOffrandeParoisse, 'id'>>,
  ): Promise<void> {
    const body: Record<string, unknown> = {};
    if (data.nom !== undefined) body.nom = data.nom;
    if (data.description !== undefined) body.description = data.description;
    if (data.montantConseille !== undefined) body.montant_propose = data.montantConseille;
    if (data.actif !== undefined) body.actif = data.actif;

    await apiRequest(`/paroisse/type-offrandes/${id}`, {
      method: 'PUT',
      body,
      token,
    });
  },

  async deleteTypeOffrande(token: string, id: string): Promise<void> {
    await apiRequest(`/paroisse/type-offrandes/${id}`, { method: 'DELETE', token });
  },

  async getPublications(token: string): Promise<PublicationParoisse[]> {
    const res = await apiRequest<{ publications: ApiParoissePublication[] }>('/paroisse/publications', {
      token,
    });
    return res.publications.map(mapParoissePublication);
  },

  async addPublication(token: string, data: Omit<PublicationParoisse, 'id'>): Promise<void> {
    await apiRequest('/paroisse/publications', {
      method: 'POST',
      body: {
        titre: data.titre,
        contenu: data.contenu,
        image: data.image || data.images[0] || null,
        images: data.images,
        type: 'information',
        date_publication: data.datePublication,
        visible: true,
      },
      token,
    });
  },

  async uploadPublicationImages(token: string, files: File[]): Promise<string[]> {
    const formData = new FormData();
    for (const file of files) {
      formData.append('images[]', file);
    }
    const res = await apiUpload<{ urls: string[] }>('/paroisse/publications/images', formData, token);
    return res.urls;
  },

  async uploadCampagneImage(token: string, file: File): Promise<string> {
    const formData = new FormData();
    formData.append('image', file);
    const res = await apiUpload<{ url: string }>('/paroisse/campagnes/image', formData, token);
    return res.url;
  },

  async updatePublication(
    token: string,
    id: string,
    data: Partial<Omit<PublicationParoisse, 'id'>>,
  ): Promise<PublicationParoisse> {
    const res = await apiRequest<{ publication: ApiParoissePublication }>(`/paroisse/publications/${id}`, {
      method: 'PUT',
      body: {
        ...(data.titre !== undefined ? { titre: data.titre } : {}),
        ...(data.contenu !== undefined ? { contenu: data.contenu } : {}),
        ...(data.images !== undefined
          ? { images: data.images, image: data.images[0] ?? data.image ?? null }
          : data.image !== undefined
            ? { image: data.image }
            : {}),
        ...(data.datePublication !== undefined ? { date_publication: data.datePublication } : {}),
        visible: true,
      },
      token,
    });
    return mapParoissePublication(res.publication);
  },

  async deletePublication(token: string, id: string): Promise<void> {
    await apiRequest(`/paroisse/publications/${id}`, { method: 'DELETE', token });
  },

  async getCampagnes(token: string): Promise<CampagneParoisse[]> {
    const res = await apiRequest<{ campagnes: ApiParoisseCampagne[] }>('/paroisse/campagnes', { token });
    return res.campagnes.map(mapParoisseCampagne);
  },

  async addCampagne(
    token: string,
    data: Omit<CampagneParoisse, 'id' | 'collecte'>,
  ): Promise<void> {
    await apiRequest('/paroisse/campagnes', {
      method: 'POST',
      body: {
        nom: data.titre,
        description: data.description,
        objectif_total: data.objectif,
        image: data.image,
        date_fin: data.dateFin || undefined,
      },
      token,
    });
  },

  async updateCampagne(
    token: string,
    id: string,
    data: Partial<Omit<CampagneParoisse, 'id'>>,
  ): Promise<CampagneParoisse> {
    const res = await apiRequest<{ campagne: ApiParoisseCampagne }>(`/paroisse/campagnes/${id}`, {
      method: 'PUT',
      body: {
        ...(data.titre !== undefined ? { nom: data.titre } : {}),
        ...(data.description !== undefined ? { description: data.description } : {}),
        ...(data.objectif !== undefined ? { objectif_total: data.objectif } : {}),
        ...(data.image !== undefined ? { image: data.image } : {}),
        ...(data.dateFin !== undefined ? { date_fin: data.dateFin || null } : {}),
      },
      token,
    });
    return mapParoisseCampagne(res.campagne);
  },

  async deleteCampagne(token: string, id: string): Promise<void> {
    await apiRequest(`/paroisse/campagnes/${id}`, { method: 'DELETE', token });
  },

  async getCampagneDons(
    token: string,
    campagneId: string,
  ): Promise<{ dons: DonCampagneParoisse[]; resume: CampagneDonsResume }> {
    const res = await apiRequest<{
      dons: ApiParoisseCampagneDon[];
      resume: ApiParoisseCampagneDonsResume;
    }>(`/paroisse/campagnes/${campagneId}/dons`, { token });

    return {
      dons: res.dons.map(mapParoisseCampagneDon),
      resume: mapParoisseCampagneDonsResume(res.resume),
    };
  },

  async getTickets(token: string): Promise<TicketSupport[]> {
    const res = await apiRequest<{ tickets: ApiParoisseTicket[] }>('/paroisse/tickets-support', { token });
    return res.tickets.map(mapParoisseTicket);
  },

  async addTicket(
    token: string,
    data: { titre: string; categorie: string; description: string },
  ): Promise<TicketSupport> {
    const message =
      data.categorie && data.categorie !== 'Autre'
        ? `[${data.categorie}] ${data.description}`
        : data.description;
    const res = await apiRequest<{ ticket: ApiParoisseTicket }>('/paroisse/tickets-support', {
      method: 'POST',
      body: { sujet: data.titre, message },
      token,
    });
    return mapParoisseTicket(res.ticket);
  },

  async getPlanningIntentions(token: string, filters?: PlanningFilters): Promise<CreneauIntentions[]> {
    const params = new URLSearchParams();
    if (filters?.scope) params.set('scope', filters.scope);
    if (filters?.from) params.set('from', filters.from);
    if (filters?.to) params.set('to', filters.to);
    if (filters?.q) params.set('q', filters.q);
    const qs = params.toString();
    const res = await apiRequest<{ creneaux: CreneauIntentions[] }>(
      `/paroisse/planning-intentions${qs ? `?${qs}` : ''}`,
      { token },
    );
    return res.creneaux;
  },

  async getCashPendingPayments(token: string): Promise<PaiementEspecesEnAttente[]> {
    const res = await apiRequest<{ paiements: PaiementEspecesEnAttente[] }>(
      '/paroisse/paiements/en-attente',
      { token },
    );
    return res.paiements;
  },

  async confirmCashPayment(token: string, paiementId: string): Promise<void> {
    await apiRequest(`/paroisse/paiements/${paiementId}/confirmer`, {
      method: 'POST',
      token,
    });
  },

  async cancelCashPayment(token: string, paiementId: string): Promise<void> {
    await apiRequest(`/paroisse/paiements/${paiementId}/annuler`, {
      method: 'POST',
      token,
    });
  },

  async createGuichetIntention(token: string, data: GuichetIntentionInput): Promise<ParoisseDemande> {
    const res = await apiRequest<{ demande: ApiParoisseDemande }>('/paroisse/intentions/guichet', {
      method: 'POST',
      body: data,
      token,
    });
    return mapParoisseDemande(res.demande);
  },
};

export interface ApiParoisseTicket {
  id: number | string;
  sujet: string;
  message: string;
  statut: string;
  created_at?: string;
}

function mapParoisseTicket(api: ApiParoisseTicket): TicketSupport {
  return {
    id: String(api.id),
    reference: `TKT-${String(api.id).slice(0, 8).toUpperCase()}`,
    titre: api.sujet,
    categorie: 'Support',
    description: api.message,
    statut: api.statut === 'ferme' ? 'resolu' : (api.statut as TicketSupport['statut']),
    createdAt: api.created_at?.slice(0, 10) ?? new Date().toISOString().slice(0, 10),
  };
}

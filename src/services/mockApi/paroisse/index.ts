import {
  mockActivites,
  mockCampagnes,
  mockCampagneDons,
  mockDemandes,
  mockKpis,
  mockMedias,
  mockMesses,
  mockMoyensPaiement,
  mockParoisseProfile,
  mockPublications,
  mockTickets,
  mockTypesOffrandes,
  type CampagneParoisse,
  type DonCampagneParoisse,
  type MoyenPaiementParoisse,
  type ParoisseDemande,
  type ParoisseMedia,
  type ParoisseMesse,
  type ParoisseProfile,
  type PublicationParoisse,
  type TicketSupport,
  type TypeOffrandeParoisse,
} from './data';

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

let profile = { ...mockParoisseProfile };
let demandes = [...mockDemandes];
let messes = [...mockMesses];
let medias = [...mockMedias];
let moyensPaiement = [...mockMoyensPaiement];
let typesOffrandes = [...mockTypesOffrandes];
let publications = [...mockPublications];
let campagnes = [...mockCampagnes];
let tickets = [...mockTickets];
let activites = [...mockActivites];
let kpis = { ...mockKpis };

export const paroisseMockApi = {
  async login(email: string, _password: string) {
    await delay();
    if (!email) throw new Error('Identifiants invalides');
    return { token: 'mock-paroisse-token', user: { email, nom: profile.nom } };
  },

  async register(_data: Record<string, string>) {
    await delay(600);
    return { pending: true };
  },

  async getDashboard() {
    await delay();
    const upcoming = messes.filter((m) => m.statut === 'planifiee');
    return {
      kpis: { ...kpis, messesAVenir: upcoming.length },
      demandesUrgentes: demandes.filter((d) => d.urgent && d.statut === 'en_attente'),
      messesAVenir: upcoming.slice(0, 3),
      activites: activites.slice(0, 5),
    };
  },

  async getProfile() {
    await delay(200);
    return profile;
  },

  async updateProfile(data: Partial<ParoisseProfile>) {
    await delay(400);
    profile = { ...profile, ...data };
    return profile;
  },

  async getDemandes(filters?: {
    q?: string;
    statut?: string;
    date?: string;
    messeId?: string;
    vue?: string;
    from?: string;
    to?: string;
  }) {
    await delay();
    let result = [...demandes];
    if (filters?.vue === 'historique') {
      result = result.filter(
        (d) =>
          d.statut === 'celebree' ||
          d.statut === 'rejetee' ||
          d.date.slice(0, 10) < new Date().toISOString().slice(0, 10),
      );
    } else if (filters?.vue === 'celebre') {
      result = result.filter((d) => d.statut === 'celebree');
    } else if (filters?.vue === 'annulee') {
      result = result.filter((d) => d.statut === 'rejetee');
    }
    if (filters?.q) {
      const q = filters.q.toLowerCase();
      result = result.filter(
        (d) =>
          d.reference.toLowerCase().includes(q) ||
          d.fideleNom.toLowerCase().includes(q) ||
          d.intention.toLowerCase().includes(q),
      );
    }
    if (filters?.statut && filters.statut !== 'tous') {
      result = result.filter((d) => d.statut === filters.statut);
    }
    if (filters?.date) {
      result = result.filter((d) => d.date.slice(0, 10) === filters.date);
    }
    if (filters?.from) {
      result = result.filter((d) => d.date.slice(0, 10) >= filters.from!);
    }
    if (filters?.to) {
      result = result.filter((d) => d.date.slice(0, 10) <= filters.to!);
    }
    if (filters?.messeId) {
      result = result.filter((d) => d.messeId === filters.messeId);
    }
    return result;
  },

  async getHistoriqueDemandes(filters?: {
    vue?: string;
    from?: string;
    to?: string;
    q?: string;
  }) {
    return this.getDemandes({
      vue: filters?.vue ?? 'historique',
      from: filters?.from,
      to: filters?.to,
      q: filters?.q,
    });
  },

  async getMesseWithDemandes(messeId: string) {
    await delay(200);
    const messe = messes.find((m) => m.id === messeId);
    if (!messe) throw new Error('Messe introuvable');
    const linked = demandes.filter((d) => d.messeId === messeId);
    return { messe, demandes: linked };
  },

  async celebrerDemande(id: string) {
    await delay(300);
    demandes = demandes.map((d) => (d.id === id ? { ...d, statut: 'celebree' as const } : d));
    return demandes.find((d) => d.id === id)!;
  },

  async celebrerMesse(messeId: string) {
    await delay(400);
    messes = messes.map((m) => (m.id === messeId ? { ...m, statut: 'celebree' as const } : m));
    demandes = demandes.map((d) =>
      d.messeId === messeId && (d.statut === 'confirmee' || d.statut === 'payee')
        ? { ...d, statut: 'celebree' as const }
        : d,
    );
    const messe = messes.find((m) => m.id === messeId)!;
    return { messe, demandes: demandes.filter((d) => d.messeId === messeId) };
  },

  async annulerMesse(messeId: string) {
    await delay(400);
    const messe = messes.find((m) => m.id === messeId);
    if (!messe) throw new Error('Messe introuvable');
    if (messe.statut === 'celebree') {
      throw new Error('Impossible d\'annuler une messe déjà célébrée.');
    }
    messes = messes.map((m) => (m.id === messeId ? { ...m, statut: 'annulee' as const } : m));
    demandes = demandes.map((d) =>
      d.messeId === messeId && d.statut !== 'celebree' && d.statut !== 'annulee'
        ? { ...d, statut: 'annulee' as const }
        : d,
    );
    const updated = messes.find((m) => m.id === messeId)!;
    return { messe: updated, demandes: demandes.filter((d) => d.messeId === messeId) };
  },

  async getDemande(id: string) {
    await delay(200);
    const d = demandes.find((x) => x.id === id);
    if (!d) throw new Error('Demande introuvable');
    return d;
  },

  async validerDemande(id: string) {
    await delay(400);
    demandes = demandes.map((d) => (d.id === id ? { ...d, statut: 'confirmee' as const } : d));
    return demandes.find((d) => d.id === id)!;
  },

  async rejeterDemande(id: string, motif: string) {
    await delay(400);
    demandes = demandes.map((d) =>
      d.id === id ? { ...d, statut: 'rejetee' as const, motifRejet: motif } : d,
    );
    return demandes.find((d) => d.id === id)!;
  },

  async getMesses() {
    await delay();
    return messes;
  },

  async addMesse(data: Omit<ParoisseMesse, 'id' | 'intentions' | 'participants' | 'statut'>) {
    await delay(400);
    const messe: ParoisseMesse = {
      ...data,
      id: `m${Date.now()}`,
      intentions: [],
      participants: 0,
      statut: 'planifiee',
    };
    messes = [...messes, messe];
    kpis = { ...kpis, messesAVenir: kpis.messesAVenir + 1 };
    return messe;
  },

  async addRecurringMesses(data: {
    titre: string;
    jour_semaine: number;
    heure: string;
    semaines: number;
    capacite_max?: number;
    pretre?: string;
    lieu?: string;
  }): Promise<number> {
    await delay(500);
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    let created = 0;

    for (let offset = 0; offset < data.semaines * 7; offset++) {
      const date = new Date(start);
      date.setDate(start.getDate() + offset);
      if (date.getDay() !== data.jour_semaine) continue;

      const dateStr = date.toISOString().slice(0, 10);
      const exists = messes.some((m) => m.date === dateStr && m.heure.startsWith(data.heure.slice(0, 5)));
      if (exists) continue;

      messes = [
        ...messes,
        {
          id: `m${Date.now()}-${created}`,
          titre: data.titre,
          date: dateStr,
          heure: data.heure.length === 5 ? `${data.heure}:00` : data.heure,
          pretre: data.pretre ?? '—',
          lieu: data.lieu ?? 'Église paroisse',
          intentions: [],
          participants: 0,
          statut: 'planifiee',
        },
      ];
      created++;
    }

    kpis = { ...kpis, messesAVenir: kpis.messesAVenir + created };
    return created;
  },

  async updateMesse(
    id: string,
    data: {
      titre?: string;
      date?: string;
      heure?: string;
      capacite_max?: number | null;
    },
  ): Promise<ParoisseMesse> {
    await delay(300);
    const index = messes.findIndex((m) => m.id === id);
    if (index === -1) throw new Error('Messe introuvable');

    const current = messes[index];
    const updated: ParoisseMesse = {
      ...current,
      ...(data.titre !== undefined ? { titre: data.titre } : {}),
      ...(data.date !== undefined ? { date: data.date } : {}),
      ...(data.heure !== undefined
        ? { heure: data.heure.length === 5 ? `${data.heure}:00` : data.heure }
        : {}),
      ...(data.capacite_max !== undefined ? { capacite_max: data.capacite_max } : {}),
    };

    messes = messes.map((m) => (m.id === id ? updated : m));
    return updated;
  },

  async deleteMesse(id: string): Promise<void> {
    await delay(300);
    const messe = messes.find((m) => m.id === id);
    if (!messe) throw new Error('Messe introuvable');

    const linked = demandes.filter((d) => d.messeId === id);
    if (linked.length > 0) {
      throw new Error(
        `Impossible de supprimer ce créneau : ${linked.length} intention(s) y sont enregistrée(s).`,
      );
    }

    messes = messes.filter((m) => m.id !== id);
    kpis = { ...kpis, messesAVenir: Math.max(0, kpis.messesAVenir - 1) };
  },

  async getMedias() {
    await delay();
    return medias;
  },

  async addMedia(data: Omit<ParoisseMedia, 'id' | 'createdAt'>) {
    await delay(400);
    const media: ParoisseMedia = { ...data, id: `med${Date.now()}`, createdAt: new Date().toISOString().split('T')[0] };
    medias = [media, ...medias];
    return media;
  },

  async deleteMedia(id: string) {
    await delay(300);
    medias = medias.filter((m) => m.id !== id);
  },

  async updateMedia(id: string, data: { url?: string; type?: 'image' | 'video' }) {
    await delay(300);
    medias = medias.map((m) =>
      m.id === id
        ? {
            ...m,
            ...(data.url ? { url: data.url, description: data.url } : {}),
            ...(data.type
              ? { titre: data.type === 'video' ? 'Vidéo paroisse' : 'Photo paroisse' }
              : {}),
          }
        : m,
    );
  },

  async getMoyensPaiement() {
    await delay(200);
    return moyensPaiement;
  },

  async addMoyenPaiement(data: Omit<MoyenPaiementParoisse, 'id'>) {
    await delay(400);
    const m = { ...data, id: `mp${Date.now()}` };
    moyensPaiement = [...moyensPaiement, m];
    return m;
  },

  async updateMoyenPaiement(id: string, data: Partial<Omit<MoyenPaiementParoisse, 'id'>>) {
    await delay(400);
    moyensPaiement = moyensPaiement.map((m) => (m.id === id ? { ...m, ...data } : m));
  },

  async deleteMoyenPaiement(id: string) {
    await delay(400);
    moyensPaiement = moyensPaiement.filter((m) => m.id !== id);
  },

  async getTypesOffrandes() {
    await delay(200);
    return typesOffrandes;
  },

  async addTypeOffrande(data: Omit<TypeOffrandeParoisse, 'id' | 'actif'>) {
    await delay(400);
    const t = { ...data, id: `to${Date.now()}`, actif: true };
    typesOffrandes = [...typesOffrandes, t];
    return t;
  },

  async updateTypeOffrande(id: string, data: Partial<Omit<TypeOffrandeParoisse, 'id'>>) {
    await delay(400);
    typesOffrandes = typesOffrandes.map((t) => (t.id === id ? { ...t, ...data } : t));
  },

  async deleteTypeOffrande(id: string) {
    await delay(400);
    typesOffrandes = typesOffrandes.filter((t) => t.id !== id);
  },

  async getPublications() {
    await delay(200);
    return publications;
  },

  async addPublication(data: Omit<PublicationParoisse, 'id'>) {
    await delay(400);
    const images = data.images?.length ? data.images : data.image ? [data.image] : [];
    const p: PublicationParoisse = {
      ...data,
      id: `pub${Date.now()}`,
      images,
      image: images[0] ?? '',
    };
    publications = [p, ...publications];
    return p;
  },

  async updatePublication(id: string, data: Partial<Omit<PublicationParoisse, 'id'>>) {
    await delay(300);
    const existing = publications.find((p) => p.id === id);
    if (!existing) throw new Error('Publication introuvable');
    const images = data.images ?? existing.images;
    const updated: PublicationParoisse = {
      ...existing,
      ...data,
      images,
      image: images[0] ?? existing.image,
    };
    publications = publications.map((p) => (p.id === id ? updated : p));
    return updated;
  },

  async deletePublication(id: string) {
    await delay(300);
    publications = publications.filter((p) => p.id !== id);
  },

  async getCampagnes() {
    await delay(200);
    return campagnes;
  },

  async addCampagne(data: Omit<CampagneParoisse, 'id' | 'collecte'>) {
    await delay(400);
    const c = { ...data, id: `c${Date.now()}`, collecte: 0 };
    campagnes = [...campagnes, c];
    return c;
  },

  async updateCampagne(id: string, data: Partial<Omit<CampagneParoisse, 'id'>>) {
    await delay(300);
    campagnes = campagnes.map((c) => (c.id === id ? { ...c, ...data } : c));
    const updated = campagnes.find((c) => c.id === id);
    if (!updated) throw new Error('Campagne introuvable');
    return updated;
  },

  async deleteCampagne(id: string) {
    await delay(300);
    campagnes = campagnes.filter((c) => c.id !== id);
  },

  async getCampagneDons(campagneId: string) {
    await delay(250);
    const dons = mockCampagneDons[campagneId] ?? [];
    const confirmes = dons.filter((d) => d.statut === 'reussi');

    return {
      dons: [...dons].sort((a, b) => {
        const statutOrder = (s: DonCampagneParoisse['statut']) =>
          s === 'reussi' ? 0 : s === 'en_attente' ? 1 : 2;
        const diff = statutOrder(a.statut) - statutOrder(b.statut);
        if (diff !== 0) return diff;
        const dateA = a.datePaiement ?? a.dateCreation;
        const dateB = b.datePaiement ?? b.dateCreation;
        return new Date(dateB).getTime() - new Date(dateA).getTime();
      }),
      resume: {
        totalConfirmes: confirmes.reduce((sum, d) => sum + d.montant, 0),
        nombreConfirmes: confirmes.length,
        nombreEnAttente: dons.filter((d) => d.statut === 'en_attente').length,
      },
    };
  },

  async getTickets(statut?: string) {
    await delay();
    if (!statut || statut === 'tous') return tickets;
    return tickets.filter((t) => t.statut === statut);
  },

  async addTicket(data: Omit<TicketSupport, 'id' | 'reference' | 'statut' | 'createdAt'>) {
    await delay(400);
    const t: TicketSupport = {
      ...data,
      id: `t${Date.now()}`,
      reference: `TKT-2026-${String(tickets.length + 1).padStart(3, '0')}`,
      statut: 'ouvert',
      createdAt: new Date().toISOString().split('T')[0],
    };
    tickets = [t, ...tickets];
    return t;
  },

  async getPlanningIntentions(filters?: {
    scope?: 'upcoming' | 'past' | 'range';
    from?: string;
    to?: string;
    q?: string;
  }) {
    await delay(200);
    const today = new Date().toISOString().slice(0, 10);
    const scope = filters?.scope ?? 'upcoming';

    let eligibleMesses = messes.filter((m) => m.statut !== 'annulee');

    if (scope === 'past') {
      eligibleMesses = eligibleMesses.filter(
        (m) => m.date < today || m.statut === 'celebree',
      );
    } else if (scope === 'range') {
      // Tous les créneaux dans la plage (calendrier)
    } else {
      eligibleMesses = eligibleMesses.filter((m) => m.statut === 'planifiee' && m.date >= today);
    }

    if (filters?.from) {
      eligibleMesses = eligibleMesses.filter((m) => m.date >= filters.from!);
    }
    if (filters?.to) {
      eligibleMesses = eligibleMesses.filter((m) => m.date <= filters.to!);
    }

    const creneaux = eligibleMesses.map((m) => {
      const linked = demandes.filter((d) => d.messeId === m.id && d.statut !== 'rejetee');
      const montantCollecte = linked
        .filter((d) => d.paiementStatut === 'reussi')
        .reduce((sum, d) => sum + d.montant, 0);
      const especesEnAttente = linked.filter(
        (d) => d.statut === 'en_attente' && d.paiementStatut === 'en_attente',
      ).length;

      return {
        id: m.id,
        titre: m.titre,
        date: m.date,
        heure: m.heure.slice(0, 5),
        capacite_max: 50,
        places_reservees: linked.filter((d) => d.statut === 'confirmee' || d.statut === 'payee').length,
        intentions_count: linked.length,
        montant_collecte: montantCollecte,
        paiements_especes_en_attente: especesEnAttente,
        statut: m.statut,
      };
    });

    if (filters?.q) {
      const q = filters.q.toLowerCase();
      return creneaux.filter(
        (c) =>
          c.titre.toLowerCase().includes(q) ||
          demandes.some(
            (d) =>
              d.messeId === c.id &&
              (d.reference.toLowerCase().includes(q) ||
                d.fideleNom.toLowerCase().includes(q) ||
                d.intention.toLowerCase().includes(q)),
          ),
      );
    }

    return scope === 'past'
      ? creneaux.sort((a, b) => b.date.localeCompare(a.date))
      : creneaux.sort((a, b) => a.date.localeCompare(b.date));
  },

  async getCashPendingPayments() {
    await delay(200);
    return demandes
      .filter((d) => d.statut === 'en_attente' && d.paiementStatut === 'en_attente')
      .map((d) => {
        const messe = messes.find((m) => m.id === d.messeId);
        return {
          id: `pay-${d.id}`,
          montant: d.montant,
          telephone_payeur: '+226 70 00 00 00',
          date_expiration: new Date(Date.now() + 86400000).toISOString(),
          demande: {
            id: d.id,
            reference: d.reference,
            intention: d.intention,
            nom: d.fideleNom,
            telephone: '+226 70 00 00 00',
            type_offrande: d.typeOffrande,
            messe: messe
              ? {
                  id: messe.id,
                  titre: messe.titre,
                  date: messe.date,
                  heure: messe.heure.slice(0, 5),
                }
              : null,
          },
        };
      });
  },

  async confirmCashPayment(paiementId: string) {
    await delay(300);
    const demandeId = paiementId.replace('pay-', '');
    demandes = demandes.map((d) =>
      d.id === demandeId
        ? { ...d, statut: 'confirmee' as const, paiementStatut: 'reussi' as const }
        : d,
    );
  },

  async cancelCashPayment(paiementId: string) {
    await delay(300);
    const demandeId = paiementId.replace('pay-', '');
    demandes = demandes.map((d) =>
      d.id === demandeId ? { ...d, statut: 'rejetee' as const, motifRejet: 'Paiement espèces annulé' } : d,
    );
  },

  async createGuichetIntention(data: {
    messe_id: string;
    type_offrande_id: string;
    nom_demandeur?: string;
    telephone_demandeur: string;
    intention: string;
    montant: number;
    est_anonyme?: boolean;
    moyen_paiement_id: string;
    paiement_recu: boolean;
  }) {
    await delay(400);
    const messe = messes.find((m) => m.id === data.messe_id);
    const type = typesOffrandes.find((t) => t.id === data.type_offrande_id);
    const estAnonyme = Boolean(data.est_anonyme);
    const demande: ParoisseDemande = {
      id: `d${Date.now()}`,
      reference: `MC-${new Date().getFullYear()}-${String(demandes.length + 1).padStart(4, '0')}`,
      fideleNom: estAnonyme ? 'Anonyme' : (data.nom_demandeur ?? '—'),
      typeOffrande: type?.nom ?? '',
      intention: data.intention,
      date: messe?.date ?? '',
      heure: messe?.heure ?? '',
      montant: data.montant,
      statut: data.paiement_recu ? 'confirmee' : 'en_attente',
      paiementStatut: data.paiement_recu ? 'reussi' : 'en_attente',
      paiementMethode: moyensPaiement.find((m) => m.id === data.moyen_paiement_id)?.type ?? 'especes',
      urgent: !data.paiement_recu,
      messeId: data.messe_id,
      messeTitre: messe?.titre,
    };
    demandes = [demande, ...demandes];
    return demande;
  },
};

export type {
  CampagneParoisse,
  MoyenPaiementParoisse,
  ParoisseDemande,
  ParoisseMedia,
  ParoisseMesse,
  ParoisseProfile,
  PublicationParoisse,
  TicketSupport,
  TypeOffrandeParoisse,
};

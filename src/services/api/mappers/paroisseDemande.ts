import type {
  ActiviteRecente,
  DashboardKpis,
  DemandeStatut,
  ParoisseDemande,
  ParoisseMesse,
} from '../../mockApi/paroisse/data';
import { formatActivityTimestamp } from '../../../utils/formatDate';

export interface ApiParoisseDashboard {
  statistiques: {
    demandes: {
      total: number;
      a_venir: number;
      celebre: number;
      annulees: number;
    };
    montant_collecte: number | string;
    fideles: number;
    campagnes_actives: number;
  };
}

export interface ApiParoisseDemande {
  id: number | string;
  reference: string;
  est_anonyme: boolean;
  demandeur?: { nom?: string; label?: string; email?: string; telephone?: string };
  intention: string | null;
  montant: number | string;
  statut: string;
  messe?: { id?: number | string; date: string; heure: string; titre?: string } | null;
  type_offrande?: { nom: string } | null;
  paiements?: { statut: string; moyen_paiement?: { type?: string } }[];
  created_at?: string;
}

export interface ApiParoisseMesse {
  id: number | string;
  titre: string;
  date: string;
  heure: string;
  statut: string;
  places_reservees?: number;
  capacite_max?: number | null;
  demandes_count?: number;
  demandes?: ApiParoisseDemande[];
}

export interface MesseWithDemandes {
  messe: ParoisseMesse;
  demandes: ParoisseDemande[];
}

export function mapDashboardKpis(stats: ApiParoisseDashboard['statistiques']): DashboardKpis {
  return {
    demandesRecues: stats.demandes.total,
    offrandesRecues: Number(stats.montant_collecte),
    messesAVenir: stats.demandes.a_venir,
    fidelesInscrits: stats.fideles,
  };
}

export function mapParoisseDemande(api: ApiParoisseDemande): ParoisseDemande {
  const paiement = api.paiements?.[0];
  const statut = api.statut as DemandeStatut;

  return {
    id: String(api.id),
    reference: api.reference,
    fideleNom: api.demandeur?.nom ?? api.demandeur?.label ?? 'Anonyme',
    typeOffrande: api.type_offrande?.nom ?? '',
    intention: api.intention ?? '',
    date: api.messe?.date ?? '',
    heure: api.messe?.heure?.slice(0, 5) ?? '',
    montant: Number(api.montant),
    statut,
    paiementStatut:
      paiement?.statut === 'reussi'
        ? 'reussi'
        : paiement?.statut === 'echoue'
          ? 'echoue'
          : 'en_attente',
    paiementMethode: paiement?.moyen_paiement?.type?.replace('_', ' ') ?? '—',
    urgent: api.statut === 'en_attente',
    createdAt: api.created_at,
    messeId: api.messe?.id != null ? String(api.messe.id) : undefined,
    messeTitre: api.messe?.titre,
  };
}

export function mapParoisseMesse(api: ApiParoisseMesse): ParoisseMesse {
  const statutMap: Record<string, ParoisseMesse['statut']> = {
    planifiee: 'planifiee',
    en_cours: 'en_cours',
    celebree: 'celebree',
    annulee: 'annulee',
  };

  return {
    id: String(api.id),
    titre: api.titre,
    date: typeof api.date === 'string' ? api.date.slice(0, 10) : api.date,
    heure: api.heure?.slice(0, 5) ?? '',
    pretre: '—',
    lieu: 'Église paroisse',
    intentions: [],
    participants: api.places_reservees ?? 0,
    capacite_max: api.capacite_max ?? null,
    statut: statutMap[api.statut] ?? 'planifiee',
  };
}

export function buildActivitesFromDemandes(demandes: ParoisseDemande[]): ActiviteRecente[] {
  return demandes.slice(0, 5).map((d, i) => {
    const fideleLabel =
      d.fideleNom === "Demande anonyme d'un fidèle" || d.fideleNom === 'Anonyme'
        ? 'Demande anonyme'
        : d.fideleNom;
    const when = d.createdAt ?? d.date;

    return {
      id: `act-${d.id}-${i}`,
      label:
        d.statut === 'en_attente'
          ? `Nouvelle demande ${d.reference} — ${fideleLabel}`
          : `Demande ${d.reference} — ${d.statut.replace('_', ' ')}`,
      date: formatActivityTimestamp(when, d.heure),
      type: 'demande',
    };
  });
}

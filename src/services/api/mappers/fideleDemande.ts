import type { MockDemande, MockMesse, MockPaiement } from '../../mockApi/data';
import type { ApiFideleParoisse, ApiFideleUser } from '../types';

export interface ApiFideleDemande {
  id: number | string;
  reference: string;
  est_anonyme: boolean;
  intention: string | null;
  nom_personne_concernee?: string | null;
  montant: number | string;
  statut: string;
  paroisse?: ApiFideleParoisse | null;
  messe?: {
    id: number | string;
    titre: string;
    date: string;
    heure: string;
  } | null;
  type_offrande?: { id: number | string; nom: string; montant_propose?: number } | null;
  paiements?: ApiPaiement[];
  created_at?: string;
}

export interface ApiPaiement {
  id: number | string;
  montant: number | string;
  statut: string;
  reference_interne?: string;
  reference_fournisseur?: string | null;
  date_paiement?: string | null;
}

export interface ApiTypeOffrande {
  id: number | string;
  nom: string;
  description?: string | null;
  montant_propose?: number | string;
}

export interface ApiMoyenPaiement {
  id: number | string;
  type: string;
  actif: boolean;
}

export interface ApiMesse {
  id: number | string;
  titre: string;
  date: string;
  heure: string;
  places_disponibles?: number | null;
  capacite_max?: number | null;
  statut?: string;
}

export function mapFideleDemande(api: ApiFideleDemande): MockDemande {
  const statutMap: Record<string, MockDemande['statut']> = {
    en_attente: 'en_attente',
    payee: 'payee',
    confirmee: 'confirmee',
    celebree: 'celebree',
    annulee: 'en_attente',
  };

  return {
    id: String(api.id),
    reference: api.reference,
    paroisseId: api.paroisse?.id != null ? String(api.paroisse.id) : '',
    paroisseNom: api.paroisse?.nom ?? '',
    typeMesse: api.type_offrande?.nom ?? 'Intention',
    intention: api.intention ?? '',
    date: normalizeApiDate(api.messe?.date),
    creneau: api.messe?.heure?.slice(0, 5) ?? '',
    montant: Number(api.montant),
    statut: statutMap[api.statut] ?? 'en_attente',
    estAnonyme: api.est_anonyme,
    createdAt: api.created_at?.slice(0, 10) ?? new Date().toISOString().slice(0, 10),
  };
}

export function normalizeApiDate(value: string | null | undefined): string {
  if (!value) return '';
  return value.slice(0, 10);
}

export function mapFideleMesse(api: ApiMesse, paroisseId: string): MockMesse {
  const placesDisponibles = api.places_disponibles;
  const capacite = api.capacite_max ?? 50;

  return {
    id: String(api.id),
    paroisseId,
    date: normalizeApiDate(api.date),
    heure: api.heure?.slice(0, 5) ?? '',
    titre: api.titre,
    placesRestantes: placesDisponibles ?? capacite,
    capacite,
  };
}

export function mapFidelePaiement(api: ApiPaiement, demandeId: string): MockPaiement {
  return {
    id: String(api.id),
    demandeId,
    reference: api.reference_interne ?? String(api.id),
    montant: Number(api.montant),
    methode: 'Mobile Money',
    statut: api.statut === 'reussi' ? 'reussi' : api.statut === 'echoue' ? 'echoue' : 'en_attente',
    date: api.date_paiement?.slice(0, 10) ?? new Date().toISOString().slice(0, 10),
  };
}

export type { ApiFideleUser };

export interface CreneauIntentions {
  id: string;
  titre: string;
  date: string;
  heure: string;
  capacite_max: number | null;
  places_reservees: number;
  intentions_count: number;
  montant_collecte: number;
  paiements_especes_en_attente: number;
  statut: string;
}

export interface PaiementEspecesEnAttente {
  id: string;
  montant: number;
  telephone_payeur?: string;
  date_expiration?: string;
  demande: {
    id: string;
    reference: string;
    intention: string;
    nom: string;
    telephone?: string;
    type_offrande?: string | null;
    messe?: {
      id: string;
      titre: string;
      date: string;
      heure: string;
    } | null;
  } | null;
}

export interface GuichetIntentionInput {
  messe_id: string;
  type_offrande_id: string;
  nom_demandeur?: string;
  telephone_demandeur: string;
  intention: string;
  montant: number;
  est_anonyme?: boolean;
  moyen_paiement_id: string;
  paiement_recu: boolean;
}

export type PlanningScope = 'upcoming' | 'past' | 'range';

export interface PlanningFilters {
  scope?: PlanningScope;
  from?: string;
  to?: string;
  q?: string;
}

export type HistoriqueVue = 'historique' | 'celebre' | 'annulee';

export interface HistoriqueFilters {
  vue?: HistoriqueVue;
  from?: string;
  to?: string;
  q?: string;
}

export type IntentionsPeriodPreset = 'week' | 'month' | 'quarter' | 'all';

export type HistoriquePeriodPreset = 'month' | 'quarter' | 'year' | 'all';

export type IntentionsViewMode = 'cards' | 'list';

import { API_TYPE_TO_MOCK_METHODE, MOCK_METHODE_TO_API_TYPE } from './paiement';
import { resolveAssetUrl } from '../../../lib/images';
import type {
  CampagneDonsResume,
  CampagneParoisse,
  DonCampagneParoisse,
  MoyenPaiementParoisse,
  ParoisseMedia,
  ParoisseMesse,
  PublicationParoisse,
  TypeOffrandeParoisse,
} from '../../mockApi/paroisse/data';

export interface ApiParoisseMedia {
  id: number | string;
  type: string;
  url: string;
  ordre?: number;
  created_at?: string;
}

export interface ApiParoissePublication {
  id: number | string;
  titre: string;
  contenu?: string | null;
  image?: string | null;
  images?: string[] | null;
  date_publication?: string | null;
}

export interface ApiParoisseCampagne {
  id: number | string;
  nom: string;
  description?: string | null;
  objectif_total: number | string;
  montant_collecte: number | string;
  image?: string | null;
  date_fin?: string | null;
  created_at?: string;
}

export interface ApiParoisseMoyenPaiement {
  id: number | string;
  type: string;
  numero?: string | null;
  actif: boolean;
}

export interface ApiParoisseTypeOffrande {
  id: number | string;
  nom: string;
  description?: string | null;
  montant_propose?: number | string | null;
  actif: boolean;
}

export function mapParoisseMesseFromApi(api: {
  id: number | string;
  titre: string;
  date: string;
  heure: string;
  description?: string | null;
  statut?: string;
  places_reservees?: number;
}): ParoisseMesse {
  const meta = parseMesseMeta(api.description);
  const statut = api.statut as ParoisseMesse['statut'] | undefined;

  return {
    id: String(api.id),
    titre: api.titre,
    date: typeof api.date === 'string' ? api.date.slice(0, 10) : String(api.date),
    heure: api.heure?.slice(0, 5) ?? '',
    pretre: meta.pretre,
    lieu: meta.lieu,
    intentions: [],
    participants: api.places_reservees ?? 0,
    statut: statut ?? 'planifiee',
  };
}

function parseMesseMeta(description?: string | null): { pretre: string; lieu: string } {
  if (!description) {
    return { pretre: '—', lieu: 'Église paroisse' };
  }

  const pretreMatch = description.match(/Prêtre:\s*(.+)/);
  const lieuMatch = description.match(/Lieu:\s*(.+)/);

  return {
    pretre: pretreMatch?.[1]?.trim() ?? '—',
    lieu: lieuMatch?.[1]?.trim() ?? 'Église paroisse',
  };
}

export function mapParoisseMedia(api: ApiParoisseMedia): ParoisseMedia {
  const type = api.type === 'video' ? 'video' : 'image';
  return {
    id: String(api.id),
    url: api.url,
    type,
    titre: type === 'video' ? 'Vidéo paroisse' : 'Photo paroisse',
    description: api.url,
    createdAt: api.created_at?.slice(0, 10) ?? new Date().toISOString().slice(0, 10),
  };
}

export function mapParoissePublication(api: ApiParoissePublication): PublicationParoisse {
  const rawImages =
    api.images && api.images.length > 0
      ? api.images
      : api.image
        ? [api.image]
        : [];
  const images = rawImages.map(resolveAssetUrl).filter(Boolean);

  return {
    id: String(api.id),
    titre: api.titre,
    contenu: api.contenu ?? '',
    image: images[0] ?? '',
    images,
    datePublication: api.date_publication?.slice(0, 10) ?? new Date().toISOString().slice(0, 10),
  };
}

export function mapParoisseCampagne(api: ApiParoisseCampagne): CampagneParoisse {
  return {
    id: String(api.id),
    titre: api.nom,
    description: api.description ?? '',
    objectif: Number(api.objectif_total),
    collecte: Number(api.montant_collecte),
    dateDebut: api.created_at?.slice(0, 10) ?? new Date().toISOString().slice(0, 10),
    dateFin: api.date_fin?.slice(0, 10) ?? '',
    image: api.image ?? '',
  };
}

export interface ApiParoisseCampagneDon {
  id: number | string;
  montant: number | string;
  statut: DonCampagneParoisse['statut'];
  reference_interne: string;
  telephone_payeur?: string | null;
  date_paiement?: string | null;
  created_at?: string | null;
  moyen_paiement?: { id?: string | number; type?: string } | null;
}

export interface ApiParoisseCampagneDonsResume {
  total_confirmes: number | string;
  nombre_confirmes: number;
  nombre_en_attente: number;
}

export function mapParoisseCampagneDon(api: ApiParoisseCampagneDon): DonCampagneParoisse {
  const apiType = api.moyen_paiement?.type ?? 'autre';
  const methode = (API_TYPE_TO_MOCK_METHODE[apiType] ?? 'especes') as DonCampagneParoisse['methodePaiement'];

  return {
    id: String(api.id),
    montant: Number(api.montant),
    statut: api.statut,
    reference: api.reference_interne,
    telephone: api.telephone_payeur ?? null,
    datePaiement: api.date_paiement ?? null,
    dateCreation: api.created_at ?? new Date().toISOString(),
    methodePaiement: methode,
  };
}

export function mapParoisseCampagneDonsResume(api: ApiParoisseCampagneDonsResume): CampagneDonsResume {
  return {
    totalConfirmes: Number(api.total_confirmes),
    nombreConfirmes: api.nombre_confirmes,
    nombreEnAttente: api.nombre_en_attente,
  };
}

export function mapParoisseMoyenPaiement(api: ApiParoisseMoyenPaiement): MoyenPaiementParoisse {
  const mockType = (API_TYPE_TO_MOCK_METHODE[api.type] ?? 'orange') as MoyenPaiementParoisse['type'];
  return {
    id: String(api.id),
    type: mockType,
    numero: api.numero ?? '—',
    nomCompte: api.type.replace('_', ' '),
    actif: api.actif,
  };
}

export function mapParoisseTypeOffrande(api: ApiParoisseTypeOffrande): TypeOffrandeParoisse {
  return {
    id: String(api.id),
    nom: api.nom,
    montantConseille: Number(api.montant_propose ?? 0),
    description: api.description ?? '',
    actif: api.actif,
  };
}

export function toApiMoyenPaiementType(mockType: MoyenPaiementParoisse['type']): string {
  return MOCK_METHODE_TO_API_TYPE[mockType] ?? 'autre';
}

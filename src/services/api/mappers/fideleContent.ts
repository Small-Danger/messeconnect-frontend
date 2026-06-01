import { appImages, resolveAssetUrl } from '../../../lib/images';
import type { MockCampagne, MockPublication } from '../../mockApi/data';

export interface ApiFidelePublication {
  id: number | string;
  titre: string;
  contenu?: string | null;
  image?: string | null;
  images?: string[] | null;
  date_publication?: string | null;
}

export interface ApiFideleCampagne {
  id: number | string;
  nom: string;
  description?: string | null;
  objectif_total: number | string;
  montant_collecte: number | string;
  image?: string | null;
  date_fin?: string | null;
}

export function mapFidelePublication(api: ApiFidelePublication, paroisseId: string): MockPublication {
  const rawImages =
    api.images && api.images.length > 0
      ? api.images
      : api.image
        ? [api.image]
        : [appImages.cathedraleOuaga];
  const images = rawImages.map(resolveAssetUrl).filter(Boolean);

  return {
    id: String(api.id),
    paroisseId,
    titre: api.titre,
    description: api.contenu ?? '',
    image: images[0] ?? appImages.cathedraleOuaga,
    images,
    datePublication: api.date_publication?.slice(0, 10) ?? new Date().toISOString().slice(0, 10),
  };
}

export function mapFideleCampagne(api: ApiFideleCampagne, paroisseId: string): MockCampagne {
  return {
    id: String(api.id),
    paroisseId,
    titre: api.nom,
    objectif: Number(api.objectif_total),
    collecte: Number(api.montant_collecte),
    image: api.image || appImages.cathedraleOuaga,
  };
}

import { appImages, resolveAssetUrl } from '../../../lib/images';
import type { MockParoisse, MockUser } from '../../mockApi/data';
import type { ApiFideleParoisse, ApiFideleUser } from '../types';

export function mapFideleUser(api: ApiFideleUser): MockUser {
  return {
    id: String(api.id),
    nom: api.nom,
    prenom: api.prenom,
    email: api.email,
    telephone: api.telephone ?? '',
    stats: {
      demandes: 0,
      montantTotal: 0,
      favoris: 0,
    },
  };
}

export function mapFideleParoisse(api: ApiFideleParoisse): MockParoisse {
  const dioceseName =
    api.diocese && typeof api.diocese === 'object' ? api.diocese.nom : '';

  return {
    id: String(api.id),
    nom: api.nom,
    ville: api.ville ?? '',
    diocese: dioceseName,
    pays: api.pays ?? 'Burkina Faso',
    distance: '—',
    image: resolveAssetUrl(api.banniere ?? api.logo) || appImages.cathedraleOuaga,
    description: api.description ?? '',
    telephone: api.telephone ?? '',
    siteWeb: api.site_web ?? undefined,
    adresse: api.adresse ?? '',
    horaires: api.horaires ?? [],
    estFavori: api.est_favori ?? false,
  };
}

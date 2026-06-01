import { resolveAssetUrl, appImages } from '../../../lib/images';
import type { ParoisseProfile } from '../../mockApi/paroisse/data';
import type { ApiParoisseParish, ApiParoisseUser } from '../types';

export function mapParoisseProfile(
  parish: ApiParoisseParish,
  user?: ApiParoisseUser,
): ParoisseProfile {
  const diocese =
    parish.diocese && typeof parish.diocese === 'object' ? parish.diocese.nom : '';

  return {
    id: String(parish.id),
    nom: parish.nom,
    diocese,
    adresse: parish.adresse ?? '',
    ville: parish.ville ?? '',
    pays: parish.pays ?? 'Burkina Faso',
    telephone: parish.telephone ?? '',
    email: parish.email ?? '',
    siteWeb: parish.site_web ?? '',
    description: parish.description ?? '',
    photoCouverture: resolveAssetUrl(parish.banniere) || appImages.cathedraleOuaga,
    photoProfil: resolveAssetUrl(parish.logo) || appImages.cathedraleOuaga,
    responsable: user?.nom ?? '',
    horaires: parish.horaires ?? [],
  };
}

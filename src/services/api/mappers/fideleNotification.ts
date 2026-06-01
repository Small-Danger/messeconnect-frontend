import type { ApiFideleNotification } from '../fidele';
import type { FideleNotification } from '../../../types/fidele';

export function mapFideleNotification(api: ApiFideleNotification): FideleNotification {
  return {
    id: api.id,
    type: api.type,
    titre: api.titre,
    contenu: api.contenu,
    statut: api.statut === 'lue' ? 'lue' : 'envoyee',
    demandeMesseId: api.demande_messe_id ?? null,
    dateEnvoi: api.date_envoi,
  };
}

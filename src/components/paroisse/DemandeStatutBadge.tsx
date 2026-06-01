import type { DemandeStatut } from '../../services/mockApi/paroisse/data';

const labels: Record<DemandeStatut, string> = {
  en_attente: 'En attente',
  confirmee: 'Confirmée',
  payee: 'Payée',
  celebree: 'Célébrée',
  rejetee: 'Rejetée',
  annulee: 'Annulée',
};

const styles: Record<DemandeStatut, string> = {
  en_attente: 'bg-amber-light text-amber-dark',
  confirmee: 'bg-teal-light text-teal-800',
  payee: 'bg-teal-light text-teal-800',
  celebree: 'bg-teal-light text-teal-900',
  rejetee: 'bg-red-50 text-red-700',
  annulee: 'bg-gray-100 text-gray-700',
};

export function DemandeStatutBadge({ statut }: { statut: DemandeStatut }) {
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${styles[statut]}`}>
      {labels[statut]}
    </span>
  );
}

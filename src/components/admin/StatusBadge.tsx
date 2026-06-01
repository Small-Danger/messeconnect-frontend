const styles: Record<string, string> = {
  actif: 'bg-teal-light text-teal-800',
  suspendu: 'bg-red-100 text-red-700',
  inactif: 'bg-gray-100 text-gray-600',
  validee: 'bg-teal-light text-teal-800',
  en_attente: 'bg-amber-light text-amber-dark',
  suspendue: 'bg-red-100 text-red-700',
  rejetee: 'bg-red-50 text-red-700',
  reussi: 'bg-teal-light text-teal-800',
  en_cours: 'bg-purple-light text-purple',
  echoue: 'bg-red-100 text-red-700',
  rembourse: 'bg-gray-100 text-gray-600',
  ouvert: 'bg-amber-light text-amber-dark',
  resolu: 'bg-teal-light text-teal-800',
  basse: 'bg-gray-100 text-gray-600',
  normale: 'bg-purple-light text-purple',
  haute: 'bg-amber-light text-amber-dark',
  urgente: 'bg-red-100 text-red-700',
  expire: 'bg-gray-100 text-gray-600',
  premium: 'bg-purple-light text-purple',
  standard: 'bg-teal-light text-teal-800',
  essentiel: 'bg-gray-100 text-gray-600',
};

const labels: Record<string, string> = {
  actif: 'Actif',
  suspendu: 'Suspendu',
  inactif: 'Inactif',
  validee: 'Validée',
  en_attente: 'En attente',
  suspendue: 'Suspendue',
  rejetee: 'Rejetée',
  reussi: 'Réussi',
  en_cours: 'En cours',
  echoue: 'Échoué',
  rembourse: 'Remboursé',
  ouvert: 'Ouvert',
  resolu: 'Résolu',
  basse: 'Basse',
  normale: 'Normale',
  haute: 'Haute',
  urgente: 'Urgente',
  expire: 'Expiré',
  premium: 'Premium',
  standard: 'Standard',
  essentiel: 'Essentiel',
};

interface StatusBadgeProps {
  statut: string;
}

export function StatusBadge({ statut }: StatusBadgeProps) {
  const style = styles[statut] ?? 'bg-gray-100 text-gray-600';
  const label = labels[statut] ?? statut.replace(/_/g, ' ');
  return (
    <span className={`inline-flex text-xs px-2.5 py-0.5 rounded-full font-medium ${style}`}>
      {label}
    </span>
  );
}

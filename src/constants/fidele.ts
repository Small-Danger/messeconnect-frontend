export const montantsRapides = [5000, 10000, 20000] as const;

export const methodesPaiement = [
  { id: 'orange', label: 'Orange Money', subtitle: 'Paiement mobile instantané' },
  { id: 'moov', label: 'Moov Money', subtitle: 'Compte Moov Burkina Faso' },
  { id: 'wave', label: 'Wave', subtitle: 'Transfert sécurisé Wave' },
  { id: 'especes', label: 'Espèces au secrétariat', subtitle: 'Règlement sur place à la paroisse' },
] as const;

export const typesMesse = [
  'Intention',
  'Défunt',
  'Action de grâce',
  'Anniversaire',
  'Mariage',
  'Autre',
] as const;

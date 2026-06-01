/**
 * Formate un montant en FCFA (XOF).
 */
export function formatFcfa(amount: number | string): string {
  const value = typeof amount === 'string' ? parseFloat(amount) : amount;

  if (Number.isNaN(value)) {
    return '0 FCFA';
  }

  return `${new Intl.NumberFormat('fr-FR', {
    maximumFractionDigits: 0,
  }).format(value)} FCFA`;
}

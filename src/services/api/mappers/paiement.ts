/** Correspondance IDs UI mock ↔ types API Laravel */
export const MOCK_METHODE_TO_API_TYPE: Record<string, string> = {
  orange: 'orange_money',
  moov: 'moov_money',
  wave: 'wave',
  especes: 'autre',
};

export const API_TYPE_TO_MOCK_METHODE: Record<string, string> = {
  orange_money: 'orange',
  moov_money: 'moov',
  wave: 'wave',
  autre: 'especes',
};

export function resolveMoyenPaiementId(
  methodeMockId: string,
  moyens: { id: string | number; type: string }[],
): string | null {
  const apiType = MOCK_METHODE_TO_API_TYPE[methodeMockId];
  if (!apiType) return null;
  const found = moyens.find((m) => m.type === apiType);
  return found ? String(found.id) : null;
}

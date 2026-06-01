/** Photos de démonstration — servies depuis /public/images/demo (fiables hors Wikimedia) */
export const appImages = {
  heroMesse: '/images/demo/cathedrale-ouaga.jpg',
  cathedraleOuaga: '/images/demo/cathedrale-ouaga.jpg',
  ouagadougou: '/images/demo/ouagadougou-ville.jpg',
  messeYagma: '/images/demo/messe-celebration.jpg',
  koudougou: '/images/demo/koudougou.jpg',
} as const;

export const paroisseImages: Record<string, string> = {
  p1: appImages.cathedraleOuaga,
  p2: appImages.messeYagma,
  p3: appImages.ouagadougou,
  p4: appImages.koudougou,
};

/** Chemins relatifs utilisés par les seeders Laravel (identiques) */
export const demoImagePaths = {
  cathedrale: '/images/demo/cathedrale-ouaga.jpg',
  messe: '/images/demo/messe-celebration.jpg',
  ouagadougou: '/images/demo/ouagadougou-ville.jpg',
  koudougou: '/images/demo/koudougou.jpg',
} as const;

/** Convertit une URL absolue Laravel (APP_URL) en chemin servi par le proxy Vite (/storage/…). */
export function resolveAssetUrl(url: string | null | undefined): string {
  if (!url?.trim()) return '';
  const value = url.trim();
  if (value.startsWith('/storage/') || value.startsWith('/images/')) return value;
  if (value.startsWith('http://') || value.startsWith('https://')) {
    try {
      const { pathname } = new URL(value);
      if (pathname.startsWith('/storage/') || pathname.startsWith('/images/')) {
        return pathname;
      }
    } catch {
      return value;
    }
  }
  return value;
}

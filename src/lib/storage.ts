export type ActorSpace = 'fidele' | 'paroisse' | 'admin';

const TOKEN_KEYS: Record<ActorSpace, string> = {
  fidele: 'mc_token_fidele',
  paroisse: 'mc_token_paroisse',
  admin: 'mc_token_admin',
};

export function getToken(space: ActorSpace): string | null {
  return localStorage.getItem(TOKEN_KEYS[space]);
}

export function setToken(space: ActorSpace, token: string): void {
  localStorage.setItem(TOKEN_KEYS[space], token);
}

export function clearToken(space: ActorSpace): void {
  localStorage.removeItem(TOKEN_KEYS[space]);
}

export type ActorSpace = 'fidele' | 'paroisse' | 'admin';

export interface AuthUser {
  id: string;
  email: string;
  nom?: string;
  prenom?: string;
  role?: string;
}

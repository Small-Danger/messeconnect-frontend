export interface ApiDiocese {
  id: number;
  nom: string;
}

export interface ApiFideleUser {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string | null;
  ville: string | null;
  pays: string | null;
  actif: boolean;
  created_at?: string;
}

export interface ApiFideleParoisse {
  id: number;
  nom: string;
  description: string | null;
  telephone: string | null;
  email: string | null;
  adresse: string | null;
  ville: string | null;
  pays: string | null;
  logo: string | null;
  banniere: string | null;
  site_web?: string | null;
  horaires?: string[];
  couleur_principale?: string | null;
  diocese?: ApiDiocese | null;
  est_favori?: boolean;
}

export interface AuthResponse<TUser> {
  message: string;
  user: TUser;
  token: string;
  token_type: string;
}

export interface ApiAdminUser {
  id: number;
  nom: string;
  email: string;
  role?: string;
  actif?: boolean;
}

export interface ApiParoisseUser {
  id: number;
  paroisse_id: number;
  nom: string;
  email: string;
  role: string;
  actif: boolean;
  paroisse?: ApiParoisseParish;
}

export interface ApiParoisseParish {
  id: number;
  nom: string;
  description: string | null;
  telephone: string | null;
  email: string | null;
  adresse: string | null;
  ville: string | null;
  pays: string | null;
  logo: string | null;
  banniere: string | null;
  site_web?: string | null;
  horaires?: string[];
  statut?: string;
  diocese?: ApiDiocese | null;
}

export type ActorSpace = 'fidele' | 'paroisse' | 'admin';

export interface PageHandle {
  title: string;
  description?: string;
  space: ActorSpace | 'landing';
  apiHint?: string;
}

export interface NavItem {
  label: string;
  to: string;
  end?: boolean;
  shortLabel?: string;
}

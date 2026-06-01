import type { NavItem } from '../types/routes';

export const paroisseNav: NavItem[] = [
  { label: 'Tableau de bord', to: '/paroisse/dashboard', end: true, shortLabel: 'Accueil' },
  { label: 'Demandes', to: '/paroisse/demandes', shortLabel: 'Demandes' },
  { label: 'Calendrier', to: '/paroisse/calendrier', shortLabel: 'Calendrier' },
  { label: 'Médias', to: '/paroisse/media', shortLabel: 'Médias' },
  { label: 'Profil', to: '/paroisse/profile', shortLabel: 'Profil' },
  { label: 'Aide MesseConnect', to: '/paroisse/support', shortLabel: 'Aide' },
];

export const paroisseBottomNav: NavItem[] = [
  { label: 'Tableau de bord', to: '/paroisse/dashboard', end: true, shortLabel: 'Accueil' },
  { label: 'Demandes', to: '/paroisse/demandes', shortLabel: 'Demandes' },
  { label: 'Calendrier', to: '/paroisse/calendrier', shortLabel: 'Calendrier' },
  { label: 'Médias', to: '/paroisse/media', shortLabel: 'Médias' },
  { label: 'Profil', to: '/paroisse/profile', shortLabel: 'Profil' },
];

export const adminNav: NavItem[] = [
  { label: 'Dashboard', to: '/admin/dashboard', end: true, shortLabel: 'Accueil' },
  { label: 'Utilisateurs', to: '/admin/users', shortLabel: 'Users' },
  { label: 'Paroisses', to: '/admin/parishes', shortLabel: 'Paroisses' },
  { label: 'Transactions', to: '/admin/transactions', shortLabel: 'Transactions' },
  { label: 'Support', to: '/admin/support', shortLabel: 'Support' },
  { label: 'Paramètres', to: '/admin/settings', shortLabel: 'Paramètres' },
];

export const adminBottomNav: NavItem[] = [
  { label: 'Dashboard', to: '/admin/dashboard', end: true, shortLabel: 'Accueil' },
  { label: 'Utilisateurs', to: '/admin/users', shortLabel: 'Users' },
  { label: 'Paroisses', to: '/admin/parishes', shortLabel: 'Paroisses' },
  { label: 'Transactions', to: '/admin/transactions', shortLabel: 'Transactions' },
  { label: 'Support', to: '/admin/support', shortLabel: 'Support' },
];

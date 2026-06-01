import { Church, HeartHandshake, Home, ListOrdered, User } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

type NavTab = {
  to: string;
  label: string;
  icon: LucideIcon;
  end?: boolean;
};

const accueilTab: NavTab = { to: '/', label: 'Accueil', icon: Home, end: true };
const paroissesTab: NavTab = { to: '/paroisses', label: 'Paroisses', icon: Church };
const demandesTab: NavTab = { to: '/mes-demandes', label: 'Demandes', icon: ListOrdered };
const collectesTab: NavTab = { to: '/campagnes', label: 'Collectes', icon: HeartHandshake };
const profilTab: NavTab = { to: '/profile', label: 'Profil', icon: User };

export function FideleBottomNav() {
  const token = useAuthStore((s) => s.token);
  const tabs: NavTab[] = token
    ? [accueilTab, paroissesTab, demandesTab, collectesTab, profilTab]
    : [accueilTab, paroissesTab, collectesTab, profilTab];

  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-mobile h-[72px] bg-white border-t border-gray-100 flex z-50 pb-safe-bottom"
      aria-label="Navigation fidèle"
    >
      {tabs.map(({ to, label, icon: Icon, end = false }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            [
              'flex-1 flex flex-col items-center justify-center gap-1 min-h-touch active:scale-95 transition-transform',
              isActive ? 'text-teal font-medium' : 'text-gray-400',
            ].join(' ')
          }
        >
          <Icon className="h-5 w-5" strokeWidth={2} />
          <span className="text-[10px] leading-none">{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

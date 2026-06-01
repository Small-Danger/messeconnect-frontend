import type { ReactNode } from 'react';
import { useMatches } from 'react-router-dom';
import type { NavItem, PageHandle } from '../../types/routes';
import { MesseConnectLogo } from '../common/MesseConnectLogo';
import { BackButton } from './BackButton';
import { BottomNav } from './BottomNav';
import { NotificationBell } from './NotificationBell';
import { SidebarNav } from './SidebarNav';

export interface AppShellProps {
  children: ReactNode;
  title?: string;
  showBack?: boolean;
  sidebarItems: NavItem[];
  bottomNavItems: NavItem[];
  accent?: 'teal' | 'green' | 'purple';
}

const accentMap = {
  teal: { header: 'bg-teal', sidebar: 'bg-teal-800', active: 'bg-teal-mid' },
  green: { header: 'bg-teal', sidebar: 'bg-teal-900', active: 'bg-teal-mid' },
  purple: { header: 'bg-purple', sidebar: 'bg-purple-dark', active: 'bg-purple' },
};

export function AppShell({
  children,
  title,
  showBack = false,
  sidebarItems,
  bottomNavItems,
  accent = 'teal',
}: AppShellProps) {
  const matches = useMatches();
  const handle = matches.at(-1)?.handle as PageHandle | undefined;
  const pageTitle = title ?? handle?.title ?? 'MesseConnect';
  const colors = accentMap[accent];

  return (
    <div className="min-h-screen bg-gray-50">
      <header
        className={[
          'fixed top-0 left-0 right-0 z-50 h-14',
          colors.header,
          'flex items-center justify-between px-4 pt-safe-top',
          'lg:left-60',
        ].join(' ')}
      >
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {showBack ? <BackButton /> : <span className="min-w-touch" />}
          <h1 className="text-white font-medium text-base truncate">{pageTitle}</h1>
        </div>
        <NotificationBell />
      </header>

      <aside
        className={[
          'hidden lg:flex fixed left-0 top-0 bottom-0 w-60 flex-col z-40',
          colors.sidebar,
        ].join(' ')}
      >
        <div className="px-4 pt-5 pb-2">
          <MesseConnectLogo size="lg" />
        </div>
        <SidebarNav items={sidebarItems} accentClass={colors.active} />
      </aside>

      <main className="pt-14 pb-20 lg:pl-60 lg:pb-8 min-h-screen">
        <div className="max-w-mobile mx-auto md:max-w-2xl lg:max-w-5xl px-4 md:px-6 lg:px-8 py-4">
          {children}
        </div>
        <div
          className="pointer-events-none fixed bottom-16 left-0 right-0 h-8 opacity-20 lg:hidden"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, #0F6E56 0, #0F6E56 8px, transparent 8px, transparent 16px)',
          }}
          aria-hidden
        />
      </main>

      <nav
        className={[
          'fixed bottom-0 left-0 right-0 h-16 bg-white',
          'border-t border-gray-100 flex lg:hidden pb-safe-bottom z-50',
        ].join(' ')}
        aria-label="Navigation principale"
      >
        <BottomNav items={bottomNavItems} />
      </nav>
    </div>
  );
}

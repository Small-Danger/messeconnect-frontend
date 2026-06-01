import { Calendar, HeadphonesIcon, HeartHandshake, LayoutDashboard, ListOrdered, LogOut, Newspaper, User } from 'lucide-react';
import { useEffect } from 'react';
import { Link, NavLink, Navigate, Outlet, useNavigate } from 'react-router-dom';
import { MesseConnectLogo } from '../common/MesseConnectLogo';
import { ParoisseNotificationMenu } from './ParoisseNotificationMenu';
import { useParoisseAppStore } from '../../stores/paroisseAppStore';

const navItems = [
  { to: '/paroisse/dashboard', label: 'Tableau de bord', icon: LayoutDashboard, end: true },
  { to: '/paroisse/intentions', label: 'Intentions', icon: ListOrdered },
  { to: '/paroisse/calendrier', label: 'Calendrier', icon: Calendar },
  { to: '/paroisse/publications', label: 'Publications', icon: Newspaper },
  { to: '/paroisse/collectes', label: 'Collectes', icon: HeartHandshake },
  { to: '/paroisse/profile', label: 'Profil', icon: User },
  {
    to: '/paroisse/support',
    label: 'Aide MesseConnect',
    hint: 'Support technique',
    icon: HeadphonesIcon,
  },
];

const mobileNavItems = navItems.filter(
  (item) => item.to !== '/paroisse/collectes' && item.to !== '/paroisse/support',
);

export function ParoisseShell() {
  const navigate = useNavigate();
  const token = useParoisseAppStore((s) => s.token);
  const { profile, refreshSession, logout, cashPending } = useParoisseAppStore();

  useEffect(() => {
    if (!token) return;
    void refreshSession();
  }, [token, refreshSession]);

  const handleLogout = () => {
    logout();
    navigate('/paroisse/login');
  };

  const avatarInitial = profile?.nom?.charAt(0)?.toUpperCase() ?? 'P';

  if (!token) {
    return <Navigate to="/paroisse/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <aside className="hidden lg:flex w-[280px] flex-col bg-teal-900 shrink-0 fixed inset-y-0 left-0 z-30">
        <div className="p-6 border-b border-white/10">
          <MesseConnectLogo variant="light" />
          <p className="text-xs text-amber-light/90 mt-2 font-medium">Espace paroisse</p>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map(({ to, label, hint, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                [
                  'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors min-h-touch',
                  isActive ? 'bg-teal text-white' : 'text-teal-100/90 hover:bg-white/10',
                ].join(' ')
              }
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span className="flex-1 min-w-0">
                <span className="block truncate">{label}</span>
                {hint ? (
                  <span className="block text-[10px] font-normal opacity-70 truncate">{hint}</span>
                ) : null}
              </span>
              {to === '/paroisse/intentions' && cashPending.length > 0 ? (
                <span className="rounded-full bg-amber-light px-2 py-0.5 text-[10px] font-bold text-amber-dark">
                  {cashPending.length}
                </span>
              ) : null}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <p className="text-sm text-teal-50 truncate font-medium">{profile?.nom ?? 'Paroisse'}</p>
          {profile?.email ? (
            <p className="text-xs text-teal-100/70 truncate mt-0.5">{profile.email}</p>
          ) : null}
          <button
            type="button"
            onClick={handleLogout}
            className="mt-3 flex items-center gap-2 text-sm text-red-300 hover:text-red-200 min-h-touch"
          >
            <LogOut className="h-4 w-4" />
            Déconnexion
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 lg:ml-[280px]">
        <header className="sticky top-0 z-20 bg-white border-b border-gray-200 px-4 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-gray-900 lg:hidden">Espace paroisse</h1>
            <p className="text-sm text-gray-500 hidden lg:block">
              Secrétariat paroissial — {profile?.nom ?? 'MesseConnect'}
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <ParoisseNotificationMenu />
            <Link
              to="/paroisse/profile"
              className="flex items-center gap-2 rounded-xl p-1 -m-1 hover:bg-gray-50 transition-colors min-h-touch"
              aria-label="Mon profil paroisse"
            >
              <span className="hidden sm:inline text-sm text-gray-600 truncate max-w-[160px] lg:max-w-[200px]">
                {profile?.responsable ?? profile?.nom ?? 'Paroisse'}
              </span>
              <span className="h-9 w-9 rounded-full bg-teal-light text-teal ring-2 ring-teal/10 flex items-center justify-center text-sm font-semibold shrink-0">
                {avatarInitial}
              </span>
            </Link>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8 pb-24 lg:pb-8 overflow-x-hidden">
          <Outlet />
        </main>

        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-teal-900 border-t border-white/10 flex z-50 pb-safe-bottom">
          {mobileNavItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                [
                  'flex-1 flex flex-col items-center justify-center gap-0.5 py-2 min-h-[56px] text-[10px]',
                  isActive ? 'text-white font-medium' : 'text-teal-100/70',
                ].join(' ')
              }
            >
              <Icon className="h-5 w-5" />
              <span className="truncate max-w-[56px]">{label.split(' ')[0]}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}

import {
  Building2,
  CreditCard,
  HeadphonesIcon,
  Landmark,
  LayoutDashboard,
  LogOut,
  Megaphone,
  Settings,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { useEffect } from 'react';
import { Link, NavLink, Navigate, Outlet, useNavigate } from 'react-router-dom';
import { MesseConnectLogo } from '../common/MesseConnectLogo';
import { useAdminStore } from '../../stores/adminStore';

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard', shortLabel: 'Accueil', icon: LayoutDashboard, end: true },
  { to: '/admin/users', label: 'Utilisateurs', shortLabel: 'Users', icon: Users },
  { to: '/admin/parishes', label: 'Paroisses', shortLabel: 'Paroisses', icon: Building2 },
  { to: '/admin/dioceses', label: 'Diocèses', shortLabel: 'Diocèses', icon: Landmark },
  { to: '/admin/transactions', label: 'Transactions', shortLabel: 'Paiements', icon: CreditCard },
  { to: '/admin/moderation', label: 'Modération', shortLabel: 'Modér.', icon: ShieldCheck },
  { to: '/admin/abonnements', label: 'Abonnements', shortLabel: 'Abonn.', icon: Megaphone },
  { to: '/admin/support', label: 'Support', shortLabel: 'Support', icon: HeadphonesIcon },
  { to: '/admin/settings', label: 'Paramètres', shortLabel: 'Réglages', icon: Settings },
];

const mobileNavItems = navItems;

export function AdminShell() {
  const navigate = useNavigate();
  const { email, logout, refreshSession, isAuthenticated, token } = useAdminStore();

  useEffect(() => {
    if (!token) return;
    void refreshSession();
  }, [token, refreshSession]);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  if (!isAuthenticated || !token) {
    return <Navigate to="/admin/login" replace />;
  }

  const avatarInitial = email?.charAt(0)?.toUpperCase() ?? 'A';

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <aside className="hidden lg:flex w-[280px] flex-col bg-purple-dark shrink-0 fixed inset-y-0 left-0 z-30">
        <div className="p-6 border-b border-white/10">
          <MesseConnectLogo variant="light" />
          <p className="text-xs text-purple-light/80 mt-2 font-medium">Administration MesseConnect</p>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                [
                  'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors min-h-touch',
                  isActive ? 'bg-purple text-white' : 'text-purple-light/90 hover:bg-white/10',
                ].join(' ')
              }
            >
              <Icon className="h-5 w-5 shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <p className="text-sm text-purple-light truncate">{email ?? 'Admin'}</p>
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
            <h1 className="text-lg font-semibold text-gray-900 lg:hidden">Administration</h1>
            <p className="text-sm text-gray-500 hidden lg:block">Cockpit de supervision — plateforme MesseConnect</p>
          </div>
          <Link
            to="/admin/settings"
            className="flex items-center gap-2 rounded-xl p-1 -m-1 hover:bg-gray-50 transition-colors min-h-touch"
            aria-label="Mon compte admin"
          >
            <span className="hidden sm:inline text-sm text-gray-600 truncate max-w-[180px]">{email}</span>
            <span className="h-9 w-9 rounded-full bg-purple-light text-purple ring-2 ring-purple/10 flex items-center justify-center text-sm font-semibold shrink-0">
              {avatarInitial}
            </span>
          </Link>
        </header>

        <main className="flex-1 p-4 lg:p-8 pb-24 lg:pb-8 overflow-x-hidden">
          <Outlet />
        </main>

        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-purple-dark border-t border-white/10 flex z-50 pb-safe-bottom">
          {mobileNavItems.map(({ to, shortLabel, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                [
                  'flex-1 flex flex-col items-center justify-center gap-0.5 py-2 min-h-[56px] text-[10px]',
                  isActive ? 'text-white font-medium' : 'text-purple-light/70',
                ].join(' ')
              }
            >
              <Icon className="h-5 w-5" />
              <span className="truncate max-w-[56px]">{shortLabel}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}

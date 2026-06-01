import {
  Bell,
  ChevronRight,
  CircleHelp,
  Heart,
  ListOrdered,
  LogIn,
  LogOut,
  Pencil,
  Search,
  Settings,
  UserPlus,
  Wallet,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FideleProfileEditModal } from '../../components/modals/FideleProfileEditModal';
import { MobileLayout } from '../../components/layout/MobileLayout';
import { PageHeader } from '../../components/layout/PageHeader';
import { Skeleton } from '../../components/common/Skeleton';
import { AnimatedStat } from '../../components/common/AnimatedStat';
import { formatFcfa } from '../../utils/formatCurrency';
import { useAuthStore } from '../../stores/authStore';
import type { LucideIcon } from 'lucide-react';

const connectedMenuItems: { icon: LucideIcon; label: string; to: string }[] = [
  { icon: Heart, label: 'Mes favoris', to: '/favoris' },
  { icon: Bell, label: 'Notifications', to: '/notifications' },
  { icon: ListOrdered, label: 'Mes demandes', to: '/mes-demandes' },
  { icon: Wallet, label: 'Mes paiements', to: '/mes-paiements' },
  { icon: Settings, label: 'Paramètres', to: '/parametres' },
];

const guestMenuItems: { icon: LucideIcon; label: string; to: string }[] = [
  { icon: Search, label: 'Suivre une demande', to: '/suivi' },
  { icon: Wallet, label: 'Retrouver un paiement', to: '/suivi' },
  { icon: CircleHelp, label: 'Aide', to: '/aide' },
];

function ProfileMenuLink({ icon: Icon, label, to }: { icon: LucideIcon; label: string; to: string }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 px-4 min-h-touch border-b border-gray-50 last:border-0 active:bg-gray-50"
    >
      <Icon className="h-5 w-5 text-teal shrink-0" />
      <span className="flex-1 text-sm text-gray-800">{label}</span>
      <ChevronRight className="h-4 w-4 text-gray-300" />
    </Link>
  );
}

function ProfileSkeleton() {
  return (
    <div className="space-y-4" aria-hidden>
      <div className="rounded-2xl bg-white border border-gray-100 p-5 flex items-center gap-4 shadow-sm">
        <Skeleton className="h-16 w-16 shrink-0" rounded="full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-2/3" rounded="md" />
          <Skeleton className="h-3 w-1/2" rounded="md" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <Skeleton className="h-16" rounded="xl" />
        <Skeleton className="h-16" rounded="xl" />
        <Skeleton className="h-16" rounded="xl" />
      </div>
      <Skeleton className="h-48 w-full" rounded="2xl" />
    </div>
  );
}

function ProfileAvatar({ prenom, nom }: { prenom: string; nom: string }) {
  return (
    <div
      className="h-16 w-16 rounded-full ring-2 ring-teal/20 bg-teal text-white flex items-center justify-center text-lg font-semibold shrink-0"
      aria-hidden
    >
      {prenom[0]}
      {nom[0]}
    </div>
  );
}

function GuestProfileHub() {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">Bienvenue sur MesseConnect</h2>
        <p className="mt-2 text-sm text-gray-600 leading-relaxed">
          Connectez-vous pour retrouver vos demandes, paiements et paroisses favorites sans retaper de
          référence.
        </p>
        <div className="mt-5 space-y-3">
          <Link
            to="/auth/login"
            className="flex w-full min-h-touch items-center justify-center gap-2 rounded-xl bg-teal text-white font-medium active:scale-[0.98]"
          >
            <LogIn className="h-4 w-4" />
            Se connecter
          </Link>
          <Link
            to="/auth/register"
            className="flex w-full min-h-touch items-center justify-center gap-2 rounded-xl border border-teal/30 bg-teal-light text-teal font-medium active:scale-[0.98]"
          >
            <UserPlus className="h-4 w-4" />
            Créer un compte
          </Link>
        </div>
      </div>

      <div>
        <p className="px-1 mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
          Sans compte
        </p>
        <nav className="rounded-2xl bg-white border border-gray-100 overflow-hidden">
          {guestMenuItems.map((item) => (
            <ProfileMenuLink key={item.label} {...item} />
          ))}
        </nav>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, token, profileLoading, logout, loadProfile, updateProfile } = useAuthStore();
  const [editOpen, setEditOpen] = useState(false);

  const showSkeleton = Boolean(token) && !user && profileLoading;

  useEffect(() => {
    if (token && !user && !profileLoading) {
      void loadProfile();
    }
  }, [token, user, profileLoading, loadProfile]);

  const handleLogout = async () => {
    await logout();
    navigate('/auth/login');
  };

  return (
    <MobileLayout header={<PageHeader title="Mon profil" showBack={false} />}>
      <div className="px-4 py-4">
        {showSkeleton ? (
          <ProfileSkeleton />
        ) : !user ? (
          <GuestProfileHub />
        ) : (
          <div className="space-y-4">
            <div className="rounded-2xl bg-white border border-gray-100 p-5 flex items-center gap-4 shadow-sm">
              <ProfileAvatar prenom={user.prenom} nom={user.nom} />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900">
                  {user.prenom} {user.nom}
                </p>
                <p className="text-sm text-gray-500 truncate">{user.email}</p>
              </div>
              <button
                type="button"
                onClick={() => setEditOpen(true)}
                className="shrink-0 min-h-touch min-w-touch flex items-center justify-center rounded-xl bg-teal-light text-teal active:scale-95"
                aria-label="Modifier le profil"
              >
                <Pencil className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl bg-teal-light p-3 text-center">
                <p className="text-xl font-semibold text-teal">
                  <AnimatedStat value={user.stats.demandes} />
                </p>
                <p className="text-xs text-teal-800 mt-1">demandes</p>
              </div>
              <div className="rounded-xl bg-amber-light p-3 text-center">
                <p className="text-lg font-semibold text-amber-dark leading-tight">
                  <AnimatedStat value={user.stats.montantTotal} format={formatFcfa} durationMs={420} />
                </p>
                <p className="text-xs text-amber-dark mt-1">offert</p>
              </div>
              <div className="rounded-xl bg-purple-light p-3 text-center">
                <p className="text-xl font-semibold text-purple">
                  <AnimatedStat value={user.stats.favoris} />
                </p>
                <p className="text-xs text-purple-dark mt-1">favoris</p>
              </div>
            </div>

            <nav className="rounded-2xl bg-white border border-gray-100 overflow-hidden">
              {connectedMenuItems.map((item) => (
                <ProfileMenuLink key={item.label} {...item} />
              ))}
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 min-h-touch text-red-600 active:bg-red-50"
              >
                <LogOut className="h-5 w-5 shrink-0" />
                <span className="text-sm font-medium">Déconnexion</span>
              </button>
            </nav>
          </div>
        )}
      </div>

      {user && editOpen ? (
        <FideleProfileEditModal
          open={editOpen}
          onClose={() => setEditOpen(false)}
          user={user}
          onSave={updateProfile}
        />
      ) : null}
    </MobileLayout>
  );
}

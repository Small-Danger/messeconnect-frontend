import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';
import { PagePlaceholder } from '../components/common/PagePlaceholder';
import { AdminShell } from '../components/admin/AdminShell';
import { ParoisseShell } from '../components/paroisse/ParoisseShell';
import type { PageHandle } from '../types/routes';
import FideleHomePage from '../pages/fidele/HomePage';
import ProfilePage from '../pages/fidele/ProfilePage';
import ParishSearchPage from '../pages/fidele/ParishSearchPage';
import FavoritesPage from '../pages/fidele/FavoritesPage';
import MesDemandesPage from '../pages/fidele/MesDemandesPage';
import MesPaiementsPage from '../pages/fidele/MesPaiementsPage';

const LoginPage = lazy(() => import('../pages/fidele/LoginPage'));
const RegisterPage = lazy(() => import('../pages/fidele/RegisterPage'));
const ParishDetailPage = lazy(() => import('../pages/fidele/ParishDetailPage'));
const AvailableMassesPage = lazy(() => import('../pages/fidele/AvailableMassesPage'));
const PublicationsPage = lazy(() => import('../pages/fidele/PublicationsPage'));
const CampaignsPage = lazy(() => import('../pages/fidele/CampaignsPage'));
const CampagneDonPage = lazy(() => import('../pages/fidele/CampagneDonPage'));
const CampagneConfirmationPage = lazy(() => import('../pages/fidele/CampagneConfirmationPage'));
const DemandeWizardPage = lazy(() => import('../pages/fidele/DemandeWizardPage'));
const PaymentPage = lazy(() => import('../pages/fidele/PaymentPage'));
const ConfirmationPage = lazy(() => import('../pages/fidele/ConfirmationPage'));
const SuiviPage = lazy(() => import('../pages/fidele/SuiviPage'));
const DemandeDetailPage = lazy(() => import('../pages/fidele/DemandeDetailPage'));
const RecurrencesPage = lazy(() => import('../pages/fidele/RecurrencesPage'));
const NotificationsPage = lazy(() => import('../pages/fidele/NotificationsPage'));
const FideleSettingsPage = lazy(() => import('../pages/fidele/FideleSettingsPage'));
const FideleAidePage = lazy(() => import('../pages/fidele/AidePage'));

const ParoisseLoginPage = lazy(() => import('../pages/paroisse/LoginPage'));
const ParoisseRegisterPage = lazy(() => import('../pages/paroisse/RegisterPage'));
const ParoissePendingPage = lazy(() => import('../pages/paroisse/PendingValidationPage'));
const ParoisseDashboardPage = lazy(() => import('../pages/paroisse/DashboardPage'));
const ParoisseProfilePage = lazy(() => import('../pages/paroisse/ProfilePage'));
const ParoisseMediaPage = lazy(() => import('../pages/paroisse/MediaPage'));
const ParoisseCollectesPage = lazy(() => import('../pages/paroisse/CollectesPage'));
const ParoisseIntentionsPage = lazy(() => import('../pages/paroisse/IntentionsPage'));
const ParoisseCalendarPage = lazy(() => import('../pages/paroisse/CalendarPage'));
const ParoisseSupportPage = lazy(() => import('../pages/paroisse/SupportPage'));

const AdminLoginPage = lazy(() => import('../pages/admin/LoginPage'));
const AdminDashboardPage = lazy(() => import('../pages/admin/DashboardPage'));
const AdminUsersPage = lazy(() => import('../pages/admin/UsersPage'));
const AdminParishesPage = lazy(() => import('../pages/admin/ParishesPage'));
const AdminTransactionsPage = lazy(() => import('../pages/admin/TransactionsPage'));
const AdminSupportPage = lazy(() => import('../pages/admin/SupportPage'));
const AdminSettingsPage = lazy(() => import('../pages/admin/SettingsPage'));
const AdminDiocesesPage = lazy(() => import('../pages/admin/DiocesesPage'));
const AdminAbonnementsPage = lazy(() => import('../pages/admin/AbonnementsPage'));
const AdminModerationPage = lazy(() => import('../pages/admin/ModerationPage'));

/** Routes module Fidèle */
const fideleRoutes: RouteObject[] = [
  { index: true, element: <FideleHomePage /> },
  { path: 'auth/login', element: <LoginPage /> },
  { path: 'auth/register', element: <RegisterPage /> },
  { path: 'profile', element: <ProfilePage /> },
  { path: 'paroisses', element: <ParishSearchPage /> },
  { path: 'paroisses/:id', element: <ParishDetailPage /> },
  { path: 'paroisses/:id/messes', element: <AvailableMassesPage /> },
  { path: 'paroisses/:id/publications', element: <PublicationsPage /> },
  { path: 'campagnes', element: <CampaignsPage /> },
  { path: 'campagnes/confirmation/:reference', element: <CampagneConfirmationPage /> },
  { path: 'campagnes/:campagneId/don', element: <CampagneDonPage /> },
  { path: 'favoris', element: <FavoritesPage /> },
  { path: 'demande/:paroisseId', element: <DemandeWizardPage /> },
  { path: 'paiement/:demandeId', element: <PaymentPage /> },
  { path: 'confirmation/:reference', element: <ConfirmationPage /> },
  { path: 'suivi', element: <SuiviPage /> },
  { path: 'mes-demandes', element: <MesDemandesPage /> },
  { path: 'demandes/:id', element: <DemandeDetailPage /> },
  { path: 'mes-paiements', element: <MesPaiementsPage /> },
  { path: 'notifications', element: <NotificationsPage /> },
  { path: 'parametres', element: <FideleSettingsPage /> },
  { path: 'aide', element: <FideleAidePage /> },
  { path: 'recurrences', element: <RecurrencesPage /> },
];

/** Redirections anciennes URLs /fidele/* vers les nouvelles routes plates */
const fideleLegacyRedirects: RouteObject[] = [
  { path: 'fidele', element: <Navigate to="/paroisses" replace /> },
  { path: 'fidele/connexion', element: <Navigate to="/auth/login" replace /> },
  { path: 'fidele/inscription', element: <Navigate to="/auth/register" replace /> },
  { path: 'fidele/paroisses', element: <Navigate to="/paroisses" replace /> },
  { path: 'fidele/favoris', element: <Navigate to="/favoris" replace /> },
  { path: 'fidele/demandes', element: <Navigate to="/mes-demandes" replace /> },
  { path: 'fidele/paiements', element: <Navigate to="/mes-paiements" replace /> },
  { path: 'fidele/profil', element: <Navigate to="/profile" replace /> },
];

export const appRoutes: RouteObject[] = [
  ...fideleRoutes,
  ...fideleLegacyRedirects,
  {
    path: 'paroisse',
    children: [
      {
        path: 'login',
        element: <ParoisseLoginPage />,
      },
      { path: 'register', element: <ParoisseRegisterPage /> },
      { path: 'pending', element: <ParoissePendingPage /> },
      {
        element: <ParoisseShell />,
        children: [
          { index: true, element: <Navigate to="dashboard" replace /> },
          { path: 'dashboard', element: <ParoisseDashboardPage /> },
          { path: 'profile', element: <ParoisseProfilePage /> },
          { path: 'publications', element: <ParoisseMediaPage /> },
          { path: 'collectes', element: <ParoisseCollectesPage /> },
          { path: 'media', element: <Navigate to="/paroisse/publications" replace /> },
          { path: 'intentions', element: <ParoisseIntentionsPage /> },
          { path: 'demandes', element: <Navigate to="/paroisse/intentions" replace /> },
          { path: 'calendrier', element: <ParoisseCalendarPage /> },
          { path: 'support', element: <ParoisseSupportPage /> },
        ],
      },
      { path: 'connexion', element: <Navigate to="/paroisse/login" replace /> },
      { path: 'inscription', element: <Navigate to="/paroisse/register" replace /> },
      { path: 'en-attente', element: <Navigate to="/paroisse/pending" replace /> },
      { path: 'tableau-de-bord', element: <Navigate to="/paroisse/dashboard" replace /> },
      { path: 'profil', element: <Navigate to="/paroisse/profile" replace /> },
      { path: 'medias', element: <Navigate to="/paroisse/publications" replace /> },
      { path: 'moyens-paiement', element: <Navigate to="/paroisse/dashboard" replace /> },
      { path: 'types-offrandes', element: <Navigate to="/paroisse/dashboard" replace /> },
      { path: 'modeles-messe', element: <Navigate to="/paroisse/calendrier" replace /> },
      { path: 'messes', element: <Navigate to="/paroisse/calendrier" replace /> },
      { path: 'messes/:messeId', element: <Navigate to="/paroisse/calendrier" replace /> },
      { path: 'demandes/:demandeId', element: <Navigate to="/paroisse/intentions" replace /> },
      { path: 'publications', element: <Navigate to="/paroisse/publications" replace /> },
      { path: 'collectes', element: <Navigate to="/paroisse/collectes" replace /> },
      { path: 'campagnes', element: <Navigate to="/paroisse/collectes" replace /> },
      { path: 'support/nouveau', element: <Navigate to="/paroisse/support" replace /> },
      { path: 'support/:ticketId', element: <Navigate to="/paroisse/support" replace /> },
    ],
  },
  {
    path: 'admin',
    children: [
      { path: 'login', element: <AdminLoginPage /> },
      {
        element: <AdminShell />,
        children: [
          { index: true, element: <Navigate to="dashboard" replace /> },
          { path: 'dashboard', element: <AdminDashboardPage /> },
          { path: 'users', element: <AdminUsersPage /> },
          { path: 'parishes', element: <AdminParishesPage /> },
          { path: 'transactions', element: <AdminTransactionsPage /> },
          { path: 'support', element: <AdminSupportPage /> },
          { path: 'settings', element: <AdminSettingsPage /> },
          { path: 'dioceses', element: <AdminDiocesesPage /> },
          { path: 'abonnements', element: <AdminAbonnementsPage /> },
          { path: 'moderation', element: <AdminModerationPage /> },
        ],
      },
      { path: 'connexion', element: <Navigate to="/admin/login" replace /> },
      { path: 'tableau-de-bord', element: <Navigate to="/admin/dashboard" replace /> },
      { path: 'dioceses/nouveau', element: <Navigate to="/admin/dioceses" replace /> },
      { path: 'dioceses/:dioceseId', element: <Navigate to="/admin/dioceses" replace /> },
      { path: 'paroisses', element: <Navigate to="/admin/parishes" replace /> },
      { path: 'paroisses/:paroisseId', element: <Navigate to="/admin/parishes" replace /> },
      { path: 'fideles', element: <Navigate to="/admin/users" replace /> },
      { path: 'fideles/:fideleId', element: <Navigate to="/admin/users" replace /> },
      { path: 'abonnements/nouveau', element: <Navigate to="/admin/abonnements" replace /> },
      { path: 'abonnements/:abonnementId', element: <Navigate to="/admin/abonnements" replace /> },
      { path: 'publications', element: <Navigate to="/admin/moderation" replace /> },
      { path: 'campagnes', element: <Navigate to="/admin/moderation" replace /> },
      { path: 'support/:ticketId', element: <Navigate to="/admin/support" replace /> },
    ],
  },
  {
    path: '*',
    element: <PagePlaceholder />,
    handle: {
      space: 'landing',
      title: 'Page introuvable',
      description: "Cette route n'existe pas encore ou l'URL est incorrecte.",
    } satisfies PageHandle,
  },
];

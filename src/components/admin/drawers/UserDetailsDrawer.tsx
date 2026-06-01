import { Ban, Heart, UserCheck } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { AdminDrawer } from './AdminDrawer';
import { StatusBadge } from '../StatusBadge';
import { SuspendUserModal } from '../modals/SuspendUserModal';
import { formatFcfa } from '../../../utils/formatCurrency';
import { useUsersStore } from '../../../stores/usersStore';

export function UserDetailsDrawer() {
  const {
    selectedUserId,
    userDetail,
    suspendModalOpen,
    loading,
    closeUserDrawer,
    openSuspendModal,
    closeSuspendModal,
    suspendUser,
    reactivateUser,
  } = useUsersStore();

  return (
    <>
      <AdminDrawer
        open={!!selectedUserId}
        onClose={closeUserDrawer}
        title={userDetail ? `${userDetail.prenom} ${userDetail.nom}` : 'Utilisateur'}
        wide
      >
        {userDetail ? (
          <div className="space-y-6">
            <Section title="Informations personnelles">
              <dl className="grid grid-cols-2 gap-3 text-sm">
                <Row label="Email" value={userDetail.email} />
                <Row label="Téléphone" value={userDetail.telephone} />
                <Row label="Ville" value={userDetail.ville} />
                <Row label="Inscription" value={userDetail.dateInscription} />
                <Row label="Demandes" value={String(userDetail.nombreDemandes)} />
                <div><dt className="text-gray-500">Statut</dt><dd className="mt-1"><StatusBadge statut={userDetail.statut} /></dd></div>
              </dl>
            </Section>

            <Section title="Demandes">
              {userDetail.demandes.length === 0 ? (
                <p className="text-sm text-gray-500 rounded-lg bg-gray-50 px-3 py-4 text-center">Aucune demande enregistrée.</p>
              ) : (
                <ul className="space-y-2 text-sm">
                  {userDetail.demandes.map((d) => (
                    <li key={d.reference} className="flex justify-between rounded-lg bg-gray-50 px-3 py-2">
                      <span className="font-mono text-xs text-purple">{d.reference}</span>
                      <span>{d.paroisse}</span>
                      <span>{formatFcfa(d.montant)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </Section>

            <Section title="Paiements">
              {userDetail.paiements.length === 0 ? (
                <p className="text-sm text-gray-500 rounded-lg bg-gray-50 px-3 py-4 text-center">Aucun paiement enregistré.</p>
              ) : (
                <ul className="space-y-2 text-sm">
                  {userDetail.paiements.map((p) => (
                    <li key={p.reference} className="flex justify-between rounded-lg bg-gray-50 px-3 py-2">
                      <span>{p.methode}</span>
                      <span>{formatFcfa(p.montant)}</span>
                      <StatusBadge statut={p.statut} />
                    </li>
                  ))}
                </ul>
              )}
            </Section>

            <Section title="Favoris">
              <div className="flex flex-wrap gap-2">
                {userDetail.favoris.length ? userDetail.favoris.map((f) => (
                  <span key={f} className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-purple-light text-purple">
                    <Heart className="h-3 w-3" /> {f}
                  </span>
                )) : <p className="text-sm text-gray-500">Aucun favori</p>}
              </div>
            </Section>

            <Section title="Historique connexions">
              {userDetail.connexions.length === 0 ? (
                <p className="text-sm text-gray-500 rounded-lg bg-gray-50 px-3 py-4 text-center">Aucune connexion enregistrée.</p>
              ) : (
                <ul className="space-y-2 text-sm">
                  {userDetail.connexions.map((c, i) => (
                    <li key={i} className="rounded-lg bg-gray-50 px-3 py-2">
                      <p>{format(parseISO(c.date), 'd MMM yyyy HH:mm', { locale: fr })}</p>
                      <p className="text-xs text-gray-500">{c.appareil} · {c.ip}</p>
                    </li>
                  ))}
                </ul>
              )}
            </Section>

            <div className="space-y-2 pt-2">
              {userDetail.statut === 'suspendu' ? (
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => void reactivateUser()}
                  className="flex items-center gap-2 min-h-touch px-4 rounded-xl bg-teal text-white text-sm font-medium w-full justify-center disabled:opacity-60"
                >
                  <UserCheck className="h-4 w-4" /> Réactiver le compte
                </button>
              ) : (
                <button
                  type="button"
                  onClick={openSuspendModal}
                  className="flex items-center gap-2 min-h-touch px-4 rounded-xl border border-red-200 text-red-600 text-sm font-medium w-full justify-center"
                >
                  <Ban className="h-4 w-4" /> Suspendre l&apos;utilisateur
                </button>
              )}
            </div>
          </div>
        ) : loading ? (
          <div className="h-48 rounded-xl bg-gray-100 animate-pulse" />
        ) : (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-6 text-center text-sm text-red-700">
            Impossible de charger le profil de ce fidèle. Réessayez ou vérifiez votre connexion.
          </div>
        )}
      </AdminDrawer>

      <SuspendUserModal
        open={suspendModalOpen}
        onClose={closeSuspendModal}
        onConfirm={suspendUser}
        loading={loading}
        userName={userDetail ? `${userDetail.prenom} ${userDetail.nom}` : undefined}
      />
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="font-semibold text-gray-900 mb-3">{title}</h3>
      {children}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-gray-500">{label}</dt>
      <dd className="font-medium text-gray-900">{value}</dd>
    </div>
  );
}

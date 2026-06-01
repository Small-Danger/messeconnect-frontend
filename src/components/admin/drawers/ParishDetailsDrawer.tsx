import { Ban, CheckCircle, Clock, RotateCcw } from 'lucide-react';
import { AdminDrawer } from './AdminDrawer';
import { SafeImage } from '../../common/SafeImage';
import { StatusBadge } from '../StatusBadge';
import { ValidateParishModal } from '../modals/ValidateParishModal';
import { SuspendParishModal } from '../modals/SuspendParishModal';
import { formatFcfa } from '../../../utils/formatCurrency';
import { useParishesStore } from '../../../stores/parishesStore';

export function ParishDetailsDrawer() {
  const {
    selectedParishId,
    parishDetail,
    validateModalOpen,
    suspendModalOpen,
    loading,
    closeParishDrawer,
    openValidateModal,
    closeValidateModal,
    openSuspendModal,
    closeSuspendModal,
    validateParish,
    suspendParish,
    reactivateParish,
  } = useParishesStore();

  const isPending = parishDetail?.statut === 'en_attente';

  return (
    <>
      <AdminDrawer
        open={!!selectedParishId}
        onClose={closeParishDrawer}
        title={parishDetail?.nom ?? 'Paroisse'}
        wide
      >
        {parishDetail ? (
          <div className="space-y-6">
            {isPending ? (
              <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 flex gap-3">
                <Clock className="h-5 w-5 text-amber-dark shrink-0" />
                <div>
                  <p className="text-sm font-medium text-amber-900">Inscription en attente de validation</p>
                  <p className="text-sm text-amber-800/90 mt-0.5">
                    Vérifiez les informations ci-dessous puis validez ou refusez l&apos;inscription.
                  </p>
                </div>
              </div>
            ) : null}

            <div className="flex items-start gap-4">
              <SafeImage src={parishDetail.photoProfil} alt={parishDetail.nom} className="h-16 w-16 rounded-xl object-cover" />
              <div className="space-y-1">
                <p className="font-semibold text-gray-900">{parishDetail.nom}</p>
                <p className="text-sm text-gray-500">{parishDetail.ville || '—'} · {parishDetail.diocese || '—'}</p>
                <StatusBadge statut={parishDetail.statut} />
              </div>
            </div>

            <Section title="Coordonnées & responsable">
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <Row label="Responsable" value={parishDetail.responsable} />
                <Row label="Email" value={parishDetail.email || '—'} />
                <Row label="Téléphone" value={parishDetail.telephone || '—'} />
                <Row label="Adresse" value={parishDetail.adresse || '—'} />
                <Row label="Inscription" value={parishDetail.dateInscription || '—'} />
                <Row label="Demandes" value={String(parishDetail.nombreDemandes)} />
                <Row label="Montant collecté" value={formatFcfa(parishDetail.montantCollecte)} />
              </dl>
              {parishDetail.description ? (
                <p className="text-sm text-gray-600 mt-3 leading-relaxed">{parishDetail.description}</p>
              ) : (
                <p className="text-sm text-gray-400 mt-3 italic">Aucune description renseignée.</p>
              )}
            </Section>

            {parishDetail.galerie.length > 0 ? (
              <Section title="Médias">
                <div className="grid grid-cols-3 gap-2">
                  {parishDetail.galerie.map((url, i) => (
                    <SafeImage key={i} src={url} alt="" className="aspect-square rounded-lg object-cover" />
                  ))}
                </div>
              </Section>
            ) : null}

            <Section title="Demandes récentes">
              {parishDetail.demandes.length === 0 ? (
                <EmptyBlock message="Aucune demande de messe pour cette paroisse." />
              ) : (
                <ul className="space-y-2 text-sm">
                  {parishDetail.demandes.map((d) => (
                    <li key={d.reference} className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-gray-50 px-3 py-2">
                      <span className="font-mono text-xs text-purple">{d.reference}</span>
                      <span className="text-gray-700">{d.fidele}</span>
                      <span className="font-medium">{formatFcfa(d.montant)}</span>
                      <span className="text-xs text-gray-400">{d.date}</span>
                    </li>
                  ))}
                </ul>
              )}
            </Section>

            <Section title="Paiements récents">
              {parishDetail.paiements.length === 0 ? (
                <EmptyBlock message="Aucun paiement enregistré." />
              ) : (
                <ul className="space-y-2 text-sm">
                  {parishDetail.paiements.map((p) => (
                    <li key={p.reference} className="flex justify-between rounded-lg bg-gray-50 px-3 py-2">
                      <span className="font-mono text-xs text-purple">{p.reference}</span>
                      <span>{p.methode}</span>
                      <span>{formatFcfa(p.montant)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </Section>

            <Section title="Campagnes & publications">
              {parishDetail.campagnes.length === 0 && parishDetail.publications.length === 0 ? (
                <EmptyBlock message="Aucune campagne ni publication pour le moment." />
              ) : (
                <div className="space-y-2 text-sm">
                  {parishDetail.campagnes.map((c) => (
                    <p key={c.titre} className="rounded-lg bg-gray-50 px-3 py-2">
                      <span className="font-medium">{c.titre}</span>
                      {' — '}
                      {formatFcfa(c.collecte)} / {formatFcfa(c.objectif)}
                    </p>
                  ))}
                  {parishDetail.publications.map((p) => (
                    <p key={`${p.titre}-${p.date}`} className="text-gray-600 px-3">
                      {p.titre} <span className="text-gray-400">({p.date})</span>
                    </p>
                  ))}
                </div>
              )}
            </Section>

            {parishDetail.historique.length > 0 ? (
              <Section title="Historique">
                <ul className="space-y-2 text-sm">
                  {parishDetail.historique.map((h, i) => (
                    <li key={i} className="rounded-lg bg-gray-50 px-3 py-2">
                      <span className="font-medium">{h.action}</span>
                      <span className="text-gray-500"> — {h.auteur}</span>
                      <span className="text-xs text-gray-400 block">{h.date}</span>
                    </li>
                  ))}
                </ul>
              </Section>
            ) : null}

            {isPending ? (
              <button
                type="button"
                onClick={openValidateModal}
                className="flex items-center gap-2 min-h-touch px-4 rounded-xl bg-purple text-white text-sm font-medium w-full justify-center"
              >
                <CheckCircle className="h-4 w-4" /> Valider ou refuser l&apos;inscription
              </button>
            ) : parishDetail.statut === 'validee' ? (
              <button
                type="button"
                onClick={openSuspendModal}
                className="flex items-center gap-2 min-h-touch px-4 rounded-xl bg-red-600 text-white text-sm font-medium w-full justify-center"
              >
                <Ban className="h-4 w-4" /> Suspendre la paroisse
              </button>
            ) : parishDetail.statut === 'suspendue' ? (
              <button
                type="button"
                onClick={openSuspendModal}
                className="flex items-center gap-2 min-h-touch px-4 rounded-xl bg-teal text-white text-sm font-medium w-full justify-center"
              >
                <RotateCcw className="h-4 w-4" /> Réactiver la paroisse
              </button>
            ) : null}
          </div>
        ) : loading ? (
          <div className="h-48 rounded-xl bg-gray-100 animate-pulse" />
        ) : (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-6 text-center text-sm text-red-700">
            Impossible de charger le détail de cette paroisse.
          </div>
        )}
      </AdminDrawer>

      <ValidateParishModal
        open={validateModalOpen}
        onClose={closeValidateModal}
        onValidate={validateParish}
        loading={loading}
        parishName={parishDetail?.nom}
      />

      <SuspendParishModal
        open={suspendModalOpen}
        onClose={closeSuspendModal}
        onConfirm={suspendParish}
        onReactivate={reactivateParish}
        loading={loading}
        parishName={parishDetail?.nom}
        mode={parishDetail?.statut === 'suspendue' ? 'reactiver' : 'suspendre'}
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
      <dd className="font-medium text-gray-900 break-words">{value}</dd>
    </div>
  );
}

function EmptyBlock({ message }: { message: string }) {
  return (
    <p className="text-sm text-gray-500 rounded-lg bg-gray-50 px-3 py-4 text-center">{message}</p>
  );
}

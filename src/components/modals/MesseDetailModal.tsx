import { Ban, Pencil, Printer, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Modal } from '../modals/Modal';
import { FormInput } from '../forms/FormInput';
import { DemandeStatutBadge } from '../paroisse/DemandeStatutBadge';
import type { ParoisseDemande, ParoisseMesse } from '../../services/mockApi/paroisse/data';
import { ApiError } from '../../services/api/client';
import { paroisseService } from '../../services/paroisseService';
import { useParoisseAppStore } from '../../stores/paroisseAppStore';
import { formatDateLabel } from '../../utils/formatDate';
import { formatFcfa } from '../../utils/formatCurrency';

interface EditForm {
  titre: string;
  date: string;
  heure: string;
  capacite_max: number;
}

interface MesseDetailModalProps {
  open: boolean;
  onClose: () => void;
  messe: ParoisseMesse | null;
  onCelebrated?: () => void;
  onUpdated?: () => void;
  onDeleted?: () => void;
  onCancelled?: () => void;
}

export function MesseDetailModal({
  open,
  onClose,
  messe,
  onCelebrated,
  onUpdated,
  onDeleted,
  onCancelled,
}: MesseDetailModalProps) {
  const token = useParoisseAppStore((s) => s.token);
  const celebrerMesse = useParoisseAppStore((s) => s.celebrerMesse);
  const [demandes, setDemandes] = useState<ParoisseDemande[]>([]);
  const [displayMesse, setDisplayMesse] = useState<ParoisseMesse | null>(null);
  const [loading, setLoading] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, reset } = useForm<EditForm>();

  useEffect(() => {
    if (!open || !messe) return;
    setEditing(false);
    setConfirmDelete(false);
    setConfirmCancel(false);
    setError(null);
    setLoading(true);
    paroisseService
      .getMesseWithDemandes(token, messe.id)
      .then(({ demandes: items, messe: fresh }) => {
        setDemandes(items);
        setDisplayMesse(fresh);
        reset({
          titre: fresh.titre,
          date: fresh.date.slice(0, 10),
          heure: fresh.heure.slice(0, 5),
          capacite_max: fresh.capacite_max ?? 20,
        });
      })
      .finally(() => setLoading(false));
  }, [open, messe, token, reset]);

  if (!messe || !displayMesse) return null;

  const aCelebrer = demandes.filter((d) => d.statut === 'confirmee' || d.statut === 'payee');
  const isCelebrated = displayMesse.statut === 'celebree';
  const isCancelled = displayMesse.statut === 'annulee';
  const canEdit = !isCelebrated && !isCancelled;
  const canDelete = canEdit && !loading && demandes.length === 0;
  const canCancelMesse = canEdit && !loading && demandes.length > 0;

  const handleCelebrate = async () => {
    setCelebrating(true);
    try {
      await celebrerMesse(messe.id);
      const fresh = await paroisseService.getMesseWithDemandes(token, messe.id);
      setDemandes(fresh.demandes);
      setDisplayMesse(fresh.messe);
      onCelebrated?.();
    } finally {
      setCelebrating(false);
    }
  };

  const handleSaveEdit = async (data: EditForm) => {
    setSaving(true);
    setError(null);
    try {
      const updated = await paroisseService.updateMesse(token, messe.id, {
        titre: data.titre,
        date: data.date,
        heure: data.heure,
        capacite_max: data.capacite_max > 0 ? data.capacite_max : null,
      });
      setDisplayMesse(updated);
      setEditing(false);
      onUpdated?.();
    } catch {
      setError('Impossible de modifier ce créneau.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelMesse = async () => {
    setCancelling(true);
    setError(null);
    try {
      const fresh = await paroisseService.annulerMesse(token, messe.id);
      setDemandes(fresh.demandes);
      setDisplayMesse(fresh.messe);
      setConfirmCancel(false);
      onCancelled?.();
      onUpdated?.();
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : 'Impossible d\'annuler cette messe.';
      setError(message);
      setConfirmCancel(false);
    } finally {
      setCancelling(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    setError(null);
    try {
      await paroisseService.deleteMesse(token, messe.id);
      setConfirmDelete(false);
      onDeleted?.();
      onClose();
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : 'Impossible de supprimer ce créneau.';
      setError(message);
      setConfirmDelete(false);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Feuille de messe" size="lg">
      <div className="space-y-5 print:space-y-4">
        {editing ? (
          <form onSubmit={handleSubmit(handleSaveEdit)} className="space-y-4 rounded-xl border border-teal/20 bg-teal-light/20 p-4">
            <p className="text-sm font-medium text-teal-900">Modifier le créneau</p>
            <FormInput label="Titre / nom" {...register('titre', { required: true })} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormInput label="Date" type="date" {...register('date', { required: true })} />
              <FormInput label="Heure" type="time" {...register('heure', { required: true })} />
            </div>
            <FormInput
              label="Capacité d'intentions (max)"
              type="number"
              min={1}
              {...register('capacite_max', { required: true, valueAsNumber: true, min: 1 })}
            />
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="flex-1 min-h-touch rounded-xl border border-gray-200 font-medium text-gray-700"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 min-h-touch rounded-xl bg-teal text-white font-medium disabled:opacity-60"
              >
                {saving ? 'Enregistrement…' : 'Enregistrer'}
              </button>
            </div>
          </form>
        ) : (
          <div className="rounded-xl bg-teal-light/40 border border-teal/10 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-semibold text-teal-900">{displayMesse.titre}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {formatDateLabel(displayMesse.date)} · {displayMesse.heure.slice(0, 5)}
                  {displayMesse.lieu && displayMesse.lieu !== '—' ? ` · ${displayMesse.lieu}` : ''}
                </p>
                {displayMesse.capacite_max ? (
                  <p className="text-xs text-gray-500 mt-1">
                    Capacité : {displayMesse.participants} / {displayMesse.capacite_max} intentions
                  </p>
                ) : null}
              </div>
              {canEdit ? (
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  className="inline-flex items-center gap-1 text-xs font-medium text-teal print:hidden shrink-0 min-h-touch px-2"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Modifier
                </button>
              ) : null}
            </div>
            {canCancelMesse ? (
              <p className="text-xs text-amber-700 mt-2">
                Ce créneau compte {demandes.length} intention{demandes.length > 1 ? 's' : ''}. Vous pouvez l&apos;annuler
                (les fidèles seront informés via le statut de leur demande) mais pas le supprimer.
              </p>
            ) : null}
            {isCelebrated ? (
              <span className="inline-flex mt-2 px-2 py-0.5 rounded-full text-xs font-medium bg-teal text-white">
                Messe célébrée
              </span>
            ) : null}
            {isCancelled ? (
              <span className="inline-flex mt-2 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-600 text-white">
                Messe annulée
              </span>
            ) : null}
          </div>
        )}

        <div>
          <div className="flex items-center justify-between gap-2 mb-3">
            <h4 className="font-semibold text-gray-900">
              Intentions ({demandes.length})
            </h4>
            {demandes.length > 0 ? (
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1 text-xs font-medium text-teal print:hidden"
              >
                <Printer className="h-3.5 w-3.5" />
                Imprimer
              </button>
            ) : null}
          </div>

          {loading ? (
            <p className="text-sm text-gray-500 animate-pulse">Chargement des intentions…</p>
          ) : demandes.length === 0 ? (
            <p className="text-sm text-gray-500 rounded-xl border border-dashed border-gray-200 p-6 text-center">
              Aucune demande rattachée à cette messe.
            </p>
          ) : (
            <ol className="space-y-3">
              {demandes.map((d, index) => (
                <li
                  key={d.id}
                  className="rounded-xl border border-gray-100 bg-gray-50 p-3 print:break-inside-avoid"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-bold text-teal shrink-0">#{index + 1}</span>
                    <DemandeStatutBadge statut={d.statut} />
                  </div>
                  <p className="text-sm font-medium text-gray-900 mt-2">{d.intention}</p>
                  <dl className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-gray-600">
                    <div>
                      <dt className="text-gray-400">Type</dt>
                      <dd className="font-medium text-gray-700">{d.typeOffrande || '—'}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-400">Fidèle</dt>
                      <dd className="font-medium text-gray-700">{d.fideleNom}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-400">Offrande</dt>
                      <dd className="font-medium text-teal">{formatFcfa(d.montant)}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-400">Réf.</dt>
                      <dd className="font-mono text-gray-700">{d.reference}</dd>
                    </div>
                  </dl>
                </li>
              ))}
            </ol>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-2 pt-2 print:hidden">
          {!isCelebrated && aCelebrer.length > 0 ? (
            <button
              type="button"
              onClick={handleCelebrate}
              disabled={celebrating}
              className="flex-1 min-h-touch rounded-xl bg-teal text-white font-medium disabled:opacity-60"
            >
              {celebrating
                ? 'Enregistrement…'
                : `Marquer la messe comme célébrée (${aCelebrer.length} intention${aCelebrer.length > 1 ? 's' : ''})`}
            </button>
          ) : null}
          {canCancelMesse ? (
            <button
              type="button"
              onClick={() => setConfirmCancel(true)}
              className="inline-flex items-center justify-center gap-1.5 min-h-touch rounded-xl border border-amber-300 text-amber-900 font-medium px-4"
            >
              <Ban className="h-4 w-4" />
              Annuler la messe
            </button>
          ) : null}
          {canDelete ? (
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="inline-flex items-center justify-center gap-1.5 min-h-touch rounded-xl border border-red-200 text-red-700 font-medium px-4"
            >
              <Trash2 className="h-4 w-4" />
              Supprimer
            </button>
          ) : null}
          <button
            type="button"
            onClick={onClose}
            className="flex-1 min-h-touch rounded-xl border border-gray-200 font-medium text-gray-700"
          >
            Fermer
          </button>
        </div>
        {error && !editing ? <p className="text-sm text-red-600 print:hidden">{error}</p> : null}
      </div>

      <Modal open={confirmCancel} onClose={() => setConfirmCancel(false)} title="Annuler cette messe ?" size="sm">
        <p className="text-sm text-gray-600 mb-4">
          La messe « {displayMesse.titre} » du {formatDateLabel(displayMesse.date)} à{' '}
          {displayMesse.heure.slice(0, 5)} sera marquée comme annulée. Les {demandes.length} intention
          {demandes.length > 1 ? 's' : ''} liée{demandes.length > 1 ? 's' : ''} passeront au statut annulé.
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setConfirmCancel(false)}
            className="flex-1 min-h-touch rounded-xl border border-gray-200 text-sm font-medium"
          >
            Retour
          </button>
          <button
            type="button"
            onClick={() => void handleCancelMesse()}
            disabled={cancelling}
            className="flex-1 min-h-touch rounded-xl bg-amber-700 text-white text-sm font-medium disabled:opacity-60"
          >
            {cancelling ? 'Annulation…' : 'Confirmer l\'annulation'}
          </button>
        </div>
      </Modal>

      <Modal open={confirmDelete} onClose={() => setConfirmDelete(false)} title="Supprimer ce créneau ?" size="sm">
        <p className="text-sm text-gray-600 mb-4">
          Le créneau « {displayMesse.titre} » du {formatDateLabel(displayMesse.date)} à{' '}
          {displayMesse.heure.slice(0, 5)} sera définitivement retiré du calendrier.
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setConfirmDelete(false)}
            className="flex-1 min-h-touch rounded-xl border border-gray-200 text-sm font-medium"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={() => void handleDelete()}
            disabled={deleting}
            className="flex-1 min-h-touch rounded-xl bg-red-600 text-white text-sm font-medium disabled:opacity-60"
          >
            {deleting ? 'Suppression…' : 'Supprimer'}
          </button>
        </div>
      </Modal>
    </Modal>
  );
}

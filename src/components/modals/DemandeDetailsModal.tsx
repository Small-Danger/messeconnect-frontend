import { useState } from 'react';
import { Modal } from '../modals/Modal';
import { formatFcfa } from '../../utils/formatCurrency';
import type { ParoisseDemande } from '../../services/mockApi/paroisse/data';
import { DemandeStatutBadge } from '../paroisse/DemandeStatutBadge';
import { useCalendarStore } from '../../stores/calendarStore';
import { useParoisseAppStore } from '../../stores/paroisseAppStore';
import { formatDateLabel } from '../../utils/formatDate';

interface DemandeDetailsModalProps {
  open: boolean;
  onClose: () => void;
  demande: ParoisseDemande | null;
  onValidate?: () => void;
  onReject?: () => void;
  readOnly?: boolean;
}

const paiementLabels = {
  reussi: 'Réussi',
  en_attente: 'En attente',
  echoue: 'Échoué',
} as const;

export function DemandeDetailsModal({
  open,
  onClose,
  demande,
  onValidate,
  onReject,
  readOnly = false,
}: DemandeDetailsModalProps) {
  const openSchedule = useCalendarStore((s) => s.openScheduleDrawer);
  const celebrerDemande = useParoisseAppStore((s) => s.celebrerDemande);
  const [celebrating, setCelebrating] = useState(false);

  if (!demande) return null;

  const dateLabel =
    demande.date && demande.heure
      ? `${formatDateLabel(demande.date)} à ${demande.heure.slice(0, 5)}`
      : '—';

  const canCelebrate = demande.statut === 'confirmee' || demande.statut === 'payee';
  const canModerate = demande.statut === 'en_attente';

  const handleCelebrate = async () => {
    setCelebrating(true);
    try {
      await celebrerDemande(demande.id);
      onClose();
    } finally {
      setCelebrating(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Détail de la demande" size="lg">
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-sm text-teal">{demande.reference}</span>
          <DemandeStatutBadge statut={demande.statut} />
        </div>

        <dl className="grid grid-cols-1 gap-3 text-sm">
          <Row label="Fidèle" value={demande.fideleNom} />
          <Row label="Type" value={demande.typeOffrande || '—'} />
          <Row label="Intention" value={demande.intention || '—'} />
          <Row label="Messe" value={demande.messeTitre ? `${demande.messeTitre} — ${dateLabel}` : dateLabel} />
          <Row label="Offrande" value={formatFcfa(demande.montant)} highlight />
          <Row
            label="Paiement"
            value={`${demande.paiementMethode} — ${paiementLabels[demande.paiementStatut]}`}
          />
        </dl>

        {demande.statut === 'rejetee' && demande.motifRejet ? (
          <p className="text-sm text-red-600 bg-red-50 rounded-lg p-3">{demande.motifRejet}</p>
        ) : null}

        <div className="flex flex-col sm:flex-row gap-2 pt-2">
          {!readOnly && canModerate ? (
            <>
              <button
                type="button"
                onClick={onValidate}
                className="flex-1 min-h-touch rounded-xl bg-teal text-white font-medium active:scale-95"
              >
                Valider
              </button>
              <button
                type="button"
                onClick={onReject}
                className="flex-1 min-h-touch rounded-xl border border-red-200 text-red-600 font-medium active:scale-95"
              >
                Rejeter
              </button>
            </>
          ) : null}
          {!readOnly && canCelebrate ? (
            <button
              type="button"
              onClick={handleCelebrate}
              disabled={celebrating}
              className="flex-1 min-h-touch rounded-xl bg-teal-900 text-white font-medium disabled:opacity-60"
            >
              {celebrating ? 'Enregistrement…' : 'Marquer comme célébrée'}
            </button>
          ) : null}
          {!readOnly && canModerate && !demande.messeId ? (
            <button
              type="button"
              onClick={() => {
                onClose();
                openSchedule();
              }}
              className="flex-1 min-h-touch rounded-xl border border-teal text-teal font-medium active:scale-95"
            >
              Programmer une messe
            </button>
          ) : null}
        </div>
      </div>
    </Modal>
  );
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-gray-500 shrink-0">{label}</dt>
      <dd className={`font-medium text-right ${highlight ? 'text-teal' : 'text-gray-900'}`}>{value}</dd>
    </div>
  );
}

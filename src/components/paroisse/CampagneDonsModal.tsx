import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Users } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { CardSkeleton } from '../common/CardSkeleton';
import { Modal } from '../modals/Modal';
import { PaymentMethodBadge } from '../payment/PaymentMethodBadge';
import type { CampagneParoisse, DonCampagneParoisse } from '../../services/mockApi/paroisse/data';
import { paroisseService } from '../../services/paroisseService';
import { useParoisseAppStore } from '../../stores/paroisseAppStore';
import { formatFcfa } from '../../utils/formatCurrency';

type DonFiltre = 'tous' | 'reussi' | 'en_attente';

interface CampagneDonsModalProps {
  open: boolean;
  onClose: () => void;
  campagne: CampagneParoisse | null;
}

function formatDonDate(value: string | null) {
  if (!value) return '—';
  try {
    return format(parseISO(value), 'd MMM yyyy · HH:mm', { locale: fr });
  } catch {
    return value.slice(0, 16);
  }
}

function donateurLabel(don: DonCampagneParoisse) {
  if (don.telephone?.trim()) return don.telephone.trim();
  return 'Donateur anonyme';
}

function statutLabel(statut: DonCampagneParoisse['statut']) {
  if (statut === 'reussi') return 'Confirmé';
  if (statut === 'en_attente') return 'En attente';
  if (statut === 'echoue') return 'Échoué';
  return 'Remboursé';
}

function statutClass(statut: DonCampagneParoisse['statut']) {
  if (statut === 'reussi') return 'bg-teal-light text-teal-800';
  if (statut === 'en_attente') return 'bg-amber-light text-amber-dark';
  if (statut === 'echoue') return 'bg-red-50 text-red-700';
  return 'bg-gray-100 text-gray-600';
}

export function CampagneDonsModal({ open, onClose, campagne }: CampagneDonsModalProps) {
  const token = useParoisseAppStore((s) => s.token);
  const [loading, setLoading] = useState(false);
  const [filtre, setFiltre] = useState<DonFiltre>('tous');
  const [dons, setDons] = useState<DonCampagneParoisse[]>([]);
  const [resume, setResume] = useState({ totalConfirmes: 0, nombreConfirmes: 0, nombreEnAttente: 0 });

  useEffect(() => {
    if (!open || !campagne) return;

    setLoading(true);
    setFiltre('tous');
    void paroisseService
      .getCampagneDons(token, campagne.id)
      .then((data) => {
        setDons(data.dons);
        setResume(data.resume);
      })
      .finally(() => setLoading(false));
  }, [open, campagne, token]);

  const donsFiltres = useMemo(() => {
    if (filtre === 'tous') return dons;
    return dons.filter((d) => d.statut === filtre);
  }, [dons, filtre]);

  const filtres: { id: DonFiltre; label: string; count: number }[] = [
    { id: 'tous', label: 'Tous', count: dons.length },
    { id: 'reussi', label: 'Confirmés', count: resume.nombreConfirmes },
    { id: 'en_attente', label: 'En attente', count: resume.nombreEnAttente },
  ];

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={campagne ? `Dons — ${campagne.titre}` : 'Dons reçus'}
      size="xl"
    >
      <div className="space-y-4">
        <div className="rounded-xl bg-gray-50 border border-gray-100 px-4 py-3">
          <p className="text-sm font-medium text-gray-900">
            {resume.nombreConfirmes} donateur{resume.nombreConfirmes > 1 ? 's' : ''} confirmé
            {resume.nombreConfirmes > 1 ? 's' : ''}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">
            {formatFcfa(resume.totalConfirmes)} encaissés
            {resume.nombreEnAttente > 0 ? ` · ${resume.nombreEnAttente} en attente` : ''}
          </p>
        </div>

        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-0.5">
          {filtres.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setFiltre(item.id)}
              className={[
                'shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
                filtre === item.id ? 'bg-teal text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
              ].join(' ')}
            >
              {item.label} ({item.count})
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : donsFiltres.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-8 text-center">
            <Users className="mx-auto h-7 w-7 text-gray-300" />
            <p className="mt-2 text-sm font-medium text-gray-700">Aucun don pour ce filtre</p>
            <p className="mt-1 text-xs text-gray-500">Les contributions apparaîtront ici après paiement.</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {donsFiltres.map((don) => (
              <li
                key={don.id}
                className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white px-3 py-3"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-light text-sm font-semibold text-teal">
                  {(don.telephone ?? 'A').replace(/\D/g, '').slice(-2) || 'A'}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium text-gray-900 truncate">{donateurLabel(don)}</p>
                    <p className="text-sm font-semibold text-teal shrink-0">{formatFcfa(don.montant)}</p>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-500">
                    <span>{formatDonDate(don.datePaiement ?? don.dateCreation)}</span>
                    <span className="font-mono text-[10px] text-gray-400">{don.reference}</span>
                  </div>
                </div>

                <div className="flex shrink-0 flex-col items-end gap-1.5">
                  <PaymentMethodBadge id={don.methodePaiement} size="sm" />
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${statutClass(don.statut)}`}>
                    {statutLabel(don.statut)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Modal>
  );
}

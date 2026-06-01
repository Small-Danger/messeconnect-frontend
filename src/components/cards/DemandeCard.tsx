import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ChevronRight, Church } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatFcfa } from '../../utils/formatCurrency';
import type { MockDemande } from '../../services/mockApi/data';

const statutLabels: Record<MockDemande['statut'], string> = {
  en_attente: 'En attente',
  confirmee: 'Confirmée',
  payee: 'Payée',
  celebree: 'Célébrée',
};

const statutStyles: Record<MockDemande['statut'], { badge: string; accent: string }> = {
  en_attente: { badge: 'bg-amber-light text-amber-dark', accent: 'bg-amber-400' },
  confirmee: { badge: 'bg-teal-light text-teal-800', accent: 'bg-teal' },
  payee: { badge: 'bg-teal-light text-teal-800', accent: 'bg-teal' },
  celebree: { badge: 'bg-purple-light text-purple-dark', accent: 'bg-purple' },
};

interface DemandeCardProps {
  demande: MockDemande;
}

export function DemandeCard({ demande }: DemandeCardProps) {
  const styles = statutStyles[demande.statut];

  return (
    <Link
      to={`/demandes/${demande.id}`}
      className="group relative flex overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all active:scale-[0.99]"
    >
      <div className={`w-1 shrink-0 ${styles.accent}`} aria-hidden />
      <div className="flex min-w-0 flex-1 items-center gap-3 p-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-light text-teal">
          <Church className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex flex-wrap items-center gap-2">
            <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${styles.badge}`}>
              {statutLabels[demande.statut]}
            </span>
            <span className="font-mono text-[11px] text-gray-400">{demande.reference}</span>
          </div>
          <p className="truncate font-semibold text-gray-900">{demande.paroisseNom}</p>
          <p className="mt-0.5 truncate text-sm text-gray-500">
            {demande.typeMesse} · {demande.intention}
          </p>
          <p className="mt-1 text-xs text-gray-400">
            {format(parseISO(demande.date), 'EEE d MMM yyyy', { locale: fr })} · {demande.creneau.slice(0, 5)}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-sm font-bold text-teal">{formatFcfa(demande.montant)}</p>
          <ChevronRight className="ml-auto mt-2 h-5 w-5 text-gray-300 transition-transform group-active:translate-x-0.5" />
        </div>
      </div>
    </Link>
  );
}

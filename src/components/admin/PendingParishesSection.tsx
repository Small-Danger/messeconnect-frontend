import { Building2, ChevronRight, Clock } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import type { AdminParish } from '../../services/mockAdminApi/data';

interface PendingParishesSectionProps {
  parishes: AdminParish[];
  onReview: (id: string) => void;
}

export function PendingParishesSection({ parishes, onReview }: PendingParishesSectionProps) {
  if (parishes.length === 0) {
    return (
      <section className="rounded-2xl border border-teal/20 bg-teal-light/20 p-4 flex gap-3">
        <Building2 className="h-5 w-5 text-teal shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-gray-900">Aucune inscription en attente</p>
          <p className="text-sm text-gray-600 mt-0.5">Toutes les demandes d&apos;inscription paroissiale ont été traitées.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-amber-200 bg-amber-50/80 p-5 space-y-4">
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-amber-light p-2">
          <Clock className="h-5 w-5 text-amber-dark" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-semibold text-gray-900">
            Inscriptions à valider
            <span className="ml-2 inline-flex items-center justify-center min-w-[1.5rem] h-6 px-2 rounded-full bg-amber-dark text-white text-xs font-bold">
              {parishes.length}
            </span>
          </h2>
          <p className="text-sm text-gray-600 mt-0.5">
            Ces paroisses ont soumis leur dossier et attendent votre validation pour apparaître auprès des fidèles.
          </p>
        </div>
      </div>

      <ul className="space-y-2">
        {parishes.map((p) => (
          <li key={p.id}>
            <button
              type="button"
              onClick={() => onReview(p.id)}
              className="w-full flex items-center gap-3 rounded-xl bg-white border border-amber-100 px-4 py-3 text-left hover:border-purple/30 hover:shadow-sm transition-shadow min-h-touch"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{p.nom}</p>
                <p className="text-sm text-gray-500 truncate">
                  {p.ville || 'Ville non renseignée'} · {p.diocese || 'Diocèse —'} · {p.responsable}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">Inscrite le {p.dateInscription || '—'}</p>
              </div>
              <StatusBadge statut={p.statut} />
              <span className="shrink-0 inline-flex items-center gap-1 text-sm font-medium text-purple">
                Examiner
                <ChevronRight className="h-4 w-4" />
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

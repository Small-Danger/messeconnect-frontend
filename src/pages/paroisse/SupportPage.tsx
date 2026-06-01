import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  CircleHelp,
  CreditCard,
  GraduationCap,
  HeadphonesIcon,
  MessageCircle,
  Plus,
  Settings,
  Wrench,
} from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { CardSkeleton } from '../../components/common/CardSkeleton';
import { NewTicketModal } from '../../components/modals/NewTicketModal';
import type { TicketStatut, TicketSupport } from '../../services/mockApi/paroisse/data';
import { useSupportStore } from '../../stores/supportStore';

const filters: { id: string; label: string }[] = [
  { id: 'tous', label: 'Tous' },
  { id: 'ouvert', label: 'En attente' },
  { id: 'en_cours', label: 'En cours' },
  { id: 'resolu', label: 'Résolus' },
];

const statutLabels: Record<TicketStatut, string> = {
  ouvert: 'En attente de réponse',
  en_cours: 'Pris en charge',
  resolu: 'Résolu',
};

const statutStyles: Record<TicketStatut, string> = {
  ouvert: 'bg-amber-light text-amber-dark',
  en_cours: 'bg-teal-light text-teal-800',
  resolu: 'bg-gray-100 text-gray-600',
};

const categoryIcons: Record<string, typeof Wrench> = {
  Technique: Wrench,
  Paiement: CreditCard,
  Formation: GraduationCap,
  Compte: Settings,
  Autre: CircleHelp,
};

const helpTopics = [
  {
    icon: Wrench,
    title: 'Problème technique',
    example: '« Le calendrier n\'affiche pas les messes »',
  },
  {
    icon: CreditCard,
    title: 'Paiements & Mobile Money',
    example: '« Comment activer Wave ou Orange Money ? »',
  },
  {
    icon: GraduationCap,
    title: 'Formation secrétariat',
    example: '« Aide pour enregistrer une intention au guichet »',
  },
];

function formatTicketDate(value: string) {
  try {
    const d = parseISO(value);
    if (value.length <= 10) {
      return format(d, 'd MMM yyyy', { locale: fr });
    }
    return format(d, "d MMM yyyy 'à' HH:mm", { locale: fr });
  } catch {
    return value;
  }
}

function countByStatut(tickets: TicketSupport[], statut: TicketStatut) {
  return tickets.filter((t) => t.statut === statut).length;
}

export default function SupportPage() {
  const {
    tickets,
    allTickets,
    loading,
    filterStatut,
    lastSubmittedRef,
    loadTickets,
    setFilterStatut,
    newTicketModalOpen,
    openNewTicketModal,
    closeNewTicketModal,
    addTicket,
  } = useSupportStore();

  useEffect(() => {
    void loadTickets();
  }, [loadTickets]);

  const openCount = useMemo(() => countByStatut(allTickets, 'ouvert'), [allTickets]);
  const inProgressCount = useMemo(() => countByStatut(allTickets, 'en_cours'), [allTickets]);

  const filterCounts = useMemo(
    () => ({
      tous: allTickets.length,
      ouvert: openCount,
      en_cours: inProgressCount,
      resolu: countByStatut(allTickets, 'resolu'),
    }),
    [allTickets, openCount, inProgressCount],
  );

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-teal">
            <HeadphonesIcon className="h-5 w-5" />
            <span className="text-xs font-semibold uppercase tracking-wide">Assistance MesseConnect</span>
          </div>
          <h1 className="mt-1 text-xl font-semibold text-gray-900">Aide pour le secrétariat</h1>
          <p className="mt-1 text-sm text-gray-500 max-w-xl">
            Contactez l&apos;équipe MesseConnect en cas de difficulté avec l&apos;application (connexion, calendrier,
            paiements, etc.). Ce n&apos;est pas un canal pour les fidèles — ils passent par leur propre espace « Aide ».
          </p>
        </div>
        <button
          type="button"
          onClick={openNewTicketModal}
          className="flex items-center justify-center gap-2 min-h-touch px-4 rounded-xl bg-teal text-white text-sm font-medium shrink-0 shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Nouvelle demande
        </button>
      </div>

      <div className="rounded-2xl border border-teal/20 bg-teal-light/40 p-4 sm:p-5">
        <div className="flex gap-3">
          <MessageCircle className="h-5 w-5 text-teal shrink-0 mt-0.5" />
          <div className="text-sm text-gray-700 space-y-2">
            <p>
              <strong className="text-gray-900">Vous êtes secrétaire ou responsable paroissial.</strong> Décrivez votre
              problème ci-dessous : notre équipe vous répond sous 24 à 48 h ouvrées.
            </p>
            <p className="text-gray-600">
              Les demandes de messe, intentions ou dons des fidèles se gèrent dans{' '}
              <strong className="text-gray-800">Intentions</strong> et <strong className="text-gray-800">Collectes</strong>
              , pas ici.
            </p>
          </div>
        </div>
      </div>

      <section className="grid gap-3 sm:grid-cols-3">
        {helpTopics.map(({ icon: Icon, title, example }) => (
          <button
            key={title}
            type="button"
            onClick={openNewTicketModal}
            className="rounded-xl border border-gray-100 bg-white p-3 text-left shadow-sm hover:border-teal/30 hover:bg-teal-light/20 transition-colors"
          >
            <Icon className="h-4 w-4 text-teal mb-2" />
            <p className="text-sm font-medium text-gray-900">{title}</p>
            <p className="mt-1 text-xs text-gray-500 italic">{example}</p>
          </button>
        ))}
      </section>

      {(openCount > 0 || inProgressCount > 0) && filterStatut === 'tous' ? (
        <div className="flex flex-wrap gap-2 text-xs">
          {openCount > 0 ? (
            <span className="rounded-full bg-amber-light px-3 py-1 font-medium text-amber-dark">
              {openCount} en attente de réponse
            </span>
          ) : null}
          {inProgressCount > 0 ? (
            <span className="rounded-full bg-teal-light px-3 py-1 font-medium text-teal-800">
              {inProgressCount} pris en charge
            </span>
          ) : null}
        </div>
      ) : null}

      {lastSubmittedRef ? (
        <div
          className="rounded-xl border border-teal/30 bg-teal-light/50 px-4 py-3 text-sm text-teal-900"
          role="status"
        >
          Demande <strong>{lastSubmittedRef}</strong> envoyée. Vous serez notifiée par e-mail dès qu&apos;une réponse
          est disponible.
        </div>
      ) : null}

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-gray-900">Vos demandes</h2>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilterStatut(f.id)}
              className={[
                'shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium min-h-touch',
                filterStatut === f.id ? 'bg-teal text-white' : 'bg-white border border-gray-200 text-gray-600',
              ].join(' ')}
            >
              {f.label}
              <span
                className={[
                  'text-xs px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center',
                  filterStatut === f.id ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500',
                ].join(' ')}
              >
                {filterCounts[f.id as keyof typeof filterCounts] ?? 0}
              </span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : tickets.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-4 py-10 text-center">
            <HeadphonesIcon className="mx-auto h-8 w-8 text-gray-300" />
            <p className="mt-3 text-sm font-medium text-gray-800">Aucune demande pour le moment</p>
            <p className="mt-1 text-xs text-gray-500 max-w-sm mx-auto">
              Un souci avec MesseConnect ? Créez une demande et notre équipe vous accompagne.
            </p>
            <button
              type="button"
              onClick={openNewTicketModal}
              className="mt-4 inline-flex items-center gap-1.5 min-h-touch px-4 rounded-xl bg-teal text-white text-sm font-medium"
            >
              <Plus className="h-4 w-4" />
              Contacter MesseConnect
            </button>
          </div>
        ) : (
          <ul className="space-y-3">
            {tickets.map((t) => {
              const CategoryIcon = categoryIcons[t.categorie] ?? CircleHelp;
              return (
                <li key={t.id} className="rounded-2xl bg-white border border-gray-100 p-4 shadow-sm">
                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-50 text-teal">
                      <CategoryIcon className="h-5 w-5" />
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <p className="font-mono text-[11px] text-gray-400">{t.reference}</p>
                          <h3 className="font-medium text-gray-900 mt-0.5">{t.titre}</h3>
                        </div>
                        <span
                          className={`text-xs px-2.5 py-1 rounded-full font-medium shrink-0 ${statutStyles[t.statut]}`}
                        >
                          {statutLabels[t.statut]}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-2 leading-relaxed">{t.description}</p>
                      <p className="text-xs text-gray-400 mt-3">
                        {t.categorie} · {formatTicketDate(t.createdAt)}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <NewTicketModal open={newTicketModalOpen} onClose={closeNewTicketModal} onSave={addTicket} />
    </div>
  );
}

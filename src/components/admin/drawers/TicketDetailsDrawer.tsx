import { MessageSquare } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { AdminDrawer } from './AdminDrawer';
import { StatusBadge } from '../StatusBadge';
import { ReplyTicketModal } from '../modals/ReplyTicketModal';
import { useAdminSupportStore } from '../../../stores/adminSupportStore';

export function TicketDetailsDrawer() {
  const {
    selectedTicketId,
    ticketDetail,
    replyModalOpen,
    loading,
    closeTicketDrawer,
    openReplyModal,
    closeReplyModal,
    replyTicket,
  } = useAdminSupportStore();

  return (
    <>
      <AdminDrawer
        open={!!selectedTicketId}
        onClose={closeTicketDrawer}
        title={ticketDetail?.reference ?? 'Ticket'}
        wide
      >
        {ticketDetail ? (
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900">{ticketDetail.titre}</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                <StatusBadge statut={ticketDetail.statut} />
                <StatusBadge statut={ticketDetail.priorite} />
                <span className="text-xs text-gray-500">{ticketDetail.categorie}</span>
              </div>
              <p className="text-sm text-gray-600 mt-3">{ticketDetail.description}</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Conversation</h3>
              <ul className="space-y-3">
                {ticketDetail.messages.map((m, i) => (
                  <li
                    key={i}
                    className={[
                      'rounded-xl p-3 text-sm',
                      m.role === 'admin' ? 'bg-purple-light ml-4' : 'bg-gray-50 mr-4',
                    ].join(' ')}
                  >
                    <p className="font-medium text-xs text-gray-500 mb-1">{m.auteur}</p>
                    <p>{m.contenu}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {format(parseISO(m.date), 'd MMM HH:mm', { locale: fr })}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            {ticketDetail.piecesJointes.length ? (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Pièces jointes</h3>
                {ticketDetail.piecesJointes.map((p) => (
                  <p key={p.nom} className="text-sm text-purple">{p.nom} ({p.taille})</p>
                ))}
              </div>
            ) : null}

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Historique</h3>
              <ul className="text-sm space-y-1 text-gray-600">
                {ticketDetail.historique.map((h, i) => (
                  <li key={i}>{h.date} — {h.action}</li>
                ))}
              </ul>
            </div>

            <button
              type="button"
              onClick={openReplyModal}
              className="flex items-center gap-2 min-h-touch px-4 rounded-xl bg-purple text-white text-sm font-medium w-full justify-center"
            >
              <MessageSquare className="h-4 w-4" /> Répondre
            </button>
          </div>
        ) : loading ? (
          <div className="h-48 rounded-xl bg-gray-100 animate-pulse" />
        ) : null}
      </AdminDrawer>

      <ReplyTicketModal
        open={replyModalOpen}
        onClose={closeReplyModal}
        onConfirm={replyTicket}
        loading={loading}
      />
    </>
  );
}

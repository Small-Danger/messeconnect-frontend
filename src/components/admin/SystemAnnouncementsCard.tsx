import { Megaphone, Plus } from 'lucide-react';
import { useState } from 'react';
import type { SystemAnnonce } from '../../services/mockAdminApi/data';
import { NewAnnouncementModal } from './modals/NewAnnouncementModal';

interface SystemAnnouncementsCardProps {
  annonces: SystemAnnonce[];
  onAdd: (data: Omit<SystemAnnonce, 'id' | 'actif'>) => Promise<void>;
}

export function SystemAnnouncementsCard({ annonces, onAdd }: SystemAnnouncementsCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Megaphone className="h-5 w-5 text-purple" />
          <h3 className="font-semibold text-gray-900">Annonces système</h3>
          <span className="text-xs px-2 py-0.5 rounded-full bg-amber-light text-amber-dark font-medium">Démo</span>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex items-center gap-1 text-sm text-purple font-medium min-h-touch px-3 rounded-lg hover:bg-purple-light"
        >
          <Plus className="h-4 w-4" /> Nouvelle annonce
        </button>
      </div>
      <ul className="space-y-3">
        {annonces.map((a) => (
          <li key={a.id} className="rounded-xl border border-gray-100 p-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-medium text-gray-900">{a.titre}</p>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{a.contenu}</p>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-purple-light text-purple shrink-0">{a.priorite}</span>
            </div>
            <p className="text-xs text-gray-400 mt-2">{a.datePublication} → {a.dateExpiration}</p>
          </li>
        ))}
      </ul>
      <NewAnnouncementModal open={open} onClose={() => setOpen(false)} onSave={onAdd} />
    </div>
  );
}

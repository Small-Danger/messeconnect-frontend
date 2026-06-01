import { Plus, Target } from 'lucide-react';
import { useState } from 'react';
import type { SystemCampagne } from '../../services/mockAdminApi/data';
import { formatFcfa } from '../../utils/formatCurrency';
import { NewSystemCampaignModal } from './modals/NewSystemCampaignModal';

interface SystemCampaignsCardProps {
  campagnes: SystemCampagne[];
  onAdd: (data: Omit<SystemCampagne, 'id' | 'collecte'>) => Promise<void>;
}

export function SystemCampaignsCard({ campagnes, onAdd }: SystemCampaignsCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-purple" />
          <h3 className="font-semibold text-gray-900">Campagnes système</h3>
          <span className="text-xs px-2 py-0.5 rounded-full bg-amber-light text-amber-dark font-medium">Démo</span>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex items-center gap-1 text-sm text-purple font-medium min-h-touch px-3 rounded-lg hover:bg-purple-light"
        >
          <Plus className="h-4 w-4" /> Nouvelle campagne
        </button>
      </div>
      <ul className="space-y-3">
        {campagnes.map((c) => {
          const pct = Math.round((c.collecte / c.objectif) * 100);
          return (
            <li key={c.id} className="rounded-xl border border-gray-100 p-3">
              <p className="font-medium text-gray-900">{c.titre}</p>
              <p className="text-sm text-gray-500 mt-1">{formatFcfa(c.collecte)} / {formatFcfa(c.objectif)}</p>
              <div className="mt-2 h-2 rounded-full bg-gray-100 overflow-hidden">
                <div className="h-full bg-purple rounded-full" style={{ width: `${pct}%` }} />
              </div>
            </li>
          );
        })}
      </ul>
      <NewSystemCampaignModal open={open} onClose={() => setOpen(false)} onSave={onAdd} />
    </div>
  );
}

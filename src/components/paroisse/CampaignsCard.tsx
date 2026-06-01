import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatFcfa } from '../../utils/formatCurrency';
import { NewCampaignModal } from '../modals/NewCampaignModal';
import type { CampagneParoisse } from '../../services/mockApi/paroisse/data';

interface CampaignsCardProps {
  campagnes: CampagneParoisse[];
  onAdd: (data: Omit<CampagneParoisse, 'id' | 'collecte'>) => Promise<void>;
}

export function CampaignsCard({ campagnes, onAdd }: CampaignsCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <section className="rounded-2xl bg-white border border-gray-100 p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900">Campagnes de collecte</h3>
          <div className="flex items-center gap-2">
            <Link to="/paroisse/collectes" className="text-sm text-teal font-medium min-h-touch px-2">
              Gérer
            </Link>
            <button type="button" onClick={() => setOpen(true)} className="flex items-center gap-1 text-sm text-teal font-medium min-h-touch px-2">
              <Plus className="h-4 w-4" /> Nouvelle
            </button>
          </div>
        </div>
        <ul className="space-y-4">
          {campagnes.map((c) => {
            const pct = Math.min(100, Math.round((c.collecte / c.objectif) * 100));
            return (
              <li key={c.id}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-900">{c.titre}</span>
                  <span className="text-teal font-medium">{pct}%</span>
                </div>
                <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div className="h-full bg-amber rounded-full" style={{ width: `${pct}%` }} />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {formatFcfa(c.collecte)} / {formatFcfa(c.objectif)}
                </p>
              </li>
            );
          })}
        </ul>
      </section>
      <NewCampaignModal open={open} onClose={() => setOpen(false)} onSave={onAdd} />
    </>
  );
}

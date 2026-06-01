import { Plus } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { SafeImage } from '../common/SafeImage';
import { PublicationFormModal } from '../modals/PublicationFormModal';
import type { PublicationParoisse } from '../../services/mockApi/paroisse/data';

interface PublicationsCardProps {
  publications: PublicationParoisse[];
  onAdd: (data: Omit<PublicationParoisse, 'id'>) => Promise<void>;
  limit?: number;
}

export function PublicationsCard({ publications, onAdd, limit }: PublicationsCardProps) {
  const [open, setOpen] = useState(false);
  const items = limit ? publications.slice(0, limit) : publications;

  return (
    <>
      <section className="rounded-2xl bg-white border border-gray-100 p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900">Publications</h3>
          <div className="flex items-center gap-2">
            <Link to="/paroisse/publications" className="text-xs text-teal font-medium min-h-touch px-2 flex items-center">
              Gérer
            </Link>
            <button type="button" onClick={() => setOpen(true)} className="flex items-center gap-1 text-sm text-teal font-medium min-h-touch px-2">
              <Plus className="h-4 w-4" /> Nouvelle
            </button>
          </div>
        </div>
        <ul className="space-y-3">
          {items.map((p) => (
            <li key={p.id} className="flex gap-3">
              <SafeImage
                src={p.images?.[0] ?? p.image}
                alt=""
                className="h-14 w-14 rounded-lg shrink-0"
              />
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{p.titre}</p>
                <p className="text-xs text-gray-400">{format(parseISO(p.datePublication), 'd MMM yyyy', { locale: fr })}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
      <PublicationFormModal open={open} onClose={() => setOpen(false)} onSave={onAdd} />
    </>
  );
}

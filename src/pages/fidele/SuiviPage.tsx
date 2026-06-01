import { useState } from 'react';
import { Link } from 'react-router-dom';
import { DemandeCard } from '../../components/cards/DemandeCard';
import { FormInput } from '../../components/forms/FormInput';
import { MobileLayout } from '../../components/layout/MobileLayout';
import { PageHeader } from '../../components/layout/PageHeader';
import { fideleService } from '../../services/fideleService';
import type { MockDemande } from '../../services/mockApi/data';

export default function SuiviPage() {
  const [reference, setReference] = useState('');
  const [demande, setDemande] = useState<MockDemande | null>(null);
  const [error, setError] = useState('');

  const search = async () => {
    setError('');
    try {
      setDemande(await fideleService.getDemandeByReference(reference.trim()));
    } catch {
      setError('Référence introuvable');
      setDemande(null);
    }
  };

  return (
    <MobileLayout header={<PageHeader title="Suivre ma demande" backTo="/" />}>
      <div className="px-4 py-4 space-y-4">
        <FormInput
          label="Référence de votre demande"
          placeholder="MSS-2026-XXXXX"
          value={reference}
          onChange={(e) => setReference(e.target.value)}
        />
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <button
          type="button"
          onClick={search}
          className="w-full min-h-touch rounded-xl bg-teal text-white font-medium active:scale-95"
        >
          Rechercher
        </button>
        {demande ? (
          <div className="space-y-3">
            <DemandeCard demande={demande} />
            <Link to={`/demandes/${demande.id}`} className="block text-center text-sm text-teal font-medium">
              Voir le détail complet
            </Link>
          </div>
        ) : null}
      </div>
    </MobileLayout>
  );
}

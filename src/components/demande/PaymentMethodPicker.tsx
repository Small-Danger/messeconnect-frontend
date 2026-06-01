import { useEffect, useMemo, useState } from 'react';
import { PaymentMethodBadge } from '../payment/PaymentMethodBadge';
import { PaymentMethodSkeleton } from '../common/skeletons/FideleSkeletons';
import { USE_MOCK_API } from '../../config/env';
import { methodesPaiement } from '../../constants/fidele';
import { API_TYPE_TO_MOCK_METHODE } from '../../services/api/mappers/paiement';
import { useDemandeFlowStore } from '../../stores/demandeFlowStore';

interface PaymentMethodPickerProps {
  paroisseId: string;
  token?: string | null;
  methode: string;
  onChange: (methode: string) => void;
}

export function PaymentMethodPicker({ paroisseId, token, methode, onChange }: PaymentMethodPickerProps) {
  const { moyensByParoisse, prefetchForParoisse } = useDemandeFlowStore();
  const cachedMoyens = moyensByParoisse[paroisseId];
  const [refreshing, setRefreshing] = useState(!cachedMoyens?.length && !USE_MOCK_API);

  useEffect(() => {
    if (USE_MOCK_API || !paroisseId) return;

    let cancelled = false;
    const hasCache = Boolean(useDemandeFlowStore.getState().moyensByParoisse[paroisseId]?.length);
    if (!hasCache) setRefreshing(true);

    prefetchForParoisse(paroisseId, token).finally(() => {
      if (!cancelled) setRefreshing(false);
    });

    return () => {
      cancelled = true;
    };
  }, [paroisseId, token, prefetchForParoisse]);

  const paymentOptions = useMemo(() => {
    if (USE_MOCK_API) return methodesPaiement;

    const moyens = moyensByParoisse[paroisseId] ?? [];
    const allowedIds = new Set(
      moyens.map((m) => API_TYPE_TO_MOCK_METHODE[m.type]).filter((id): id is string => Boolean(id)),
    );

    return methodesPaiement.filter((m) => allowedIds.has(m.id));
  }, [moyensByParoisse, paroisseId]);

  useEffect(() => {
    if (!paymentOptions.length) return;
    const isValid = paymentOptions.some((m) => m.id === methode);
    if (!isValid) {
      onChange(paymentOptions[0].id);
    }
  }, [paymentOptions, methode, onChange]);

  if (refreshing && paymentOptions.length === 0) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <PaymentMethodSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (paymentOptions.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-6 text-center text-sm text-gray-500">
        Aucun moyen de paiement disponible pour cette paroisse.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {paymentOptions.map((m) => {
        const selected = methode === m.id;
        return (
          <button
            key={m.id}
            type="button"
            onClick={() => onChange(m.id)}
            className={[
              'flex w-full items-center gap-3 min-h-touch rounded-2xl border p-4 text-left transition-all active:scale-[0.99]',
              selected ? 'border-teal bg-teal-light ring-2 ring-teal/15 shadow-sm' : 'border-gray-100 bg-white',
            ].join(' ')}
          >
            <PaymentMethodBadge id={m.id} />
            <span className="min-w-0 flex-1">
              <span className="block font-semibold text-gray-900">{m.label}</span>
              <span className="mt-0.5 block text-xs text-gray-500">{m.subtitle}</span>
            </span>
            <span
              className={[
                'h-5 w-5 shrink-0 rounded-full border-2',
                selected ? 'border-teal bg-teal text-white' : 'border-gray-300',
              ].join(' ')}
              aria-hidden
            >
              {selected ? (
                <span className="flex h-full w-full items-center justify-center text-[10px]">✓</span>
              ) : null}
            </span>
          </button>
        );
      })}
    </div>
  );
}

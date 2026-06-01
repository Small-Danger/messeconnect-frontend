import { Banknote } from 'lucide-react';

const styles: Record<string, { bg: string; text: string; label: string }> = {
  orange: { bg: 'bg-[#FF7900]', text: 'text-white', label: 'OM' },
  moov: { bg: 'bg-[#0066CC]', text: 'text-white', label: 'MM' },
  wave: { bg: 'bg-[#1DC4E9]', text: 'text-white', label: 'W' },
  especes: { bg: 'bg-teal-light', text: 'text-teal', label: '' },
};

interface PaymentMethodBadgeProps {
  id: string;
  size?: 'sm' | 'md';
}

export function PaymentMethodBadge({ id, size = 'md' }: PaymentMethodBadgeProps) {
  const style = styles[id] ?? styles.especes;
  const dim = size === 'sm' ? 'h-9 w-9 text-xs' : 'h-11 w-11 text-sm';

  if (id === 'especes') {
    return (
      <span className={`${dim} rounded-xl ${style.bg} flex items-center justify-center shrink-0`}>
        <Banknote className={`h-5 w-5 ${style.text}`} />
      </span>
    );
  }

  return (
    <span
      className={`${dim} rounded-xl ${style.bg} ${style.text} font-bold flex items-center justify-center shrink-0`}
    >
      {style.label}
    </span>
  );
}

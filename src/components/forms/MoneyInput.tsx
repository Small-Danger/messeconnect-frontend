import type { InputHTMLAttributes } from 'react';
import type { FieldError } from 'react-hook-form';

interface MoneyInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: FieldError;
}

export function MoneyInput({ label = 'Montant (FCFA)', error, className = '', ...props }: MoneyInputProps) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <div className="relative">
        <input
          type="number"
          inputMode="numeric"
          min={0}
          step={500}
          className={[
            'min-h-touch w-full rounded-xl border border-gray-200 px-4 py-3 pr-16 text-base focus:outline-none focus:ring-2 focus:ring-teal/20 focus:border-teal bg-white',
            className,
          ].join(' ')}
          {...props}
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">FCFA</span>
      </div>
      {error ? <span className="text-xs text-red-600">{error.message}</span> : null}
    </label>
  );
}

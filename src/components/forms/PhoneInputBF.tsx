import type { InputHTMLAttributes } from 'react';
import type { FieldError } from 'react-hook-form';

interface PhoneInputBFProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: FieldError;
}

export function PhoneInputBF({ label = 'Téléphone', error, className = '', ...props }: PhoneInputBFProps) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <div className="flex rounded-xl border border-gray-200 overflow-hidden focus-within:ring-2 focus-within:ring-teal/20 focus-within:border-teal bg-white">
        <span className="flex items-center px-3 bg-gray-50 text-sm text-gray-600 border-r border-gray-200 shrink-0">
          +226
        </span>
        <input
          type="tel"
          inputMode="tel"
          placeholder="70 12 34 56"
          className={['flex-1 min-h-touch px-4 py-3 text-base focus:outline-none', className].join(' ')}
          {...props}
        />
      </div>
      {error ? <span className="text-xs text-red-600">{error.message}</span> : null}
    </label>
  );
}

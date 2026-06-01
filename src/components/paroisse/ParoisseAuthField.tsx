import type { LucideIcon } from 'lucide-react';
import type { InputHTMLAttributes } from 'react';
import type { FieldError } from 'react-hook-form';

interface ParoisseAuthFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: LucideIcon;
  error?: FieldError;
}

export function ParoisseAuthField({ label, icon: Icon, error, className = '', id, ...props }: ParoisseAuthFieldProps) {
  const fieldId = id ?? props.name;

  return (
    <label htmlFor={fieldId} className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <input
          id={fieldId}
          className={[
            'min-h-touch w-full rounded-xl border bg-white py-3 pl-11 pr-4 text-base',
            error ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:border-teal focus:ring-teal/20',
            'focus:outline-none focus:ring-2',
            className,
          ].join(' ')}
          {...props}
        />
      </div>
      {error ? <span className="text-xs text-red-600">{error.message}</span> : null}
    </label>
  );
}

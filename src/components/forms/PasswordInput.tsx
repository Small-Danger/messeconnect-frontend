import { Eye, EyeOff } from 'lucide-react';
import { useState, type InputHTMLAttributes } from 'react';
import type { FieldError } from 'react-hook-form';

interface PasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  error?: FieldError;
}

export function PasswordInput({ label, error, className = '', id, ...props }: PasswordInputProps) {
  const [visible, setVisible] = useState(false);
  const fieldId = id ?? props.name;

  return (
    <label htmlFor={fieldId} className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <div className="relative">
        <input
          id={fieldId}
          type={visible ? 'text' : 'password'}
          className={[
            'min-h-touch w-full rounded-xl border px-4 py-3 pr-12 text-base bg-white',
            error ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:ring-teal/20 focus:border-teal',
            'focus:outline-none focus:ring-2',
            className,
          ].join(' ')}
          {...props}
        />
        <button
          type="button"
          aria-label={visible ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
          onClick={() => setVisible((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 min-h-touch min-w-touch flex items-center justify-center text-gray-400 active:scale-95 transition-transform"
        >
          {visible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>
      {error ? <span className="text-xs text-red-600">{error.message}</span> : null}
    </label>
  );
}

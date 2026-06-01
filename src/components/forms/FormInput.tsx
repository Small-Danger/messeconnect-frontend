import type { InputHTMLAttributes } from 'react';
import type { FieldError } from 'react-hook-form';

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: FieldError;
}

export function FormInput({ label, error, className = '', id, ...props }: FormInputProps) {
  const fieldId = id ?? props.name;

  return (
    <label htmlFor={fieldId} className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <input
        id={fieldId}
        className={[
          'min-h-touch w-full rounded-xl border px-4 py-3 text-base bg-white',
          error ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:ring-teal/20 focus:border-teal',
          'focus:outline-none focus:ring-2',
          className,
        ].join(' ')}
        {...props}
      />
      {error ? <span className="text-xs text-red-600">{error.message}</span> : null}
    </label>
  );
}

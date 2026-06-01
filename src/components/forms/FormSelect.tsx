import type { SelectHTMLAttributes } from 'react';
import type { FieldError } from 'react-hook-form';

interface FormSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: FieldError;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export function FormSelect({
  label,
  error,
  options,
  placeholder = 'Sélectionner…',
  className = '',
  id,
  ...props
}: FormSelectProps) {
  const fieldId = id ?? props.name;

  return (
    <label htmlFor={fieldId} className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <select
        id={fieldId}
        className={[
          'min-h-touch w-full rounded-xl border px-4 py-3 text-base bg-white appearance-none',
          error ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:ring-teal/20 focus:border-teal',
          'focus:outline-none focus:ring-2',
          className,
        ].join(' ')}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error ? <span className="text-xs text-red-600">{error.message}</span> : null}
    </label>
  );
}

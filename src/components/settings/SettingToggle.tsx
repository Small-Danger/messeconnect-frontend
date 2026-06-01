interface SettingToggleProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function SettingToggle({ label, description, checked, onChange }: SettingToggleProps) {
  return (
    <label className="flex items-start justify-between gap-4 min-h-touch py-3 cursor-pointer">
      <span className="flex-1">
        <span className="block text-sm font-medium text-gray-900">{label}</span>
        {description ? <span className="block text-xs text-gray-500 mt-0.5">{description}</span> : null}
      </span>
      <span className="relative inline-flex h-7 w-12 shrink-0 items-center">
        <input
          type="checkbox"
          className="peer sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span className="absolute inset-0 rounded-full bg-gray-200 transition-colors peer-checked:bg-teal" />
        <span className="absolute left-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
      </span>
    </label>
  );
}

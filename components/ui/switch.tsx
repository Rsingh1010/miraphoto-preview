"use client";

interface SwitchProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export function Switch({ id, label, checked, onChange, disabled }: SwitchProps) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        id={id}
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full
          transition-colors focus:outline-none focus:ring-2 focus:ring-slate-800/30
          focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50
          ${checked ? "bg-slate-800" : "bg-gray-300"}`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white
            transition-transform ${checked ? "translate-x-6" : "translate-x-1"}`}
        />
      </button>
      <label htmlFor={id} className="text-sm font-medium text-slate-700">
        {label}
      </label>
    </div>
  );
}

import type { ReactNode } from "react";

interface FieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
}

export function Field({
  label,
  htmlFor,
  error,
  hint,
  required,
  children,
}: FieldProps) {
  const errorId = error ? `${htmlFor}-error` : undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium text-slate-700">
        {label}
        {required && (
          <span aria-hidden="true" className="ml-0.5 text-slate-400">
            *
          </span>
        )}
      </label>

      {hint && <p className="text-xs text-gray-500">{hint}</p>}

      {children}

      {error && (
        <p id={errorId} role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

"use client";

import { useRef } from "react";

interface FileInputProps {
  id: string;
  accept: string;
  buttonLabel: string;
  multiple?: boolean;
  files: File[];
  onChange: (files: File[]) => void;
  error?: string;
}

export function FileInput({
  id,
  accept,
  buttonLabel,
  multiple,
  files,
  onChange,
  error,
}: FileInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const summary =
    files.length === 0
      ? "No file chosen"
      : files.length === 1
        ? files[0].name
        : `${files.length} files chosen`;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="rounded-md bg-slate-800 px-4 py-2 text-sm font-semibold text-amber-400
            shadow-sm transition hover:bg-slate-700"
        >
          {buttonLabel}
        </button>
        <span className="text-sm text-slate-600">{summary}</span>
      </div>

      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={(event) => onChange(Array.from(event.target.files ?? []))}
        className="hidden"
      />

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

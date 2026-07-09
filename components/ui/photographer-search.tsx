"use client";

import { useEffect, useState } from "react";
import { searchPhotographers, type PhotographerResult } from "@/lib/api/photographers";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { inputClasses } from "@/lib/ui/styles";

interface PhotographerSearchProps {
  id: string;
  value: string;
  onChange: (name: string, id?: string) => void;
}

export function PhotographerSearch({ id, value, onChange }: PhotographerSearchProps) {
  const [results, setResults] = useState<PhotographerResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const debouncedValue = useDebouncedValue(value, 400);

  useEffect(() => {
    if (debouncedValue.trim().length < 2) {
      setResults([]);
      return;
    }

    let cancelled = false;
    setIsSearching(true);

    searchPhotographers(debouncedValue)
      .then((found) => {
        if (!cancelled) setResults(found);
      })
      .finally(() => {
        if (!cancelled) setIsSearching(false);
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedValue]);

  return (
    <div className="relative">
      <input
        id={id}
        type="text"
        placeholder="Type at least 2 characters"
        className={inputClasses}
        value={value}
        autoComplete="off"
        onChange={(event) => onChange(event.target.value, undefined)}
      />

      {isSearching && (
        <p className="mt-1 text-xs text-gray-500">Searching…</p>
      )}

      {results.length > 0 && (
        <ul className="absolute z-10 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-sm">
          {results.map((photographer) => (
            <li key={photographer.id}>
              <button
                type="button"
                className="w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-gray-50"
                onClick={() => {
                  onChange(photographer.name, photographer.id);
                  setResults([]);
                }}
              >
                {photographer.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

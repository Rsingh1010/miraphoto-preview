interface RadioOption {
  label: string;
  value: string;
}

interface RadioGroupProps {
  name: string;
  legend: string;
  options: RadioOption[];
  value: string | undefined;
  onChange: (value: string) => void;
  error?: string;
}

export function RadioGroup({
  name,
  legend,
  options,
  value,
  onChange,
  error,
}: RadioGroupProps) {
  return (
    <fieldset className="flex flex-col gap-1.5">
      <legend className="text-sm font-medium text-slate-700">{legend}</legend>
      <div className="flex items-center gap-6">
        {options.map((option) => (
          <label
            key={option.value}
            className="flex items-center gap-2 text-slate-700"
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="h-4 w-4 border-gray-300 text-slate-800 focus:ring-slate-800/30"
            />
            {option.label}
          </label>
        ))}
      </div>
      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}
    </fieldset>
  );
}

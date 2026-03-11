interface RadioOption {
  value: string | number;
  label: string;
}

interface RadioGroupProps {
  label?: string;
  options: RadioOption[];
  value: string | number;
  onChange: (value: string | number) => void;
  name: string;
  className?: string;
}

export default function RadioGroup({
  label,
  options,
  value,
  onChange,
  name,
  className = ''
}: RadioGroupProps) {
  return (
    <div className={`flex flex-col ${className}`}>
      {label && (
        <label className="text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className="space-y-2">
        {options.map((option) => (
          <label
            key={option.value}
            className="flex items-center cursor-pointer"
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-2 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">
              {option.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}

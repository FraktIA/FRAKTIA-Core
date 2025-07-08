import React, { forwardRef } from "react";

interface FormSelectOption {
  value: string | number;
  label: string;
}

interface FormSelectProps {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  options: FormSelectOption[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  helpText?: string;
  className?: string;
}

const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  (
    {
      label,
      value,
      onChange,
      options,
      placeholder,
      required = false,
      disabled = false,
      helpText,
      className = "",
    },
    ref
  ) => {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      onChange(e.target.value);
    };

    return (
      <div className={`space-y-2 ${className}`}>
        <label className="block text-sm font-medium text-white/70 tracking-wide">
          {label}
          {required && <span className="text-primary ml-1">*</span>}
        </label>
        <select
          ref={ref}
          value={String(value)}
          onChange={handleChange}
          disabled={disabled}
          className="w-full p-3 bg-bg border border-bg rounded-sm text-white focus:outline-none focus:ring-[0.5px] focus:ring-primary text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {helpText && <p className="text-xs text-white/50 mt-1">{helpText}</p>}
      </div>
    );
  }
);

FormSelect.displayName = "FormSelect";

export default FormSelect;

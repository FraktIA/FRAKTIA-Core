import React, { forwardRef } from "react";

interface FormInputProps {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: "text" | "password" | "email" | "url" | "number";
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  min?: string | number;
  max?: string | number;
  step?: string | number;
  helpText?: string;
  className?: string;
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      label,
      value,
      onChange,
      type = "text",
      placeholder,
      required = false,
      disabled = false,
      min,
      max,
      step,
      helpText,
      className = "",
    },
    ref
  ) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value);
    };

    return (
      <div className={`space-y-2 ${className}`}>
        <label className="block text-sm font-medium text-white/70 tracking-wide">
          {label}
          {required && <span className="text-primary ml-1">*</span>}
        </label>
        <input
          ref={ref}
          type={type}
          value={String(value)}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          min={min}
          max={max}
          step={step}
          className="w-full p-3 bg-bg border border-bg rounded-sm text-white placeholder-gray-500 focus:outline-none focus:ring-[0.5px] focus:ring-primary transition-all duration-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        />
        {helpText && <p className="text-xs text-white/50 mt-1">{helpText}</p>}
      </div>
    );
  }
);

FormInput.displayName = "FormInput";

export default FormInput;

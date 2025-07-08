import React from "react";

interface FormCheckboxProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

const FormCheckbox: React.FC<FormCheckboxProps> = ({
  id,
  label,
  checked,
  onChange,
  disabled = false,
  className = "",
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked);
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        className="w-4 h-4 text-primary bg-bg border-gray-600 rounded focus:ring-primary focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed"
      />
      <label
        htmlFor={id}
        className={`text-sm text-white/70 tracking-wide ${
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        }`}
      >
        {label}
      </label>
    </div>
  );
};

export default FormCheckbox;

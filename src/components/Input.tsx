import React from 'react';

export interface InputProps {
  id?: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  min?: string;
  max?: string;
  step?: string;
}

export function Input({
  id,
  type = 'text',
  placeholder,
  value,
  onChange,
  className = '',
  disabled = false,
  required = false,
  min,
  max,
  step,
}: InputProps) {
  return (
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`
        w-full px-3 py-2 border border-border rounded-md bg-background text-foreground
        focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
      disabled={disabled}
      required={required}
      min={min}
      max={max}
      step={step}
    />
  );
}

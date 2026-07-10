import React, { useId } from 'react';
import './Checkbox.css';

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  id,
  className = '',
  checked,
  onChange,
  disabled,
  ...props
}) => {
  const generatedId = useId();
  const checkboxId = id || generatedId;

  return (
    <label
      htmlFor={checkboxId}
      className={`checkbox-label-container ${disabled ? 'checkbox-disabled' : ''} ${className}`}
    >
      <div className="checkbox-wrapper">
        <input
          id={checkboxId}
          type="checkbox"
          className="checkbox-input"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          {...props}
        />
        <div className="checkbox-box" aria-hidden="true">
          <svg
            className="checkbox-checkmark"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
      </div>
      {label && <span className="checkbox-text">{label}</span>}
    </label>
  );
};

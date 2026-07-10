import React, { useId } from 'react';
import './Switch.css';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  id?: string;
}

export const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  label,
  disabled = false,
  id,
}) => {
  const generatedId = useId();
  const switchId = id || generatedId;

  return (
    <label
      htmlFor={switchId}
      className={`switch-label-container ${disabled ? 'switch-disabled' : ''}`}
    >
      <div className="switch-wrapper">
        <input
          id={switchId}
          type="checkbox"
          role="switch"
          aria-checked={checked}
          checked={checked}
          onChange={e => onChange(e.target.checked)}
          disabled={disabled}
          className="switch-input"
        />
        <div className="switch-track">
          <div className="switch-thumb" />
        </div>
      </div>
      {label && <span className="switch-text">{label}</span>}
    </label>
  );
};

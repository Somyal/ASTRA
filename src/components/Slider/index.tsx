import React, { useId } from 'react';
import './Slider.css';

interface SliderProps {
  min: number;
  max: number;
  value: number;
  onChange: (val: number) => void;
  label?: string;
  disabled?: boolean;
  id?: string;
}

export const Slider: React.FC<SliderProps> = ({
  min,
  max,
  value,
  onChange,
  label,
  disabled = false,
  id,
}) => {
  const generatedId = useId();
  const sliderId = id || generatedId;

  return (
    <div className={`slider-container ${disabled ? 'slider-disabled' : ''}`}>
      {label && (
        <div className="slider-label-row">
          <label htmlFor={sliderId} className="slider-label">
            {label}
          </label>
          <span className="slider-value">{value}</span>
        </div>
      )}
      <input
        id={sliderId}
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        disabled={disabled}
        className="slider-input"
      />
    </div>
  );
};

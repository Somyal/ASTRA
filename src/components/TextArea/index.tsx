import React, { useId } from 'react';
import './TextArea.css';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const TextArea: React.FC<TextAreaProps> = ({
  label,
  error,
  id,
  className = '',
  disabled,
  ...props
}) => {
  const generatedId = useId();
  const inputId = id || generatedId;
  const errorId = `${inputId}-error`;

  return (
    <div className={`textarea-container ${error ? 'textarea-has-error' : ''} ${className}`}>
      {label && (
        <label htmlFor={inputId} className="textarea-label">
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        className="textarea-field"
        disabled={disabled}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        {...props}
      />
      {error && (
        <span id={errorId} className="textarea-error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
};

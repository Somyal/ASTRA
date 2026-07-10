import React from 'react';
import './Divider.css';

interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  className = '',
}) => {
  return (
    <div
      role="separator"
      aria-orientation={orientation}
      className={`divider divider-${orientation} ${className}`}
    />
  );
};

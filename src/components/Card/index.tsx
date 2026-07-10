import React from 'react';
import './Card.css';

interface CardProps {
  children: React.ReactNode;
  variant?: 'flat' | 'raised' | 'glass';
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'flat',
  className = '',
}) => {
  return (
    <div className={`card card-${variant} ${className}`}>
      {children}
    </div>
  );
};

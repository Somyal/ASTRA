import React from 'react';
import './ScrollArea.css';

interface ScrollAreaProps {
  children: React.ReactNode;
  maxHeight?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const ScrollArea: React.FC<ScrollAreaProps> = ({
  children,
  maxHeight,
  className = '',
  style,
}) => {
  return (
    <div
      className={`scroll-area ${className}`}
      style={{ maxHeight, ...style }}
    >
      {children}
    </div>
  );
};

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import './IconButton.css';

interface IconButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary' | 'ghost';
  ariaLabel: string;
}

export const IconButton: React.FC<IconButtonProps> = ({
  children,
  variant = 'secondary',
  ariaLabel,
  disabled,
  ...props
}) => {
  return (
    <motion.button
      className={`icon-btn icon-btn-${variant}`}
      whileTap={disabled ? undefined : { scale: 0.92 }}
      aria-label={ariaLabel}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  );
};

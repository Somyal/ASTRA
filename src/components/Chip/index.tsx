import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import './Chip.css';

interface ChipProps {
  label: string;
  onClose?: () => void;
  onClick?: () => void;
  active?: boolean;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  onClose,
  onClick,
  active = false,
}) => {
  return (
    <motion.div
      layout
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      transition={{ duration: 0.15 }}
      className={`chip ${active ? 'chip-active' : ''} ${onClick ? 'chip-clickable' : ''}`}
      onClick={onClick}
    >
      <span className="chip-label">{label}</span>
      {onClose && (
        <button
          type="button"
          aria-label={`Remove ${label}`}
          className="chip-close-btn"
          onClick={e => {
            e.stopPropagation();
            onClose();
          }}
        >
          <X size={12} />
        </button>
      )}
    </motion.div>
  );
};

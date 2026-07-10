import React from 'react';
import { motion } from 'framer-motion';
import './ProgressBar.css';

interface ProgressBarProps {
  value: number; // 0 to 100
  label?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ value, label }) => {
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div className="progress-container">
      {label && (
        <div className="progress-label-row">
          <span className="progress-label">{label}</span>
          <span className="progress-percentage">{Math.round(clampedValue)}%</span>
        </div>
      )}
      <div
        className="progress-track"
        role="progressbar"
        aria-valuenow={clampedValue}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <motion.div
          className="progress-bar"
          initial={{ width: 0 }}
          animate={{ width: `${clampedValue}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
};

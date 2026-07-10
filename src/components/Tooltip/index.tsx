import React, { useState, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Tooltip.css';

interface TooltipProps {
  text: string;
  children: React.ReactElement;
}

export const Tooltip: React.FC<TooltipProps> = ({ text, children }) => {
  const [visible, setVisible] = useState(false);
  const generatedId = useId();
  const tooltipId = generatedId;

  // Clone child element to inject event listeners & accessibility attributes
  const triggerElement = React.cloneElement(children, {
    'aria-describedby': tooltipId,
    onMouseEnter: () => setVisible(true),
    onMouseLeave: () => setVisible(false),
    onFocus: () => setVisible(true),
    onBlur: () => setVisible(false),
  } as React.HTMLProps<HTMLElement>);

  return (
    <div className="tooltip-wrapper">
      {triggerElement}
      <AnimatePresence>
        {visible && (
          <motion.div
            id={tooltipId}
            role="tooltip"
            initial={{ opacity: 0, scale: 0.95, y: 5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 5 }}
            transition={{ duration: 0.12 }}
            className="tooltip-content"
          >
            {text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

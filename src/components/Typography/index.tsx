import React from 'react';
import './Typography.css';

export type TypographyVariant =
  | 'display'
  | 'heading'
  | 'title'
  | 'subtitle'
  | 'body'
  | 'caption'
  | 'label';

interface TypographyProps {
  id?: string;
  variant?: TypographyVariant;
  color?: 'primary' | 'secondary' | 'muted' | 'accent';
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  htmlFor?: string; // Support for label tags
}

const getElement = (variant: TypographyVariant): 'h1' | 'h2' | 'h3' | 'h4' | 'span' | 'label' | 'p' => {
  switch (variant) {
    case 'display':
      return 'h1';
    case 'heading':
      return 'h2';
    case 'title':
      return 'h3';
    case 'subtitle':
      return 'h4';
    case 'caption':
      return 'span';
    case 'label':
      return 'label';
    default:
      return 'p';
  }
};

export const Typography: React.FC<TypographyProps> = ({
  id,
  variant = 'body',
  color = 'primary',
  children,
  className = '',
  style,
  htmlFor,
}) => {
  const Tag = getElement(variant);

  return React.createElement(
    Tag,
    {
      id,
      style,
      htmlFor: Tag === 'label' ? htmlFor : undefined,
      className: `typography typography-${variant} color-${color} ${className}`,
    },
    children
  );
};

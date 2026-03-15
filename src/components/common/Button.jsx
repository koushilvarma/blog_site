import React from 'react';
import styles from './Common.module.css';

export const Button = ({ 
  children, 
  variant = 'primary', // primary, secondary, outline, ghost
  size = 'md', // sm, md, lg
  disabled = false,
  className = '',
  type = 'button',
  ...props 
}) => {
  const variantClass = styles[`btn-${variant}`];
  const sizeClass = styles[`btn-${size}`];
  
  return (
    <button 
      type={type}
      className={`${styles.btn} ${variantClass} ${sizeClass} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

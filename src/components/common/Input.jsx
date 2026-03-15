import React, { forwardRef } from 'react';
import styles from './Common.module.css';

export const Input = forwardRef(({ 
  label, 
  error, 
  id, 
  className = '',
  as = 'input', // input or textarea
  type = 'text',
  rows,
  ...props 
}, ref) => {
  const Component = as;
  return (
    <div className={`${styles.inputWrapper} ${className}`}>
      {label && <label htmlFor={id} className={styles.inputLabel}>{label}</label>}
      <Component 
        id={id}
        ref={ref}
        type={as === 'input' ? type : undefined}
        rows={as === 'textarea' ? rows || 4 : undefined}
        className={`${styles.inputField} ${error ? styles.inputError : ''}`}
        {...props}
      />
      {error && <span className={styles.inputErrorMessage}>{error}</span>}
    </div>
  );
});

Input.displayName = 'Input';

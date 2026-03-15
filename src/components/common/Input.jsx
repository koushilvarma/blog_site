import React, { forwardRef } from 'react';
import styles from './Common.module.css';

export const Input = forwardRef(({ 
  label, 
  error, 
  as = 'input', // input or textarea
  ...props 
}, ref) => {
  const Component = as;
  return (
    <div className={styles.inputWrapper}>
      {label && <label className={styles.label}>{label}</label>}
      <Component 
        ref={ref}
        className={`${styles.input} ${error ? styles.inputError : ''}`}
        {...props}
      />
      {error && <span className={styles.inputErrorMessage}>{error}</span>}
    </div>
  );
});

Input.displayName = 'Input';

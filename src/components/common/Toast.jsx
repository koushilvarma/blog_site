import React from 'react';
import { X } from 'lucide-react';
import styles from './Common.module.css';

export const Toast = ({ message, type = 'info', onClose }) => {
  const typeClass = styles[`toast-${type}`] || styles[`toast-info`];
  return (
    <div className={`${styles.toast} ${typeClass}`}>
      <span>{message}</span>
      <button onClick={onClose} className={styles.toastClose} aria-label="Close toast">
        <X size={16} />
      </button>
    </div>
  );
};

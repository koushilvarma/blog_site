import React from 'react';
import styles from './Common.module.css';

export const Avatar = ({ src, alt = 'Avatar', size = 'md', className = '' }) => {
  const sizeClass = styles[`avatar-${size}`];
  return (
    <div className={`${styles.avatar} ${sizeClass} ${className}`}>
      <img src={src} alt={alt} />
    </div>
  );
};

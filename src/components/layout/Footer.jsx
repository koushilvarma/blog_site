import React from 'react';
import styles from './Layout.module.css';

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerContainer}`}>
        <p className={styles.footerText}>
          &copy; {new Date().getFullYear()} Inkwell. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

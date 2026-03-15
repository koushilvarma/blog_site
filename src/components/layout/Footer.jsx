import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Layout.module.css';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerContent}`}>
        <div className={styles.footerBrand}>
          <Link to="/" className={styles.logo}>Inkwell.</Link>
          <p className={styles.tagline}>Read. Write. Inspire.</p>
        </div>
        
        <nav className={styles.footerNav}>
          <Link to="/" className={styles.footerLink}>Home</Link>
          <Link to="/create" className={styles.footerLink}>Write</Link>
          <Link to="/bookmarks" className={styles.footerLink}>Bookmarks</Link>
        </nav>
        
        <div className={styles.footerMeta}>
          <p>This is a coding project.</p>
          <p>&copy; {currentYear} Inkwell.</p>
        </div>
      </div>
    </footer>
  );
};

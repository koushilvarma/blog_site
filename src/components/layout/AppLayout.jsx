import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import styles from './Layout.module.css';

export const AppLayout = () => {
  const location = useLocation();

  return (
    <div className={styles.appWrapper}>
      <header className={styles.header}>
        <Navbar />
      </header>
      
      <main className={styles.mainContent}>
        <div key={location.pathname} className="pageTransition">
          <Outlet />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

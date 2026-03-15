import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon, Edit3, Bookmark } from 'lucide-react';
import { Button } from '../common/Button';
import { Avatar } from '../common/Avatar';
import styles from './Layout.module.css';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className={styles.header}>
      <div className={`container ${styles.navContainer}`}>
        <Link to="/" className={styles.logo}>Inkwell.</Link>
        
        <nav className={styles.navLinks}>
          <button onClick={toggleTheme} className={styles.iconBtn} aria-label="Toggle dark mode">
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          
          {isAuthenticated ? (
            <>
              <Link to="/create" className={styles.navLink}><Edit3 size={18} /> <span className="hide-mobile">Write</span></Link>
              <Link to="/bookmarks" className={styles.navLink}><Bookmark size={18} /> <span className="hide-mobile">Bookmarks</span></Link>
              <div className={styles.userMenu}>
                <Link to="/profile" aria-label="Profile">
                  <Avatar src={user.avatar} alt={user.name} size="sm" />
                </Link>
                <Button variant="ghost" size="sm" onClick={handleLogout} className="hide-mobile">Sign out</Button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className={styles.navLink}>Sign in</Link>
              <Link to="/signup">
                <Button variant="primary" size="sm">Get Started</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

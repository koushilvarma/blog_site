import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageSquare, Bookmark, Trash2 } from 'lucide-react';
import { calculateReadTime } from '../../utils/readTime';
import { formatTimeAgo } from '../../utils/formatDate';
import { Avatar } from '../common/Avatar';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useToast } from '../../context/ToastContext';
import styles from './PostCard.module.css';

export const PostCard = ({ post, featured = false, showRemove = false, onRemove }) => {
  const [bookmarks, setBookmarks] = useLocalStorage('inkwell_bookmarks', []);
  const addToast = useToast();
  
  if (!post) return null;

  const isBookmarked = bookmarks.includes(post.id);

  const toggleBookmark = (e) => {
    e.preventDefault(); 
    if (isBookmarked) {
      setBookmarks(bookmarks.filter(id => id !== post.id));
      addToast('Removed from bookmarks', 'info');
      if (onRemove) onRemove(post.id);
    } else {
      setBookmarks([...bookmarks, post.id]);
      addToast('Saved to bookmarks', 'success');
    }
  };

  return (
    <article className={`${styles.card} ${featured ? styles.featured : ''}`}>
      {post.coverImage && (
        <div style={{ position: 'relative' }} className={styles.imageLink}>
          <Link to={`/post/${post.id}`} style={{ display: 'block', height: '100%' }}>
            <img src={post.coverImage} alt={post.title} className={styles.image} loading="lazy" />
          </Link>
          <button 
            className={`${styles.bookmarkBtn} ${isBookmarked && !showRemove ? styles.bookmarked : ''}`}
            onClick={toggleBookmark}
            style={showRemove ? { backgroundColor: 'var(--error)' } : {}}
            aria-label={showRemove ? "Remove absolute bookmark" : isBookmarked ? "Remove bookmark" : "Save bookmark"}
            title={showRemove ? "Remove" : isBookmarked ? "Remove from bookmarks" : "Save for later"}
          >
            {showRemove ? <Trash2 size={18} /> : <Bookmark size={18} fill={isBookmarked ? "currentColor" : "none"} />}
          </button>
        </div>
      )}
      
      <div className={styles.content}>
        <div className={styles.meta}>
          <span className={styles.tag}>{post.tags?.[0] || 'General'}</span>
          <span>&middot;</span>
          <span>{calculateReadTime(post.content)}</span>
        </div>
        
        <Link to={`/post/${post.id}`}>
          <h2 className={styles.title}>{post.title}</h2>
          <p className={styles.excerpt}>{post.excerpt}</p>
        </Link>
        
        <div className={styles.footer}>
          <Link to={`/profile/${post.authorId}`} className={styles.author}>
            <Avatar src={post.authorAvatar} size="sm" />
            <div className={styles.authorInfo}>
              <span className={styles.authorName}>{post.authorName}</span>
              <span className={styles.date}>{formatTimeAgo(post.date)}</span>
            </div>
          </Link>
          
          <div className={styles.stats}>
            <span className={styles.stat}><Heart size={16} /> {post.likes?.length || 0}</span>
            <span className={styles.stat}><MessageSquare size={16} /> {post.comments?.length || 0}</span>
          </div>
        </div>
      </div>
    </article>
  );
};

import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageSquare } from 'lucide-react';
import { calculateReadTime } from '../../utils/readTime';
import { formatTimeAgo } from '../../utils/formatDate';
import { Avatar } from '../common/Avatar';
import styles from './PostCard.module.css';

export const PostCard = ({ post, featured = false }) => {
  if (!post) return null;

  return (
    <article className={`${styles.card} ${featured ? styles.featured : ''}`}>
      {post.coverImage && (
        <Link to={`/post/${post.id}`} className={styles.imageLink}>
          <img src={post.coverImage} alt={post.title} className={styles.image} loading="lazy" />
        </Link>
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

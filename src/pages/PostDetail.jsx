import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Heart, MessageSquare, Share2, Bookmark } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { usePosts } from '../context/PostContext';
import { useToast } from '../context/ToastContext';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useReadingProgress } from '../hooks/useReadingProgress';
import { calculateReadTime } from '../utils/readTime';
import { formatDate } from '../utils/formatDate';
import { Avatar } from '../components/common/Avatar';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { CommentSection } from '../components/blog/CommentSection';
import { PostCard } from '../components/blog/PostCard';
import styles from './PostDetail.module.css';

export const PostDetail = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const { posts, deletePost, toggleLike } = usePosts();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [bookmarks, setBookmarks] = useLocalStorage('inkwell_bookmarks', []);
  const completion = useReadingProgress();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [post, setPost] = useState(null);
  const [isLiking, setIsLiking] = useState(false); // Used for pulse animation

  useEffect(() => {
    const foundPost = posts.find((p) => p.id === id);
    if (!foundPost) {
      navigate('/404');
    } else {
      setPost(foundPost);
    }
  }, [id, posts, navigate]);

  if (!post) return null;

  const isAuthor = user && user.id === post.authorId;
  const hasLiked = user ? post.likes.includes(user.id) : false;
  const isBookmarked = bookmarks.includes(post.id);
  
  // Find other posts by this author
  const authorPosts = posts
    .filter(p => p.authorId === post.authorId && p.id !== post.id && p.status !== 'draft')
    .slice(0, 3);

  const handleDelete = () => {
    deletePost(post.id);
    addToast('Post deleted successfully', 'success');
    navigate('/');
  };

  const handleLike = () => {
    if (!isAuthenticated) {
      addToast('Please sign in to like posts', 'info');
      return;
    }
    toggleLike(post.id, user.id);
    
    // Trigger pulse animation
    setIsLiking(true);
    setTimeout(() => setIsLiking(false), 300);
  };

  const toggleBookmark = () => {
    if (!isAuthenticated) {
      addToast('Please sign in to bookmark posts', 'info');
      return;
    }
    if (isBookmarked) {
      setBookmarks(bookmarks.filter(b => b !== post.id));
      addToast('Removed from bookmarks', 'info');
    } else {
      setBookmarks([...bookmarks, post.id]);
      addToast('Saved to bookmarks', 'success');
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    addToast('Link copied to clipboard!', 'success');
  };

  return (
    <>
      <div 
        className={styles.progressBar} 
        style={{ width: `${completion}%` }} 
        aria-hidden="true" 
      />
      
      <div className="container" style={{ maxWidth: '900px' }}>
        {isAuthor && (
          <div className={styles.authorActions}>
            <Link to={`/edit/${post.id}`}>
              <Button variant="outline" size="sm">Edit Post</Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={() => setIsDeleteModalOpen(true)} style={{ color: 'var(--error)' }}>
              Delete Post
            </Button>
          </div>
        )}

        <header className={styles.postHeader}>
          {post.category && (
            <div className={styles.tagsWrapper} style={{ justifyContent: 'center' }}>
              <span className={styles.tag} style={{ color: 'var(--accent-primary)', backgroundColor: 'transparent', border: '1px solid var(--accent-primary)', fontWeight: '600', textTransform: 'uppercase' }}>
                {post.category}
              </span>
            </div>
          )}
          
          <h1 className={styles.postTitle}>{post.title}</h1>
          
          <div className={styles.postMeta}>
            <Link to={`/profile/${post.authorId}`} className={styles.authorInfo}>
              <Avatar src={post.authorAvatar} alt={post.authorName} size="sm" />
              <span>{post.authorName}</span>
            </Link>
            <span>&middot;</span>
            <span>{formatDate(post.date)}</span>
            <span>&middot;</span>
            <span>{calculateReadTime(post.content)}</span>
          </div>
        </header>

        {post.coverImage && (
          <div className={styles.coverImageContainer}>
            <img src={post.coverImage} alt={post.title} className={styles.coverImage} />
          </div>
        )}

        <div className={styles.contentWrapper}>
          <div className={styles.engagementBar}>
            <div className={styles.engagementGroup}>
              <button 
                className={`${styles.actionBtn} ${hasLiked ? styles.active : ''} ${isLiking ? styles.pulse : ''}`} 
                onClick={handleLike}
                aria-label={hasLiked ? "Unlike post" : "Like post"}
              >
                <Heart size={20} fill={hasLiked ? 'currentColor' : 'none'} />
                <span>{post.likes.length}</span>
              </button>
              <div className={styles.actionBtn}>
                <MessageSquare size={20} />
                <span>{post.comments?.length || 0}</span>
              </div>
            </div>
            <div className={styles.engagementGroup}>
              <button 
                className={`${styles.actionBtn} ${isBookmarked ? styles.active : ''}`} 
                onClick={toggleBookmark}
                aria-label={isBookmarked ? "Remove bookmark" : "Save bookmark"}
              >
                <Bookmark size={20} fill={isBookmarked ? 'currentColor' : 'none'} />
              </button>
              <button className={styles.actionBtn} onClick={handleShare} aria-label="Share post">
                <Share2 size={20} />
              </button>
            </div>
          </div>

          <div 
            className={styles.content} 
            dangerouslySetInnerHTML={{ __html: post.content }} 
          />
          
          {post.tags && post.tags.length > 0 && (
            <div className={styles.tagsWrapper} style={{ marginTop: '2rem' }}>
              {post.tags.map((tag) => (
                <span key={tag} className={styles.tag}>#{tag}</span>
              ))}
            </div>
          )}

          <CommentSection post={post} />
        </div>

        {authorPosts.length > 0 && (
          <div className={styles.moreFromAuthor}>
            <h3 className={styles.moreTitle}>More from {post.authorName}</h3>
            <div className={styles.moreGrid}>
              {authorPosts.map(p => (
                <PostCard key={p.id} post={p} />
              ))}
            </div>
          </div>
        )}

        <Modal 
          isOpen={isDeleteModalOpen} 
          onClose={() => setIsDeleteModalOpen(false)}
          title="Delete Post"
        >
          <p>Are you sure you want to delete this post? This action cannot be undone.</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
            <Button variant="ghost" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
            <Button variant="primary" style={{ backgroundColor: 'var(--error)' }} onClick={handleDelete}>
              Yes, Delete
            </Button>
          </div>
        </Modal>
      </div>
    </>
  );
};

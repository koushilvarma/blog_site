import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { usePosts } from '../../context/PostContext';
import { Avatar } from '../common/Avatar';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { formatTimeAgo } from '../../utils/formatDate';
import styles from '../../pages/PostDetail.module.css';

export const CommentSection = ({ post }) => {
  const { user, isAuthenticated } = useAuth();
  const { addComment, deleteComment } = usePosts();
  const [commentText, setCommentText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment(post.id, user, commentText);
    setCommentText('');
  };

  const handleDelete = (commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      deleteComment(post.id, commentId);
    }
  };

  return (
    <div className={styles.commentSection}>
      <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', marginBottom: '1.5rem' }}>
        Comments ({post.comments?.length || 0})
      </h3>

      {isAuthenticated ? (
        <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <Avatar src={user.avatar} size="md" />
            <div style={{ flex: 1 }}>
              <Input
                as="textarea"
                rows={3}
                placeholder="Share your thoughts..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                style={{ marginBottom: '0.5rem' }}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button type="submit" disabled={!commentText.trim()}>Post Comment</Button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div style={{ padding: '1.5rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', textAlign: 'center', marginBottom: '2rem' }}>
          <p style={{ color: 'var(--text-muted)' }}>Sign in to join the discussion.</p>
        </div>
      )}

      <div className={styles.commentList}>
        {post.comments?.map((comment) => (
          <div key={comment.id} className={styles.commentItem}>
            <Avatar src={comment.authorAvatar} size="md" />
            <div className={styles.commentBody}>
              <div className={styles.commentHeader}>
                <span className={styles.commentAuthor}>{comment.authorName}</span>
                <span className={styles.commentDate}>{formatTimeAgo(comment.date)}</span>
              </div>
              <p className={styles.commentText}>{comment.content}</p>
              
              {user?.id === comment.authorId && (
                <div className={styles.commentActions}>
                  <button onClick={() => handleDelete(comment.id)} className={styles.replyBtn} style={{ color: 'var(--error)' }}>
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

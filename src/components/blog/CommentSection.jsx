import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { usePosts } from '../../context/PostContext';
import { useToast } from '../../context/ToastContext';
import { Avatar } from '../common/Avatar';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { formatTimeAgo } from '../../utils/formatDate';
import styles from '../../pages/PostDetail.module.css';

export const CommentSection = ({ post }) => {
  const { user, isAuthenticated } = useAuth();
  const { addComment, deleteComment } = usePosts();
  const { addToast } = useToast();
  
  const [commentText, setCommentText] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment(post.id, user, commentText);
    setCommentText('');
    addToast('Comment posted!', 'success');
  };

  const handleReplySubmit = (e, parentId) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    addComment(post.id, user, replyText, parentId);
    setReplyText('');
    setReplyingTo(null);
    addToast('Reply posted!', 'success');
  };

  const handleDelete = (commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      deleteComment(post.id, commentId);
    }
  };

  const topLevelComments = post.comments?.filter(c => !c.parentId) || [];
  const getReplies = (parentId) => post.comments?.filter(c => c.parentId === parentId) || [];

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
        {topLevelComments.map((comment) => (
          <div key={comment.id} className={styles.commentThread}>
            <div className={styles.commentItem}>
              <Avatar src={comment.authorAvatar} size="md" />
              <div className={styles.commentBody}>
                <div className={styles.commentHeader}>
                  <span className={styles.commentAuthor}>{comment.authorName}</span>
                  <span className={styles.commentDate}>{formatTimeAgo(comment.date)}</span>
                </div>
                <p className={styles.commentText}>{comment.content}</p>
                
                <div className={styles.commentActions}>
                  {isAuthenticated && (
                    <button 
                      onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)} 
                      className={styles.replyBtn}
                    >
                      Reply
                    </button>
                  )}
                  {user?.id === comment.authorId && (
                    <button onClick={() => handleDelete(comment.id)} className={styles.replyBtn} style={{ color: 'var(--error)' }}>
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Reply Input Form */}
            {replyingTo === comment.id && (
              <div className={styles.replyFormBlock}>
                <form onSubmit={(e) => handleReplySubmit(e, comment.id)}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <Avatar src={user?.avatar} size="sm" />
                    <div style={{ flex: 1 }}>
                      <Input
                        as="textarea"
                        rows={2}
                        placeholder={`Replying to ${comment.authorName}...`}
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        style={{ marginBottom: '0.5rem' }}
                        autoFocus
                      />
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        <Button type="button" variant="ghost" size="sm" onClick={() => setReplyingTo(null)}>Cancel</Button>
                        <Button type="submit" size="sm" disabled={!replyText.trim()}>Reply</Button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            )}

            {/* Nested Replies */}
            {getReplies(comment.id).length > 0 && (
              <div className={styles.repliesList}>
                {getReplies(comment.id).map(reply => (
                  <div key={reply.id} className={styles.commentItem}>
                    <Avatar src={reply.authorAvatar} size="sm" />
                    <div className={styles.commentBody}>
                      <div className={styles.commentHeader}>
                        <span className={styles.commentAuthor}>{reply.authorName}</span>
                        <span className={styles.commentDate}>{formatTimeAgo(reply.date)}</span>
                      </div>
                      <p className={styles.commentText}>{reply.content}</p>
                      
                      {user?.id === reply.authorId && (
                        <div className={styles.commentActions}>
                          <button onClick={() => handleDelete(reply.id)} className={styles.replyBtn} style={{ color: 'var(--error)' }}>
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

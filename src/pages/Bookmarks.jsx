import React, { useMemo } from 'react';
import { usePosts } from '../context/PostContext';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { PostCard } from '../components/blog/PostCard';
import { Button } from '../components/common/Button';
import { Link } from 'react-router-dom';
import { Bookmark } from 'lucide-react';
import styles from './Home.module.css'; 

export const Bookmarks = () => {
  const { posts } = usePosts();
  const [bookmarks] = useLocalStorage('inkwell_bookmarks', []);

  const bookmarkedPosts = useMemo(() => {
    return posts.filter(post => bookmarks.includes(post.id) && post.status === 'published');
  }, [posts, bookmarks]);

  const recommendedPosts = useMemo(() => {
    return posts.filter(post => !bookmarks.includes(post.id) && post.status === 'published').slice(0, 3);
  }, [posts, bookmarks]);

  return (
    <div className="container" style={{ maxWidth: '1000px' }}>
      <div style={{ marginBottom: '3rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Bookmark size={32} /> Your Reading List
        </h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
          {bookmarkedPosts.length} {bookmarkedPosts.length === 1 ? 'article' : 'articles'} saved for later.
        </p>
      </div>

      {bookmarkedPosts.length > 0 ? (
        <div className={styles.postsGrid}>
          {bookmarkedPosts.map(post => (
            <PostCard key={post.id} post={post} showRemove={true} />
          ))}
        </div>
      ) : (
        <div style={{ padding: '4rem 0' }}>
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '5rem' }}>
            <Bookmark size={72} style={{ opacity: 0.4, marginBottom: '1.5rem' }} />
            <h3 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-heading)' }}>No bookmarks yet</h3>
            <p style={{ marginTop: '0.5rem', marginBottom: '2rem' }}>Articles you bookmark will appear here for easy access.</p>
            <Link to="/">
              <Button size="lg">Explore Feed</Button>
            </Link>
          </div>

          {recommendedPosts.length > 0 && (
            <div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', marginBottom: '2rem', borderTop: '1px solid var(--border-color)', paddingTop: '3rem' }}>
                Recommended for you
              </h3>
              <div className={styles.postsGrid}>
                {recommendedPosts.map(post => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

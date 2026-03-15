import React, { useMemo } from 'react';
import { usePosts } from '../context/PostContext';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { PostCard } from '../components/blog/PostCard';
import { Link } from 'react-router-dom';
import { Bookmark } from 'lucide-react';
import styles from './Home.module.css'; // Reusing some grid styles

export const Bookmarks = () => {
  const { posts } = usePosts();
  const [bookmarks] = useLocalStorage('inkwell_bookmarks', []);

  const bookmarkedPosts = useMemo(() => {
    return posts.filter(post => bookmarks.includes(post.id) && post.status === 'published');
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
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted)' }}>
          <Bookmark size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
          <h3>No bookmarks yet</h3>
          <p style={{ marginTop: '0.5rem', marginBottom: '2rem' }}>Articles you bookmark will appear here.</p>
          <Link to="/">
            <button className="btn btn-primary btn-md">Explore Feed</button>
          </Link>
        </div>
      )}
    </div>
  );
};

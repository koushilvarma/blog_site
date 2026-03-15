import React, { useMemo, useState } from 'react';
import { usePosts } from '../context/PostContext';
import { usePagination } from '../hooks/usePagination';
import { useDebounce } from '../hooks/useDebounce';
import { PostCard } from '../components/blog/PostCard';
import { PostCardSkeleton } from '../components/blog/PostCardSkeleton';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Search } from 'lucide-react';
import styles from './Home.module.css';

export const Home = () => {
  const { posts } = usePosts();
  const publishedPosts = useMemo(() => posts.filter(p => p.status === 'published'), [posts]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTag, setActiveTag] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const debouncedSearch = useDebounce(searchTerm, 300);

  const [isLoading, setIsLoading] = useState(true);

  // Simulate remote fetch for skeletons
  React.useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, [debouncedSearch, activeTag, sortBy]);

  // Extract all tags for the tag cloud
  const allTags = useMemo(() => {
    const tags = new Set();
    publishedPosts.forEach(post => {
      post.tags?.forEach(t => tags.add(t.toLowerCase()));
    });
    return Array.from(tags).slice(0, 15); // Top 15 tags
  }, [publishedPosts]);

  // Trending posts (most liked)
  const trendingPosts = useMemo(() => {
    return [...publishedPosts].sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0)).slice(0, 4);
  }, [publishedPosts]);

  // Filtering & Sorting
  const filteredAndSortedPosts = useMemo(() => {
    let result = [...publishedPosts];

    if (debouncedSearch) {
      const lowerSearch = debouncedSearch.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(lowerSearch) || 
        p.excerpt.toLowerCase().includes(lowerSearch) ||
        p.authorName.toLowerCase().includes(lowerSearch)
      );
    }

    if (activeTag) {
      result = result.filter(p => p.tags?.map(t => t.toLowerCase()).includes(activeTag));
    }

    if (sortBy === 'latest') {
      result.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortBy === 'oldest') {
      result.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (sortBy === 'liked') {
      result.sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0));
    } else if (sortBy === 'commented') {
      result.sort((a, b) => (b.comments?.length || 0) - (a.comments?.length || 0));
    }

    return result;
  }, [publishedPosts, debouncedSearch, activeTag, sortBy]);

  // Featured post is the first one if sorting by latest and no filters applied
  const isDefaultView = !debouncedSearch && !activeTag && sortBy === 'latest';
  const featuredPost = (isDefaultView && filteredAndSortedPosts.length > 0) ? filteredAndSortedPosts[0] : null;
  
  // Pagination (exclude featured post if it exists from the normal feed)
  const postsForPagination = isDefaultView ? filteredAndSortedPosts.slice(1) : filteredAndSortedPosts;
  const { currentData, next, prev, currentPage, maxPage } = usePagination(postsForPagination, 6);
  const paginatedPosts = currentData();

  return (
    <div className="container">
      <div className={styles.homeLayout}>
        
        {/* Main Feed Activity */}
        <section>
          {featuredPost && (
            <div style={{ marginBottom: '4rem' }}>
              {isLoading ? (
                <PostCardSkeleton />
              ) : (
                <PostCard post={featuredPost} featured={true} />
              )}
            </div>
          )}

          <div className={styles.feedHeader}>
            <h2 className={styles.feedTitle}>
              {debouncedSearch ? `Search results for "${debouncedSearch}"` : 
               activeTag ? `Posts tagged with "${activeTag}"` : 'Latest Reading'}
            </h2>
            <div className={styles.filters}>
              <div className={styles.tabPills}>
                {['latest', 'oldest', 'liked', 'commented'].map(tab => (
                  <button
                    key={tab}
                    className={`${styles.tabPill} ${sortBy === tab ? styles.activeTab : ''}`}
                    onClick={() => setSortBy(tab)}
                  >
                    {tab === 'latest' ? 'Latest' : tab === 'oldest' ? 'Oldest' : tab === 'liked' ? 'Most Liked' : 'Most Commented'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className={styles.postsGrid}>
              {[1, 2, 3, 4, 5, 6].map((n) => <PostCardSkeleton key={n} />)}
            </div>
          ) : paginatedPosts.length > 0 ? (
            <>
              <div className={styles.postsGrid}>
                {paginatedPosts.map(post => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
              
              {maxPage > 1 && (
                <div className={styles.pagination}>
                  <Button variant="outline" onClick={prev} disabled={currentPage === 1}>Previous</Button>
                  <span className={styles.pageInfo}>Page {currentPage} of {maxPage}</span>
                  <Button variant="outline" onClick={next} disabled={currentPage === maxPage}>Next</Button>
                </div>
              )}
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
              <p>No posts found. Try adjusting your search or filters.</p>
              {(debouncedSearch || activeTag) && (
                <Button variant="ghost" onClick={() => { setSearchTerm(''); setActiveTag(''); }} style={{ marginTop: '1rem' }}>
                  Clear Filters
                </Button>
              )}
            </div>
          )}
        </section>

        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarSection}>
            <div style={{ position: 'relative' }} className={styles.searchBar}>
              <Input 
                placeholder="Search articles..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search size={18} style={{ position: 'absolute', right: '12px', top: '12px', color: 'var(--text-muted)' }} />
            </div>
          </div>

          <div className={styles.sidebarSection}>
            <h3>Discover Topics</h3>
            <div className={styles.tagCloud}>
              <button 
                className={`${styles.tagBtn} ${!activeTag ? styles.active : ''}`}
                onClick={() => setActiveTag('')}
              >
                All
              </button>
              {allTags.map(tag => (
                <button 
                  key={tag} 
                  className={`${styles.tagBtn} ${activeTag === tag ? styles.active : ''}`}
                  onClick={() => setActiveTag(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {trendingPosts.length > 0 && (
            <div className={styles.sidebarSection}>
              <h3>Trending Selected</h3>
              <div className={styles.trendingList}>
                {trendingPosts.map(post => (
                  <div key={post.id} className={styles.trendingItem}>
                    <a href={`/post/${post.id}`}>
                      <h4>{post.title}</h4>
                    </a>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{post.likes?.length || 0} Likes</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>

      </div>
    </div>
  );
};

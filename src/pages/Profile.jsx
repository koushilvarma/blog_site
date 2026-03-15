import React, { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { usePosts } from '../context/PostContext';
import { useToast } from '../context/ToastContext';
import { Avatar } from '../components/common/Avatar';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { PostCard } from '../components/blog/PostCard';
import { formatDate } from '../utils/formatDate';
import styles from './Profile.module.css';

export const Profile = () => {
  const { user, updateProfile } = useAuth();
  const { posts } = usePosts();
  const { addToast } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('posts');
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: user?.name || '',
      bio: user?.bio || '',
      avatar: user?.avatar || ''
    }
  });

  if (!user) return null;

  const publishedPosts = posts.filter(post => post.authorId === user.id && post.status === 'published');
  const draftPosts = posts.filter(post => post.authorId === user.id && post.status === 'draft');
  const likedPosts = posts.filter(post => post.likes?.includes(user.id) && post.status === 'published');

  const totalLikes = publishedPosts.reduce((acc, post) => acc + (post.likes?.length || 0), 0);
  
  // Calculate total read time (assuming 200 words per min avg)
  const totalWords = publishedPosts.reduce((acc, post) => {
    const text = post.content.replace(/<[^>]*>?/gm, '');
    return acc + (text.split(/\s+/).filter(Boolean).length);
  }, 0);
  const totalReadTime = Math.ceil(totalWords / 200);

  const onSubmit = (data) => {
    updateProfile(data);
    setIsEditing(false);
    addToast('Profile updated successfully', 'success');
  };

  // Deterministic css gradient based on username
  const gradientSeed = user.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const gradientBanner = `linear-gradient(135deg, hsl(${gradientSeed % 360}, 70%, 40%), hsl(${(gradientSeed + 60) % 360}, 70%, 15%))`;

  const renderActiveTabContent = () => {
    let displayList = [];
    let emptyMsg = "";
    
    switch (activeTab) {
      case 'posts':
        displayList = publishedPosts;
        emptyMsg = "You haven't published any posts yet.";
        break;
      case 'liked':
        displayList = likedPosts;
        emptyMsg = "You haven't liked any posts yet.";
        break;
      case 'drafts':
        displayList = draftPosts;
        emptyMsg = "You have no saved drafts.";
        break;
      default:
        break;
    }

    if (displayList.length === 0) {
      return (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
          <p>{emptyMsg}</p>
          {activeTab === 'posts' && (
            <Button variant="outline" style={{ marginTop: '1.5rem' }} onClick={() => window.location.href='/create'}>
              Write your first post
            </Button>
          )}
        </div>
      );
    }

    return (
      <div className={styles.postsGrid}>
        {displayList.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    );
  };

  return (
    <div className={`container`}>
      <div className={styles.bannerImage} style={{ background: gradientBanner }} />
      
      <div className={styles.profileHeader}>
        <div className={styles.avatarWrapper}>
          <Avatar src={user.avatar} alt={user.name} size="xl" />
        </div>
        
        <div className={styles.profileInfo}>
          {!isEditing ? (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h1 className={styles.profileName}>{user.name}</h1>
                  <p className={styles.profileBio}>{user.bio || 'No bio provided. Edit your profile to add one!'}</p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditing(true)}
                  className={styles.editProfileBtn}
                >
                  Edit Profile
                </Button>
              </div>
              
              <div className={styles.profileStats}>
                <div className={styles.statItem}>
                  <strong>{publishedPosts.length}</strong> 
                  <span>Posts</span>
                </div>
                <div className={styles.statDivider} />
                <div className={styles.statItem}>
                  <strong>{totalLikes}</strong> 
                  <span>Likes</span>
                </div>
                <div className={styles.statDivider} />
                <div className={styles.statItem}>
                  <strong>{totalReadTime}m</strong> 
                  <span>Read Time</span>
                </div>
                <div className={styles.statDivider} />
                <div className={styles.statItem}>
                  <strong>{formatDate(user.joinDate)}</strong> 
                  <span>Joined</span>
                </div>
              </div>
            </>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className={styles.editForm}>
              <h2 style={{ marginBottom: '1.5rem', fontFamily: 'var(--font-heading)' }}>Edit Profile</h2>
              <Input 
                label="Full Name" 
                {...register('name', { required: 'Name is required' })}
                error={errors.name?.message}
              />
              <Input 
                label="Bio" 
                as="textarea"
                rows={4}
                placeholder="Tell us about yourself..."
                {...register('bio')} 
              />
              <Input 
                label="Avatar URL" 
                placeholder="https://example.com/avatar.jpg"
                {...register('avatar')} 
              />
              
              <div className={styles.formActions}>
                <Button type="button" variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          )}
        </div>
      </div>

      <div className={styles.profileTabs}>
        <button 
          className={`${styles.tabBtn} ${activeTab === 'posts' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('posts')}
        >
          Posts
        </button>
        <button 
          className={`${styles.tabBtn} ${activeTab === 'liked' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('liked')}
        >
          Liked
        </button>
        <button 
          className={`${styles.tabBtn} ${activeTab === 'drafts' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('drafts')}
        >
          Drafts
        </button>
      </div>

      <div className={styles.postsSection}>
        {renderActiveTabContent()}
      </div>
    </div>
  );
};

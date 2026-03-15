import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { usePosts } from '../context/PostContext';
import { useToast } from '../context/ToastContext';
import { Avatar } from '../components/common/Avatar';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { formatDate } from '../utils/formatDate';
import styles from './Profile.module.css';

export const Profile = () => {
  const { user, updateProfile } = useAuth();
  const { posts } = usePosts();
  const { addToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: user?.name || '',
      bio: user?.bio || '',
      avatar: user?.avatar || ''
    }
  });

  if (!user) return null;

  const userPosts = posts.filter(post => post.authorId === user.id);
  const totalLikes = userPosts.reduce((acc, post) => acc + (post.likes?.length || 0), 0);

  const onSubmit = (data) => {
    updateProfile(data);
    setIsEditing(false);
    addToast('Profile updated successfully', 'success');
  };

  return (
    <div className={`container`}>
      <div className={styles.profileHeader}>
        <Avatar src={user.avatar} alt={user.name} size="xl" />
        
        <div className={styles.profileInfo}>
          {!isEditing ? (
            <>
              <h1 className={styles.profileName}>{user.name}</h1>
              <p className={styles.profileBio}>{user.bio || 'No bio provided. Edit your profile to add one!'}</p>
              
              <div className={styles.profileStats}>
                <div className={styles.statItem}>
                  <strong>{userPosts.length}</strong> Posts
                </div>
                <div className={styles.statItem}>
                  <strong>{totalLikes}</strong> Likes
                </div>
                <div className={styles.statItem}>
                  <strong>{formatDate(user.joinDate)}</strong> Joined
                </div>
              </div>
              
              <Button 
                variant="outline" 
                onClick={() => setIsEditing(true)}
                style={{ marginTop: '2rem' }}
              >
                Edit Profile
              </Button>
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
                <Button variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          )}
        </div>
      </div>

      <div className={styles.postsSection}>
        <h2 className={styles.sectionTitle}>Your Posts</h2>
        {userPosts.length > 0 ? (
          <div>
            {/* We will render a PostList component here later */}
            <p className={styles.profileBio}>You have {userPosts.length} published posts. Display coming soon in the Feed implementation.</p>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
            <p>You haven't published any posts yet.</p>
            <Button variant="outline" style={{ marginTop: '1rem' }} onClick={() => window.location.href='/create'}>
              Write your first post
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePosts } from '../context/PostContext';
import { useToast } from '../context/ToastContext';
import { PostForm } from '../components/blog/PostForm';

export const CreatePost = () => {
  const { user } = useAuth();
  const { addPost } = usePosts();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = (postData) => {
    const newPostId = addPost(postData, user);
    addToast('Post created successfully!', 'success');
    navigate(`/post/${newPostId}`);
  };

  return (
    <div className="container" style={{ maxWidth: '800px' }}>
      <h1 style={{ marginBottom: '2rem', fontFamily: 'var(--font-heading)' }}>Create New Post</h1>
      <PostForm onSubmit={handleSubmit} isEditing={false} />
    </div>
  );
};

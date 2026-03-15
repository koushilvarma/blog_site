import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePosts } from '../context/PostContext';
import { useToast } from '../context/ToastContext';
import { PostForm } from '../components/blog/PostForm';
import { Skeleton } from '../components/common/Skeleton';

export const EditPost = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { posts, updatePost } = usePosts();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);

  useEffect(() => {
    const existingPost = posts.find(p => p.id === id);
    if (!existingPost) {
      addToast('Post not found', 'error');
      navigate('/');
    } else if (existingPost.authorId !== user.id) {
      addToast('Unauthorized to edit this post', 'error');
      navigate('/');
    } else {
      setPost(existingPost);
    }
  }, [id, posts, user.id, navigate, addToast]);

  const handleSubmit = (postData) => {
    updatePost(id, postData);
    addToast('Post updated successfully!', 'success');
    navigate(`/post/${id}`);
  };

  if (!post) {
    return (
      <div className="container" style={{ maxWidth: '800px' }}>
        <Skeleton height="40px" width="50%" style={{ marginBottom: '2rem' }} />
        <Skeleton height="500px" />
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: '800px' }}>
      <h1 style={{ marginBottom: '2rem', fontFamily: 'var(--font-heading)' }}>Edit Post</h1>
      <PostForm initialData={post} onSubmit={handleSubmit} isEditing={true} />
    </div>
  );
};

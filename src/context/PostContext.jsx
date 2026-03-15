import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { generateId } from '../utils/generateId';

const PostContext = createContext();

// Constants
const ACTIONS = {
  ADD_POST: 'ADD_POST',
  UPDATE_POST: 'UPDATE_POST',
  DELETE_POST: 'DELETE_POST',
  LIKE_POST: 'LIKE_POST',
  ADD_COMMENT: 'ADD_COMMENT',
  DELETE_COMMENT: 'DELETE_COMMENT',
  SET_POSTS: 'SET_POSTS', // Used for initializing
};

const postReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_POSTS:
      return action.payload;
    case ACTIONS.ADD_POST:
      return [action.payload, ...state];
    case ACTIONS.UPDATE_POST:
      return state.map(post => 
        post.id === action.payload.id ? { ...post, ...action.payload.updates } : post
      );
    case ACTIONS.DELETE_POST:
      return state.filter(post => post.id !== action.payload);
    case ACTIONS.LIKE_POST:
      return state.map(post => {
        if (post.id === action.payload.postId) {
          const hasLiked = post.likes.includes(action.payload.userId);
          const likes = hasLiked 
            ? post.likes.filter(id => id !== action.payload.userId) 
            : [...post.likes, action.payload.userId];
          return { ...post, likes };
        }
        return post;
      });
    case ACTIONS.ADD_COMMENT:
      return state.map(post => {
        if (post.id === action.payload.postId) {
          return { 
            ...post, 
            comments: [...post.comments, action.payload.comment] 
          };
        }
        return post;
      });
    case ACTIONS.DELETE_COMMENT:
      return state.map(post => {
        if (post.id === action.payload.postId) {
          return {
            ...post,
            comments: post.comments.filter(c => c.id !== action.payload.commentId)
          };
        }
        return post;
      });
    default:
      return state;
  }
};

export const PostProvider = ({ children }) => {
  const [storedPosts, setStoredPosts] = useLocalStorage('inkwell_posts', []);
  const [posts, dispatch] = useReducer(postReducer, storedPosts);

  // Sync reducer state back to localStorage
  useEffect(() => {
    setStoredPosts(posts);
  }, [posts, setStoredPosts]);

  const addPost = (postData, author) => {
    const newPost = {
      id: generateId(),
      ...postData,
      authorId: author.id,
      authorName: author.name,
      authorAvatar: author.avatar,
      date: new Date().toISOString(),
      likes: [],
      comments: []
    };
    dispatch({ type: ACTIONS.ADD_POST, payload: newPost });
    return newPost.id;
  };

  const updatePost = (id, updates) => {
    dispatch({ type: ACTIONS.UPDATE_POST, payload: { id, updates } });
  };

  const deletePost = (id) => {
    dispatch({ type: ACTIONS.DELETE_POST, payload: id });
  };

  const toggleLike = (postId, userId) => {
    dispatch({ type: ACTIONS.LIKE_POST, payload: { postId, userId } });
  };

  const addComment = (postId, user, content) => {
    const comment = {
      id: generateId(),
      authorId: user.id,
      authorName: user.name,
      authorAvatar: user.avatar,
      content,
      date: new Date().toISOString()
    };
    dispatch({ type: ACTIONS.ADD_COMMENT, payload: { postId, comment } });
  };

  const deleteComment = (postId, commentId) => {
    dispatch({ type: ACTIONS.DELETE_COMMENT, payload: { postId, commentId } });
  };

  return (
    <PostContext.Provider value={{ 
      posts, 
      addPost, 
      updatePost, 
      deletePost, 
      toggleLike, 
      addComment, 
      deleteComment
    }}>
      {children}
    </PostContext.Provider>
  );
};

export const usePosts = () => {
  const context = useContext(PostContext);
  if (!context) throw new Error('usePosts must be used within PostProvider');
  return context;
};

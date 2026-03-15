import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { TagInput } from './TagInput';
import { useTextSelection } from '../../hooks/useTextSelection';
import { useDebounce } from '../../hooks/useDebounce';
import { useToast } from '../../context/ToastContext';
import { Bold, Italic, Heading, Code, Quote, Link2, Image as ImageIcon } from 'lucide-react';
import styles from './Blog.module.css';

const CATEGORIES = ['Technology', 'Travel', 'Mental Health', 'Science', 'Book Reviews', 'Programming', 'Literature', 'Space'];
const DRAFT_KEY = 'inkwell_draft';

export const PostForm = ({ initialData, onSubmit, isEditing }) => {
  const [tags, setTags] = useState(initialData?.tags || []);
  const [hasDraft, setHasDraft] = useState(false);
  const contentRef = useRef(null);
  const { insertText } = useTextSelection(contentRef);
  const addToast = useToast();

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm({
    defaultValues: {
      title: initialData?.title || '',
      coverImage: initialData?.coverImage || '',
      excerpt: initialData?.excerpt || '',
      content: initialData?.content?.replace(/<[^>]*>?/gm, '') || '', // Stripping HTML if seeded data had it, otherwise raw markdown
      category: initialData?.category || CATEGORIES[0],
    }
  });

  const watchAllFields = watch();
  const coverImageUrl = watch('coverImage');
  const excerptValue = watch('excerpt') || '';
  const debouncedCover = useDebounce(coverImageUrl, 500);

  // Autosave Draft Logic
  useEffect(() => {
    if (isEditing) return;
    
    const savedDraft = localStorage.getItem(DRAFT_KEY);
    if (savedDraft) {
      setHasDraft(true);
    }

    const interval = setInterval(() => {
      const currentData = watch();
      if (currentData.title || currentData.content) {
        localStorage.setItem(DRAFT_KEY, JSON.stringify({ ...currentData, tags }));
        addToast('Draft saved', 'info');
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [isEditing, watch, tags, addToast]);

  const restoreDraft = () => {
    try {
      const draft = JSON.parse(localStorage.getItem(DRAFT_KEY));
      if (draft) {
        reset({
          title: draft.title || '',
          coverImage: draft.coverImage || '',
          excerpt: draft.excerpt || '',
          content: draft.content || '',
          category: draft.category || CATEGORIES[0],
        });
        setTags(draft.tags || []);
        addToast('Draft restored', 'success');
        setHasDraft(false);
      }
    } catch(e) {
      console.error("Failed to restore draft", e);
    }
  };

  const discardDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
    setHasDraft(false);
    addToast('Draft discarded', 'info');
  };

  const handleFormSubmit = (status) => (data) => {
    if (!isEditing) {
       localStorage.removeItem(DRAFT_KEY);
       setHasDraft(false);
    }
    onSubmit({
      ...data,
      tags,
      status
    });
  };

  const toolbarButtons = [
    { icon: <Bold size={16} />, action: () => insertText('**', '**'), label: "Bold" },
    { icon: <Italic size={16} />, action: () => insertText('*', '*'), label: "Italic" },
    { icon: <Heading size={16} />, action: () => insertText('### ', ''), label: "Heading" },
    { icon: <Code size={16} />, action: () => insertText('`', '`'), label: "Inline Code" },
    { icon: <Quote size={16} />, action: () => insertText('> ', ''), label: "Blockquote" },
    { icon: <Link2 size={16} />, action: () => insertText('[', '](url)'), label: "Link" },
  ];

  const { ref: registerContentRef, ...contentRest } = register('content', { required: 'Post content is required' });

  return (
    <form className={styles.postForm}>
      {!isEditing && hasDraft && (
        <div className={styles.draftBanner}>
          <div>
            <strong style={{ color: 'var(--text-primary)' }}>Unsaved Draft</strong>
            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>You have an unsaved draft. Restore it?</p>
          </div>
          <div className={styles.draftBannerActions}>
            <Button type="button" variant="ghost" size="sm" onClick={discardDraft}>Discard</Button>
            <Button type="button" size="sm" onClick={restoreDraft}>Restore</Button>
          </div>
        </div>
      )}

      <Input
        label="Post Title"
        placeholder="My Awesome Blog Post"
        error={errors.title?.message}
        {...register('title', { required: 'Title is required' })}
      />
      
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '1.5rem' }}>
        <Input
          label="Category"
          as="select"
          error={errors.category?.message}
          {...register('category')}
        >
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </Input>
        
        <Input
          label="Cover Image URL"
          placeholder="https://images.unsplash.com/..."
          {...register('coverImage')}
        />
      </div>

      {debouncedCover && (
        <div className={styles.coverPreviewWrapper}>
          <img 
            src={debouncedCover} 
            alt="Cover preview" 
            className={styles.coverPreviewImg}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.innerHTML = '<div style="display:flex; flex-direction:column; align-items:center; gap:0.5rem;"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg><span>Invalid image URL</span></div>';
            }}
          />
        </div>
      )}
      
      <div style={{ position: 'relative' }}>
        <Input
          label="Short Excerpt"
          as="textarea"
          rows={2}
          placeholder="A brief summary of the post..."
          error={errors.excerpt?.message}
          {...register('excerpt', { 
            required: 'Excerpt is required', 
            maxLength: { value: 200, message: 'Excerpt is too long' } 
          })}
        />
        <span 
          style={{ 
            position: 'absolute', 
            bottom: '10px', 
            right: '10px', 
            fontSize: '0.75rem', 
            color: excerptValue.length > 200 ? 'var(--error)' : 'var(--text-muted)' 
          }}
        >
          {excerptValue.length} / 200
        </span>
      </div>
      
      <div style={{ marginBottom: '1.5rem' }}>
        <label className={styles.editorLabel}>Content</label>
        <div className={styles.markdownToolbar}>
          {toolbarButtons.map((btn, i) => (
            <button
              key={i}
              type="button"
              className={styles.toolbarBtn}
              onClick={btn.action}
              title={btn.label}
              aria-label={btn.label}
            >
              {btn.icon}
            </button>
          ))}
        </div>
        <textarea
          {...contentRest}
          ref={(e) => {
            registerContentRef(e);
            contentRef.current = e;
          }}
          className={`${styles.input} ${styles.textareaWithToolbar} ${errors.content ? styles.inputError : ''}`}
          rows={14}
          placeholder="Write your post here using Markdown..."
          style={{ width: '100%', padding: '1rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', resize: 'vertical', fontFamily: 'monospace' }}
        />
        {errors.content && <span className={styles.inputErrorMessage}>{errors.content.message}</span>}
      </div>
      
      <TagInput tags={tags} setTags={setTags} maxTags={5} />
      
      <div className={styles.formActions}>
        {!isEditing && (
          <Button 
            type="button" 
            variant="outline" 
            size="lg" 
            onClick={handleSubmit(handleFormSubmit('draft'))}
          >
            Save as Draft
          </Button>
        )}
        <Button 
          type="button" 
          size="lg" 
          onClick={handleSubmit(handleFormSubmit('published'))}
        >
          {isEditing ? 'Update Post' : 'Publish Post'}
        </Button>
      </div>
    </form>
  );
};

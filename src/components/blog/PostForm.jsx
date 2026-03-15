import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import styles from './Blog.module.css';

export const PostForm = ({ initialData, onSubmit, isEditing }) => {
  const { register, handleSubmit, control, formState: { errors } } = useForm({
    defaultValues: {
      title: initialData?.title || '',
      coverImage: initialData?.coverImage || '',
      excerpt: initialData?.excerpt || '',
      tags: initialData?.tags?.join(', ') || '',
      status: initialData?.status || 'published',
    }
  });

  const handleFormSubmit = (data) => {
    // Content is handled via Controller, but if we want to grab it, the hookform manages it.
    onSubmit({
      ...data,
      tags: data.tags.split(',').map(tag => tag.trim()).filter(Boolean)
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className={styles.postForm}>
      <Input
        label="Post Title"
        placeholder="My Awesome Blog Post"
        error={errors.title?.message}
        {...register('title', { required: 'Title is required' })}
      />
      
      <Input
        label="Cover Image URL"
        placeholder="https://images.unsplash.com/..."
        {...register('coverImage')}
      />
      
      <Input
        label="Short Excerpt"
        as="textarea"
        rows={2}
        placeholder="A brief summary of the post..."
        error={errors.excerpt?.message}
        {...register('excerpt', { 
          required: 'Excerpt is required', 
          maxLength: { value: 300, message: 'Excerpt is too long' } 
        })}
      />
      
      <div className={styles.editorWrapper}>
        <label className={styles.editorLabel}>Content</label>
        <Controller
          name="content"
          control={control}
          defaultValue={initialData?.content || ''}
          rules={{ required: 'Post content is required' }}
          render={({ field }) => (
            <ReactQuill 
              theme="snow" 
              value={field.value} 
              onChange={field.onChange}
              className={styles.quillEditor}
              modules={{
                toolbar: [
                  [{ 'header': [1, 2, 3, false] }],
                  ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                  [{'list': 'ordered'}, {'list': 'bullet'}],
                  ['link', 'image'],
                  ['clean']
                ],
              }}
            />
          )}
        />
        {errors.content && <span className={styles.editorError}>{errors.content.message}</span>}
      </div>
      
      <Input
        label="Tags (comma separated)"
        placeholder="tech, react, tutorial"
        {...register('tags')}
      />
      
      <div className={styles.statusToggle}>
        <label className={styles.editorLabel}>Status:</label>
        <select {...register('status')} className={styles.selectStatus}>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>
      
      <div className={styles.formActions}>
        <Button type="submit" size="lg">
          {isEditing ? 'Update Post' : 'Publish Post'}
        </Button>
      </div>
    </form>
  );
};

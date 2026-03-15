import React, { useState } from 'react';
import { X } from 'lucide-react';
import styles from './Blog.module.css';

export const TagInput = ({ tags, setTags, maxTags = 5 }) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = inputValue.trim().toLowerCase();
      
      if (newTag && !tags.includes(newTag) && tags.length < maxTags) {
        setTags([...tags, newTag]);
      }
      setInputValue('');
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className={styles.tagInputContainer}>
      <label className={styles.editorLabel}>Tags ({tags.length}/{maxTags})</label>
      
      <div className={styles.tagPillsWrapper}>
        {tags.map(tag => (
          <span key={tag} className={styles.tagPill}>
            {tag}
            <button 
              type="button" 
              onClick={() => removeTag(tag)}
              className={styles.removeTagBtn}
              aria-label={`Remove ${tag} tag`}
            >
              <X size={14} />
            </button>
          </span>
        ))}
        
        {tags.length < maxTags && (
          <input
            type="text"
            className={styles.tagInputField}
            placeholder={tags.length === 0 ? "Type tag and press Enter" : "Add another tag"}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        )}
      </div>
    </div>
  );
};

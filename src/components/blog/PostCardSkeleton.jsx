import React from 'react';
import { Skeleton } from '../common/Skeleton';
import styles from './PostCard.module.css';

export const PostCardSkeleton = () => {
  return (
    <div className={styles.card} aria-hidden="true">
      <div className={styles.imageLink}>
        <Skeleton height="100%" borderRadius="0" />
      </div>
      <div className={styles.content}>
        <div className={styles.meta}>
          <Skeleton width="60px" height="14px" />
          <span>&middot;</span>
          <Skeleton width="40px" height="14px" />
        </div>
        <Skeleton width="90%" height="24px" className={styles.title} />
        <Skeleton width="75%" height="24px" className={styles.title} />
        <div className={styles.excerpt} style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
           <Skeleton width="100%" height="12px" />
           <Skeleton width="100%" height="12px" />
           <Skeleton width="80%" height="12px" />
        </div>
        
        <div className={styles.footer}>
          <div className={styles.author}>
            <Skeleton width="32px" height="32px" borderRadius="50%" />
            <div className={styles.authorInfo} style={{ gap: '0.25rem' }}>
              <Skeleton width="100px" height="12px" />
              <Skeleton width="60px" height="10px" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

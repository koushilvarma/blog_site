import { useState, useEffect } from 'react';

export const useReadingProgress = () => {
  const [completion, setCompletion] = useState(0);

  useEffect(() => {
    const updateScrollCompletion = () => {
      const currentProgress = window.scrollY;
      const scrollHeight = document.body.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        setCompletion(Number((currentProgress / scrollHeight).toFixed(2)) * 100);
      }
    };

    window.addEventListener('scroll', updateScrollCompletion);
    
    // Initial check
    updateScrollCompletion();
    
    return () => window.removeEventListener('scroll', updateScrollCompletion);
  }, []);

  return completion;
};

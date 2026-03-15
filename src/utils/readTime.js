/**
 * Calculates the estimated reading time of text content based on word count.
 * @param {string} content - The markdown or standard text content.
 * @returns {string} - The calculated estimated reading time.
 */
export const calculateReadTime = (content) => {
  if (!content) return '1 min read';
  
  const wordsPerMinute = 200;
  // Strip basic HTML/Markdown tags and get word count
  const textContent = content.replace(/<[^>]*>?/gm, '');
  const words = textContent.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  
  return `${minutes > 0 ? minutes : 1} min read`;
};

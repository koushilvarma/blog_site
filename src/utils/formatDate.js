import { format, formatDistanceToNow } from 'date-fns';

/**
 * Formats a given date to a readable standard string format.
 * @param {string|number|Date} date - The date to format
 * @returns {string} - Formatted date string, e.g., 'Oct 12, 2023'
 */
export const formatDate = (date) => {
  if (!date) return '';
  try {
    return format(new Date(date), 'MMM d, yyyy');
  } catch (error) {
    console.warn('Invalid date format:', date);
    return String(date);
  }
};

/**
 * Formats a given date to indicate distance to the current time.
 * @param {string|number|Date} date - The target date
 * @returns {string} - Formatted distance string, e.g., '2 days ago'
 */
export const formatTimeAgo = (date) => {
  if (!date) return '';
  try {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  } catch (error) {
    console.warn('Invalid date format for time ago:', date);
    return String(date);
  }
};

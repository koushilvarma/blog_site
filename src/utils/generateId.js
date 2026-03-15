import { v4 as uuidv4 } from 'uuid';

/**
 * Generates a unique identifier.
 * @returns {string} - UUID v4 string
 */
export const generateId = () => {
  return uuidv4();
};

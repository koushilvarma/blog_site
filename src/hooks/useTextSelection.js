import { useCallback } from 'react';

export const useTextSelection = (textareaRef) => {
  const insertText = useCallback((prefix, suffix = '') => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;

    const selectedText = text.substring(start, end);
    const hasSelection = start !== end;

    // If there's no selection, put placeholder text
    const textToInsert = hasSelection ? selectedText : 'content';
    const newText = text.substring(0, start) + prefix + textToInsert + suffix + text.substring(end);

    // Update value natively so React Hook Form registers the change
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
    nativeInputValueSetter.call(textarea, newText);
    
    // Dispatch input event to notify listeners (like react-hook-form)
    textarea.dispatchEvent(new Event('input', { bubbles: true }));

    // Set cursor position after inserted text
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + prefix.length + (hasSelection ? selectedText.length : 0);
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);

  }, [textareaRef]);

  return { insertText };
};

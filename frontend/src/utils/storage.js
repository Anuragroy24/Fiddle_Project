const STORAGE_KEYS = {
  TEXT_CONTENT: 'tone_picker_text',
  TONE_SETTINGS: 'tone_picker_settings',
  HISTORY: 'tone_picker_history'
};

export const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.warn('Failed to save to localStorage:', error);
  }
};

export const loadFromStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.warn('Failed to load from localStorage:', error);
    return defaultValue;
  }
};

export const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.warn('Failed to remove from localStorage:', error);
  }
};

export const clearAllStorage = () => {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.warn('Failed to clear localStorage:', error);
  }
};

// Specific storage functions for the app
export const saveTextContent = (text) => {
  saveToStorage(STORAGE_KEYS.TEXT_CONTENT, text);
};

export const loadTextContent = () => {
  return loadFromStorage(STORAGE_KEYS.TEXT_CONTENT, '');
};

export const saveToneSettings = (formalityLevel, friendlinessLevel) => {
  saveToStorage(STORAGE_KEYS.TONE_SETTINGS, { formalityLevel, friendlinessLevel });
};

export const loadToneSettings = () => {
  return loadFromStorage(STORAGE_KEYS.TONE_SETTINGS, { formalityLevel: 0, friendlinessLevel: 0 });
};

export const saveHistory = (history, currentIndex) => {
  saveToStorage(STORAGE_KEYS.HISTORY, { history, currentIndex });
};

export const loadHistory = () => {
  return loadFromStorage(STORAGE_KEYS.HISTORY, null);
};

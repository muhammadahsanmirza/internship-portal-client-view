// utils/localStorage.js

export const saveState = (state) => {
    try {
      const serializedState = JSON.stringify(state);
      localStorage.setItem('userState', serializedState);
    } catch (err) {
      console.error('Error saving state to localStorage:', err);
    }
  };
  
  export const loadState = () => {
    try {
      const serializedState = localStorage.getItem('userState');
      if (serializedState === null) {
        return undefined; // Will use the initial state defined in the reducer
      }
      return JSON.parse(serializedState);
    } catch (err) {
      console.error('Error loading state from localStorage:', err);
      return undefined;
    }
  };
  
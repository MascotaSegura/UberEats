import { useEffect, useRef } from 'react';

class HistoryManager {
  constructor() {
    this.queue = [];
    this.isProcessing = false;
    this.isProgrammaticBack = false;
    this.stack = [];
    
    // Attach listener only once globally
    if (typeof window !== 'undefined') {
      window.addEventListener('popstate', () => {
        if (this.isProgrammaticBack) return;
        
        if (this.stack.length > 0) {
          const top = this.stack.pop();
          if (top && typeof top.onClose === 'function') {
            top.onClose();
          }
        }
      });
    }
  }
  
  push(id, onClose) {
    this.enqueue(() => {
      this.stack.push({ id, onClose });
      // Push state with an identifier to allow proper tracking
      window.history.pushState({ modalId: id }, '');
      return Promise.resolve();
    });
  }
  
  remove(id) {
    this.enqueue(() => {
      const idx = this.stack.findIndex(m => m.id === id);
      if (idx !== -1) {
        // Remove from our stack
        this.stack.splice(idx, 1);
        
        // Trigger a back navigation to clear the history state,
        // while ignoring the resulting popstate event
        this.isProgrammaticBack = true;
        window.history.back();
        
        return new Promise(resolve => setTimeout(() => {
          this.isProgrammaticBack = false;
          resolve();
        }, 50)); // 50ms buffer to let browser process the popstate
      }
      return Promise.resolve();
    });
  }
  
  enqueue(task) {
    this.queue.push(task);
    this.processQueue();
  }
  
  async processQueue() {
    if (this.isProcessing) return;
    this.isProcessing = true;
    while (this.queue.length > 0) {
      const task = this.queue.shift();
      await task();
    }
    this.isProcessing = false;
  }
}

const historyManager = new HistoryManager();
let modalIdCounter = 0;

/**
 * Hook to manage browser history for modals and panels.
 * Ensures the native back button closes the modal instead of exiting the PWA.
 * 
 * @param {boolean} isOpen - Whether the modal is currently open.
 * @param {function} onClose - Function to call to close the modal.
 */
export const useModalHistory = (isOpen, onClose) => {
  const idRef = useRef('');

  useEffect(() => {
    if (!isOpen) return;

    modalIdCounter++;
    const id = `modal-${modalIdCounter}`;
    idRef.current = id;

    // We pass a stable closure for onClose, assuming the parent handles stale closures
    // usually by having onClose not depend on changing state or by using useCallback.
    historyManager.push(id, onClose);

    return () => {
      historyManager.remove(idRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]); // Intentionally omitting onClose to prevent re-pushing if onClose changes
};

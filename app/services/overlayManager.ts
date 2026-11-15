'use client';

/**
 * Global Overlay Registry for Native Android Back Button & Escape key handling
 *
 * Keeps a LIFO stack of currently active modals, drawers, bottom sheets,
 * and dialogs so that pressing the native device back button closes the top-most
 * overlay first rather than closing the app or navigating away.
 */

type OverlayCloseHandler = () => boolean | void;

interface OverlayEntry {
  id: string;
  close: OverlayCloseHandler;
  priority: number;
}

class OverlayManager {
  private stack: OverlayEntry[] = [];
  private listeners: Array<() => void> = [];

  /**
   * Register an open overlay with an optional priority (higher priority closes first)
   */
  register(id: string, close: OverlayCloseHandler, priority: number = 0) {
    // Remove if already registered to avoid duplicates
    this.stack = this.stack.filter((item) => item.id !== id);
    this.stack.push({ id, close, priority });
    this.notify();
  }

  /**
   * Unregister an overlay when it is closed or unmounted
   */
  unregister(id: string) {
    const prevLen = this.stack.length;
    this.stack = this.stack.filter((item) => item.id !== id);
    if (this.stack.length !== prevLen) {
      this.notify();
    }
  }

  /**
   * Check if any overlays are currently open
   */
  hasOpenOverlays(): boolean {
    return this.stack.length > 0;
  }

  /**
   * Number of open overlays
   */
  get count(): number {
    return this.stack.length;
  }

  /**
   * Close the top-most overlay. Returns true if an overlay was found and closed.
   */
  closeTopOverlay(): boolean {
    if (this.stack.length === 0) return false;

    // Pop the topmost overlay
    const top = this.stack.pop();
    if (top) {
      try {
        top.close();
        this.notify();
        return true;
      } catch (err) {
        console.error(`[OverlayManager] Error closing overlay "${top.id}":`, err);
        return false;
      }
    }
    return false;
  }

  /**
   * Subscribe to overlay stack changes
   */
  subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    for (const listener of this.listeners) {
      try {
        listener();
      } catch {
        // ignore
      }
    }
  }
}

export const overlayManager = new OverlayManager();

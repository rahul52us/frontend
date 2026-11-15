'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export interface RouteTrackerState {
  stack: string[];
}

// Global in-memory route history stack accessible across components
class NavigationHistory {
  private stack: string[] = [];
  private listeners: Array<() => void> = [];

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        const saved = sessionStorage.getItem('__app_nav_stack');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            this.stack = parsed;
          }
        }
      } catch {
        // ignore
      }
    }
  }

  get entries(): string[] {
    return [...this.stack];
  }

  get length(): number {
    return this.stack.length;
  }

  get current(): string {
    return this.stack[this.stack.length - 1] || '/';
  }

  get previous(): string | null {
    return this.stack.length > 1 ? this.stack[this.stack.length - 2] : null;
  }

  push(url: string) {
    if (!url) return;
    const last = this.stack[this.stack.length - 1];
    if (last === url) return;

    // Check if user is navigating back to previous entry
    if (this.stack.length > 1 && this.stack[this.stack.length - 2] === url) {
      this.stack.pop();
    } else {
      this.stack.push(url);
      // Keep stack at reasonable length
      if (this.stack.length > 30) {
        this.stack.shift();
      }
    }
    this.persist();
    this.notify();
  }

  /**
   * Return target previous URL and pop the top state
   */
  popToPrevious(): string | null {
    if (this.stack.length <= 1) return null;
    this.stack.pop(); // pop current
    const prev = this.stack[this.stack.length - 1] || null;
    this.persist();
    this.notify();
    return prev;
  }

  pop(): string | null {
    if (this.stack.length <= 1) return null;
    const popped = this.stack.pop() || null;
    this.persist();
    this.notify();
    return popped;
  }

  private persist() {
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem('__app_nav_stack', JSON.stringify(this.stack));
      } catch {
        // ignore
      }
    }
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

  subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }
}

export const navigationHistory = new NavigationHistory();

/**
 * RouteTracker
 * Must be rendered inside Suspense so useSearchParams works reliably during Next.js static generation.
 * Tracks full URLs (path + search query string) into navigationHistory.
 */
export function RouteTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const path = pathname || '/';
    const query = searchParams?.toString();
    const fullUrl = query ? `${path}?${query}` : path;
    navigationHistory.push(fullUrl);
  }, [pathname, searchParams]);

  return null;
}

export default RouteTracker;

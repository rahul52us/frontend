'use client';

import React, { useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useColorMode, useToast } from '@chakra-ui/react';
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';
import { overlayManager } from '../services/overlayManager';
import { navigationHistory } from './RouteTracker';
import stores from '../store/stores';

/**
 * NativeMobileProvider
 *
 * Coordinates:
 * 1. Safe-area top synchronization via Capacitor StatusBar & CSS variables (0px bottom).
 * 2. Status bar styling (Dark / Light icons) matched to the active theme.
 * 3. Android hardware/gesture back-button navigation with overlay dismissal,
 *    nested route traversal, and graceful root exit.
 */
export const NativeMobileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { colorMode } = useColorMode();
  const toast = useToast();

  const lastBackPressRef = useRef<number>(0);
  const historyStackRef = useRef<string[]>([]);
  const currentPathRef = useRef<string>(pathname || '/');

  // Track internal history stack on route changes
  useEffect(() => {
    const current = pathname || '/';
    currentPathRef.current = current;
    const stack = historyStackRef.current;
    if (stack.length === 0 || stack[stack.length - 1] !== current) {
      if (stack.length > 1 && stack[stack.length - 2] === current) {
        stack.pop();
      } else {
        stack.push(current);
      }
    }
  }, [pathname]);

  // Synchronize Status Bar styling with current theme
  useEffect(() => {
    const isDark = colorMode === 'dark';

    const syncStatusBar = async () => {
      try {
        if (!Capacitor.isNativePlatform()) return;

        // Overlay webview so header backgrounds flow into status bar
        await StatusBar.setOverlaysWebView({ overlay: true });

        // Style.Dark: light text/icons for dark background
        // Style.Light: dark text/icons for light background
        await StatusBar.setStyle({
          style: isDark ? Style.Dark : Style.Light,
        });

        if (Capacitor.getPlatform() === 'android') {
          try {
            await StatusBar.setBackgroundColor({
              color: isDark ? '#070B14' : '#FFFFFF',
            });
          } catch {
            // Android 15+ edge-to-edge ignores setBackgroundColor
          }
        }

        // Measure native status bar height and update CSS custom property
        const info = await StatusBar.getInfo();
        if (info && typeof info.height === 'number' && info.height > 0) {
          document.documentElement.style.setProperty(
            '--capacitor-safe-area-top',
            `${info.height}px`
          );
        }
      } catch (err) {
        console.warn('[NativeMobileProvider] StatusBar sync warning:', err);
      }
    };

    syncStatusBar();
  }, [colorMode]);

  // Centralized Hardware / Gesture Back Button Handler
  useEffect(() => {
    const handleBackButton = async (eventCanGoBack?: boolean) => {
      // 1. Priority 1: Check and close any open overlay (modal, drawer, sheet, dialog)
      if (overlayManager.hasOpenOverlays()) {
        const closed = overlayManager.closeTopOverlay();
        if (closed) return;
      }

      // 1b. Fallback store check (cart drawer or side drawer)
      if (stores.cartStore?.isCartOpen) {
        stores.cartStore.closeCart();
        return;
      }
      if (stores.layout?.openMobileSideDrawer) {
        stores.layout.setOpenMobileSideDrawer(false);
        return;
      }

      // 2. Priority 2: Nested page navigation
      // Determine current full path and URL
      const currentPath =
        (typeof window !== 'undefined' ? window.location.pathname : '') ||
        pathname ||
        '/';
      const currentSearch =
        typeof window !== 'undefined' ? window.location.search : '';
      const currentFullUrl = currentSearch ? `${currentPath}${currentSearch}` : currentPath;

      const isRoot = (currentPath === '/' || currentPath === '/home') && !currentSearch;

      if (!isRoot) {
        // Check our comprehensive navigationHistory tracker
        const prevUrl = navigationHistory.previous;
        const hasHistory = navigationHistory.length > 1;

        if (prevUrl && hasHistory) {
          // Pop current and navigate to recorded previous route
          navigationHistory.pop();
          router.push(prevUrl);
          return;
        }

        // Fallback to browser history if available
        if (typeof window !== 'undefined' && window.history.length > 1) {
          window.history.back();
          return;
        }

        // Default fallback to home
        router.push('/');
        return;
      }

      // 3. Priority 3: On Root / Home screen -> Exit App with double-press protection
      const now = Date.now();
      if (now - lastBackPressRef.current < 2000) {
        try {
          await App.exitApp();
        } catch {
          // ignore
        }
      } else {
        lastBackPressRef.current = now;
        toast({
          title: 'Press back again to exit',
          status: 'info',
          duration: 2000,
          isClosable: false,
          position: 'bottom',
          variant: 'solid',
        });
      }
    };

    let backButtonHandle: any = null;

    // Register with Capacitor App plugin
    const registerCapacitorBack = async () => {
      try {
        backButtonHandle = await App.addListener('backButton', (data) => {
          handleBackButton(data?.canGoBack);
        });
      } catch (e) {
        console.warn('[NativeMobileProvider] App.addListener error:', e);
      }
    };

    registerCapacitorBack();

    // Redundant fallback: Document 'backbutton' event
    const onDocumentBackButton = (e: any) => {
      e?.preventDefault?.();
      handleBackButton();
    };

    if (typeof document !== 'undefined') {
      document.addEventListener('backbutton', onDocumentBackButton);
    }

    return () => {
      if (backButtonHandle && typeof backButtonHandle.remove === 'function') {
        backButtonHandle.remove();
      }
      if (typeof document !== 'undefined') {
        document.removeEventListener('backbutton', onDocumentBackButton);
      }
    };
  }, [router, toast]);

  // Keyboard Escape key support for Web/Desktop overlay dismissal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && overlayManager.hasOpenOverlays()) {
        overlayManager.closeTopOverlay();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return <>{children}</>;
};

export default NativeMobileProvider;

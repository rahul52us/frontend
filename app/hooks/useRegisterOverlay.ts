'use client';

import { useEffect, useRef } from 'react';
import { overlayManager } from '../services/overlayManager';

/**
 * Hook to automatically register/unregister an overlay (modal, drawer, dialog)
 * with the global OverlayManager for Android native back button support.
 *
 * @param isOpen - Whether the overlay is currently visible
 * @param onClose - The callback function that closes the overlay
 * @param id - Optional unique identifier; auto-generated if omitted
 * @param priority - Optional priority (higher priority closes first)
 */
export function useRegisterOverlay(
  isOpen: boolean,
  onClose: () => void,
  id?: string,
  priority: number = 0
) {
  const generatedId = useRef(id || `overlay_${Math.random().toString(36).substring(2, 9)}`);

  useEffect(() => {
    const overlayId = generatedId.current;
    if (isOpen) {
      overlayManager.register(overlayId, onClose, priority);
      return () => {
        overlayManager.unregister(overlayId);
      };
    } else {
      overlayManager.unregister(overlayId);
    }
  }, [isOpen, onClose, priority]);
}

export default useRegisterOverlay;

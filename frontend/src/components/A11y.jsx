/**
 * Accessibility Utilities - WCAG 2.1 AA Compliance
 * Part of Phase 7: Accessibility & UX Polish (AIC-702)
 */
import { useEffect, useCallback, useState } from 'react';

/**
 * Generate unique ID for ARIA relationships
 */
let idCounter = 0;
export const generateId = (prefix = 'a11y') => {
  idCounter += 1;
  return `${prefix}-${idCounter}`;
};

/**
 * Hook for keyboard navigation within a list/grid
 */
export function useKeyboardNav({
  onSelect,
  onEscape,
  orientation = 'vertical',
  loop = true,
}) {
  const handleKeyDown = useCallback((e, items, currentIndex) => {
    const key = e.key;
    let newIndex = currentIndex;

    const moveNext = () => {
      newIndex = currentIndex + 1;
      if (newIndex >= items.length) newIndex = loop ? 0 : items.length - 1;
    };

    const movePrev = () => {
      newIndex = currentIndex - 1;
      if (newIndex < 0) newIndex = loop ? items.length - 1 : 0;
    };

    if (orientation === 'vertical') {
      if (key === 'ArrowDown') { e.preventDefault(); moveNext(); }
      else if (key === 'ArrowUp') { e.preventDefault(); movePrev(); }
    } else if (orientation === 'horizontal') {
      if (key === 'ArrowRight') { e.preventDefault(); moveNext(); }
      else if (key === 'ArrowLeft') { e.preventDefault(); movePrev(); }
    } else if (orientation === 'grid') {
      if (key === 'ArrowDown') { e.preventDefault(); moveNext(); }
      else if (key === 'ArrowUp') { e.preventDefault(); movePrev(); }
      else if (key === 'ArrowRight') { e.preventDefault(); moveNext(); }
      else if (key === 'ArrowLeft') { e.preventDefault(); movePrev(); }
    }

    if (key === 'Home') { e.preventDefault(); newIndex = 0; }
    if (key === 'End') { e.preventDefault(); newIndex = items.length - 1; }
    if (key === 'Enter' || key === ' ') {
      e.preventDefault();
      onSelect?.(items[newIndex], newIndex);
      return;
    }
    if (key === 'Escape') {
      onEscape?.();
      return;
    }

    // Single character navigation
    if (key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
      const char = key.toLowerCase();
      const matchIndex = items.findIndex((item, i) =>
        i > currentIndex && String(item.label || item.name || item)
          .toLowerCase()
          .startsWith(char)
      );
      if (matchIndex !== -1) newIndex = matchIndex;
    }

    if (newIndex !== currentIndex && items[newIndex]) {
      onSelect?.(items[newIndex], newIndex);
    }
  }, [onSelect, onEscape, orientation, loop]);

  return { handleKeyDown };
}

/**
 * Check if user prefers reduced motion
 */
export const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Announce message to screen readers
 */
export function announceToScreenReader(message, priority = 'polite') {
  const el = document.createElement('div');
  el.setAttribute('aria-live', priority);
  el.setAttribute('aria-atomic', 'true');
  el.setAttribute('role', 'status');
  el.setAttribute('class', 'sr-only');
  el.textContent = message;
  document.body.appendChild(el);

  setTimeout(() => {
    document.body.removeChild(el);
  }, 1000);
}

/**
 * Focus trap utility for modals
 */
export function useFocusTrap(containerRef, isActive = true) {
  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const focusableSelectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])',
    ].join(',');

    const handleKeyDown = (e) => {
      if (e.key !== 'Tab') return;

      const focusable = Array.from(container.querySelectorAll(focusableSelectors));
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    const firstFocusable = container.querySelector(focusableSelectors);
    firstFocusable?.focus();

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  }, [isActive, containerRef]);
}

/**
 * Roving tabindex for list navigation
 */
export function useRovingTabIndex(items, onSelect) {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleKeyDown = (e) => {
    let newIndex = activeIndex;

    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        e.preventDefault();
        newIndex = Math.min(activeIndex + 1, items.length - 1);
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        e.preventDefault();
        newIndex = Math.max(activeIndex - 1, 0);
        break;
      case 'Home':
        e.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        e.preventDefault();
        newIndex = items.length - 1;
        break;
      default:
        return;
    }

    if (newIndex !== activeIndex) {
      setActiveIndex(newIndex);
      onSelect?.(items[newIndex], newIndex);
    }
  };

  return {
    activeIndex,
    setActiveIndex,
    handleKeyDown,
    getItemProps: (index) => ({
      tabIndex: index === activeIndex ? 0 : -1,
      onFocus: () => setActiveIndex(index),
    }),
  };
}


import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowDown, SpinnerGap } from '@phosphor-icons/react';

/**
 * PullToRefresh — for use ONLY on non-modal, full-page scrollable areas
 * (e.g. the main home feed). Do NOT use inside panels that have framer-motion
 * drag="y" (swipe-to-close), as the two gesture systems conflict.
 *
 * State machine: idle → pulling → refreshing → idle
 *                idle → pulling → cancelled → idle
 *
 * Key invariants:
 *  - scrollTop is read once at touchstart. After that, eligibility is fixed
 *    for the entire touch sequence to avoid race conditions.
 *  - Indicator has opacity 0 and scale 0 in idle state. Never partially visible.
 *  - If user pulls then slides back up, progress smoothly returns to 0 (no stuck state).
 *  - e.preventDefault() is held for the duration once pulling starts, so the
 *    browser cannot snap the scroll away mid-gesture.
 */

const THRESHOLD = 72;    // px of pull (after resistance) needed to trigger refresh
const MAX_PULL  = 100;   // max visual travel of the indicator + content
const RESISTANCE = 0.45; // rubber-band dampening factor

const PullToRefresh = ({ onRefresh, children, scrollRef }) => {
  // 'idle' | 'pulling' | 'refreshing'
  const [gestureState, setGestureState] = useState('idle');
  const [pullPx, setPullPx] = useState(0);       // raw translated px for indicator
  const [pullProgress, setPullProgress] = useState(0); // 0..1 for arrow animation

  const containerRef = useRef(null);

  // All gesture tracking via refs — must not trigger re-renders during touchmove
  const startY      = useRef(null);  // null = gesture not eligible
  const startX      = useRef(null);
  const lastY       = useRef(0);
  const axisLocked  = useRef(false);
  const isHoriz     = useRef(false);
  const eligible    = useRef(false); // set once at touchstart, based on scrollTop

  // Mirror gestureState into a ref so event-handlers can read it synchronously
  const stateRef = useRef('idle');
  useEffect(() => { stateRef.current = gestureState; }, [gestureState]);

  const reset = useCallback(() => {
    startY.current     = null;
    startX.current     = null;
    lastY.current      = 0;
    axisLocked.current = false;
    isHoriz.current    = false;
    eligible.current   = false;
  }, []);

  const snapBack = useCallback(() => {
    setPullPx(0);
    setPullProgress(0);
    setGestureState('idle');
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onTouchStart = (e) => {
      if (stateRef.current === 'refreshing') return;

      // Single, definitive read of scrollTop
      const scrollTarget = scrollRef?.current;
      const top = scrollTarget ? scrollTarget.scrollTop : window.scrollY;

      if (top <= 0) {
        eligible.current   = true;
        startY.current     = e.touches[0].clientY;
        startX.current     = e.touches[0].clientX;
        lastY.current      = startY.current;
        axisLocked.current = false;
        isHoriz.current    = false;
      } else {
        eligible.current = false;
        startY.current   = null;
      }
    };

    const onTouchMove = (e) => {
      if (!eligible.current || stateRef.current === 'refreshing') return;

      const y = e.touches[0].clientY;
      const x = e.touches[0].clientX;
      lastY.current = y;

      // Lock axis on first meaningful movement
      if (!axisLocked.current) {
        const dx = Math.abs(x - startX.current);
        const dy = Math.abs(y - startY.current);
        if (dx > 6 || dy > 6) {
          axisLocked.current = true;
          isHoriz.current    = dx > dy;
        }
      }

      if (isHoriz.current) { reset(); return; }
      if (!axisLocked.current) return;

      const rawDy = y - startY.current;

      if (rawDy <= 0) {
        // User came back up — cancel visual pull cleanly
        if (stateRef.current === 'pulling') {
          setPullPx(0);
          setPullProgress(0);
          setGestureState('idle');
          if (e.cancelable) e.preventDefault();
        } else {
          // If they weren't pulling, they are just scrolling normally down the page.
          // Relinquish control to the browser.
          eligible.current = false;
        }
        return;
      }

      // Downward motion — consume the event so browser doesn't scroll
      if (e.cancelable) e.preventDefault();

      const px       = Math.min(rawDy * RESISTANCE, MAX_PULL);
      const progress = Math.min(px / THRESHOLD, 1);

      setPullPx(px);
      setPullProgress(progress);
      setGestureState('pulling');
    };

    const onTouchEnd = async () => {
      if (!eligible.current || stateRef.current === 'refreshing') {
        reset();
        return;
      }

      const rawDy = (lastY.current || 0) - (startY.current || 0);
      const px    = Math.min(rawDy * RESISTANCE, MAX_PULL);
      reset();

      if (px >= THRESHOLD) {
        setGestureState('refreshing');
        setPullProgress(1);
        setPullPx(THRESHOLD * 0.85); // park indicator while loading
        try {
          await onRefresh();
        } finally {
          snapBack();
        }
      } else {
        snapBack();
      }
    };

    container.addEventListener('touchstart',  onTouchStart,  { passive: true });
    container.addEventListener('touchmove',   onTouchMove,   { passive: false });
    container.addEventListener('touchend',    onTouchEnd,    { passive: true });
    container.addEventListener('touchcancel', onTouchEnd,    { passive: true });

    return () => {
      container.removeEventListener('touchstart',  onTouchStart);
      container.removeEventListener('touchmove',   onTouchMove);
      container.removeEventListener('touchend',    onTouchEnd);
      container.removeEventListener('touchcancel', onTouchEnd);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollRef, onRefresh]);

  // Kill the browser's native pull-to-refresh when using window scroll
  useEffect(() => {
    if (!scrollRef) {
      document.body.style.overscrollBehaviorY = 'none';
      return () => { document.body.style.overscrollBehaviorY = 'auto'; };
    }
  }, [scrollRef]);

  const isVisible    = gestureState !== 'idle';
  const isRefreshing = gestureState === 'refreshing';

  // Indicator parks 12px below the top edge when refreshing,
  // otherwise it slides in proportionally to the pull distance.
  const INDICATOR_SIZE = 48;
  const indicatorY = isRefreshing
    ? 12
    : Math.min(pullPx - INDICATOR_SIZE, 8);

  const contentY = isRefreshing ? INDICATOR_SIZE + 12 : pullPx;

  return (
    <div ref={containerRef} className={`relative w-full h-full min-h-full ${gestureState !== 'idle' ? 'overflow-hidden' : 'overflow-visible'}`}>
      {/* Pull indicator — completely invisible (scale 0) at idle */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 w-full flex justify-center z-20"
        style={{
          top: 0,
          transform: `translateY(${indicatorY}px)`,
          transition: isRefreshing ? 'transform 0.25s ease' : 'none',
          opacity: isVisible ? 1 : 0,
        }}
      >
        <div
          className="flex items-center justify-center bg-white rounded-full"
          style={{
            width:  INDICATOR_SIZE,
            height: INDICATOR_SIZE,
            // Scale up as the user pulls — completely zero at idle
            transform: `scale(${isVisible ? 0.6 + pullProgress * 0.4 : 0})`,
            transition: isRefreshing ? 'transform 0.2s ease' : 'none',
          }}
        >
          {isRefreshing ? (
            <SpinnerGap
              size={22}
              color="#06C167"
              weight="bold"
              style={{ animation: 'ptr-spin 0.8s linear infinite' }}
            />
          ) : (
            <ArrowDown
              size={22}
              color="#1E1E1E"
              weight="bold"
              style={{
                transform:  `rotate(${pullProgress >= 1 ? 180 : 0}deg)`,
                transition: 'transform 0.25s ease',
                opacity:    Math.max(0, pullProgress),
              }}
            />
          )}
        </div>
      </div>

      {/* Content — translates down as user pulls */}
      <div
        className="relative w-full min-h-full"
        style={{
          transform:  `translateY(${contentY}px)`,
          // Smooth spring-back only when returning to idle; no transition while dragging
          transition: gestureState === 'idle'
            ? 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
            : 'none',
        }}
      >
        {children}
      </div>

      <style>{`
        @keyframes ptr-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default PullToRefresh;

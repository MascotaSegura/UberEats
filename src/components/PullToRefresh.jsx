import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { ArrowDown, SpinnerGap } from '@phosphor-icons/react';

const PullToRefresh = ({ onRefresh, children, scrollRef, bgClass = "bg-[#F3F4F6]" }) => {
  const [isPulling, setIsPulling] = useState(false);
  const [pullProgress, setPullProgress] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const containerRef = useRef(null);
  const controls = useAnimation();
  
  const startY = useRef(0);
  const startX = useRef(0);
  const currentY = useRef(0);
  const isAxisDetermined = useRef(false);
  const isHorizontal = useRef(false);
  
  const MAX_PULL = 120;
  const THRESHOLD = 80;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleTouchStart = (e) => {
      const scrollTarget = scrollRef?.current;
      const scrollTop = scrollTarget ? scrollTarget.scrollTop : window.scrollY;

      if (scrollTop <= 0) {
        startY.current = e.touches[0].clientY;
        startX.current = e.touches[0].clientX;
        currentY.current = startY.current;
        isAxisDetermined.current = false;
        isHorizontal.current = false;
      } else {
        startY.current = 0;
      }
    };

    const handleTouchMove = (e) => {
      if (startY.current === 0 || isRefreshing) return;
      
      const x = e.touches[0].clientX;
      const y = e.touches[0].clientY;
      const dx = Math.abs(x - startX.current);
      const dy = y - startY.current;

      if (!isAxisDetermined.current) {
        if (dx > 5 || Math.abs(dy) > 5) {
          isAxisDetermined.current = true;
          isHorizontal.current = dx > Math.abs(dy);
        }
      }

      if (isHorizontal.current) {
        startY.current = 0;
        return;
      }

      const scrollTarget = scrollRef?.current;
      const scrollTop = scrollTarget ? scrollTarget.scrollTop : window.scrollY;

      if (dy > 0 && scrollTop <= 0 && isAxisDetermined.current && !isHorizontal.current) {
        if (e.cancelable) e.preventDefault();
        
        setIsPulling(true);
        currentY.current = y;
        
        const pullDistance = dy * 0.4;
        const constrainedPull = Math.min(pullDistance, MAX_PULL);
        
        setPullProgress(Math.min(constrainedPull / THRESHOLD, 1));
        controls.set({ y: constrainedPull });
      }
    };

    const handleTouchEnd = async () => {
      if (startY.current === 0 || isRefreshing) return;
      
      const dy = currentY.current - startY.current;
      const pullDistance = dy * 0.4;
      
      if (pullDistance > THRESHOLD && !isHorizontal.current) {
        setIsRefreshing(true);
        controls.start({ y: 60, transition: { type: 'spring', damping: 25, stiffness: 200 } });
        
        try {
          await onRefresh();
        } finally {
          setIsRefreshing(false);
          setIsPulling(false);
          setPullProgress(0);
          controls.start({ y: 0, transition: { type: 'spring', damping: 25, stiffness: 200 } });
        }
      } else if (isPulling) {
        setIsPulling(false);
        setPullProgress(0);
        controls.start({ y: 0, transition: { type: 'spring', damping: 25, stiffness: 200 } });
      }
      
      startY.current = 0;
      isAxisDetermined.current = false;
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isRefreshing, onRefresh, controls, isPulling, scrollRef]);

  // Disable browser's native pull-to-refresh conditionally on the target
  useEffect(() => {
    // If it's the main window, disable body overscroll
    if (!scrollRef) {
      document.body.style.overscrollBehaviorY = 'none';
      return () => {
        document.body.style.overscrollBehaviorY = 'auto';
      };
    }
  }, [scrollRef]);

  return (
    <div ref={containerRef} className={`relative w-full h-full min-h-full ${bgClass}`}>
      {/* Indicator */}
      <div className="absolute top-0 left-0 w-full flex justify-center items-end overflow-visible z-0 pointer-events-none">
        <motion.div 
          animate={controls}
          className="flex justify-center items-center h-12 w-12 bg-white rounded-full mt-[-48px] shadow-sm"
        >
          {isRefreshing ? (
            <SpinnerGap size={24} color="#06C167" weight="bold" className="animate-spin" />
          ) : (
            <motion.div
              style={{ 
                rotate: pullProgress >= 1 ? 180 : 0, 
                opacity: Math.max(0.3, pullProgress),
                scale: 0.8 + (pullProgress * 0.2)
              }}
              animate={{ rotate: pullProgress >= 1 ? 180 : 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <ArrowDown size={24} color="#1E1E1E" weight="bold" />
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Content */}
      <motion.div animate={controls} className={`w-full relative z-10 min-h-full ${bgClass}`}>
        {children}
      </motion.div>
    </div>
  );
};

export default PullToRefresh;

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X } from '@phosphor-icons/react';
import { createPortal } from 'react-dom';

const handleKeyDown = (fn) => (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    fn();
  }
};

const ImageViewer = ({ src, alt, onClose }) => {
  const [zoomStyle, setZoomStyle] = useState({});
  const [isZoomed, setIsZoomed] = useState(false);
  const containerRef = useRef(null);

  // Close on Escape key
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const handleMouseMove = (e) => {
    // Only apply hover zoom on desktop (no touch)
    if (window.matchMedia('(hover: none)').matches) return;

    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: 'scale(2)'
    });
    setIsZoomed(true);
  };

  const handleMouseLeave = () => {
    if (window.matchMedia('(hover: none)').matches) return;
    setZoomStyle({ transform: 'scale(1)' });
    setIsZoomed(false);
  };

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-[#F3F4F6]"
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="absolute top-[max(1rem,env(safe-area-inset-top,1rem))] right-4 md:right-8 w-12 h-12 bg-white hover:bg-[#ECECEE] active:bg-[#ECECEE] active:scale-[0.95] rounded-full flex items-center justify-center cursor-pointer transition-all z-10 outline-none focus-visible:bg-[#ECECEE]"
        onClick={onClose}
        onKeyDown={handleKeyDown(onClose)}
        role="button"
        tabIndex={0}
        aria-label="Cerrar imagen"
      >
        <X size={24} weight="bold" color="#1E1E1E" />
      </div>

      <motion.div
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0.5, bottom: 0.5 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        onDragEnd={(e, info) => {
          if (Math.abs(info.offset.y) > 100 || Math.abs(info.velocity.y) > 500) {
            onClose();
          }
        }}
        className="w-full h-full flex items-center justify-center p-4 outline-none"
      >
        <div 
          ref={containerRef}
          className="relative w-full h-full max-w-5xl max-h-[85vh] flex items-center justify-center overflow-hidden cursor-zoom-in"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <motion.img
            src={src}
            alt={alt}
            className={`max-w-full max-h-full object-contain transition-transform duration-75 ease-out rounded-2xl ${!isZoomed && 'pointer-events-none'}`}
            style={zoomStyle}
          />
        </div>
      </motion.div>
    </motion.div>,
    document.body
  );
};

export default ImageViewer;

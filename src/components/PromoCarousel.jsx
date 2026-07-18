import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CaretLeft, CaretRight } from '@phosphor-icons/react';

const promos = [
  {
    id: 1,
    title: 'Refrescante.',
    subtitle: '2x1 en bebidas frías seleccionadas.',
    buttonText: 'Pide ahora',
    bgColor: 'bg-[#06C167]', // Original Green
    textColor: 'text-white',
    image: import.meta.env.BASE_URL + 'images/ice_cola_v4.png',
  },
  {
    id: 2,
    title: 'Más por menos en tus favoritos.',
    subtitle: 'Envíos gratis con Uber One.',
    buttonText: 'Ver ofertas',
    bgColor: 'bg-[#9E6202]', // Uber One color
    textColor: 'text-white',
    image: import.meta.env.BASE_URL + 'images/combo_clasico_v2.png',
  },
  {
    id: 3,
    title: 'Noche de pelis.',
    subtitle: 'Combos de hamburguesas con 30% OFF.',
    buttonText: 'Ordena ya',
    bgColor: 'bg-[#06C167]', // Brand Green
    textColor: 'text-white',
    image: import.meta.env.BASE_URL + 'images/double_burger_v2.png',
  },
  {
    id: 4,
    title: 'Antojos de medianoche.',
    subtitle: 'Postres 2x1 y envío gratis nocturno.',
    buttonText: 'Ver postres',
    bgColor: 'bg-[#06C167]', // Brand Green
    textColor: 'text-white',
    image: import.meta.env.BASE_URL + 'images/chocolate_brownie_v2.png',
  }
];

const PromoCard = ({ promo }) => (
  <div 
    className={`relative flex items-center w-full h-[150px] lg:h-[180px] rounded-2xl overflow-hidden cursor-pointer transition-transform active:scale-[0.98] outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#06C167] ${promo.bgColor}`}
    role="button"
    tabIndex={0}
  >
    {/* Left Content */}
    <div className={`flex-1 h-full flex flex-col justify-center py-4 pl-5 lg:pl-6 pr-2 z-10 ${promo.textColor}`}>
      <h3 className="text-[17px] lg:text-[20px] font-bold leading-tight mb-1.5 line-clamp-2">
        {promo.title}
      </h3>
      <p className="text-[13px] lg:text-[14px] opacity-90 leading-snug mb-3 line-clamp-2">
        {promo.subtitle}
      </p>
      <div className="flex items-start">
        <span className="inline-flex items-center justify-center px-4 py-1.5 bg-white text-[#1E1E1E] rounded-full text-[13px] font-bold">
          {promo.buttonText}
        </span>
      </div>
    </div>

    {/* Right Image Container */}
    <div className="w-[120px] lg:w-[150px] xl:w-[180px] h-full shrink-0">
      <img 
        src={promo.image} 
        alt="Promoción" 
        className="w-full h-full object-cover"
      />
    </div>
  </div>
);

const PromoCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(1);

  useEffect(() => {
    const updateView = () => {
      if (window.innerWidth >= 1024) setCardsPerView(3);
      else if (window.innerWidth >= 768) setCardsPerView(2);
      else setCardsPerView(1);
    };
    updateView();
    window.addEventListener('resize', updateView);
    return () => window.removeEventListener('resize', updateView);
  }, []);

  const maxIndex = Math.max(0, promos.length - cardsPerView);

  const slideLeft = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const slideRight = () => {
    if (currentIndex < maxIndex) setCurrentIndex(currentIndex + 1);
  };

  return (
    <div className="w-full pt-4 pb-2">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 relative group">
        
        {/* Navigation Arrows for Tablet/Desktop */}
        <button 
          onClick={(e) => { e.preventDefault(); slideLeft(); }}
          disabled={currentIndex === 0}
          className={`hidden md:flex absolute left-0 xl:-left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white rounded-full items-center justify-center text-[#1E1E1E] opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#F3F4F6] active:scale-95 disabled:opacity-0`}
          aria-label="Anterior"
        >
          <CaretLeft size={20} weight="bold" />
        </button>
        <button 
          onClick={(e) => { e.preventDefault(); slideRight(); }}
          disabled={currentIndex === maxIndex}
          className={`hidden md:flex absolute right-0 xl:-right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white rounded-full items-center justify-center text-[#1E1E1E] opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#F3F4F6] active:scale-95 disabled:opacity-0`}
          aria-label="Siguiente"
        >
          <CaretRight size={20} weight="bold" />
        </button>

        {/* Strict Swipe Slider Container */}
        <div className="w-full overflow-hidden">
          <motion.div 
            className="flex w-full"
            animate={{ x: `-${currentIndex * (100 / cardsPerView)}%` }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipeThreshold = 50;
              if (offset.x < -swipeThreshold || velocity.x < -500) {
                slideRight();
              } else if (offset.x > swipeThreshold || velocity.x > 500) {
                slideLeft();
              }
            }}
          >
            {promos.map((promo) => (
              <div 
                key={promo.id} 
                className="shrink-0 p-2"
                style={{ width: `${100 / cardsPerView}%` }}
              >
                <PromoCard promo={promo} />
              </div>
            ))}
          </motion.div>
        </div>

        {/* Pagination Dots (Mobile) */}
        {cardsPerView === 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20 pointer-events-none">
             {promos.map((_, i) => (
               <div 
                 key={i} 
                 className={`w-1.5 h-1.5 rounded-full transition-colors ${i === currentIndex ? 'bg-white' : 'bg-white/40'}`} 
               />
             ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default PromoCarousel;

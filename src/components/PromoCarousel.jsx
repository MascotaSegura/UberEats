import React, { useState, useEffect, useRef } from 'react';
import { CaretLeft, CaretRight } from '@phosphor-icons/react';

const promos = [
  {
    id: 1,
    title: 'Hamburguesa Clásica',
    subtitle: '20% OFF en tu primera orden del día.',
    buttonText: 'Pedir ahora',
    bgColor: 'bg-[#06C167]',
    textColor: 'text-white',
    image: import.meta.env.BASE_URL + 'images/hamburguesa_clasica.png',
  },
  {
    id: 2,
    title: 'Doble Queso',
    subtitle: 'Doble sabor, doble queso. Envío gratis hoy.',
    buttonText: 'Ordenar',
    bgColor: 'bg-[#06C167]',
    textColor: 'text-white',
    image: import.meta.env.BASE_URL + 'images/hamburguesa_doble_queso.png',
  },
  {
    id: 3,
    title: 'Papas Crujientes',
    subtitle: '2x1 en papas fritas los fines de semana.',
    buttonText: 'Ver oferta',
    bgColor: 'bg-[#06C167]',
    textColor: 'text-white',
    image: import.meta.env.BASE_URL + 'images/papas_crujientes.png',
  },
  {
    id: 4,
    title: 'Refresco Helado',
    subtitle: '2x1 en bebidas frías seleccionadas.',
    buttonText: 'Agregar',
    bgColor: 'bg-[#06C167]',
    textColor: 'text-white',
    image: import.meta.env.BASE_URL + 'images/refresco_helado.png',
  },
  {
    id: 5,
    title: 'Brownie de Chocolate',
    subtitle: 'El postre que tu orden estaba esperando.',
    buttonText: 'Pedir postre',
    bgColor: 'bg-[#06C167]',
    textColor: 'text-white',
    image: import.meta.env.BASE_URL + 'images/brownie_chocolate.png',
  },
  {
    id: 6,
    title: 'Combo Clásico',
    subtitle: 'Más por menos. Envíos gratis con Uber One.',
    buttonText: 'Ver combo',
    bgColor: 'bg-[#9E6202]',
    textColor: 'text-white',
    image: import.meta.env.BASE_URL + 'images/combo_clasico_promo.png',
  },
  {
    id: 7,
    title: 'Pizza Pepperoni',
    subtitle: 'Masa madre artesanal con pepperoni crujiente.',
    buttonText: 'Elegir tamaño',
    bgColor: 'bg-[#06C167]',
    textColor: 'text-white',
    image: import.meta.env.BASE_URL + 'images/pizza_pepperoni_promo.png',
  },
  {
    id: 8,
    title: 'Alitas BBQ',
    subtitle: '10 piezas bañadas en salsa BBQ secreta.',
    buttonText: 'Pedir alitas',
    bgColor: 'bg-[#06C167]',
    textColor: 'text-white',
    image: import.meta.env.BASE_URL + 'images/alitas_bbq_promo.png',
  },
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
        alt={promo.title}
        loading="lazy"
        className="w-full h-full object-cover"
      />
    </div>
  </div>
);

const PromoCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(1);
  const scrollRef = useRef(null);

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

  const handleScroll = (e) => {
    if (!scrollRef.current) return;
    const scrollLeft = e.target.scrollLeft;
    const cardWidth = scrollRef.current.clientWidth / cardsPerView;
    const newIndex = Math.round(scrollLeft / cardWidth);
    setCurrentIndex(Math.min(Math.max(newIndex, 0), maxIndex));
  };

  const slideLeft = () => {
    if (scrollRef.current) {
      const cardWidth = scrollRef.current.clientWidth / cardsPerView;
      scrollRef.current.scrollBy({ left: -cardWidth, behavior: 'smooth' });
    }
  };

  const slideRight = () => {
    if (scrollRef.current) {
      const cardWidth = scrollRef.current.clientWidth / cardsPerView;
      scrollRef.current.scrollBy({ left: cardWidth, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full pt-4 pb-2">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 relative group">

        {/* Navigation Arrows for Tablet/Desktop */}
        <button
          onClick={(e) => { e.preventDefault(); slideLeft(); }}
          disabled={currentIndex === 0}
          className="hidden md:flex absolute left-0 xl:-left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white rounded-full items-center justify-center text-[#1E1E1E] opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#F3F4F6] active:scale-95 disabled:opacity-0"
          aria-label="Anterior"
        >
          <CaretLeft size={20} weight="bold" />
        </button>
        <button
          onClick={(e) => { e.preventDefault(); slideRight(); }}
          disabled={currentIndex >= maxIndex}
          className="hidden md:flex absolute right-0 xl:-right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white rounded-full items-center justify-center text-[#1E1E1E] opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#F3F4F6] active:scale-95 disabled:opacity-0"
          aria-label="Siguiente"
        >
          <CaretRight size={20} weight="bold" />
        </button>

        {/* Native Scroll Container */}
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex w-full overflow-x-auto snap-x snap-mandatory touch-pan-x [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {promos.map((promo) => (
            <div
              key={promo.id}
              className="shrink-0 p-2 snap-center"
              style={{ width: `${100 / cardsPerView}%` }}
            >
              <PromoCard promo={promo} />
            </div>
          ))}
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
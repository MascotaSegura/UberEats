import React, { useEffect, useState, useRef } from 'react';
import { useCart } from '../context/useCart';
import { createPortal } from 'react-dom';
import { Phone, X, MapPin, Storefront, Moped, CheckCircle, Package, Truck } from '@phosphor-icons/react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const getIconHtml = (color, type) => {
  const svgMap = {
    store: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" viewBox="0 0 256 256"><path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm-96,16h40V88H120Zm56,0h40V88H176ZM40,56H104V88H40ZM216,200H40V104H216V200Z"></path></svg>`,
    user: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" viewBox="0 0 256 256"><path d="M128,64a40,40,0,1,0,40,40A40,40,0,0,0,128,64Zm0,64a24,24,0,1,1,24-24A24,24,0,0,1,128,128Zm0-112a88.1,88.1,0,0,0-88,88c0,31.4,14.51,64.68,42,96.25a254.19,254.19,0,0,0,41.45,38.3,8,8,0,0,0,9.18,0A254.19,254.19,0,0,0,174,200.25c27.45-31.57,42-64.85,42-96.25A88.1,88.1,0,0,0,128,16Zm0,206c-16.53-13-72-60.75-72-134a72,72,0,0,1,144,0C200,161.21,144.53,209,128,222Z"></path></svg>`,
    driver: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" viewBox="0 0 256 256"><path d="M232,120h-8V96a16,16,0,0,0-16-16H168L138.86,50.86A16,16,0,0,0,127.55,46H32A16,16,0,0,0,16,62V168a32,32,0,0,0,64,0h88a32,32,0,0,0,64,0h0a16,16,0,0,0,16-16V136A16,16,0,0,0,232,120ZM48,184a16,16,0,1,1,16-16A16,16,0,0,1,48,184ZM32,152V62H127.55l29.15,29.14A16,16,0,0,0,168,96v56H80a32,32,0,0,0-48,0Zm152,32a16,16,0,1,1,16-16A16,16,0,0,1,184,184Zm48-32H216a32,32,0,0,0-64,0H184V112h24v24Z"></path></svg>`
  };
  return `<div style="background-color: ${color}; width: 40px; height: 40px; border-radius: 50%; display: grid; place-items: center; border: 3px solid white; box-sizing: border-box;">${svgMap[type]}</div>`;
};

const createMarkerIcon = (color, type) => {
  return L.divIcon({
    html: getIconHtml(color, type),
    className: 'leaflet-custom-marker',
    iconSize: [40, 40],
    iconAnchor: [20, 20]
  });
};

const STEPS_DELIVERY = [
  { key: 'preparing', label: 'Preparando', Icon: Package },
  { key: 'on-the-way', label: 'En camino', Icon: Truck },
  { key: 'delivered', label: 'Entregado', Icon: CheckCircle },
];

const STEPS_PICKUP = [
  { key: 'preparing', label: 'Preparando', Icon: Package },
  { key: 'ready', label: 'Listo', Icon: Storefront },
  { key: 'picked-up', label: 'Entregado', Icon: CheckCircle },
];

const OrderTrackingScreen = () => {
  const { orderStatus, resetOrder, deliveryMode, deliveryAddress, pickupBranch } = useCart();
  const [currentStep, setCurrentStep] = useState(0); 
  const mapRef = useRef(null);
  const driverMarkerRef = useRef(null);

  const isPickup = deliveryMode === 'pickup';
  const steps = isPickup ? STEPS_PICKUP : STEPS_DELIVERY;

  useEffect(() => {
    if (orderStatus !== 'tracking') return;

    if (isPickup) {
      // Simulate pickup timeline
      const timeout1 = setTimeout(() => setCurrentStep(1), 4000);
      const timeout2 = setTimeout(() => setCurrentStep(2), 8000);
      return () => {
        clearTimeout(timeout1);
        clearTimeout(timeout2);
      };
    }

    // --- DELIVERY MAP LOGIC ---
    const userLat = deliveryAddress?.lat || 19.4326;
    const userLng = deliveryAddress?.lng || -99.1332;
    
    // Simulate restaurant ~2km away
    const restLat = userLat - 0.015;
    const restLng = userLng + 0.015;

    if (!mapRef.current) {
      const map = L.map('tracking-map', { zoomControl: false, attributionControl: false }).setView([restLat, restLng], 14);
      const key = import.meta.env.VITE_MAPTILER_KEY;
      
      L.tileLayer(`https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=${key}`, {
        maxZoom: 19,
      }).addTo(map);

      // Draw route polyline
      const routeLine = L.polyline(
        [[restLat, restLng], [userLat, userLng]], 
        { color: '#1E1E1E', weight: 4, opacity: 0.5, dashArray: '8, 8' }
      ).addTo(map);

      L.marker([restLat, restLng], { icon: createMarkerIcon('#1E1E1E', 'store') }).addTo(map);
      L.marker([userLat, userLng], { icon: createMarkerIcon('#06C167', 'user') }).addTo(map);
      
      // Fit bounds to show both markers and line with some padding
      map.fitBounds(routeLine.getBounds(), { padding: [50, 50] });

      mapRef.current = map;
    }

    const map = mapRef.current;
    
    let animationFrame;
    let startTime;
    const DURATION_PREP = 3000;
    const DURATION_DRIVE = 12000;

    const animateDriver = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;

      if (elapsed < DURATION_PREP) {
        setCurrentStep(0);
        if (!driverMarkerRef.current) {
          driverMarkerRef.current = L.marker([restLat, restLng], { icon: createMarkerIcon('#1E1E1E', 'driver') }).addTo(map);
        }
      } else if (elapsed < DURATION_PREP + DURATION_DRIVE) {
        setCurrentStep(1);
        const driveElapsed = elapsed - DURATION_PREP;
        const progress = Math.min(driveElapsed / DURATION_DRIVE, 1);
        
        const easeOutQuad = t => t * (2 - t);
        const easedProgress = easeOutQuad(progress);

        const currentLat = restLat + (userLat - restLat) * easedProgress;
        const currentLng = restLng + (userLng - restLng) * easedProgress;

        if (driverMarkerRef.current) {
          driverMarkerRef.current.setLatLng([currentLat, currentLng]);
        }
        
        map.setView([currentLat, currentLng], 15, { animate: false });
        
      } else {
        setCurrentStep(2);
        if (driverMarkerRef.current) {
          driverMarkerRef.current.setLatLng([userLat, userLng]);
        }
        return; 
      }
      
      animationFrame = requestAnimationFrame(animateDriver);
    };

    animationFrame = requestAnimationFrame(animateDriver);

    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      driverMarkerRef.current = null;
    };
  }, [orderStatus, isPickup, deliveryAddress]);

  if (orderStatus !== 'tracking') return null;

  // --- RENDER PICKUP VIEW ---
  if (isPickup) {
    return createPortal(
      <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#F3F4F6] overflow-hidden animate-fade-in isolate p-4">
        <div 
          className="absolute top-[max(1rem,env(safe-area-inset-top,1rem))] left-4 w-12 h-12 bg-white rounded-full flex items-center justify-center cursor-pointer z-10 active:scale-[0.95] transition-transform"
          onClick={resetOrder}
        >
          <X size={24} weight="bold" color="#1E1E1E" />
        </div>

        <div className="w-full max-w-[480px] bg-white rounded-3xl p-8 flex flex-col items-center">
          <div className="w-20 h-20 bg-[#F3F4F6] rounded-full flex items-center justify-center mb-6">
            <Storefront size={40} weight="fill" color="#1E1E1E" />
          </div>

          <h2 className="text-2xl font-bold text-[#1E1E1E] mb-2 text-center">
            {currentStep === 0 ? 'Preparando tu pedido...' : currentStep === 1 ? '¡Tu pedido está listo!' : '¡Pedido entregado!'}
          </h2>
          
          <p className="text-[#8E8E93] text-[15px] mb-8 text-center font-medium max-w-[280px]">
            {currentStep === 2 ? '¡Gracias por tu preferencia!' : currentStep === 1 ? `Pasa a recogerlo a ${pickupBranch?.name || 'la sucursal'}` : 'Te avisaremos en cuanto esté listo para recoger.'}
          </p>

          <div className="flex items-center justify-center gap-2 mb-10 w-full">
            {steps.map((step, i) => {
              const { Icon } = step;
              const done = i <= currentStep;
              const active = i === currentStep;
              return (
                <React.Fragment key={step.key}>
                  <div className="flex flex-col items-center gap-2">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-500 ${done ? 'bg-[#1E1E1E] text-white' : 'bg-[#F3F4F6] text-[#8E8E93]'}`}>
                      <Icon size={24} weight={active ? 'fill' : 'bold'} className={active && i < 2 ? 'animate-pulse' : ''} />
                    </div>
                    <span className={`text-[12px] font-bold transition-colors ${done ? 'text-[#1E1E1E]' : 'text-[#8E8E93]'}`}>
                      {step.label}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className={`flex-1 h-[3px] -translate-y-3 rounded-full transition-all duration-500 ${i < currentStep ? 'bg-[#1E1E1E]' : 'bg-[#F3F4F6]'}`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {currentStep === 2 && (
            <div
              className="w-full bg-[#06C167] text-white py-4 rounded-full flex justify-center font-bold text-[16px] cursor-pointer transition-all active:scale-[0.98] outline-none animate-fade-in"
              onClick={resetOrder}
            >
              Volver al inicio
            </div>
          )}
        </div>
      </div>,
      document.body
    );
  }

  // --- RENDER DELIVERY VIEW ---
  return createPortal(
    <div className="fixed inset-0 z-[100] flex flex-col md:flex-row bg-white overflow-hidden animate-fade-in isolate">
      {/* Map (Right side on desktop, top on mobile) */}
      <div id="tracking-map" className="w-full flex-1 md:w-auto bg-[#F3F4F6] relative z-0 md:order-2" />

      {/* Mobile Close Button (Absolute over map) */}
      <div 
        className="md:hidden absolute top-[max(1rem,env(safe-area-inset-top,1rem))] left-4 w-12 h-12 bg-white rounded-full flex items-center justify-center cursor-pointer z-10 active:scale-[0.95] transition-transform"
        onClick={resetOrder}
      >
        <X size={24} weight="bold" color="#1E1E1E" />
      </div>

      {/* Information Panel (Left side on desktop, bottom sheet on mobile) */}
      <div className="w-full md:w-[400px] xl:w-[480px] bg-white rounded-t-3xl md:rounded-none p-6 pb-[max(1.5rem,env(safe-area-inset-bottom,1.5rem))] md:p-8 z-10 relative mt-[-20px] md:mt-0 flex flex-col md:h-full md:order-1 overflow-y-auto shrink-0">
        
        {/* Top Header in Panel */}
        <div className="w-full flex justify-center md:justify-between items-start mb-6 shrink-0">
           {/* Mobile drag pill */}
           <div className="w-12 h-1.5 bg-[#F3F4F6] rounded-full md:hidden" />
           
           {/* Desktop Logo & Close */}
           <div className="hidden md:block text-[22px] tracking-tight text-[#1E1E1E] mt-1">
              <span className="font-normal">Uber</span> <span className="font-medium">Eats</span>
           </div>
           <div 
             className="hidden md:flex w-10 h-10 bg-[#F3F4F6] hover:bg-[#ECECEE] rounded-full items-center justify-center cursor-pointer active:scale-[0.95] transition-transform shrink-0"
             onClick={resetOrder}
           >
             <X size={20} weight="bold" color="#1E1E1E" />
           </div>
        </div>

        <div className="flex flex-col items-center md:items-start w-full">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1E1E1E] mb-2 text-center md:text-left leading-tight">
            {currentStep === 0 ? 'Preparando tu pedido...' : currentStep === 1 ? '¡Tu pedido va en camino!' : '¡Pedido entregado!'}
          </h2>
          
          <p className="text-[#8E8E93] text-[15px] md:text-[16px] mb-8 text-center md:text-left font-medium">
            {currentStep === 2 ? '¡Disfruta tu comida!' : 'Llegada estimada: 15-20 min'}
          </p>

          <div className="flex items-center justify-center md:justify-start gap-2 mb-10 w-full max-w-[320px] md:max-w-none">
            {steps.map((step, i) => {
              const { Icon } = step;
              const done = i <= currentStep;
              const active = i === currentStep;
              return (
                <React.Fragment key={step.key}>
                  <div className="flex flex-col items-center gap-2">
                    <div className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-colors duration-500 ${done ? 'bg-[#1E1E1E] text-white' : 'bg-[#F3F4F6] text-[#8E8E93]'}`}>
                      <Icon size={24} weight={active ? 'fill' : 'bold'} className={active && i < 2 ? 'animate-pulse' : ''} />
                    </div>
                    <span className={`text-[12px] font-bold transition-colors ${done ? 'text-[#1E1E1E]' : 'text-[#8E8E93]'}`}>
                      {step.label}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className={`flex-1 h-[3px] -translate-y-3 rounded-full transition-all duration-500 ${i < currentStep ? 'bg-[#1E1E1E]' : 'bg-[#F3F4F6]'}`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {currentStep > 0 && (
            <div className="w-full bg-[#F3F4F6] rounded-2xl p-4 flex items-center gap-4 mb-6 animate-fade-in">
              <div className="w-12 h-12 bg-[#D1D1D6] rounded-full overflow-hidden shrink-0">
                 <img src={`${import.meta.env.BASE_URL}images/driver.jpg`} alt="Repartidor" className="w-full h-full object-cover mix-blend-multiply" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-[#1E1E1E] text-[16px]">Carlos M.</h4>
                <p className="text-[14px] text-[#8E8E93]">Honda Moto • 98% Satisfacción</p>
              </div>
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center cursor-pointer active:scale-[0.95] transition-transform">
                <Phone size={20} weight="fill" color="#1E1E1E" />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div
              className="w-full bg-[#06C167] text-white py-4 md:py-4 rounded-full flex justify-center font-bold text-[16px] cursor-pointer transition-all active:scale-[0.98] outline-none animate-fade-in mt-auto"
              onClick={resetOrder}
            >
              Volver al inicio
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default OrderTrackingScreen;

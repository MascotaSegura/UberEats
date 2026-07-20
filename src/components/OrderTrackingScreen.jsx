import React, { useEffect, useState, useRef } from 'react';
import { useCart } from '../context/useCart';
import { createPortal } from 'react-dom';
import { Phone, X, MapPin, Storefront, Moped, CheckCircle, Package, Truck, ChatTeardropText, Browsers } from '@phosphor-icons/react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { renderToStaticMarkup } from 'react-dom/server';

const getIconHtml = (color, type) => {
  let IconComponent;
  if (type === 'store') IconComponent = <Storefront size={22} weight="fill" color="white" style={{ display: 'block' }} />;
  if (type === 'user') IconComponent = <MapPin size={22} weight="fill" color="white" style={{ display: 'block' }} />;
  if (type === 'driver') IconComponent = <Moped size={22} weight="fill" color="white" style={{ display: 'block' }} />;

  const svgString = renderToStaticMarkup(IconComponent);
  return `<div style="background-color: ${color}; width: 100%; height: 100%; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-sizing: border-box; overflow: hidden;">${svgString}</div>`;
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

const OrderTrackingScreen = ({ onOpenChat }) => {
  const { orderStatus, setOrderStatus, resetOrder, completeOrder, activeOrder, deliveryMode, deliveryAddress, pickupBranch } = useCart();
  const [currentStep, setCurrentStep] = useState(0); 
  const [lastNotifiedStep, setLastNotifiedStep] = useState(-1);
  const mapRef = useRef(null);
  const driverMarkerRef = useRef(null);
  
  const pipSupported = 'documentPictureInPicture' in window;
  const [pipWindow, setPipWindow] = useState(null);

  const togglePip = async () => {
    if (pipWindow) {
      pipWindow.close();
      return;
    }

    try {
      const pip = await window.documentPictureInPicture.requestWindow({
        width: 320,
        height: 380,
      });
      
      // Copy styles directly by cloning nodes to avoid cross-origin and iteration crashes
      Array.from(document.head.querySelectorAll('style, link[rel="stylesheet"]')).forEach(el => {
        pip.document.head.appendChild(el.cloneNode(true));
      });
      
      pip.addEventListener('pagehide', () => {
        setPipWindow(null);
      });
      
      setPipWindow(pip);
      resetOrder(); // hide main tracking screen
    } catch (err) {
      console.error('Failed to open PiP window:', err);
    }
  };

  const isPickup = deliveryMode === 'pickup';
  const steps = isPickup ? STEPS_PICKUP : STEPS_DELIVERY;

  useEffect(() => {
    if (currentStep > lastNotifiedStep && currentStep > 0 && lastNotifiedStep !== -1) {
      // Fire notification on step change
      const title = currentStep === 1 
        ? (isPickup ? '¡Tu pedido está listo!' : '¡Tu pedido va en camino!') 
        : '¡Pedido entregado!';
      const body = currentStep === 1 
        ? (isPickup ? 'Pasa a recogerlo a la sucursal' : 'El repartidor va hacia tu ubicación') 
        : '¡Gracias por tu preferencia!';
        
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, { body });
      } else {
        const div = document.createElement('div');
        div.className = 'fixed top-4 right-4 bg-[#1E1E1E] rounded-2xl p-4 z-[9999] flex flex-col gap-1 transition-all duration-300 transform translate-y-0 opacity-100';
        div.style.animation = 'slide-up 0.3s ease-out';
        div.innerHTML = `<h4 class="font-bold text-white text-[16px] m-0">${title}</h4><p class="text-[14px] text-[#D1D1D6] m-0">${body}</p>`;
        document.body.appendChild(div);
        setTimeout(() => {
          div.style.opacity = '0';
          setTimeout(() => div.remove(), 300);
        }, 4000);
      }
      setLastNotifiedStep(currentStep);
    }
  }, [currentStep, isPickup, lastNotifiedStep]);

  useEffect(() => {
    if (!activeOrder || (orderStatus !== 'tracking' && !pipWindow)) return;

    const DURATION_PREP = 4000;
    const DURATION_DRIVE = 12000;
    
    // Set initial step based on time elapsed to handle reloads
    const initialElapsed = Date.now() - activeOrder.createdAt;
    let initialStep = 0;
    if (initialElapsed > DURATION_PREP + DURATION_DRIVE) initialStep = 2;
    else if (initialElapsed > DURATION_PREP) initialStep = 1;
    
    setCurrentStep(initialStep);
    setLastNotifiedStep(initialStep); // Don't notify on reload if already passed

    let timeout1, timeout2;
    const t1 = DURATION_PREP - initialElapsed;
    const t2 = (DURATION_PREP + DURATION_DRIVE) - initialElapsed;
    
    if (t1 > 0) timeout1 = setTimeout(() => setCurrentStep(1), t1);
    if (t2 > 0) timeout2 = setTimeout(() => setCurrentStep(2), t2);
    
    return () => {
      if (timeout1) clearTimeout(timeout1);
      if (timeout2) clearTimeout(timeout2);
    };
  }, [activeOrder, orderStatus, pipWindow]);

  useEffect(() => {
    if (orderStatus !== 'tracking' || isPickup || !activeOrder) return;

    const mapContainer = document.getElementById('tracking-map');
    if (!mapContainer) return; // Map container must exist in the DOM
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

      L.marker([restLat, restLng], { icon: createMarkerIcon('#1E1E1E', 'store') }).addTo(map);
      L.marker([userLat, userLng], { icon: createMarkerIcon('#06C167', 'user') }).addTo(map);
      
      mapRef.current = map;
    }

    const map = mapRef.current;
    
    let animationFrame;

    // Fetch realistic route from OSRM
    fetch(`https://router.project-osrm.org/route/v1/driving/${restLng},${restLat};${userLng},${userLat}?overview=full&geometries=geojson`)
      .then(res => res.json())
      .then(data => {
        if (!mapRef.current) return; // Unmounted
        const coords = data.routes?.[0]?.geometry?.coordinates;
        if (!coords || coords.length === 0) return;

        const routeLatLngs = coords.map(c => L.latLng(c[1], c[0]));
        
        // Draw the realistic route
        const routeLine = L.polyline(routeLatLngs, { 
          color: '#1E1E1E', 
          weight: 4, 
          opacity: 0.8,
          lineJoin: 'round'
        }).addTo(map);
        
        map.fitBounds(routeLine.getBounds(), { padding: [50, 50] });

        // Calculate cumulative distances for interpolation
        let totalDist = 0;
        const cumDist = [0];
        for (let i = 1; i < routeLatLngs.length; i++) {
           const dist = routeLatLngs[i-1].distanceTo(routeLatLngs[i]);
           totalDist += dist;
           cumDist.push(totalDist);
        }

        const animateDriver = () => {
          const elapsed = Date.now() - activeOrder.createdAt;

          if (elapsed < DURATION_PREP) {
            setCurrentStep(prev => prev !== 0 ? 0 : prev);
            if (!driverMarkerRef.current) {
              driverMarkerRef.current = L.marker([restLat, restLng], { icon: createMarkerIcon('#1E1E1E', 'driver') }).addTo(map);
            }
          } else if (elapsed < DURATION_PREP + DURATION_DRIVE) {
            setCurrentStep(prev => prev !== 1 ? 1 : prev);
            const driveElapsed = elapsed - DURATION_PREP;
            const progress = Math.min(driveElapsed / DURATION_DRIVE, 1);
            
            // Linear progression along the path looks best for realistic turns
            const targetDist = progress * totalDist;
            
            let segIdx = 0;
            while(segIdx < cumDist.length - 1 && cumDist[segIdx + 1] < targetDist) {
              segIdx++;
            }
            
            const p1 = routeLatLngs[segIdx];
            const p2 = routeLatLngs[segIdx + 1] || p1;
            const segStartDist = cumDist[segIdx];
            const segEndDist = cumDist[segIdx + 1] || segStartDist;
            const segTotal = segEndDist - segStartDist;
            const t = segTotal > 0 ? (targetDist - segStartDist) / segTotal : 1;
            
            const currentLat = p1.lat + (p2.lat - p1.lat) * t;
            const currentLng = p1.lng + (p2.lng - p1.lng) * t;

            if (driverMarkerRef.current) {
              driverMarkerRef.current.setLatLng([currentLat, currentLng]);
            }
            
            map.setView([currentLat, currentLng], 15, { animate: false });
            
          } else {
            setCurrentStep(prev => prev !== 2 ? 2 : prev);
            if (driverMarkerRef.current) {
              driverMarkerRef.current.setLatLng([userLat, userLng]);
            }
            return; 
          }
          
          animationFrame = requestAnimationFrame(animateDriver);
        };

        animationFrame = requestAnimationFrame(animateDriver);
      })
      .catch(err => console.error("OSRM Routing Error:", err));

    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      driverMarkerRef.current = null;
    };
  }, [orderStatus, isPickup, deliveryAddress, activeOrder]);

  const isVisible = orderStatus === 'tracking' || pipWindow !== null;
  if (!activeOrder || !isVisible) return null;

  const renderMainView = () => {
    if (orderStatus !== 'tracking') return null;

    if (isPickup) {
      return createPortal(
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#F3F4F6] overflow-hidden animate-fade-in isolate p-4">
          <button type="button" className="absolute top-[max(1rem,env(safe-area-inset-top,1rem))] left-4 w-12 h-12 bg-white rounded-full flex items-center justify-center cursor-pointer z-10 active:scale-[0.95] transition-transform outline-none focus-visible:bg-[#ECECEE]" onClick={resetOrder} aria-label="Cerrar tracking">
            <X size={24} weight="bold" color="#1E1E1E" />
          </button>
          {pipSupported && (
            <button type="button" className="absolute top-[max(1rem,env(safe-area-inset-top,1rem))] right-4 w-12 h-12 bg-white rounded-full flex items-center justify-center cursor-pointer z-10 active:scale-[0.95] transition-transform outline-none focus-visible:bg-[#ECECEE]" onClick={togglePip} title="Picture in Picture" aria-label="Picture in Picture">
              <Browsers size={24} weight="bold" color="#1E1E1E" />
            </button>
          )}

          <div className="w-full max-w-[480px] bg-white rounded-2xl p-8 flex flex-col items-center">
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
              <button type="button" className="w-full bg-[#06C167] text-white py-4 rounded-full flex justify-center font-bold text-[16px] cursor-pointer transition-all hover:bg-[#05a055] active:bg-[#05a055] active:scale-[0.98] outline-none focus-visible:opacity-90 animate-fade-in" onClick={completeOrder}>
                Volver al inicio
              </button>
            )}
          </div>
        </div>,
        document.body
      );
    }

    return createPortal(
      <div className="fixed inset-0 z-[100] flex flex-col md:flex-row bg-white overflow-hidden animate-fade-in isolate">
        <div id="tracking-map" className="w-full flex-1 md:w-auto bg-[#F3F4F6] relative z-0 md:order-2" />
        
        <button type="button" className="md:hidden absolute top-[max(1rem,env(safe-area-inset-top,1rem))] left-4 w-12 h-12 bg-white rounded-full flex items-center justify-center cursor-pointer z-10 active:scale-[0.95] transition-transform outline-none focus-visible:bg-[#ECECEE]" onClick={resetOrder} aria-label="Cerrar tracking">
          <X size={24} weight="bold" color="#1E1E1E" />
        </button>
        {pipSupported && (
          <button type="button" className="md:hidden absolute top-[max(1rem,env(safe-area-inset-top,1rem))] right-4 w-12 h-12 bg-white rounded-full flex items-center justify-center cursor-pointer z-10 active:scale-[0.95] transition-transform outline-none focus-visible:bg-[#ECECEE]" onClick={togglePip} title="Picture in Picture" aria-label="Picture in Picture">
            <Browsers size={24} weight="bold" color="#1E1E1E" />
          </button>
        )}

        <div className="w-full md:w-[400px] xl:w-[480px] bg-white rounded-t-2xl md:rounded-none p-6 pb-[max(1.5rem,env(safe-area-inset-bottom,1.5rem))] md:p-8 z-10 relative mt-[-20px] md:mt-0 flex flex-col md:h-full md:order-1 overflow-y-auto shrink-0">
          <div className="w-full flex justify-between items-start mb-6 shrink-0">
             <div className="hidden md:block text-[22px] tracking-tight text-[#1E1E1E] mt-1">
                 <img src={`${import.meta.env.BASE_URL}logo.svg`} alt="Uber Eats" className="h-6 w-auto object-contain shrink-0" />
             </div>
             <div className="hidden md:flex gap-2">
               {pipSupported && (
                 <button type="button" className="w-10 h-10 bg-[#F3F4F6] hover:bg-[#ECECEE] rounded-full flex items-center justify-center cursor-pointer active:scale-[0.95] transition-transform shrink-0 outline-none focus-visible:bg-[#ECECEE]" onClick={togglePip} title="Picture in Picture" aria-label="Picture in Picture">
                   <Browsers size={20} weight="bold" color="#1E1E1E" />
                 </button>
               )}
               <button type="button" className="w-10 h-10 bg-[#F3F4F6] hover:bg-[#ECECEE] rounded-full flex items-center justify-center cursor-pointer active:scale-[0.95] transition-transform shrink-0 outline-none focus-visible:bg-[#ECECEE]" onClick={resetOrder} aria-label="Cerrar tracking">
                 <X size={20} weight="bold" color="#1E1E1E" />
               </button>
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
                   <img src={`${import.meta.env.BASE_URL}images/repartidor.png`} alt="Repartidor" className="w-full h-full object-cover mix-blend-multiply" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-[#1E1E1E] text-[16px]">Carlos M.</h4>
                  <p className="text-[14px] text-[#8E8E93]">Honda Moto • 98% Satisfacción</p>
                </div>
                <div className="flex items-center gap-2">
                  <button type="button" className="w-10 h-10 bg-white rounded-full flex items-center justify-center cursor-pointer hover:bg-[#ECECEE] active:scale-[0.95] transition-all outline-none focus-visible:opacity-80" onClick={() => onOpenChat?.('driver')} aria-label="Chatear con el repartidor">
                    <ChatTeardropText size={20} weight="fill" color="#1E1E1E" />
                  </button>
                  <button type="button" className="w-10 h-10 bg-white rounded-full flex items-center justify-center cursor-pointer hover:bg-[#ECECEE] active:scale-[0.95] transition-all outline-none focus-visible:opacity-80" aria-label="Llamar al repartidor">
                    <Phone size={20} weight="fill" color="#1E1E1E" />
                  </button>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <button type="button" className="w-full bg-[#06C167] text-white py-4 md:py-4 rounded-full flex justify-center font-bold text-[16px] cursor-pointer transition-all hover:bg-[#05a055] active:bg-[#05a055] active:scale-[0.98] outline-none focus-visible:opacity-90 animate-fade-in mt-auto" onClick={completeOrder}>
                Volver al inicio
              </button>
            )}
          </div>
        </div>
      </div>,
      document.body
    );
  };

  const renderPipView = () => {
    if (!pipWindow) return null;
    
    return createPortal(
      <div className="flex flex-col items-center justify-center p-6 bg-white w-full h-full text-center isolate font-sans">
        <div className="w-16 h-16 bg-[#F3F4F6] rounded-full flex items-center justify-center mb-6">
          {currentStep === 0 && <Package size={32} weight="fill" color="#1E1E1E" />}
          {currentStep === 1 && (isPickup ? <Storefront size={32} weight="fill" color="#1E1E1E" /> : <Truck size={32} weight="fill" color="#1E1E1E" />)}
          {currentStep === 2 && <CheckCircle size={32} weight="fill" color="#06C167" />}
        </div>
        
        <h2 className="text-xl font-bold text-[#1E1E1E] mb-2 leading-tight">
          {currentStep === 0 ? 'Preparando...' : currentStep === 1 ? (isPickup ? 'Listo' : 'En camino') : 'Entregado'}
        </h2>
        
        <p className="text-[#8E8E93] text-[14px] mb-8 font-medium">
          {currentStep === 2 ? '¡Disfruta tu comida!' : (isPickup ? 'Pasa a la sucursal' : 'Llegada estimada: 15-20 min')}
        </p>
        
        <div className="flex items-center justify-center gap-3 w-full max-w-[240px]">
          {steps.map((step, i) => {
            const { Icon } = step;
            const done = i <= currentStep;
            const active = i === currentStep;
            return (
              <React.Fragment key={step.key}>
                <div className="flex flex-col items-center gap-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-500 ${done ? 'bg-[#1E1E1E] text-white' : 'bg-[#F3F4F6] text-[#8E8E93]'}`}>
                    <Icon size={20} weight={active ? 'fill' : 'bold'} className={active && i < 2 ? 'animate-pulse' : ''} />
                  </div>
                </div>
                {i < steps.length - 1 && (
                  <div className={`flex-1 h-[2px] -translate-y-1/2 rounded-full transition-all duration-500 ${i < currentStep ? 'bg-[#1E1E1E]' : 'bg-[#F3F4F6]'}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        <button 
          className="mt-8 bg-[#1E1E1E] text-white py-3 px-6 rounded-full font-medium text-[15px] hover:bg-[#2C2C2E] active:scale-[0.98] outline-none transition-all w-full max-w-[240px]"
          onClick={() => {
            if (pipWindow) {
              setOrderStatus('tracking');
              pipWindow.close();
              setPipWindow(null);
            }
          }}
        >
          Expandir a la app
        </button>
      </div>,
      pipWindow.document.body
    );
  };

  return (
    <>
      {renderMainView()}
      {renderPipView()}
    </>
  );
};

export default OrderTrackingScreen;

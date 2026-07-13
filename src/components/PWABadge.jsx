import React from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { ArrowsClockwise, X } from '@phosphor-icons/react';

const PWABadge = () => {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered: ' + r);
    },
    onRegisterError(error) {
      console.log('SW registration error', error);
    },
  });

  if (!needRefresh) return null;

  return (
    <div className="fixed bottom-[calc(1.5rem+env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 z-[300] w-[90%] max-w-[340px] bg-[#1E1E1E] text-white p-3 rounded-2xl flex items-center justify-between gap-3 animate-slide-up mx-auto">
      <div className="flex flex-col gap-0.5 pl-1 flex-1">
        <span className="text-[14px] font-semibold leading-tight">Nueva versión disponible</span>
        <span className="text-[12px] text-gray-300 leading-tight">Actualiza para ver los cambios</span>
      </div>
      
      <div className="flex items-center gap-2 shrink-0">
        <button
          className="bg-white text-[#1E1E1E] px-3 py-1.5 rounded-full text-[13px] font-bold hover:bg-gray-100 active:bg-gray-200 active:scale-95 transition-all outline-none"
          onClick={() => updateServiceWorker(true)}
        >
          <div className="flex items-center gap-1.5">
            <ArrowsClockwise size={14} weight="bold" />
            Actualizar
          </div>
        </button>
        <button
          className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/20 active:bg-white/30 transition-colors text-white outline-none shrink-0"
          onClick={() => setNeedRefresh(false)}
        >
          <X size={16} weight="bold" />
        </button>
      </div>
    </div>
  );
};

export default PWABadge;

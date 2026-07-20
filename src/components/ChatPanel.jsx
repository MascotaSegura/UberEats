import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, PaperPlaneRight, Headset } from '@phosphor-icons/react';

const handleKeyDown = (fn) => (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    fn();
  }
};

const driverMessages = [
  { id: 1, text: 'Hola, voy en camino hacia tu domicilio.', sender: 'them', time: '12:00' },
  { id: 2, text: 'Perfecto, gracias. Estaré atento.', sender: 'user', time: '12:01' },
];

const supportMessages = [
  { id: 1, text: 'Hola, bienvenido al Soporte de Uber Eats. ¿En qué te puedo ayudar hoy?', sender: 'them', time: '10:00' },
];

const ChatPanel = ({ isOpen, onClose, recipient }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setMessages(recipient === 'driver' ? driverMessages : supportMessages);
    }
  }, [isOpen, recipient]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSend = (e) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;
    
    const newMsg = {
      id: Date.now(),
      text: inputValue.trim(),
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, newMsg]);
    setInputValue('');

    // Simulate auto-reply
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: recipient === 'driver' ? 'Entendido, llego en un momento.' : 'Un agente te atenderá en breve. Gracias por tu paciencia.',
        sender: 'them',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 h-[100dvh] w-screen z-[200] flex items-end md:items-stretch justify-center md:justify-end bg-[#1E1E1E]/40 md:p-0 overflow-hidden"
      role="dialog"
      aria-modal="true"
    >
      <motion.div 
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.5 }}
        onDragEnd={(e, info) => {
          if (info.offset.y > 100 || info.velocity.y > 500) {
            onClose();
          }
        }}
        className="bg-[#F3F4F6] w-full h-full max-h-[100dvh] md:h-full max-w-[480px] flex flex-col md:rounded-l-2xl rounded-t-2xl md:rounded-tr-none overflow-hidden relative isolate"
      >
        {/* Header */}
        <div className="flex items-center px-4 pb-4 pt-[max(1rem,env(safe-area-inset-top,1rem))] shrink-0 bg-white">
          <div
            className="w-10 h-10 bg-[#F3F4F6] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#ECECEE] active:bg-[#ECECEE] active:scale-[0.95] outline-none focus-visible:bg-[#ECECEE] transition-all"
            onClick={onClose}
            onKeyDown={handleKeyDown(onClose)}
            role="button"
            tabIndex={0}
            aria-label="Cerrar"
          >
            <X size={20} weight="bold" color="#1E1E1E" />
          </div>
          <div className="flex-1 flex items-center justify-center pr-10 gap-3">
            {recipient === 'driver' ? (
              <div className="w-10 h-10 rounded-full bg-[#D1D1D6] overflow-hidden shrink-0">
                <img
                  src={`${import.meta.env.BASE_URL}images/repartidor.png`}
                  alt="Carlos M."
                  className="w-full h-full object-cover mix-blend-multiply"
                />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full bg-[#1E1E1E] text-white flex items-center justify-center shrink-0">
                <Headset size={18} weight="bold" />
              </div>
            )}
            <div className="flex flex-col items-start">
              <h2 className="text-[15px] font-semibold text-[#1E1E1E] leading-tight">
                {recipient === 'driver' ? 'Carlos M.' : 'Soporte Técnico'}
              </h2>
              <p className="text-[12px] font-medium text-[#06C167] leading-tight">
                En línea
              </p>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
          <div className="w-full text-center mb-2">
             <span className="text-[12px] font-medium text-[#8E8E93] bg-[#ECECEE] px-3 py-1 rounded-full">
               Hoy
             </span>
          </div>
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div key={msg.id} className={`flex flex-col max-w-[80%] ${isUser ? 'self-end items-end' : 'self-start items-start'}`}>
                <div 
                  className={`px-4 py-2.5 text-[15px] ${
                    isUser 
                      ? 'bg-[#1E1E1E] text-white rounded-2xl rounded-tr-sm' 
                      : 'bg-white text-[#1E1E1E] rounded-2xl rounded-tl-sm'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[11px] text-[#8E8E93] mt-1 font-medium px-1">
                  {msg.time}
                </span>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white shrink-0 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <form onSubmit={handleSend} className="flex items-center gap-2 bg-[#F3F4F6] rounded-full p-1.5 focus-within:bg-[#ECECEE] transition-colors">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Escribe un mensaje..."
              className="flex-1 bg-transparent outline-none px-4 text-[15px] text-[#1E1E1E] placeholder:text-[#8E8E93]"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="w-10 h-10 bg-[#1E1E1E] text-white rounded-full flex items-center justify-center outline-none focus-visible:opacity-80 hover:bg-[#2C2C2E] active:bg-[#2C2C2E] active:scale-[0.95] transition-all disabled:opacity-50 disabled:active:scale-100"
            >
              <PaperPlaneRight size={18} weight="fill" />
            </button>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ChatPanel;

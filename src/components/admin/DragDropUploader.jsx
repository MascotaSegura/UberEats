import React, { useState, useRef } from 'react';
import { UploadSimple, X } from '@phosphor-icons/react';

const DragDropUploader = ({ value, onChange }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const processFile = (file) => {
    if (!file || !file.type.startsWith('image/')) {
      alert('Por favor selecciona una imagen válida.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      onChange(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    processFile(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    processFile(file);
  };

  if (value) {
    return (
      <div className="relative w-full h-40 bg-[#F3F4F6] rounded-2xl flex items-center justify-center overflow-hidden group">
        <img src={value} alt="Preview" className="w-full h-full object-contain mix-blend-multiply" />
        <div className="absolute inset-0 bg-[#1E1E1E]/0 group-hover:bg-[#1E1E1E]/40 transition-colors flex items-center justify-center">
          <button
            type="button"
            onClick={() => onChange('')}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100 hover:bg-[#F3F4F6] active:scale-95 text-[#FF3B30] outline-none"
          >
            <X size={20} weight="bold" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
      className={`w-full h-40 rounded-2xl flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors border-2 border-dashed ${
        isDragging ? 'bg-[#ECECEE] border-[#1E1E1E]' : 'bg-[#F3F4F6] border-transparent hover:bg-[#ECECEE]'
      }`}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#1E1E1E]">
        <UploadSimple size={24} weight="bold" />
      </div>
      <div className="text-center">
        <p className="text-[14px] font-semibold text-[#1E1E1E]">Haz clic o arrastra una imagen</p>
        <p className="text-[12px] text-[#8E8E93] mt-1">PNG, JPG hasta 5MB</p>
      </div>
    </div>
  );
};

export default DragDropUploader;

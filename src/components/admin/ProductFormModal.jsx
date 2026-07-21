import React, { useState, useEffect, useContext } from 'react';
import { createPortal } from 'react-dom';
import { X } from '@phosphor-icons/react';
import { ProductsContext } from '../../context/ProductsContext';

const ProductFormModal = ({ isOpen, onClose, product }) => {
  const { products, addProduct, updateProduct } = useContext(ProductsContext);
  const uniqueCategories = Array.from(new Set(products.map(p => p.category)));
  const [isNewCategory, setIsNewCategory] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: import.meta.env.BASE_URL + 'images/producto_hamburguesa_clasica.png',
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        category: product.category || '',
        image: product.image || import.meta.env.BASE_URL + 'images/producto_hamburguesa_clasica.png',
      });
      if (product.category && !uniqueCategories.includes(product.category)) {
        setIsNewCategory(true);
      }
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.category) return;
    
    const productPayload = {
      ...formData,
      price: parseFloat(formData.price),
    };

    if (product) {
      updateProduct(product.id, productPayload);
    } else {
      addProduct(productPayload);
    }
    onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center bg-[#1E1E1E]/40 md:p-4">
      <div 
        className="bg-white w-full h-[90vh] md:h-auto md:max-h-[85vh] md:max-w-[500px] flex flex-col rounded-t-2xl md:rounded-2xl overflow-hidden relative animate-slide-up md:animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center px-6 py-4 bg-white shrink-0 relative">
          <h2 className="flex-1 text-center font-semibold text-lg text-[#1E1E1E]">
            {product ? 'Editar Producto' : 'Nuevo Producto'}
          </h2>
          <button
            onClick={onClose}
            className="absolute right-4 w-9 h-9 bg-[#F3F4F6] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#ECECEE] active:bg-[#ECECEE] active:scale-[0.95] outline-none transition-all text-[#1E1E1E]"
          >
            <X size={18} weight="bold" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-white">
          <form id="product-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#1E1E1E]">Nombre</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ej. Hamburguesa Doble"
                className="w-full bg-[#F3F4F6] rounded-xl px-4 py-3 text-[15px] text-[#1E1E1E] outline-none focus:bg-[#ECECEE] transition-colors"
                required
              />
            </div>
            
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#1E1E1E]">Precio ($ MXN)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Ej. 150.00"
                step="0.01"
                className="w-full bg-[#F3F4F6] rounded-xl px-4 py-3 text-[15px] text-[#1E1E1E] outline-none focus:bg-[#ECECEE] transition-colors"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#1E1E1E]">Categoría</label>
              {!isNewCategory ? (
                <div className="flex gap-2">
                  <select
                    name="category"
                    value={formData.category}
                    onChange={(e) => {
                      if (e.target.value === '__NEW__') {
                        setIsNewCategory(true);
                        setFormData(prev => ({ ...prev, category: '' }));
                      } else {
                        handleChange(e);
                      }
                    }}
                    className="flex-1 bg-[#F3F4F6] rounded-xl px-4 py-3 text-[15px] text-[#1E1E1E] outline-none focus:bg-[#ECECEE] transition-colors appearance-none cursor-pointer"
                    required
                  >
                    <option value="" disabled>Selecciona una categoría...</option>
                    {uniqueCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                    <option value="__NEW__">+ Añadir nueva categoría...</option>
                  </select>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="Ej. postres"
                    className="flex-1 bg-[#F3F4F6] rounded-xl px-4 py-3 text-[15px] text-[#1E1E1E] outline-none focus:bg-[#ECECEE] transition-colors"
                    required
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => { setIsNewCategory(false); setFormData(prev => ({...prev, category: ''})) }}
                    className="px-4 bg-[#F3F4F6] text-[#1E1E1E] rounded-xl font-medium text-[13px] hover:bg-[#ECECEE] transition-colors outline-none"
                  >
                    Cancelar
                  </button>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#1E1E1E]">URL Imagen</label>
              <input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="Ruta o URL de la imagen"
                className="w-full bg-[#F3F4F6] rounded-xl px-4 py-3 text-[15px] text-[#1E1E1E] outline-none focus:bg-[#ECECEE] transition-colors"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#1E1E1E]">Descripción</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Ingresa una breve descripción del producto..."
                rows={3}
                className="w-full bg-[#F3F4F6] rounded-xl px-4 py-3 text-[15px] text-[#1E1E1E] outline-none focus:bg-[#ECECEE] transition-colors resize-none"
              />
            </div>
          </form>
        </div>

        <div className="p-4 bg-white shrink-0 pb-[max(1rem,env(safe-area-inset-bottom))] border-t border-[#F3F4F6]">
          <button
            type="submit"
            form="product-form"
            className="w-full bg-[#1E1E1E] text-white py-4 rounded-full font-bold text-[16px] hover:bg-[#2C2C2E] active:scale-[0.98] transition-all outline-none"
          >
            {product ? 'Guardar Cambios' : 'Crear Producto'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ProductFormModal;

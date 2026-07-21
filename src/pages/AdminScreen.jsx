import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ProductsContext } from '../context/ProductsContext';
import { CaretLeft, Plus, PencilSimple, Trash, MagnifyingGlass, Storefront } from '@phosphor-icons/react';
import ProductFormModal from '../components/admin/ProductFormModal';

const AdminScreen = ({ isEmbedded = false }) => {
  const { user } = useContext(AuthContext);
  const { products, deleteProduct } = useContext(ProductsContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModal, setActiveModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  if (!user || !user.isAdmin) {
    return (
      <div className="min-h-screen bg-[#F3F4F6] flex flex-col items-center justify-center p-6 text-center">
        <Storefront size={64} weight="fill" color="#8E8E93" className="mb-4" />
        <h1 className="text-2xl font-bold text-[#1E1E1E] mb-2">Acceso Restringido</h1>
        <p className="text-[#8E8E93] mb-8 max-w-[300px]">
          Esta sección es únicamente para administradores del sistema.
        </p>
        <button
          onClick={() => { window.location.hash = ''; }}
          className="bg-[#1E1E1E] text-white px-8 py-3.5 rounded-full font-medium hover:bg-[#2C2C2E] active:scale-[0.98] outline-none transition-all"
        >
          Volver a la Tienda
        </button>
      </div>
    );
  }

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (product) => {
    setEditingProduct(product);
    setActiveModal(true);
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setActiveModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      deleteProduct(id);
    }
  };

  return (
    <div className={`${isEmbedded ? 'flex-1 flex flex-col p-4 md:p-8 overflow-y-auto' : 'min-h-screen bg-[#F3F4F6] flex flex-col'}`}>
      
      {/* Header Admin - Only shown if not embedded */}
      {!isEmbedded ? (
        <div className="bg-white px-4 py-3 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <button
              onClick={() => { window.location.hash = ''; }}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#F3F4F6] active:bg-[#ECECEE] transition-colors outline-none text-[#1E1E1E]"
            >
              <CaretLeft size={24} weight="bold" />
            </button>
            <h1 className="text-xl font-bold text-[#1E1E1E]">Admin. de Productos</h1>
          </div>
          <button
            onClick={handleAdd}
            className="hidden md:flex bg-[#06C167] text-white px-5 py-2.5 rounded-full font-medium text-[15px] hover:bg-[#05a055] active:scale-[0.98] items-center gap-2 outline-none transition-all"
          >
            <Plus size={18} weight="bold" />
            Nuevo Producto
          </button>
        </div>
      ) : (
        <div className="mb-6 md:mb-8 mt-2 md:mt-0 px-2 md:px-0 flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-bold text-[#1E1E1E]">Productos</h1>
            <p className="text-[#8E8E93] text-[15px] mt-1">Gestiona el catálogo de tu tienda.</p>
          </div>
          <button
            onClick={handleAdd}
            className="hidden md:flex bg-[#06C167] text-white px-5 py-2.5 rounded-full font-medium text-[15px] hover:bg-[#05a055] active:scale-[0.98] items-center gap-2 outline-none transition-all"
          >
            <Plus size={18} weight="bold" />
            Nuevo Producto
          </button>
        </div>
      )}

      <div className="p-4 md:p-6 flex-1 max-w-5xl w-full mx-auto flex flex-col gap-4">
        {/* Search */}
        <div className="flex items-center bg-white rounded-full h-11 px-4 focus-within:bg-[#FAFAFA] transition-colors w-full">
          <MagnifyingGlass size={20} weight="bold" color="#8E8E93" />
          <input
            type="text"
            placeholder="Buscar por nombre o categoría..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 ml-3 text-[15px] outline-none bg-transparent text-[#1E1E1E]"
          />
        </div>

        {/* List */}
        <div className="bg-white rounded-2xl overflow-hidden flex-1 p-2 md:p-4">
          {filteredProducts.length === 0 ? (
            <div className="p-10 text-center text-[#8E8E93]">No hay productos que coincidan.</div>
          ) : (
            <div className="flex flex-col gap-2">
              {filteredProducts.map((product) => (
                <div key={product.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-[#F3F4F6] rounded-2xl hover:bg-[#ECECEE] transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center p-1 shrink-0">
                      <img src={product.image} alt={product.name} className="max-w-full max-h-full object-contain mix-blend-multiply" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-[#1E1E1E] text-[16px]">{product.name}</span>
                      <span className="text-[13px] text-[#8E8E93] uppercase tracking-wider font-medium mt-0.5">{product.category}</span>
                      <span className="text-[15px] font-bold text-[#1E1E1E] mt-1">${parseFloat(product.price).toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-4 md:mt-0 justify-end">
                    <button
                      onClick={() => handleEdit(product)}
                      className="p-2.5 bg-white text-[#1E1E1E] rounded-full hover:bg-[#ECECEE] active:scale-[0.95] transition-all outline-none"
                    >
                      <PencilSimple size={20} weight="fill" />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="p-2.5 bg-white text-[#FF3B30] rounded-full hover:bg-[#FFF0F0] active:scale-[0.95] transition-all outline-none"
                    >
                      <Trash size={20} weight="fill" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* FAB for Mobile */}
      <button
        onClick={handleAdd}
        className={`md:hidden fixed right-6 w-14 h-14 bg-[#06C167] text-white rounded-full flex items-center justify-center hover:bg-[#05a055] active:scale-[0.95] transition-all outline-none z-40 ${isEmbedded ? 'bottom-24' : 'bottom-6'}`}
      >
        <Plus size={24} weight="bold" />
      </button>

      {/* Modal Form */}
      {activeModal && (
        <ProductFormModal
          isOpen={activeModal}
          onClose={() => setActiveModal(false)}
          product={editingProduct}
        />
      )}
    </div>
  );
};

export default AdminScreen;

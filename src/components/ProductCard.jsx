import { playSound } from '../utils/sounds';

const handleKeyDown = (fn) => (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    fn();
  }
};

const ProductCard = ({ product, onClick }) => {
  return (
    <div
      className="bg-white p-4 flex flex-col cursor-pointer hover:-translate-y-1 hover:bg-[#FAFAFA] active:scale-[0.98] transition-all outline-none focus-visible:ring-2 focus-visible:ring-[#FF441F] rounded-2xl"
      onClick={() => { playSound('click'); onClick(product); }}
      onKeyDown={handleKeyDown(() => { playSound('click'); onClick(product); })}
      role="button"
      tabIndex={0}
      aria-label={`Ver ${product.name}, ${product.price.toFixed(2)} MXN`}
    >
      <div className="w-full aspect-square mb-3 relative flex justify-center items-center">
        <img
          src={product.image}
          alt={product.name}
          className="max-w-full max-h-full object-contain mix-blend-multiply"
        />
      </div>

      <h3 className="text-[15px] font-semibold text-[#1E1E1E] leading-tight mb-1 line-clamp-2">
        {product.name}
      </h3>

      <p className="text-[13px] text-[#8E8E93] line-clamp-2 mb-3 flex-1 leading-snug">
        {product.description}
      </p>

      <div className="flex items-center mt-auto">
        <span className="text-[15px] font-bold text-[#1E1E1E]">
          ${product.price.toFixed(2)} <span className="text-[12px] font-semibold text-[#8E8E93]">MXN</span>
        </span>
      </div>
    </div>
  );
};

export default ProductCard;

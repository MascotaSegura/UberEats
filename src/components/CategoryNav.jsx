const categories = [
  { id: 'all', name: 'Todos' },
  { id: 'burgers', name: 'Hamburguesas' },
  { id: 'fries', name: 'Papas' },
  { id: 'drinks', name: 'Refrescos' },
  { id: 'extras', name: 'Extras' },
];

const handleKeyDown = (fn) => (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    fn();
  }
};

const CategoryNav = ({ selectedCategory, onSelectCategory }) => {
  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto flex overflow-x-auto no-scrollbar px-4 py-2 gap-3">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              onKeyDown={handleKeyDown(() => onSelectCategory(cat.id))}
              role="button"
              tabIndex={0}
              aria-pressed={isSelected}
              className={`whitespace-nowrap px-5 h-9 flex items-center justify-center rounded-full text-[14px] font-semibold cursor-pointer transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#FF441F] focus-visible:ring-offset-1 ${
                isSelected
                  ? 'bg-[#1E1E1E] text-white'
                  : 'bg-[#F3F4F6] text-[#1E1E1E] hover:bg-[#ECECEE]'
              }`}
            >
              {cat.name}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryNav;

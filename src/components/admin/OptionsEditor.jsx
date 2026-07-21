import React, { useState } from 'react';
import { Plus, X, Trash } from '@phosphor-icons/react';

const OptionsEditor = ({ ingredients, onChangeIngredients, singleChoiceOptions, onChangeSingleChoiceOptions }) => {
  const [ingredientInput, setIngredientInput] = useState('');

  const addIngredient = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      e.preventDefault();
      const val = ingredientInput.trim();
      if (val && !ingredients.includes(val)) {
        onChangeIngredients([...ingredients, val]);
      }
      setIngredientInput('');
    }
  };

  const removeIngredient = (idx) => {
    onChangeIngredients(ingredients.filter((_, i) => i !== idx));
  };

  const addOptionGroup = () => {
    onChangeSingleChoiceOptions([
      ...singleChoiceOptions,
      { title: '', required: true, options: [] }
    ]);
  };

  const updateOptionGroup = (idx, field, value) => {
    const newGroups = [...singleChoiceOptions];
    newGroups[idx][field] = value;
    onChangeSingleChoiceOptions(newGroups);
  };

  const removeOptionGroup = (idx) => {
    onChangeSingleChoiceOptions(singleChoiceOptions.filter((_, i) => i !== idx));
  };

  const addOptionToGroup = (groupIndex) => {
    const newGroups = [...singleChoiceOptions];
    newGroups[groupIndex].options.push({ label: '', priceAdd: 0 });
    onChangeSingleChoiceOptions(newGroups);
  };

  const updateOptionInGroup = (groupIndex, optionIndex, field, value) => {
    const newGroups = [...singleChoiceOptions];
    newGroups[groupIndex].options[optionIndex][field] = value;
    onChangeSingleChoiceOptions(newGroups);
  };

  const removeOptionFromGroup = (groupIndex, optionIndex) => {
    const newGroups = [...singleChoiceOptions];
    newGroups[groupIndex].options = newGroups[groupIndex].options.filter((_, i) => i !== optionIndex);
    onChangeSingleChoiceOptions(newGroups);
  };

  return (
    <div className="flex flex-col gap-6 mt-2 pt-6">
      {/* Ingredientes */}
      <div className="flex flex-col gap-2">
        <label className="text-[13px] font-semibold text-[#1E1E1E]">Ingredientes (Opcional)</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {ingredients.map((ing, idx) => (
            <div key={idx} className="bg-[#1E1E1E] text-white px-3 py-1.5 rounded-full flex items-center gap-2 text-[13px] font-medium animate-fade-in">
              {ing}
              <button
                type="button"
                onClick={() => removeIngredient(idx)}
                className="text-[#8E8E93] hover:text-white transition-colors outline-none"
              >
                <X size={14} weight="bold" />
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={ingredientInput}
            onChange={(e) => setIngredientInput(e.target.value)}
            onKeyDown={addIngredient}
            placeholder="Ej. Tomate (presiona Enter para añadir)"
            className="flex-1 bg-[#F3F4F6] rounded-2xl px-4 py-3 text-[15px] text-[#1E1E1E] outline-none focus:bg-[#ECECEE] transition-colors"
          />
          <button
            type="button"
            onClick={addIngredient}
            className="w-12 bg-[#F3F4F6] text-[#1E1E1E] rounded-2xl flex items-center justify-center hover:bg-[#ECECEE] transition-colors outline-none shrink-0"
          >
            <Plus size={20} weight="bold" />
          </button>
        </div>
      </div>

      {/* Variantes y Opciones */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <label className="text-[13px] font-semibold text-[#1E1E1E]">Opciones Adicionales (Ej. Tamaños, Extras)</label>
          <button
            type="button"
            onClick={addOptionGroup}
            className="text-[#06C167] text-[13px] font-bold hover:text-[#05a055] transition-colors flex items-center gap-1 outline-none"
          >
            <Plus size={14} weight="bold" />
            Nuevo Grupo
          </button>
        </div>

        {singleChoiceOptions.map((group, groupIdx) => (
          <div key={groupIdx} className="bg-[#F3F4F6] rounded-2xl p-4 flex flex-col gap-3 animate-fade-in relative group">
            <button
              type="button"
              onClick={() => removeOptionGroup(groupIdx)}
              className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center text-[#FF3B30] opacity-0 group-hover:opacity-100 transition-all hover:bg-[#FFF0F0] active:scale-95 outline-none shadow-none"
              title="Eliminar grupo"
            >
              <Trash size={16} weight="fill" />
            </button>
            
            <div className="flex flex-col gap-1.5 pr-10">
              <input
                type="text"
                value={group.title}
                onChange={(e) => updateOptionGroup(groupIdx, 'title', e.target.value)}
                placeholder="Título del grupo (Ej. Elige tu tamaño)"
                className="w-full bg-white rounded-2xl px-4 py-2.5 text-[14px] text-[#1E1E1E] outline-none font-medium"
              />
              <label className="flex items-center gap-2 mt-1 cursor-pointer w-max">
                <div className={`w-10 h-6 rounded-full p-1 transition-colors ${group.required ? 'bg-[#06C167]' : 'bg-[#D1D1D6]'}`}>
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${group.required ? 'translate-x-4' : 'translate-x-0'}`} />
                </div>
                <span className="text-[13px] text-[#8E8E93] font-medium">Obligatorio</span>
              </label>
            </div>

            <div className="flex flex-col gap-2 mt-2">
              {group.options.map((opt, optIdx) => (
                <div key={optIdx} className="flex gap-2 animate-fade-in">
                  <input
                    type="text"
                    value={opt.label}
                    onChange={(e) => updateOptionInGroup(groupIdx, optIdx, 'label', e.target.value)}
                    placeholder="Opción (Ej. Grande)"
                    className="flex-1 bg-white rounded-2xl px-4 py-2.5 text-[14px] text-[#1E1E1E] outline-none"
                  />
                  <div className="w-24 bg-white rounded-2xl flex items-center px-3 focus-within:ring-1 focus-within:ring-[#1E1E1E]">
                    <span className="text-[#8E8E93] font-semibold text-[14px]">$</span>
                    <input
                      type="number"
                      value={opt.priceAdd === 0 ? '' : opt.priceAdd}
                      onChange={(e) => updateOptionInGroup(groupIdx, optIdx, 'priceAdd', parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                      className="w-full bg-transparent text-[14px] text-[#1E1E1E] outline-none ml-1 font-medium"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeOptionFromGroup(groupIdx, optIdx)}
                    className="w-10 bg-white rounded-2xl flex items-center justify-center text-[#FF3B30] hover:bg-[#FFF0F0] active:scale-95 transition-colors outline-none shrink-0"
                  >
                    <X size={16} weight="bold" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addOptionToGroup(groupIdx)}
                className="mt-1 w-full border border-dashed border-[#D1D1D6] rounded-2xl py-2.5 flex items-center justify-center gap-1.5 text-[13px] font-bold text-[#8E8E93] hover:text-[#1E1E1E] hover:border-[#1E1E1E] hover:bg-white transition-all outline-none"
              >
                <Plus size={14} weight="bold" />
                Añadir opción
              </button>
            </div>
          </div>
        ))}
        {singleChoiceOptions.length === 0 && (
           <p className="text-[13px] text-[#8E8E93]">No hay opciones adicionales configuradas.</p>
        )}
      </div>
    </div>
  );
};

export default OptionsEditor;

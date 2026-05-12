"use client";
import { useState, useEffect } from "react";
import { Plus, Trash2, X, GripVertical, Image as ImageIcon, Search, Filter } from "lucide-react";
import VariantEditModal from "./VariantEditModal";

export default function ProductVariants({ formData, setFormData, onGenerate, onRemoveVariant }) {
  const [editingVariant, setEditingVariant] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const addOptionType = () => {
    setFormData({ 
      ...formData, 
      optionTypes: [...formData.optionTypes, { name: "", values: "", isEditing: true }] 
    });
  };
  
  const updateOptionType = (idx, field, value) => {
    const newOT = [...formData.optionTypes];
    newOT[idx][field] = value;
    setFormData({ ...formData, optionTypes: newOT });
  };

  const removeOptionType = (idx) => {
    const newOT = formData.optionTypes.filter((_, i) => i !== idx);
    setFormData({ ...formData, optionTypes: newOT });
  };

  const toggleOptionEditing = (idx) => {
    setFormData(prev => {
      const newOT = [...prev.optionTypes];
      newOT[idx].isEditing = !newOT[idx].isEditing;
      return { ...prev, optionTypes: newOT };
    });
    
    // Use a small timeout to ensure state is committed before generation
    setTimeout(() => onGenerate(), 10);
  };

  const updateVariant = (vIdx, field, value) => {
    const newV = [...formData.variants];
    newV[vIdx] = { ...newV[vIdx], [field]: value };
    setFormData({ ...formData, variants: newV });
  };

  const handleEditVariant = (variant, index) => {
    setEditingVariant({ ...variant, index });
    setModalOpen(true);
  };

  const saveVariantChanges = (updatedVariant) => {
    const index = updatedVariant.index;
    const { index: _, ...cleanVariant } = updatedVariant;
    updateVariant(index, null, null); // Just to get the array reference
    const newV = [...formData.variants];
    newV[index] = cleanVariant;
    setFormData({ ...formData, variants: newV });
    setModalOpen(false);
  };

  const totalAvailable = formData.variants.reduce((acc, v) => acc + (parseInt(v.stock_qty) || 0), 0);

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
      <div className="p-4 border-b border-slate-100">
        <h3 className="text-sm font-semibold text-slate-800">Variants</h3>
      </div>
      
      <div className="p-6 space-y-6">
        {/* Modal */}
        <VariantEditModal 
          isOpen={modalOpen} 
          variant={editingVariant} 
          onClose={() => setModalOpen(false)} 
          onSave={saveVariantChanges} 
        />
        {/* Option Builders */}
        <div className="space-y-4">
          {formData.optionTypes.map((ot, idx) => (
            <div key={idx} className="border border-slate-200 rounded-lg p-5 relative bg-slate-50/30">
              <div className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-300">
                <GripVertical size={16} />
              </div>
              
              <div className="pl-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm text-slate-600">Option name</label>
                  <input 
                    type="text" 
                    value={ot.name} 
                    onChange={(e) => updateOptionType(idx, 'name', e.target.value)} 
                    className="w-full border border-slate-300 px-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                    placeholder="e.g. Size" 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-slate-600">Option values</label>
                  <div className="space-y-2">
                    {ot.values.split(',').map((val, vIdx) => {
                      const trimmedVal = val.trim();
                      // Only show non-empty values or the very last empty "new" field
                      return (
                        <div key={vIdx} className="flex items-center gap-2 relative group">
                          <GripVertical size={14} className="text-slate-300 absolute left-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                          <input 
                            type="text" 
                            value={trimmedVal}
                            onChange={(e) => {
                              const newVals = ot.values.split(',');
                              newVals[vIdx] = e.target.value;
                              
                              // Logic: If we are typing in the last field, and it's not empty, add a new empty field
                              if (vIdx === newVals.length - 1 && e.target.value.trim() !== "") {
                                newVals.push("");
                              }
                              
                              updateOptionType(idx, 'values', newVals.join(','));
                            }}
                            onBlur={() => {
                              // Cleanup: Remove empty values except for the last one if we have others
                              const vals = ot.values.split(',').map(v => v.trim()).filter(v => v !== "");
                              if (vals.length > 0) {
                                updateOptionType(idx, 'values', [...vals, ""].join(','));
                              }
                            }}
                            className="w-full bg-white border border-slate-300 pl-10 pr-10 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            placeholder={vIdx === ot.values.split(',').length - 1 ? "Add another value" : ""}
                          />
                          {trimmedVal !== "" && (
                            <button 
                              type="button" 
                              onClick={() => {
                                const newVals = ot.values.split(',').filter((_, i) => i !== vIdx);
                                updateOptionType(idx, 'values', newVals.join(','));
                              }}
                              className="text-slate-400 hover:text-red-500 absolute right-3"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button 
                    type="button" 
                    onClick={() => removeOptionType(idx)}
                    className="text-sm font-medium text-red-500 hover:text-red-600 px-4 py-2 border border-red-100 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    Delete
                  </button>
                  <button 
                    type="button" 
                    onClick={() => toggleOptionEditing(idx)}
                    className="bg-slate-900 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          ))}

          <button 
            type="button" 
            onClick={addOptionType}
            className="flex items-center gap-2 text-blue-600 font-medium text-sm hover:text-blue-700 transition-colors py-2"
          >
            <Plus size={18} className="bg-blue-50 rounded-full p-0.5" />
            Add another option
          </button>
        </div>

        {/* Variant Table Area */}
        {formData.variants.length > 0 && (
          <div className="pt-6 border-t border-slate-100 space-y-4">
            <div className="flex items-center justify-end gap-2 mb-2">
              <div className="p-1.5 border border-slate-200 rounded-lg text-slate-400 hover:bg-slate-50 cursor-pointer">
                <Search size={16} />
              </div>
              <div className="p-1.5 border border-slate-200 rounded-lg text-slate-400 hover:bg-slate-50 cursor-pointer">
                <Filter size={16} />
              </div>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-200">
                    <th className="px-4 py-3 w-10 text-center">
                      <input type="checkbox" className="w-4 h-4 rounded border-slate-300" />
                    </th>
                    <th className="px-4 py-3 font-medium text-slate-600">Variant</th>
                    <th className="px-4 py-3 font-medium text-slate-600 text-right">Price</th>
                    <th className="px-4 py-3 font-medium text-slate-600 text-right">Available</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {formData.variants.map((v, vIdx) => (
                    <tr key={vIdx} className="hover:bg-slate-50/30 transition-colors">
                      <td className="px-4 py-3 w-10 text-center">
                        <input type="checkbox" className="w-4 h-4 rounded border-slate-300" />
                      </td>
                      <td className="px-4 py-3 flex items-center gap-3">
                        <div 
                          onClick={() => handleEditVariant(v, vIdx)}
                          className="w-10 h-10 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center text-slate-300 group cursor-pointer relative overflow-hidden hover:border-slate-400 transition-all"
                        >
                          <ImageIcon size={18} />
                          <div className="absolute inset-0 bg-slate-900/0 hover:bg-slate-900/5 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                            <Plus size={14} className="text-slate-600" />
                          </div>
                        </div>
                        <span 
                          onClick={() => handleEditVariant(v, vIdx)}
                          className="font-medium text-slate-700 cursor-pointer hover:text-blue-600 hover:underline decoration-blue-300 underline-offset-4 transition-all"
                        >
                          {Object.values(v.options).join(" / ")}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="relative inline-block max-w-[120px]">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">Rs</span>
                          <input 
                            type="number"
                            step="0.01"
                            value={v.price ?? ""}
                            onChange={(e) => updateVariant(vIdx, 'price', e.target.value)}
                            className="w-full border border-slate-300 pl-8 pr-3 py-1.5 rounded-lg text-sm text-right focus:outline-none focus:border-blue-500"
                            placeholder="0.00"
                          />
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <input 
                          type="number"
                          value={v.stock_qty ?? 0}
                          onChange={(e) => updateVariant(vIdx, 'stock_qty', e.target.value)}
                          className="w-20 border border-slate-300 px-3 py-1.5 rounded-lg text-sm text-right focus:outline-none focus:border-blue-500 inline-block"
                          placeholder="0"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="px-4 py-3 bg-slate-50/50 text-xs text-slate-500 font-medium">
                Total inventory at Shop location: {totalAvailable} available
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";
import { Plus, Trash2, RefreshCw, X, Layers } from "lucide-react";

export default function ProductVariants({ formData, setFormData, onGenerate, onRemoveVariant }) {
  const addOptionType = () => setFormData({ ...formData, optionTypes: [...formData.optionTypes, { name: "", values: "" }] });
  
  const updateOptionType = (idx, field, value) => {
    const newOT = [...formData.optionTypes];
    newOT[idx][field] = value;
    setFormData({ ...formData, optionTypes: newOT });
  };

  const removeOptionType = (idx) => {
    const newOT = formData.optionTypes.filter((_, i) => i !== idx);
    setFormData({ ...formData, optionTypes: newOT });
  };

  const updateVariant = (vIdx, field, value) => {
    const newV = [...formData.variants];
    newV[vIdx] = { ...newV[vIdx], [field]: value };
    setFormData({ ...formData, variants: newV });
  };

  return (
    <div className="pt-6 border-t border-slate-100">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
            <Layers size={14} className="text-blue-600" /> Product Variants
          </h3>
          <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-tight">Define options like Size or Color.</p>
        </div>
      </div>
      <OptionTypesBuilder optionTypes={formData.optionTypes} onAdd={addOptionType} onUpdate={updateOptionType} onRemove={removeOptionType} onGenerate={onGenerate} />
      <VariantsTable variants={formData.variants} onUpdate={updateVariant} onRemove={onRemoveVariant} defaultPrice={formData.price} />
    </div>
  );
}

function OptionTypesBuilder({ optionTypes, onAdd, onUpdate, onRemove, onGenerate }) {
  return (
    <div className="space-y-4 mb-8 p-4 bg-slate-50 border border-slate-200 rounded-md">
      {optionTypes.map((ot, idx) => (
        <div key={idx} className="grid grid-cols-12 gap-4 items-start">
          <div className="col-span-4 space-y-1">
            <input type="text" value={ot.name} onChange={(e) => onUpdate(idx, 'name', e.target.value)} className="w-full bg-white border border-slate-200 px-3 py-2 text-xs rounded" placeholder="e.g. Size" />
          </div>
          <div className="col-span-7 space-y-1">
            <input type="text" value={ot.values} onChange={(e) => onUpdate(idx, 'values', e.target.value)} className="w-full bg-white border border-slate-200 px-3 py-2 text-xs rounded" placeholder="S, M, L" />
          </div>
          <button type="button" onClick={() => onRemove(idx)} className="col-span-1 pt-2 text-slate-400 hover:text-red-600"><Trash2 size={14} /></button>
        </div>
      ))}
      <div className="flex items-center gap-3">
        <button type="button" onClick={onAdd} className="text-[10px] font-bold text-blue-600 uppercase flex items-center gap-1"><Plus size={12} /> Add Option</button>
        {optionTypes.length > 0 && <button type="button" onClick={onGenerate} className="text-[10px] font-bold text-slate-600 uppercase ml-auto bg-white px-3 py-1.5 border border-slate-200 rounded shadow-sm flex items-center gap-1"><RefreshCw size={12} /> Generate</button>}
      </div>
    </div>
  );
}

function VariantsTable({ variants, onUpdate, onRemove, defaultPrice }) {
  if (variants.length === 0) return null;
  return (
    <div className="border border-slate-200 rounded-md overflow-hidden overflow-x-auto">
      <table className="w-full text-left text-[11px] border-collapse">
        <thead>
          <tr className="bg-slate-100 border-b border-slate-200">
            <th className="px-4 py-2 font-bold text-slate-600 uppercase">Variant</th>
            <th className="px-4 py-2 font-bold text-slate-600 uppercase">SKU</th>
            <th className="px-4 py-2 font-bold text-slate-600 uppercase">Price</th>
            <th className="px-4 py-2 font-bold text-slate-600 uppercase text-center">Active</th>
            <th className="px-4 py-2"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {variants.map((v, vIdx) => (
            <tr key={vIdx}>
              <td className="px-4 py-2 font-bold">{Object.values(v.options).join(" / ")}</td>
              <td className="px-4 py-2"><input type="text" value={v.sku || ""} onChange={(e) => onUpdate(vIdx, 'sku', e.target.value)} className="w-full bg-transparent border-b border-transparent focus:border-blue-400 py-1" /></td>
              <td className="px-4 py-2"><input type="number" value={v.price || ""} onChange={(e) => onUpdate(vIdx, 'price', e.target.value)} className="w-20 bg-transparent border-b border-transparent focus:border-blue-400 py-1" placeholder={defaultPrice} /></td>
              <td className="px-4 py-2 text-center"><button type="button" onClick={() => onUpdate(vIdx, 'is_active', !v.is_active)} className={`w-8 h-4 rounded-full relative transition-colors ${v.is_active ? 'bg-blue-500' : 'bg-slate-200'}`}><div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${v.is_active ? 'left-4.5' : 'left-0.5'}`} /></button></td>
              <td className="px-4 py-2 text-right"><button type="button" onClick={() => onRemove(v, vIdx)} className="text-slate-300 hover:text-red-500"><X size={14} /></button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

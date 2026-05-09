import { Plus } from "lucide-react";

export default function CatalogHeader({ onAdd }) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold text-gray-900">Catalogs</h1>
      <button
        onClick={onAdd}
        className="bg-[#008060] hover:bg-[#006e52] text-white px-4 py-2 rounded-md font-medium text-sm flex items-center gap-2 transition-colors"
      >
        <Plus size={16} /> Add Catalog
      </button>
    </div>
  );
}

export default function AdminSettings() {
  return (
    <div className="space-y-6 max-w-2xl">
      <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Platform Settings</h3>
      
      <div className="bg-white border border-[#E1E3E5] p-8 rounded-sm shadow-sm space-y-8">
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Platform Name</label>
          <input 
            type="text" 
            defaultValue="Shopify-Inspired Admin" 
            className="w-full border border-[#E1E3E5] px-4 py-2 text-sm rounded-sm focus:outline-none focus:border-[#008060] bg-white transition-colors"
          />
        </div>
        
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Support Email</label>
          <input 
            type="email" 
            defaultValue="admin@platform.com" 
            className="w-full border border-[#E1E3E5] px-4 py-2 text-sm rounded-sm focus:outline-none focus:border-[#008060] bg-white transition-colors"
          />
        </div>
        
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Global Commission Rate (%)</label>
          <input 
            type="number" 
            defaultValue="10" 
            className="w-full border border-[#E1E3E5] px-4 py-2 text-sm rounded-sm focus:outline-none focus:border-[#008060] bg-white transition-colors"
          />
        </div>
        
        <div className="pt-6 border-t border-[#E1E3E5] flex justify-end">
          <button className="bg-[#008060] text-white px-6 py-2.5 text-xs font-bold uppercase tracking-wider rounded-sm shadow-sm hover:bg-[#006e52] transition-colors">
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}

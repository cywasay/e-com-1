"use client";
import { X, Loader2, Package, User, MapPin, ShoppingBag, Truck } from "lucide-react";
import StatusBadge from "./StatusBadge";

export default function OrderDetailsPanel({ orderId, onClose, orderDetail, isLoading, onUpdateStatus, isUpdating }) {
  if (!orderId) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <PanelHeader orderId={orderId} onClose={onClose} />
        <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
          {isLoading ? <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-600" /></div> : orderDetail && (
            <>
              <StatusCard orderDetail={orderDetail} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <CustomerInfo customer={orderDetail.customer} buyerType={orderDetail.buyer_type} />
                <ShippingInfo address={orderDetail.shipping_address} />
              </div>
              <OrderItems items={orderDetail.items} total={orderDetail.total_amount} />
              <FulfillmentForm orderDetail={orderDetail} onUpdate={onUpdateStatus} isUpdating={isUpdating} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function PanelHeader({ orderId, onClose }) {
  return (
    <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
      <div>
        <h2 className="text-lg font-black text-gray-900">Order #{orderId}</h2>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Order Details & Fulfillment</p>
      </div>
      <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors"><X size={20} /></button>
    </div>
  );
}

function StatusCard({ orderDetail }) {
  return (
    <div className={`p-6 rounded-xl border flex items-center justify-between bg-white shadow-sm`}>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center"><Package size={24} /></div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Current Status</p>
          <StatusBadge status={orderDetail.status} />
        </div>
      </div>
      <div className="text-right">
        <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Payment ID</p>
        <p className="font-mono text-xs">{orderDetail.stripe_payment_intent || "N/A"}</p>
      </div>
    </div>
  );
}

function CustomerInfo({ customer, buyerType }) {
  return (
    <div className="space-y-4">
      <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2"><User size={12} /> Customer Info</h4>
      <div className="bg-gray-50 p-4 rounded-xl space-y-3">
        <div><p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Name</p><p className="text-sm font-bold">{customer.name}</p></div>
        <div><p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Email</p><p className="text-sm font-bold">{customer.email}</p></div>
        <div><p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Type</p><p className="text-xs font-bold uppercase">{buyerType}</p></div>
      </div>
    </div>
  );
}

function ShippingInfo({ address }) {
  return (
    <div className="space-y-4">
      <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2"><MapPin size={12} /> Shipping Address</h4>
      <div className="bg-gray-50 p-4 rounded-xl">
        <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">{address ? (typeof address === 'string' ? address : JSON.stringify(address, null, 2)) : "No address provided"}</p>
      </div>
    </div>
  );
}

function OrderItems({ items, total }) {
  return (
    <div className="space-y-4">
      <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2"><ShoppingBag size={12} /> Order Items</h4>
      <div className="border border-gray-100 rounded-xl overflow-hidden">
        <table className="w-full text-xs text-left">
          <thead className="bg-gray-50 text-gray-400 border-b border-gray-100">
            <tr><th className="px-4 py-3 font-bold uppercase tracking-widest">Product</th><th className="px-4 py-3 font-bold uppercase tracking-widest text-center">Qty</th><th className="px-4 py-3 font-bold uppercase tracking-widest text-right">Price</th></tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {items?.map((item) => (
              <tr key={item.id}>
                <td className="px-4 py-4">
                  <p className="font-bold text-gray-900">{item.product.name}</p>
                  {item.variant && <p className="text-[9px] text-gray-400 uppercase font-black">{item.variant.label || 'Default'}</p>}
                </td>
                <td className="px-4 py-4 text-center font-bold">{item.quantity}</td>
                <td className="px-4 py-4 text-right font-black">AED {item.unit_price_snapshot}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-50 border-t border-gray-100">
            <tr><td colSpan="2" className="px-4 py-3 text-right text-[10px] font-black uppercase tracking-widest">Total Amount</td><td className="px-4 py-3 text-right text-lg font-black text-blue-600">AED {total}</td></tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

function FulfillmentForm({ orderDetail, onUpdate, isUpdating }) {
  return (
    <div className="space-y-4 pt-4 border-t border-gray-100">
      <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2"><Truck size={12} /> Fulfillment</h4>
      <form onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.target); onUpdate({ status: fd.get("status"), tracking_number: fd.get("tracking_number"), carrier: fd.get("carrier") }); }} className="bg-white border border-gray-200 p-6 rounded-2xl space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Order Status</label>
          <select name="status" defaultValue={orderDetail.status} className="w-full bg-gray-50 border-none px-4 py-3 rounded-xl text-sm font-bold">
            <option value="pending">Pending</option><option value="processing">Processing</option><option value="shipped">Shipped</option><option value="delivered">Delivered</option><option value="cancelled">Cancelled</option><option value="refunded">Refunded</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2"><label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Tracking #</label><input name="tracking_number" defaultValue={orderDetail.tracking_number} className="w-full bg-gray-50 border-none px-4 py-3 rounded-xl text-sm" placeholder="#7721..." /></div>
          <div className="space-y-2"><label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Carrier</label><input name="carrier" defaultValue={orderDetail.carrier} className="w-full bg-gray-50 border-none px-4 py-3 rounded-xl text-sm" placeholder="Aramex" /></div>
        </div>
        <button type="submit" disabled={isUpdating} className="w-full bg-blue-600 text-white py-4 rounded-xl font-black uppercase tracking-widest hover:bg-slate-900 transition-all flex items-center justify-center gap-3 disabled:opacity-50">
          {isUpdating ? <Loader2 className="animate-spin" /> : "Update Fulfillment"}
        </button>
      </form>
    </div>
  );
}

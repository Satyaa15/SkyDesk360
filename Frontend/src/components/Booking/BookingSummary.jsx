import React from 'react';
import { TAX_RATE, MAINTENANCE_FEE } from '../../data/constants';

const BookingSummary = ({ selectedItem, onClear }) => {
  if (!selectedItem) {
    return (
      <div className="glass p-8 sticky top-28">
        <h3 className="text-2xl font-bold mb-6">Summary</h3>
        <div className="py-12 text-center text-gray-500 border border-dashed border-white/10 rounded-2xl">
          <p className="text-sm">Select a space to view pricing.</p>
        </div>
      </div>
    );
  }

  const tax = selectedItem.price * TAX_RATE;
  const total = selectedItem.price + MAINTENANCE_FEE + tax;

  return (
    <div className="glass p-8 sticky top-28 animate-in fade-in slide-in-from-bottom-4">
      <h3 className="text-2xl font-bold mb-6">Booking <span className="text-[#00f2fe]">Summary</span></h3>
      
      <div className="flex justify-between items-start pb-4 border-b border-white/10">
        <div>
          <h4 className="text-white font-bold">{selectedItem.id}</h4>
          <p className="text-xs text-gray-500">{selectedItem.type}</p>
        </div>
        <button onClick={onClear} className="text-[10px] text-red-500 font-bold uppercase hover:underline">Remove</button>
      </div>

      <div className="space-y-3 py-6">
        <SummaryLine label="Base Price" value={selectedItem.price} />
        <SummaryLine label="Maintenance" value={MAINTENANCE_FEE} />
        <SummaryLine label="GST (18%)" value={tax} />
      </div>

      <div className="pt-6 border-t border-white/20 flex justify-between items-center">
        <span className="font-bold">Total Amount</span>
        <span className="text-2xl font-black text-[#00f2fe]">₹{total.toLocaleString()}</span>
      </div>

      <button className="btn-primary w-full py-4 rounded-xl font-bold text-black uppercase tracking-widest mt-6">
        Confirm & Pay
      </button>
    </div>
  );
};

const SummaryLine = ({ label, value }) => (
  <div className="flex justify-between text-sm">
    <span className="text-gray-400">{label}</span>
    <span className="text-white">₹{value.toLocaleString()}</span>
  </div>
);

export default BookingSummary;
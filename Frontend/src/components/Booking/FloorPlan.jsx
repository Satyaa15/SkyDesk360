import React, { useState, useEffect } from 'react';
import api from '../../api/axios';

const FloorPlan = ({ selectedSeats, onSeatClick }) => {
  const [occupiedSeats, setOccupiedSeats] = useState([]);
  const [loading, setLoading] = useState(true);

  // FETCH LIVE OCCUPANCY FROM DATABASE
  useEffect(() => {
    const fetchLiveStatus = async () => {
      try {
        const { data } = await api.get('/admin/all-bookings');
        // We store an array of strings: ["A-01", "C-02", ...]
        setOccupiedSeats(data.map(booking => booking.unit_id));
      } catch (err) {
        console.error("Failed to sync floor plan with server");
      } finally {
        setLoading(false);
      }
    };
    fetchLiveStatus();
  }, []);

  const isSelected = (id) => selectedSeats.some(s => s.id === id);
  const isOccupied = (id) => occupiedSeats.includes(id);

  // Dynamic Seat Generators
  const alphaSeats = Array.from({ length: 12 }, (_, i) => ({
    id: `A-${(i + 1).toString().padStart(2, '0')}`,
    type: 'Hot Desk',
    price: 399
  }));

  const betaSeats = Array.from({ length: 8 }, (_, i) => ({
    id: `B-${(i + 1).toString().padStart(2, '0')}`,
    type: 'Dedicated Desk',
    price: 800
  }));

  if (loading) return <div className="p-20 text-center animate-pulse text-gray-500 uppercase tracking-widest">Calibrating Floor Sensors...</div>;

  return (
    <div className="glass p-6 md:p-10 overflow-x-auto relative">
      <div className="min-w-[750px] space-y-12">
        {/* Legend */}
        <div className="flex justify-between border-b border-white/5 pb-8 items-center">
          <div className="flex gap-8">
            <Legend color="bg-white/5 border-white/10" label="Available" />
            <Legend color="bg-[#1a1a1a] opacity-40" label="Occupied" />
            <Legend color="bg-[#00f2fe] shadow-[0_0_10px_#00f2fe]" label="Selected" />
          </div>
          <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Floor 14 • Live Status</p>
        </div>

        {/* CLUSTERS */}
        <div className="grid grid-cols-2 gap-12">
          {/* Cluster Alpha */}
          <div className="glass bg-white/[0.02] p-6 rounded-3xl border-white/5">
            <h4 className="text-[10px] text-gray-500 uppercase tracking-widest mb-6">Cluster Alpha (Hot Desks)</h4>
            <div className="grid grid-cols-4 gap-4">
              {alphaSeats.map(seat => (
                <button
                  key={seat.id}
                  disabled={isOccupied(seat.id)}
                  onClick={() => onSeatClick(seat)}
                  className={`w-10 h-10 rounded-xl text-[10px] font-black transition-all 
                    ${isOccupied(seat.id) ? 'bg-[#1a1a1a] text-gray-700 cursor-not-allowed opacity-40' : 
                      isSelected(seat.id) ? 'bg-[#00f2fe] text-black shadow-[0_0_15px_#00f2fe] scale-110' : 
                      'bg-white/5 border border-white/10 text-gray-400 hover:border-[#00f2fe] hover:bg-[#00f2fe]/10'}`}
                >
                  {seat.id}
                </button>
              ))}
            </div>
          </div>

          {/* Cluster Beta */}
          <div className="glass bg-white/[0.02] p-6 rounded-3xl border-white/5">
            <h4 className="text-[10px] text-gray-500 uppercase tracking-widest mb-6">Cluster Beta (Dedicated)</h4>
            <div className="grid grid-cols-4 gap-4">
              {betaSeats.map(seat => (
                <button
                  key={seat.id}
                  disabled={isOccupied(seat.id)}
                  onClick={() => onSeatClick(seat)}
                  className={`w-10 h-10 rounded-xl text-[10px] font-black transition-all 
                    ${isOccupied(seat.id) ? 'bg-[#1a1a1a] text-gray-700 cursor-not-allowed opacity-40' : 
                      isSelected(seat.id) ? 'bg-[#00f2fe] text-black shadow-[0_0_15px_#00f2fe] scale-110' : 
                      'bg-white/5 border border-white/10 text-gray-400 hover:border-[#00f2fe] hover:bg-[#00f2fe]/10'}`}
                >
                  {seat.id}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Private Cabins */}
        <h4 className="text-[10px] text-gray-500 uppercase tracking-widest -mb-8 ml-2">Executive Cabins</h4>
        <div className="grid grid-cols-4 gap-6">
           {[1, 2, 3, 4].map(n => {
             const cabinId = `C-0${n}`;
             const cabinData = { id: cabinId, type: 'Private Cabin', price: 25000 };
             const occupied = isOccupied(cabinId);
             
             return (
               <button
                 key={cabinId}
                 disabled={occupied}
                 onClick={() => onSeatClick(cabinData)}
                 className={`h-24 rounded-2xl flex flex-col items-center justify-center gap-1 border transition-all
                   ${occupied ? 'bg-black/40 border-white/5 cursor-not-allowed grayscale' :
                     isSelected(cabinId) ? 'bg-[#7000ff]/20 border-[#7000ff] shadow-[0_0_20px_rgba(112,0,255,0.3)]' : 
                     'bg-white/5 border-white/10 hover:border-[#7000ff]/50'}`}
               >
                 <span className="text-[10px] font-bold text-gray-500">{occupied ? 'RESERVED' : 'CABIN'}</span>
                 <span className={`text-xl font-black ${occupied ? 'text-gray-700' : 'text-white'}`}>{cabinId}</span>
               </button>
             );
           })}
        </div>
      </div>
    </div>
  );
};

const Legend = ({ color, label }) => (
  <div className="flex items-center gap-3">
    <div className={`w-3 h-3 rounded-full border ${color}`}></div>
    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{label}</span>
  </div>
);

export default FloorPlan;
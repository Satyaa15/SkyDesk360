import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FloorPlan from '../components/Booking/FloorPlan';
import { TAX_RATE, MAINTENANCE_FEE } from '../data/constants';
import api from '../api/axios';

const BookingPage = () => {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  // Load user info on mount to ensure session is valid
  useEffect(() => {
    const name = localStorage.getItem('userName');
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/signin');
    }
    setUserName(name || 'Member');
  }, [navigate]);

  // Toggle seat selection
  const toggleSeat = (seat) => {
    setSelectedSeats(prev => {
      const exists = prev.find(s => s.id === seat.id);
      if (exists) return prev.filter(s => s.id !== seat.id);
      return [...prev, seat];
    });
  };

  // Financial Calculations
  const subtotal = selectedSeats.reduce((sum, item) => sum + item.price, 0);
  const tax = subtotal * TAX_RATE;
  const total = subtotal + (selectedSeats.length > 0 ? MAINTENANCE_FEE : 0) + tax;

  // PRIMARY HANDLER: Save bookings to Database
  const handleConfirmReservation = async () => {
    const userId = localStorage.getItem('user_id');
    
    if (!userId) {
      alert("Session expired. Please login again to secure your Nest.");
      return navigate('/signin');
    }

    setIsSubmitting(true);
    try {
      // We map through all selected seats and send a POST request for each
      // This ensures each seat is a unique record in the PostgreSQL 'bookings' table
      const bookingRequests = selectedSeats.map(seat => 
        api.post('/book-seat', {
          user_id: parseInt(userId),
          unit_id: seat.id,
          unit_type: seat.type,
          price: seat.price
        })
      );

      // Execute all API calls simultaneously
      await Promise.all(bookingRequests);
      
      alert("Success! Your space at SkyDesk360 is now reserved.");
      navigate('/admin'); // Redirect to Admin or Profile to view active bookings
      
    } catch (err) {
      console.error("Booking Error:", err);
      const errorMsg = err.response?.data?.detail || "Connection to 14th Floor lost. Please try again.";
      alert(`Booking Failed: ${errorMsg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-screen font-['Plus_Jakarta_Sans']">
      
      {/* NAVIGATION & BREADCRUMB */}
      <button 
        onClick={() => navigate('/')} 
        className="group mb-8 flex items-center gap-3 text-gray-400 hover:text-[#00f2fe] transition-all"
      >
        <div className="w-10 h-10 rounded-full glass border-white/10 flex items-center justify-center group-hover:border-[#00f2fe]/50 group-hover:bg-[#00f2fe]/10">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </div>
        <span className="text-xs font-bold uppercase tracking-widest">Exit to Lobby</span>
      </button>

      {/* PAGE HEADER */}
      <div className="flex flex-col lg:flex-row justify-between items-end mb-12 gap-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#00f2fe] animate-pulse"></span>
            <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Live Session: {userName}</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-white uppercase italic">
            Config <span className="text-[#00f2fe]">Nest.</span>
          </h1>
          <p className="text-gray-500 mt-2 font-light italic">Architecture meets agility. Select your coordinates.</p>
        </div>
        
        {/* RUNNING TOTALS */}
        <div className="glass px-8 py-5 rounded-2xl border-[#00f2fe]/20 flex items-center gap-6">
          <div className="text-right">
            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-[0.2em]">Selected Units</p>
            <p className="text-3xl font-black text-[#00f2fe]">{selectedSeats.length}</p>
          </div>
          <div className="w-[1px] h-12 bg-white/10"></div>
          <div className="text-right">
            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-[0.2em]">Investment</p>
            <p className="text-3xl font-black text-white">₹{total.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-12 items-start">
        {/* INTERACTIVE FLOOR PLAN COMPONENT */}
        <div className="xl:col-span-2">
          <FloorPlan selectedSeats={selectedSeats} onSeatClick={toggleSeat} />
        </div>

        {/* CHECKOUT SIDEBAR */}
        <div className="glass p-8 sticky top-32 h-auto border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent rounded-[2rem]">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <span className="text-[#00f2fe] text-sm font-black tracking-tighter uppercase">01</span> Checkout Summary
          </h3>
          
          {/* SCROLLABLE ITEM LIST */}
          <div className="max-h-64 overflow-y-auto mb-8 space-y-3 pr-2 custom-scrollbar">
            {selectedSeats.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-white/10 rounded-2xl bg-white/[0.01]">
                <p className="text-gray-500 text-xs italic">Blueprint empty.<br/>Select seats on the map.</p>
              </div>
            ) : (
              selectedSeats.map(item => (
                <div key={item.id} className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/5 hover:border-[#00f2fe]/30 transition-all group">
                  <div>
                    <p className="text-white font-bold">{item.id}</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">{item.type}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-[#00f2fe]">₹{item.price.toLocaleString()}</span>
                    <button onClick={() => toggleSeat(item)} className="text-gray-600 hover:text-red-500 transition-all p-1">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6 6 18M6 6l12 12"/></svg>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* FEE BREAKDOWN */}
          <div className="space-y-4 pt-6 border-t border-white/10">
            <div className="flex justify-between text-sm text-gray-400 font-medium">
              <span>Subtotal</span>
              <span className="text-white">₹{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-400 font-medium">
              <span>Maintenance Fee</span>
              <span className="text-white">₹{selectedSeats.length > 0 ? MAINTENANCE_FEE : 0}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-400 font-medium">
              <span>GST ({TAX_RATE * 100}%)</span>
              <span className="text-white">₹{tax.toLocaleString()}</span>
            </div>
            
            <div className="flex justify-between text-3xl font-black pt-6 text-white border-t border-white/5 mt-4">
              <span>Total</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f2fe] to-[#7000ff]">
                ₹{total.toLocaleString()}
              </span>
            </div>
          </div>

          {/* FINAL ACTION BUTTON */}
          <button 
            onClick={handleConfirmReservation}
            disabled={selectedSeats.length === 0 || isSubmitting}
            className="btn-primary w-full py-5 rounded-2xl font-bold text-black uppercase tracking-widest mt-10 disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:shadow-[0_0_25px_rgba(0,242,254,0.4)] relative overflow-hidden group"
          >
            <span className={isSubmitting ? 'opacity-0' : 'opacity-100'}>
              Confirm Reservation
            </span>
            {isSubmitting && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-6 h-6 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </button>
          
          <p className="text-[10px] text-gray-600 text-center mt-6 font-bold uppercase tracking-widest">
            By confirming, you agree to SkyDesk Terms of Service.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
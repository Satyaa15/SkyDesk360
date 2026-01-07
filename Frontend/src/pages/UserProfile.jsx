import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const [myBookings, setMyBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName');
  const userId = localStorage.getItem('user_id');

  useEffect(() => {
    const fetchMyData = async () => {
      try {
        const { data } = await api.get(`/my-bookings/${userId}`);
        setMyBookings(data);
      } catch (err) {
        console.error("Error fetching your bookings");
      } finally {
        setLoading(false);
      }
    };
    if (userId) fetchMyData();
  }, [userId]);

  const handleCancel = async (id) => {
    if (window.confirm("Are you sure you want to release this unit?")) {
      try {
        await api.delete(`/cancel-booking/${id}`);
        setMyBookings(myBookings.filter(b => b.id !== id));
        alert("Unit released successfully.");
      } catch (err) {
        alert("Could not cancel booking.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Profile Header */}
        <div className="flex justify-between items-end mb-12 border-b border-white/5 pb-8">
          <div>
            <span className="text-[#00f2fe] text-[10px] font-black uppercase tracking-[0.3em]">Member Profile</span>
            <h1 className="text-5xl font-black text-white mt-2 uppercase">{userName}</h1>
          </div>
          <div className="text-right">
            <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">Active Nests</p>
            <p className="text-4xl font-black text-[#00f2fe]">{myBookings.length}</p>
          </div>
        </div>

        {/* Bookings List */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white mb-6">Your Current Reservations</h3>
          
          {loading ? (
            <p className="text-gray-500 italic text-sm">Synchronizing with 14th Floor...</p>
          ) : myBookings.length === 0 ? (
            <div className="glass p-10 text-center rounded-3xl border-dashed border-white/10">
              <p className="text-gray-500 mb-6">You don't have any active bookings yet.</p>
              <button onClick={() => navigate('/book')} className="btn-primary px-8 py-3 rounded-xl font-bold text-black uppercase text-xs">Explore Spaces</button>
            </div>
          ) : (
            myBookings.map((booking) => (
              <div key={booking.id} className="glass p-6 rounded-2xl border-white/5 flex justify-between items-center group hover:border-[#00f2fe]/30 transition-all">
                <div className="flex gap-6 items-center">
                  <div className="w-12 h-12 rounded-xl bg-[#00f2fe]/10 flex items-center justify-center text-[#00f2fe] font-black border border-[#00f2fe]/20">
                    {booking.unit_id}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-lg">{booking.unit_type}</h4>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">Reserved on {new Date(booking.booking_date).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-8">
                  <span className="font-black text-white">₹{booking.price}</span>
                  <button 
                    onClick={() => handleCancel(booking.id)}
                    className="text-red-500 opacity-0 group-hover:opacity-100 transition-all hover:scale-110 p-2"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('analytics'); // analytics | manage
  const [hoveredUnit, setHoveredUnit] = useState(null);
  const [liveBookings, setLiveBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State for creating new Sub-Admins
  const [newAdmin, setNewAdmin] = useState({ full_name: '', email: '', password: '' });
  const [adminCreating, setAdminCreating] = useState(false);

  // 1. Fetch live data from FastAPI Backend
  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/admin/all-bookings');
      setLiveBookings(data);
    } catch (err) {
      console.error("System Error: Could not fetch floor data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
    // Real-time refresh every 30 seconds to keep occupancy updated
    const interval = setInterval(fetchAdminData, 30000);
    return () => clearInterval(interval);
  }, []);

  // 2. Handle Sub-Admin Creation
  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    setAdminCreating(true);
    try {
      await api.post('/admin/create-sub-admin', newAdmin);
      alert(`Success: Admin credentials dispatched to ${newAdmin.email}. Check terminal for mail simulation.`);
      setNewAdmin({ full_name: '', email: '', password: '' });
    } catch (err) {
      alert(err.response?.data?.detail || "Action failed: Unauthorized or User exists.");
    } finally {
      setAdminCreating(false);
    }
  };

  // 3. Aggregate Calculations
  const totalRevenue = liveBookings.reduce((acc, b) => acc + b.price, 0);
  const occupancyRate = ((liveBookings.length / 48) * 100).toFixed(1);

  return (
    <div className="min-h-screen bg-[#020202] text-white pt-24 font-['Plus_Jakarta_Sans']">
      
      {/* SIDEBAR NAVIGATION */}
      <div className="fixed left-6 top-32 bottom-10 w-20 glass rounded-3xl flex flex-col items-center py-10 gap-8 border-white/5 z-50 hidden xl:flex">
        <NavIcon 
            icon="📊" 
            label="Live Intel"
            active={activeTab === 'analytics'} 
            onClick={() => setActiveTab('analytics')} 
        />
        <NavIcon 
            icon="🔐" 
            label="Manage"
            active={activeTab === 'manage'} 
            onClick={() => setActiveTab('manage')} 
        />
      </div>

      <div className="xl:ml-32 px-6 max-w-[1600px] mx-auto pb-20">
        
        {/* DASHBOARD HEADER */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 bg-[#00f2fe]/10 text-[#00f2fe] text-[10px] font-black rounded-full border border-[#00f2fe]/20 uppercase tracking-[0.2em]">SkyControl Live</span>
              <span className="text-gray-600 text-[10px] font-bold uppercase tracking-widest italic">Admin Command Center</span>
            </div>
            <h1 className="text-5xl font-black tracking-tighter uppercase italic">
                Sky<span className="text-[#00f2fe]">Control</span> Admin
            </h1>
          </div>
          
          <div className="flex gap-4">
            <div className="glass px-6 py-4 rounded-2xl border-white/5 text-right">
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Occupancy</p>
              <p className="text-2xl font-black text-white">{occupancyRate}%</p>
            </div>
            <div className="glass px-6 py-4 rounded-2xl border-white/5 text-right">
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Total Units</p>
              <p className="text-2xl font-black text-[#00f2fe]">{liveBookings.length}</p>
            </div>
          </div>
        </header>

        {activeTab === 'analytics' ? (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
              {/* INTERACTIVE BLUEPRINT MAP */}
              <div className="lg:col-span-3 glass p-10 rounded-[3rem] border-white/5 relative bg-white/[0.01]">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-bold uppercase tracking-tight">Interactive <span className="text-[#00f2fe]">Floor Blueprint</span></h3>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#00f2fe]"></div><span className="text-[10px] text-gray-500 font-bold uppercase">Occupied</span></div>
                    <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-white/10"></div><span className="text-[10px] text-gray-500 font-bold uppercase">Vacant</span></div>
                  </div>
                </div>

                <div className="relative border border-white/5 p-12 rounded-[2rem] bg-black/40 grid grid-cols-2 sm:grid-cols-6 lg:grid-cols-12 gap-3">
                   {Array.from({length: 48}, (_, i) => {
                     const id = `S-${(i + 1).toString().padStart(2, '0')}`;
                     const booking = liveBookings.find(b => b.unit_id === id);
                     return (
                       <div
                         key={id}
                         onMouseEnter={() => setHoveredUnit(booking || { unit_id: id, status: 'Available' })}
                         onMouseLeave={() => setHoveredUnit(null)}
                         className={`h-12 rounded-lg cursor-crosshair transition-all duration-300 hover:scale-110 
                           ${booking ? 'bg-[#00f2fe] shadow-[0_0_20px_rgba(0,242,254,0.3)]' : 'bg-white/5'} border border-white/10`}
                       >
                         <div className="w-full h-full flex items-center justify-center opacity-10 text-[8px] font-bold">
                           {id}
                         </div>
                       </div>
                     );
                   })}

                   {hoveredUnit && (
                     <div className="absolute top-4 right-4 w-64 glass p-6 rounded-2xl border-[#00f2fe]/40 z-50 backdrop-blur-xl">
                       <p className="text-[10px] font-bold text-[#00f2fe] uppercase tracking-widest mb-1">{hoveredUnit.unit_id}</p>
                       <h4 className="text-xl font-black mb-4">{hoveredUnit.id ? 'Occupied' : 'Vacant'}</h4>
                       <div className="space-y-3 border-t border-white/10 pt-4 text-[10px]">
                         <div className="flex justify-between uppercase">
                           <span className="text-gray-500 font-bold">Category</span>
                           <span className="text-white">{hoveredUnit.unit_type || 'Open Unit'}</span>
                         </div>
                         <div className="flex justify-between uppercase">
                           <span className="text-gray-500 font-bold">Base Revenue</span>
                           <span className="text-[#00f2fe] font-black">₹{hoveredUnit.price || 0}</span>
                         </div>
                       </div>
                     </div>
                   )}
                </div>
              </div>

              {/* STATS PANEL */}
              <div className="flex flex-col gap-6">
                <MetricCard title="Est. Gross Revenue" value={`₹${totalRevenue.toLocaleString()}`} sub="Live Postgres Sync" />
                <MetricCard title="System Health" value="99.99%" sub="All API Endpoints Active" />
                <div className="glass p-8 rounded-[2rem] border-white/5 bg-gradient-to-br from-[#7000ff]/10 to-transparent flex-grow">
                   <h4 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-6">Server Location</h4>
                   <p className="text-sm font-bold text-white mb-2">Baner HQ - Wing B</p>
                   <div className="flex items-center gap-2 text-[10px] text-green-500 font-bold uppercase">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                      Encrypted Tunnel Active
                   </div>
                </div>
              </div>
            </div>

            {/* RECENT TRANSACTIONS TABLE */}
            <div className="glass p-10 rounded-[3rem] border-white/5">
              <h3 className="text-xl font-bold uppercase tracking-tight mb-8 flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-[#7000ff]"></span> Transaction Audit Log
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-gray-500 text-[10px] font-black uppercase tracking-widest border-b border-white/5">
                      <th className="pb-4">Booking ID</th>
                      <th className="pb-4">Unit</th>
                      <th className="pb-4">Category</th>
                      <th className="pb-4">Amount</th>
                      <th className="pb-4">Date</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {liveBookings.length === 0 ? (
                        <tr><td colSpan="5" className="py-10 text-center text-gray-600 italic">No bookings found in database.</td></tr>
                    ) : (
                        liveBookings.slice().reverse().map((booking) => (
                        <tr key={booking.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                            <td className="py-4 font-mono text-xs text-gray-400">#BK-360-{booking.id}</td>
                            <td className="py-4 font-bold">{booking.unit_id}</td>
                            <td className="py-4 text-xs text-gray-500 uppercase font-bold">{booking.unit_type}</td>
                            <td className="py-4 font-black text-[#00f2fe]">₹{booking.price}</td>
                            <td className="py-4 text-xs text-gray-400">{new Date(booking.booking_date).toLocaleDateString()}</td>
                        </tr>
                        ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          /* SUB-ADMIN MANAGEMENT TAB */
          <div className="max-w-xl mx-auto">
             <div className="glass p-10 rounded-[3rem] border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#00f2fe]/5 blur-[80px]"></div>
                <h3 className="text-3xl font-black mb-2 italic">Authorize <span className="text-[#00f2fe]">Admin.</span></h3>
                <p className="text-gray-500 text-sm mb-10">Deploy a new administrator to the command center. Credentials will be dispatched immediately.</p>
                
                <form onSubmit={handleCreateAdmin} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-2">Full Name</label>
                    <input 
                        type="text" 
                        required
                        value={newAdmin.full_name}
                        onChange={e => setNewAdmin({...newAdmin, full_name: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-[#00f2fe] transition-all" 
                        placeholder="e.g. Satish Swamy"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-2">Email Identity</label>
                    <input 
                        type="email" 
                        required
                        value={newAdmin.email}
                        onChange={e => setNewAdmin({...newAdmin, email: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-[#00f2fe] transition-all" 
                        placeholder="admin@skydesk.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-2">Secure Passcode</label>
                    <input 
                        type="password" 
                        required
                        value={newAdmin.password}
                        onChange={e => setNewAdmin({...newAdmin, password: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-[#00f2fe] transition-all" 
                        placeholder="••••••••"
                    />
                  </div>
                  <button 
                    disabled={adminCreating}
                    className="btn-primary w-full py-5 rounded-2xl font-black text-black uppercase tracking-widest mt-6 hover:shadow-[0_0_30px_rgba(0,242,254,0.3)] disabled:opacity-50"
                  >
                    {adminCreating ? 'Authorizing...' : 'Deploy Administrator'}
                  </button>
                </form>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* HELPER COMPONENTS */
const NavIcon = ({ icon, label, active, onClick }) => (
  <div className="flex flex-col items-center gap-1">
    <button 
        onClick={onClick} 
        className={`text-2xl transition-all duration-300 hover:scale-125 
        ${active ? 'opacity-100 drop-shadow-[0_0_10px_#00f2fe]' : 'opacity-20 hover:opacity-100'}`}
    >
        {icon}
    </button>
    <span className={`text-[8px] font-bold uppercase tracking-tighter transition-all ${active ? 'text-[#00f2fe]' : 'text-transparent'}`}>
        {label}
    </span>
  </div>
);

const MetricCard = ({ title, value, sub }) => (
  <div className="glass p-8 rounded-[2rem] border-white/5 hover:border-[#00f2fe]/20 transition-all group">
    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-3">{title}</p>
    <div className="text-3xl font-black text-white group-hover:text-[#00f2fe] transition-colors">{value}</div>
    <p className="text-[10px] text-green-500 mt-1 font-bold">{sub}</p>
  </div>
);

export default AdminDashboard;
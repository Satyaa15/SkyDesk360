import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const SignUp = () => {
  const [formData, setFormData] = useState({ full_name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      await api.post('/signup', formData);
      alert("Account created successfully! Please sign in.");
      navigate('/signin');
    } catch (err) {
      alert(err.response?.data?.detail || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 flex flex-col items-center justify-center bg-[#050505] relative">
      {/* ROLLBACK BUTTON */}
      <button 
        onClick={() => navigate('/')}
        className="absolute top-10 left-10 flex items-center gap-2 text-gray-500 hover:text-white transition-all text-xs font-bold uppercase tracking-widest"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m15 18-6-6 6-6"/></svg>
        Back to Home
      </button>

      <div className="glass max-w-md w-full p-10 rounded-[2.5rem] border-white/10">
        <h2 className="text-3xl font-black tracking-tighter text-center mb-8 text-white uppercase italic">
          Join <span className="text-[#00f2fe]">SkyDesk</span>
        </h2>
        <form onSubmit={handleSignUp} className="space-y-4">
          <input type="text" placeholder="Full Name" className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-[#00f2fe]" onChange={(e) => setFormData({...formData, full_name: e.target.value})} required />
          <input type="email" placeholder="Email Address" className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-[#00f2fe]" onChange={(e) => setFormData({...formData, email: e.target.value})} required />
          <input type="password" placeholder="Create Password" className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-[#00f2fe]" onChange={(e) => setFormData({...formData, password: e.target.value})} required />
          <button type="submit" className="w-full bg-[#00f2fe] py-4 rounded-xl font-bold text-black uppercase tracking-widest mt-4">Initialize Account</button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
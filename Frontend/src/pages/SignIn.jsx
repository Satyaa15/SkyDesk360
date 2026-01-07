import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/login', { email, password });
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('isAdmin', data.is_admin);
      localStorage.setItem('user_id', data.user_id);
      localStorage.setItem('userName', data.full_name);
      
      if (data.is_admin) navigate('/admin');
      else navigate('/');
    } catch (err) {
      alert(err.response?.data?.detail || "Invalid Credentials");
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
          Sky<span className="text-[#00f2fe]">Control</span> Login
        </h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input type="email" placeholder="Email" className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-[#00f2fe]" onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-[#00f2fe]" onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit" className="w-full bg-[#00f2fe] py-4 rounded-xl font-bold text-black uppercase tracking-widest mt-4">Sign In</button>
        </form>
        <p className="text-center text-gray-500 text-[10px] mt-8 uppercase font-bold">
          New Member? <Link to="/signup" className="text-[#00f2fe]">Create Identity</Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
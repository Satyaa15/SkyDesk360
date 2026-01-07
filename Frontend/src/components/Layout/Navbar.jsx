import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    // Get name stored during Login/Signup
    const storedName = localStorage.getItem('userName');
    if (storedName) {
      setUserName(storedName);
    }
  }, [token]); // Re-run when token changes (login/logout)

  const handleLogout = () => {
    localStorage.clear(); // Clears token, name, and admin status
    navigate('/'); // Redirect to Home Page
    window.location.reload(); // Refresh to update navbar state
  };

  return (
    <nav className="fixed top-0 w-full z-[100] px-6 py-4 glass bg-black/40 border-b border-white/5 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00f2fe] to-[#7000ff] flex items-center justify-center font-black italic text-white transition-transform group-hover:scale-110">
            S
          </div>
          <span className="text-xl font-extrabold text-white tracking-tighter">
            SKY<span className="text-[#00f2fe]">DESK</span>360
          </span>
        </Link>

        {/* ACTIONS */}
        <div className="flex items-center gap-6">
          {token ? (
            <div className="flex items-center gap-6">
              <Link to="/profile" className="text-[10px] font-black uppercase text-[#00f2fe] tracking-[0.2em] hover:text-white transition-all">
                Hi, {userName.split(' ')[0]}
              </Link>
              <button 
                onClick={handleLogout}
                className="text-[10px] font-bold text-gray-500 hover:text-red-500 uppercase tracking-widest transition-all"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link to="/signin" className="text-[10px] font-bold text-gray-400 hover:text-white uppercase tracking-widest">
              Login
            </Link>
          )}
          
          
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="py-20 px-6 border-t border-white/5 bg-black/40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
        
        {/* BRAND COLUMN */}
        <div className="flex flex-col items-center md:items-start gap-4">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00f2fe] to-[#7000ff] flex items-center justify-center font-black italic text-white transition-transform group-hover:scale-110">
              S
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-extrabold tracking-tighter text-white">
                Sky<span className="text-[#00f2fe]">Desk</span>
                <span className="text-white/50 text-sm font-light ml-0.5">360</span>
              </span>
              <span className="text-[7px] uppercase tracking-[0.5em] text-gray-500 font-bold">Premium Workspace</span>
            </div>
          </Link>
          <p className="text-[10px] text-gray-600 uppercase tracking-widest mt-2">
            © 2026 SkyDesk360 High-Rise Solutions. <br className="md:hidden"/> Baner HQ, District 01.
          </p>
        </div>
        
        {/* NAV & LEGAL LINKS */}
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <div className="flex gap-8 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
            <Link to="/" className="hover:text-[#00f2fe] transition-colors">Home</Link>
            <Link to="/book" className="hover:text-[#00f2fe] transition-colors">Booking</Link>
            <a href="#location" className="hover:text-[#00f2fe] transition-colors">Location</a>
          </div>
          
          <div className="hidden md:block w-px h-4 bg-white/10"></div>
          
          <div className="flex gap-8 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Use</a>
          </div>
        </div>

        {/* SOCIAL/CONTACT HINT */}
        <div className="flex items-center gap-4">
           <div className="w-8 h-8 rounded-full border border-white/5 flex items-center justify-center text-gray-400 hover:border-[#00f2fe] hover:text-[#00f2fe] transition-all cursor-pointer">
             <span className="text-xs">in</span>
           </div>
           <div className="w-8 h-8 rounded-full border border-white/5 flex items-center justify-center text-gray-400 hover:border-[#00f2fe] hover:text-[#00f2fe] transition-all cursor-pointer">
             <span className="text-xs">X</span>
           </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
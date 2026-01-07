import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Shield, Zap, Coffee, Monitor, Car, Globe, ArrowRight, MapPin, Play, Pause, RotateCcw, FastForward, Rewind } from 'lucide-react';
import SpaceCard from '../components/UI/SpaceCard';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Leaflet Icon Fix
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({ iconUrl: markerIcon, shadowUrl: markerShadow, iconSize: [25, 41], iconAnchor: [12, 41] });
L.Marker.prototype.options.icon = DefaultIcon;

const Home = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');
  const position = [18.552146999436236, 73.77132638120212];

  // --- VIDEO PLAYER STATE ---
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  // --- ADVANCED SCROLL & PARALLAX LOGIC ---
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothScroll = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const heroScale = useTransform(smoothScroll, [0, 0.2], [1, 0.85]);
  const heroRotateX = useTransform(smoothScroll, [0, 0.2], [0, 15]);
  const heroOpacity = useTransform(smoothScroll, [0, 0.2], [1, 0]);
  const heroBlur = useTransform(smoothScroll, [0, 0.2], [0, 8]);

  // --- VIDEO CONTROL FUNCTIONS ---
  const togglePlay = () => {
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    const current = (videoRef.current.currentTime / videoRef.current.duration) * 100;
    setProgress(current);
  };

  const skip = (time) => {
    videoRef.current.currentTime += time;
  };

  const handleBookingRedirect = () => {
    isLoggedIn ? navigate('/book') : navigate('/signin');
  };

  const amenities = [
    { icon: <Globe className="w-8 h-8 text-[#00f2fe]" />, title: "High-Speed WiFi", desc: "Redundant 10Gbps fiber lines for uninterrupted flow." },
    { icon: <Coffee className="w-8 h-8 text-orange-400" />, title: "Gourmet Coffee", desc: "Unlimited artisan brews and premium pantry access." },
    { icon: <Shield className="w-8 h-8 text-[#7000ff]" />, title: "24/7 Security", desc: "Advanced biometric access and round-the-clock CCTV." },
    { icon: <Monitor className="w-8 h-8 text-blue-500" />, title: "Business Support", desc: "Enterprise-grade printing and mail handling services." },
    { icon: <Zap className="w-8 h-8 text-yellow-400" />, title: "Zero Downtime", desc: "Designed lounge areas for networking and relaxation." },
    { icon: <Car className="w-8 h-8 text-pink-500" />, title: "Valet Parking", desc: "Reserved parking slots with dedicated valet assistance." },
  ];

  return (
    <div ref={containerRef} className="bg-[#020202] text-white selection:bg-[#00f2fe] selection:text-black perspective-1000">
      
      {/* --- HERO SECTION: PERSPECTIVE TILT EXIT + LIGHT WASH --- */}
      <section className="relative h-screen sticky top-0 z-20 flex items-center justify-center overflow-hidden">
        {/* Subtle Light Wash Animation */}
        <div className="absolute inset-0 pointer-events-none z-10">
            <motion.div 
                animate={{ 
                    x: ['-100%', '100%'],
                    opacity: [0, 0.3, 0] 
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 scale-150"
            />
        </div>

        <motion.div 
          style={{ 
            scale: heroScale, 
            rotateX: heroRotateX, 
            opacity: heroOpacity,
            filter: `blur(${heroBlur}px)` 
          }}
          className="relative z-20 text-center px-6 w-full"
        >
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
          >
            <motion.span 
              variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
              className="inline-flex items-center gap-2 text-[10px] font-black tracking-[0.6em] text-[#00f2fe] uppercase mb-8 border border-[#00f2fe]/30 px-5 py-2 rounded-full bg-[#00f2fe]/5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#00f2fe] animate-pulse" />
              14 Floors Above Ordinary
            </motion.span>
            
            <h1 className="text-[14vw] md:text-[10vw] font-black leading-[0.8] tracking-tighter uppercase italic overflow-hidden">
              <motion.span 
                variants={{ hidden: { y: "100%" }, visible: { y: 0 } }}
                transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
                className="block relative"
              >
                SKY<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f2fe] to-[#7000ff]">DESK360</span>
              </motion.span>
            </h1>

            <motion.p 
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
              transition={{ delay: 0.6 }}
              className="text-gray-400 text-sm md:text-lg max-w-xl mx-auto mt-8 mb-12 font-medium"
            >
              The world's first AI-integrated premium workspace. 
              Luxury meets logic at Pune's premier altitude.
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="flex flex-col md:flex-row items-center justify-center gap-6"
          >
            <button
              onClick={handleBookingRedirect}
              className="group relative bg-[#00f2fe] text-black px-12 py-5 rounded-full font-black text-xs uppercase tracking-widest flex items-center gap-3 transition-all hover:pr-14"
            >
              Reserve Now 
              <ArrowRight className="w-4 h-4 absolute right-5 opacity-0 group-hover:opacity-100 transition-all" />
            </button>
          </motion.div>
        </motion.div>

        {/* Parallax Background Glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,#7000ff08,transparent_70%)]" />
        </div>
      </section>

      {/* --- MAIN CONTENT: SLIDES OVER HERO --- */}
      <div className="relative z-30 bg-[#020202] shadow-[0_-50px_100px_rgba(0,0,0,1)]">
        
        {/* STATS BAR */}
        <section className="py-24 border-b border-white/5 bg-white/[0.01] backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            <StatItem value="500+" label="Pioneer Members" />
            <StatItem value="10Gbps" label="Neural Fiber" />
            <StatItem value="24/7" label="Secure Access" />
            <StatItem value="14th" label="Floor Altitude" />
          </div>
        </section>

        {/* --- RESPONSIVE VIDEO PLAYER SECTION --- */}
        <section className="py-20 md:py-32 px-6 overflow-hidden">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-center gap-12 md:gap-20">
            {/* Text Content */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="w-full lg:w-1/2 text-center lg:text-left"
            >
              <h2 className="text-5xl md:text-6xl font-black tracking-tighter italic uppercase mb-6 md:mb-8">
                The <span className="text-[#00f2fe]">Walkthrough.</span>
              </h2>
              <p className="text-gray-400 text-base md:text-lg leading-relaxed mb-6 md:mb-8 font-light italic">
                Control your perspective. Take a guided virtual flight through our 14th-floor ecosystem using the interactive controller.
              </p>
              <div className="h-px w-20 bg-[#00f2fe] mx-auto lg:mx-0 mb-8" />
              <div className="flex justify-center lg:justify-start gap-8 md:gap-12">
                <div className="text-center lg:text-left">
                    <p className="text-xl md:text-2xl font-black text-white">4K</p>
                    <p className="text-[10px] text-gray-600 uppercase font-bold">Resolution</p>
                </div>
                <div className="text-center lg:text-left">
                    <p className="text-xl md:text-2xl font-black text-white">360°</p>
                    <p className="text-[10px] text-gray-600 uppercase font-bold">Capture</p>
                </div>
              </div>
            </motion.div>

            {/* Video Player Mockup */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="w-full lg:w-1/2 flex justify-center items-center"
            >
              {/* Responsive Container for Mobile Video */}
              <div className="relative group w-full max-w-[280px] sm:max-w-[320px] aspect-[9/18.5] bg-[#111] rounded-[2.5rem] md:rounded-[3.5rem] border-[8px] md:border-[12px] border-white/5 shadow-2xl overflow-hidden glass ring-1 ring-white/10">
                <video 
                  ref={videoRef}
                  onTimeUpdate={handleTimeUpdate}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  playsInline 
                  className="w-full h-full object-cover pointer-events-none"
                >
                  <source src="/videos/office-tour.mp4" type="video/mp4" />
                </video>

                {/* --- CUSTOM GLASS CONTROLS (Responsive) --- */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6 md:p-8">
                  {/* Progress Seek Bar */}
                  <div className="w-full h-1 bg-white/20 rounded-full mb-6 md:mb-8 overflow-hidden">
                    <motion.div 
                        className="h-full bg-[#00f2fe]" 
                        style={{ width: `${progress}%` }} 
                    />
                  </div>

                  {/* Buttons Row */}
                  <div className="flex items-center justify-between mb-4 md:mb-6">
                    <button onClick={() => skip(-5)} className="text-white/70 hover:text-[#00f2fe]"><Rewind size={20} className="md:w-6 md:h-6" /></button>
                    <button 
                        onClick={togglePlay} 
                        className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20"
                    >
                      {isPlaying ? <Pause fill="white" size={24} className="md:w-7 md:h-7" /> : <Play fill="white" className="ml-1 md:w-7 md:h-7" size={24} />}
                    </button>
                    <button onClick={() => skip(5)} className="text-white/70 hover:text-[#00f2fe]"><FastForward size={20} className="md:w-6 md:h-6" /></button>
                  </div>
                  
                  <button onClick={() => {videoRef.current.currentTime = 0}} className="text-[7px] md:text-[8px] font-black text-gray-500 uppercase tracking-[0.3em] flex items-center justify-center gap-2 hover:text-white">
                      <RotateCcw size={10} className="md:w-3 md:h-3" /> Restart Experience
                  </button>
                </div>

                {/* Pulsing Play Button for Interaction */}
                {!isPlaying && (
                    <div onClick={togglePlay} className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black/20">
                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#00f2fe] flex items-center justify-center shadow-[0_0_30px_rgba(0,242,254,0.5)]">
                            <Play fill="black" size={28} className="md:w-8 md:h-8" />
                        </div>
                    </div>
                )}

                {/* Visual Phone Mockup Details */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 md:w-32 h-4 md:h-6 bg-[#020202] rounded-b-2xl z-20" />
              </div>
            </motion.div>
          </div>
        </section>

        {/* 4. CURATED SPACES */}
        <section id="spaces" className="py-32 px-6 bg-white/[0.01]">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-6xl md:text-7xl font-black italic tracking-tighter uppercase leading-none mb-16 md:mb-20 text-center">
              Curated <span className="text-[#00f2fe]">Nests.</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <SpaceCard image="https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&w=800&q=80" title="Hot Desks" price="399" />
              <SpaceCard image="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80" title="Private Cabins" price="25,000" />
              <SpaceCard image="https://images.unsplash.com/photo-1431540015161-0bf868a2d407?auto=format&fit=crop&w=800&q=80" title="Meeting Rooms" price="999" />
            </div>
          </div>
        </section>

        {/* 5. AMENITIES GRID */}
        <section className="py-32 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {amenities.map((item, i) => (
                <motion.div 
                  key={i}
                  whileHover={{ y: -10, borderColor: "rgba(0,242,254,0.3)" }}
                  className="p-10 rounded-[2.5rem] border border-white/5 glass transition-all group"
                >
                  <div className="mb-6 group-hover:scale-110 transition-transform">{item.icon}</div>
                  <h3 className="text-xl font-bold mb-3 uppercase italic">{item.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. THE LOCATION */}
        <section id="location" className="py-32 px-6">
          <div className="max-w-7xl mx-auto glass rounded-[3rem] md:rounded-[4rem] border-white/5 overflow-hidden flex flex-col lg:flex-row shadow-2xl">
            <div className="lg:w-1/2 p-10 md:p-20">
              <h2 className="text-5xl md:text-6xl font-black tracking-tighter mb-8 italic uppercase leading-none">The <span className="text-[#00f2fe]">Location.</span></h2>
              <div className="flex gap-6 mb-12">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center shrink-0"><MapPin className="text-[#00f2fe]" /></div>
                <p className="text-gray-400 font-medium leading-relaxed">
                  14th Floor, Maruti Chowk, Baner, Pune, MH 411045
                </p>
              </div>
              <motion.button 
                whileHover={{ x: 10 }}
                className="text-xs font-black uppercase tracking-[0.3em] flex items-center gap-4 text-[#00f2fe]"
              >
                Satellite Coordinates <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
            <div className="lg:w-1/2 h-[400px] md:h-[500px] grayscale hover:grayscale-0 transition-all duration-1000 contrast-125 brightness-50 hover:brightness-100 border-l border-white/5">
              <MapContainer center={position} zoom={15} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={position} />
              </MapContainer>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

/* --- HELPER SUB-COMPONENTS --- */
const StatItem = ({ value, label }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="text-center"
  >
    <div className="text-4xl md:text-5xl font-black mb-2 tracking-tighter uppercase italic text-white">{value}</div>
    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em]">{label}</div>
  </motion.div>
);

export default Home;
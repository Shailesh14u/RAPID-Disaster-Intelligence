import React, { useState, useEffect } from 'react';
import { Satellite, Activity } from 'lucide-react';

const Header = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatUTC = (date) => {
    return date.toISOString().substr(11, 8) + ' UTC';
  };

  return (
    <header className="absolute top-0 left-0 w-full h-14 bg-[rgba(2,11,17,0.9)] border-b border-[#00D9FF] z-50 flex items-center justify-between px-6 shadow-[0_0_15px_rgba(0,217,255,0.2)] font-mono">
      {/* Left */}
      <div className="flex items-center gap-4">
        <div className="flex flex-col">
          <span className="text-[#00D9FF] font-bold text-lg tracking-widest leading-none">D-OPS</span>
          <span className="text-gray-400 text-[0.65rem] tracking-widest">DISASTER OPERATIONS INTELLIGENCE</span>
        </div>
      </div>

      {/* Center Nav */}
      <nav className="hidden md:flex items-center gap-8">
        <div className="text-[#00D9FF] text-sm tracking-widest border-b-2 border-[#00D9FF] pb-1 cursor-pointer font-bold">INCIDENT MAP</div>
        <div className="text-gray-500 text-sm tracking-widest hover:text-gray-300 transition-colors cursor-pointer">CHANGE ANALYSIS</div>
        <div className="text-gray-500 text-sm tracking-widest hover:text-gray-300 transition-colors cursor-pointer">RESPONSE CENTER</div>
      </nav>

      {/* Right */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#00D9FF] hud-blinker"></div>
          <Satellite size={16} className="text-[#00D9FF]" />
          <span className="text-[#00D9FF] text-xs tracking-wider">SATELLITE LINK</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#A78BFA] hud-blinker"></div>
          <Activity size={16} className="text-[#A78BFA]" />
          <span className="text-[#A78BFA] text-xs tracking-wider">AI ONLINE</span>
        </div>
        <div className="text-gray-300 text-sm tracking-wider w-24 text-right">
          {formatUTC(time)}
        </div>
      </div>
    </header>
  );
};

export default Header;

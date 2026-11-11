import React from 'react';
import { Search, AlertTriangle, CloudRain, ShieldAlert, Navigation } from 'lucide-react';
import useAppStore from '../store/appStore';
import { MOCK_LIVE_CONDITIONS } from '../data/mockData';

const LeftPanels = () => {
  const selectedZone = useAppStore(state => state.selectedZone);

  return (
    <div className="absolute top-20 left-6 bottom-24 w-80 flex flex-col gap-4 z-40 font-mono pointer-events-none">
      
      {/* Panel 1: INCIDENT STATUS */}
      <div className="hud-panel hud-cut-corner p-4 pointer-events-auto">
        <div className="flex items-center justify-between mb-4 border-b border-[#00D9FF] pb-2">
          <h2 className="text-[#00D9FF] text-xs font-bold tracking-widest">INCIDENT STATUS</h2>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#FF354F] hud-blinker"></div>
            <span className="text-[#FF354F] text-[10px] font-bold tracking-wider">CRITICAL</span>
          </div>
        </div>
        
        <div className="mb-4">
          <h3 className="text-white font-bold text-lg">MUMBAI FLOOD</h3>
          <p className="text-gray-400 text-xs mt-1">Multi-Temporal Change Detected</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[rgba(0,217,255,0.05)] p-2 border border-[rgba(0,217,255,0.2)]">
            <div className="text-gray-400 text-[10px] tracking-wider mb-1">AFFECTED AREA</div>
            <div className="text-[#00D9FF] text-lg font-bold">{selectedZone?.analysis?.metrics?.damage_score ? (selectedZone.analysis.metrics.damage_score * 3.2).toFixed(1) : '24.6'} km²</div>
          </div>
          <div className="bg-[rgba(255,53,79,0.05)] p-2 border border-[rgba(255,53,79,0.2)]">
            <div className="text-gray-400 text-[10px] tracking-wider mb-1">CHANGE</div>
            <div className="text-[#FF354F] text-lg font-bold">+{selectedZone?.analysis?.metrics?.damage_score ? (selectedZone.analysis.metrics.damage_score * 2.1).toFixed(1) : '18.4'}%</div>
          </div>
        </div>
      </div>

      {/* Panel 2: LIVE CONDITIONS */}
      <div className="hud-panel hud-cut-corner p-4 pointer-events-auto flex-1 max-h-56">
        <h2 className="text-[#00D9FF] text-xs font-bold tracking-widest mb-4 border-b border-[#00D9FF] pb-2">LIVE CONDITIONS</h2>
        
        <div className="flex flex-col gap-3 text-sm">
          <div className="flex justify-between items-center border-b border-[rgba(0,217,255,0.1)] pb-2">
            <div className="flex items-center gap-2 text-gray-300">
              <AlertTriangle size={14} className="text-[#FF9D3D]" /> Flood Severity
            </div>
            <span className="text-[#FF9D3D] font-bold">{MOCK_LIVE_CONDITIONS.floodSeverity}</span>
          </div>
          <div className="flex justify-between items-center border-b border-[rgba(0,217,255,0.1)] pb-2">
            <div className="flex items-center gap-2 text-gray-300">
              <CloudRain size={14} className="text-[#00D9FF]" /> Rainfall
            </div>
            <span className="text-white">{MOCK_LIVE_CONDITIONS.rainfall}</span>
          </div>
          <div className="flex justify-between items-center border-b border-[rgba(0,217,255,0.1)] pb-2">
            <div className="flex items-center gap-2 text-gray-300">
              <Navigation size={14} className="text-[#00D9FF]" /> Water Level
            </div>
            <span className="text-white">{MOCK_LIVE_CONDITIONS.waterLevel}</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-gray-300">
              <ShieldAlert size={14} className="text-[#FF354F]" /> Road Access
            </div>
            <span className="text-[#FF354F] font-bold">{MOCK_LIVE_CONDITIONS.roadAccess}</span>
          </div>
        </div>
      </div>

      {/* Panel 3: RESOURCE STATUS */}
      <div className="hud-panel hud-cut-corner p-4 pointer-events-auto flex-1 max-h-56">
        <h2 className="text-[#00D9FF] text-xs font-bold tracking-widest mb-4 border-b border-[#00D9FF] pb-2">RESOURCE STATUS</h2>
        
        <div className="flex flex-col gap-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Population Exposed</span>
            <span className="text-white font-bold">{selectedZone?.analysis?.metrics?.population_affected?.toLocaleString() || '18,420'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Critical Infra</span>
            <span className="text-[#FFD45A] font-bold">37</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Blocked Roads</span>
            <span className="text-[#FF354F] font-bold">17</span>
          </div>
          <div className="flex justify-between mt-2 pt-2 border-t border-[rgba(0,217,255,0.1)]">
            <span className="text-gray-500">Detection Confidence</span>
            <span className="text-[#24E49B]">87.4%</span>
          </div>
        </div>
      </div>

      {/* Panel 4: SEARCH */}
      <div className="hud-panel hud-cut-corner p-2 pointer-events-auto flex items-center gap-2">
        <Search size={16} className="text-[#00D9FF] ml-2" />
        <input 
          type="text" 
          placeholder="Search incident / location..." 
          className="bg-transparent border-none outline-none text-white text-xs w-full p-1 placeholder-gray-500"
        />
      </div>

    </div>
  );
};

export default LeftPanels;

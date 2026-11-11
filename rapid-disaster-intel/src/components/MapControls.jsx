import React from 'react';
import { Layers, Map as MapIcon, Route, Waves, Target } from 'lucide-react';
import useAppStore from '../store/appStore';

const MapControls = () => {
  const overlays = useAppStore(state => state.overlays);
  const toggleOverlay = useAppStore(state => state.toggleOverlay);

  return (
    <>
      {/* Bottom Center Toolbar */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-40 font-mono">
        <div className="hud-panel px-4 py-2 flex items-center gap-6 rounded-full">
          <button 
            className="flex flex-col items-center gap-1 group"
          >
            <Layers size={18} className="text-[#00D9FF]" />
            <span className="text-[10px] text-[#00D9FF] font-bold tracking-wider">SATELLITE</span>
          </button>
          
          <button 
            className="flex flex-col items-center gap-1 group"
          >
            <MapIcon size={18} className="text-gray-500 group-hover:text-gray-300 transition-colors" />
            <span className="text-[10px] text-gray-500 group-hover:text-gray-300 font-bold tracking-wider transition-colors">TERRAIN</span>
          </button>

          <button 
            onClick={() => toggleOverlay('roads')}
            className="flex flex-col items-center gap-1 group"
          >
            <Route size={18} className={overlays.roads ? "text-[#00D9FF]" : "text-gray-500 group-hover:text-gray-300 transition-colors"} />
            <span className={`text-[10px] font-bold tracking-wider transition-colors ${overlays.roads ? "text-[#00D9FF]" : "text-gray-500 group-hover:text-gray-300"}`}>ROADS</span>
          </button>

          <button 
            onClick={() => toggleOverlay('damage')}
            className="flex flex-col items-center gap-1 group"
          >
            <Waves size={18} className={overlays.damage ? "text-[#00D9FF]" : "text-gray-500 group-hover:text-gray-300 transition-colors"} />
            <span className={`text-[10px] font-bold tracking-wider transition-colors ${overlays.damage ? "text-[#00D9FF]" : "text-gray-500 group-hover:text-gray-300"}`}>FLOOD</span>
          </button>

          <button 
            onClick={() => toggleOverlay('searchZones')}
            className="flex flex-col items-center gap-1 group"
          >
            <Target size={18} className={overlays.searchZones ? "text-[#00D9FF]" : "text-gray-500 group-hover:text-gray-300 transition-colors"} />
            <span className={`text-[10px] font-bold tracking-wider transition-colors ${overlays.searchZones ? "text-[#00D9FF]" : "text-gray-500 group-hover:text-gray-300"}`}>PRIORITY</span>
          </button>
        </div>
      </div>

      {/* Legend - Bottom Left */}
      <div className="absolute bottom-6 left-6 z-40 font-mono">
        <div className="hud-panel p-3 text-xs">
          <div className="text-gray-400 text-[10px] tracking-widest mb-2 border-b border-[rgba(0,217,255,0.2)] pb-1">LEGEND</div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-[#FF354F]"></div>
            <span className="text-white">Critical</span>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-[#FF9D3D]"></div>
            <span className="text-white">High</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#FFD45A]"></div>
            <span className="text-white">Medium</span>
          </div>
        </div>
      </div>

      {/* Info - Bottom Right */}
      <div className="absolute bottom-6 right-6 z-40 font-mono text-right flex gap-4">
        <div className="hud-panel p-2">
          <div className="text-gray-400 text-[10px] tracking-widest mb-1">LAST PASS</div>
          <div className="text-[#00D9FF] text-sm font-bold">04:32 UTC</div>
        </div>
        <div className="hud-panel p-2">
          <div className="text-gray-400 text-[10px] tracking-widest mb-1">ZOOM</div>
          <div className="text-white text-sm font-bold">11</div>
        </div>
      </div>
    </>
  );
};

export default MapControls;

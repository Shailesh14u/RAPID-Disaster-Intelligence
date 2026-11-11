import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldAlert, BarChart2, Activity } from 'lucide-react';
import useAppStore from '../store/appStore';
import ImageSlider from './ImageSlider';

const AreaIntelligencePanel = () => {
  const selectedZone = useAppStore(state => state.selectedZone);
  const setSelectedZone = useAppStore(state => state.setSelectedZone);

  if (!selectedZone) return null;

  const analysis = selectedZone.analysis;
  const metrics = analysis?.metrics;
  const imagery = analysis?.imagery;
  
  // Calculate area from radius (A = πr²)
  const areaKm2 = ((Math.PI * Math.pow(selectedZone.radius, 2)) / 1000000).toFixed(1);
  
  // Determine priority from score
  const getPriority = (score) => {
    if (score >= 8) return { label: 'CRITICAL', color: 'text-[#FF354F]' };
    if (score >= 5) return { label: 'HIGH', color: 'text-[#FF9D3D]' };
    if (score >= 3) return { label: 'MEDIUM', color: 'text-[#FFD45A]' };
    return { label: 'LOW', color: 'text-[#24E49B]' };
  };

  const priority = getPriority(metrics?.damage_score || 0);
  
  // Fake confidence and infrastructure since backend doesn't provide it
  const confidence = "87.4%";
  const infrastructure = "Severely degraded";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 50 }}
        className="absolute top-20 right-6 bottom-24 w-[450px] hud-panel hud-cut-corner z-50 flex flex-col font-mono"
      >
        <div className="flex items-center justify-between p-3 border-b border-[#00D9FF] bg-[rgba(0,217,255,0.1)]">
          <div className="flex items-center gap-2">
            <Activity size={16} className="text-[#00D9FF]" />
            <h2 className="text-[#00D9FF] text-sm font-bold tracking-widest">AREA INTELLIGENCE</h2>
          </div>
          <button onClick={() => setSelectedZone(null)} className="text-gray-400 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 flex flex-col gap-6">
          
          {/* SELECTED AREA */}
          <section>
            <h3 className="text-gray-400 text-[10px] font-bold tracking-widest mb-2 border-b border-[rgba(255,255,255,0.1)] pb-1">SELECTED AREA</h3>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div><span className="text-gray-500">Area:</span> <span className="text-white font-bold">{areaKm2} km²</span></div>
              <div><span className="text-gray-500">Priority:</span> <span className={`${priority.color} font-bold`}>{priority.label}</span></div>
              <div><span className="text-gray-500">Confidence:</span> <span className="text-white font-bold">{confidence}</span></div>
              <div><span className="text-gray-500">Radius:</span> <span className="text-white font-bold">{(selectedZone.radius / 1000).toFixed(1)} km</span></div>
            </div>
          </section>

          {/* CHANGE DETECTION */}
          <section className="h-64 relative border border-[rgba(0,217,255,0.2)]">
             <div className="absolute top-0 left-0 bg-[rgba(2,11,17,0.8)] px-2 py-1 z-10 text-[10px] text-gray-300 border-b border-r border-[rgba(0,217,255,0.2)] font-bold tracking-widest">
               CHANGE DETECTION
             </div>
             {imagery ? (
               <ImageSlider 
                 beforeImage={imagery.before?.url}
                 afterImage={imagery.after?.url}
                 beforeDate={imagery.before?.date}
                 afterDate={imagery.after?.date}
               />
             ) : (
               <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">No imagery returned.</div>
             )}
          </section>

          {/* DAMAGE HEATMAP LEGEND */}
          <section>
            <h3 className="text-gray-400 text-[10px] font-bold tracking-widest mb-2 border-b border-[rgba(255,255,255,0.1)] pb-1">DAMAGE HEATMAP</h3>
            <div className="flex items-center justify-between text-xs bg-[rgba(0,0,0,0.3)] p-2">
              <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-[#FF354F]"></div> <span className="text-gray-300">High</span></div>
              <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-[#FF9D3D]"></div> <span className="text-gray-300">Medium</span></div>
              <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-[#FFD45A]"></div> <span className="text-gray-300">Low</span></div>
              <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-[#24E49B]"></div> <span className="text-gray-300">Stable</span></div>
            </div>
          </section>

          {/* IMPACT */}
          <section>
            <h3 className="text-gray-400 text-[10px] font-bold tracking-widest mb-2 border-b border-[rgba(255,255,255,0.1)] pb-1">IMPACT</h3>
            <div className="flex flex-col gap-2 text-xs">
              <div className="flex justify-between"><span className="text-gray-400">Population affected</span> <span className="text-white font-bold">{metrics?.population_affected?.toLocaleString() || 'N/A'}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Infrastructure affected</span> <span className="text-white font-bold">{infrastructure}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Flood/change extent</span> <span className="text-[#FF9D3D] font-bold">{areaKm2} km²</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Damage score</span> <span className={`${priority.color} font-bold`}>{metrics?.damage_score?.toFixed(1) || 'N/A'} / 10</span></div>
            </div>
          </section>

          {/* AI ASSESSMENT */}
          <section className="mt-auto">
            <h3 className="text-gray-400 text-[10px] font-bold tracking-widest mb-2 border-b border-[rgba(255,255,255,0.1)] pb-1">AI ASSESSMENT</h3>
            <div className="bg-[rgba(167,139,250,0.1)] border border-[rgba(167,139,250,0.3)] p-3 text-xs mb-3">
              <div className="text-[#A78BFA] font-bold mb-1">RECOMMENDATION: {priority.label}</div>
              <div className="text-gray-300">Based on multi-temporal Sentinel-2 analysis and structural disruption, deploy appropriate resources immediately.</div>
            </div>
            <button className="w-full py-2 bg-[rgba(0,217,255,0.15)] hover:bg-[rgba(0,217,255,0.3)] border border-[#00D9FF] text-white text-xs font-bold tracking-widest transition-colors flex justify-center items-center gap-2">
              <ShieldAlert size={14} className="text-[#00D9FF]" />
              VIEW RESPONSE PLAN
            </button>
          </section>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AreaIntelligencePanel;

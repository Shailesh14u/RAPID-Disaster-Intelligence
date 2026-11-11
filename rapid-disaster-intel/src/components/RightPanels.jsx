import React from 'react';
import { Activity, ShieldAlert, Zap, Route } from 'lucide-react';
import useAppStore from '../store/appStore';
import { MOCK_INCIDENT_FEED, MOCK_PRIORITY_ZONES, MOCK_AI_RESPONSE } from '../data/mockData';

const RightPanels = () => {
  const selectedZone = useAppStore(state => state.selectedZone);

  const getFeedColor = (type) => {
    if (type === 'critical') return 'bg-[#FF354F] hud-glow';
    if (type === 'high') return 'bg-[#FF9D3D]';
    return 'bg-[#329CFF]';
  };

  const getZoneColor = (score) => {
    if (score >= 90) return { bg: 'bg-[rgba(255,53,79,0.1)]', border: 'border-[rgba(255,53,79,0.3)]', text: 'text-[#FF354F]' };
    if (score >= 80) return { bg: 'bg-[rgba(255,157,61,0.1)]', border: 'border-[rgba(255,157,61,0.3)]', text: 'text-[#FF9D3D]' };
    return { bg: 'bg-[rgba(255,212,90,0.1)]', border: 'border-[rgba(255,212,90,0.3)]', text: 'text-[#FFD45A]' };
  };

  return (
    <div className="absolute top-20 right-6 bottom-24 w-80 flex flex-col gap-4 z-40 font-mono pointer-events-none">
      
      {/* Panel 1: INCIDENT FEED */}
      <div className="hud-panel hud-cut-corner p-4 pointer-events-auto flex-1 max-h-56">
        <div className="flex items-center justify-between mb-4 border-b border-[#00D9FF] pb-2">
          <h2 className="text-[#00D9FF] text-xs font-bold tracking-widest">INCIDENT FEED</h2>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#24E49B] hud-blinker"></div>
            <span className="text-[#24E49B] text-[10px] font-bold tracking-wider">LIVE</span>
          </div>
        </div>

        <div className="flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar text-xs">
          {MOCK_INCIDENT_FEED.map((item, idx) => (
            <div key={idx} className="flex gap-3">
              <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${getFeedColor(item.type)}`}></div>
              <div>
                <div className="text-white font-bold">{item.text}</div>
                <div className="text-gray-500 text-[10px] mt-1">{item.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Panel 2: PRIORITY ZONES */}
      <div className="hud-panel hud-cut-corner p-4 pointer-events-auto flex-1 max-h-56">
        <h2 className="text-[#00D9FF] text-xs font-bold tracking-widest mb-4 border-b border-[#00D9FF] pb-2">PRIORITY ZONES</h2>
        
        <div className="flex flex-col gap-3">
          {MOCK_PRIORITY_ZONES.map((zone, idx) => {
            const colors = getZoneColor(zone.score);
            return (
              <div key={idx} className={`flex items-center justify-between ${colors.bg} border ${colors.border} p-2`}>
                <div className="flex gap-3">
                  <span className={`${colors.text} font-bold`}>{zone.id}</span>
                  <div>
                    <div className="text-white text-xs font-bold">{zone.name}</div>
                    <div className="text-gray-400 text-[10px]">{zone.reason}</div>
                  </div>
                </div>
                <div className={`${colors.text} font-bold text-lg`}>{zone.score}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Panel 3: AI RESPONSE ENGINE */}
      <div className="hud-panel border-[#A78BFA] hud-cut-corner p-4 pointer-events-auto" style={{boxShadow: '0 0 10px rgba(167, 139, 250, 0.15), inset 0 0 20px rgba(167, 139, 250, 0.05)'}}>
        <div className="flex items-center justify-between mb-4 border-b border-[#A78BFA] pb-2">
          <div className="flex items-center gap-2">
            <Zap size={14} className="text-[#A78BFA]" />
            <h2 className="text-[#A78BFA] text-xs font-bold tracking-widest">AI ENGINE</h2>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#A78BFA] hud-blinker"></div>
            <span className="text-[#A78BFA] text-[10px] font-bold tracking-wider">ACTIVE</span>
          </div>
        </div>

        <div className="text-center mb-4">
          <div className="text-[#FF354F] text-[10px] font-bold tracking-widest mb-1">{MOCK_AI_RESPONSE.priority}</div>
          <div className="text-white font-bold text-lg">{MOCK_AI_RESPONSE.action}</div>
        </div>

        <div className="bg-[rgba(0,0,0,0.4)] border border-[rgba(167,139,250,0.2)] p-3 mb-4 text-xs">
          <div className="text-gray-400 text-[10px] mb-2 tracking-widest border-b border-[rgba(167,139,250,0.2)] pb-1">EXPLAINABILITY MATRIX</div>
          <div className="flex justify-between mb-1"><span className="text-gray-300">Flood Severity</span><span className="text-[#FF354F]">{MOCK_AI_RESPONSE.matrix.floodSeverity}</span></div>
          <div className="flex justify-between mb-1"><span className="text-gray-300">Population Exposure</span><span className="text-[#FF9D3D]">{MOCK_AI_RESPONSE.matrix.populationExposure}</span></div>
          <div className="flex justify-between mb-1"><span className="text-gray-300">Infrastructure</span><span className="text-[#FF9D3D]">{MOCK_AI_RESPONSE.matrix.infrastructure}</span></div>
          <div className="flex justify-between mb-1"><span className="text-gray-300">Road Access</span><span className="text-[#00D9FF]">{MOCK_AI_RESPONSE.matrix.roadAccess}</span></div>
          <div className="flex justify-between"><span className="text-gray-300">Hospital Proximity</span><span className="text-[#FF354F]">{MOCK_AI_RESPONSE.matrix.hospitalProximity}</span></div>
        </div>

        <button className="w-full bg-[rgba(167,139,250,0.15)] hover:bg-[rgba(167,139,250,0.3)] border border-[#A78BFA] text-white py-2 flex items-center justify-center gap-2 transition-all group">
          <Route size={14} className="text-[#A78BFA] group-hover:text-white transition-colors" />
          <span className="text-xs font-bold tracking-widest">VIEW RESPONSE ROUTE</span>
        </button>
      </div>

    </div>
  );
};

export default RightPanels;

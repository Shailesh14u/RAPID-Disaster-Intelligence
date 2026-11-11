import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Users, Map as MapIcon, Home } from 'lucide-react';

const PriorityScoreCard = ({ score = 8.2, population = 3240, area = 4.8, recommendation = "CRITICAL - DEPLOY RESOURCES" }) => {
  
  const getScorePanelClass = (s) => {
    if (s >= 8) return 'hud-panel-red';
    if (s >= 5) return 'hud-panel-orange';
    return 'hud-panel';
  };

  const getScoreTextColor = (s) => {
    if (s >= 8) return 'text-[#FF354F]';
    if (s >= 5) return 'text-[#FF9D3D]';
    return 'text-[#00D9FF]';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={`absolute top-20 left-1/2 transform -translate-x-1/2 w-[500px] ${getScorePanelClass(score)} hud-cut-corner z-40 font-mono`}
    >
      <div className="flex">
        {/* Score Block */}
        <div className="w-1/3 border-r border-[rgba(255,255,255,0.1)] p-4 flex flex-col items-center justify-center text-center">
          <div className="text-[10px] text-gray-400 font-bold tracking-widest mb-1">PRIORITY SCORE</div>
          <div className={`text-4xl font-bold ${getScoreTextColor(score)}`}>
            {score.toFixed(1)}
          </div>
        </div>

        {/* Details */}
        <div className="w-2/3 p-4 text-xs">
          <div className={`font-bold tracking-widest mb-3 border-b border-[rgba(255,255,255,0.1)] pb-2 flex items-center gap-2 ${getScoreTextColor(score)}`}>
            <AlertTriangle size={14} />
            {recommendation}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <Users size={12} className="text-gray-500" />
              <span className="text-gray-400 text-[10px]">PEOPLE</span>
              <span className="text-white font-bold ml-auto">{population.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapIcon size={12} className="text-gray-500" />
              <span className="text-gray-400 text-[10px]">AREA</span>
              <span className="text-white font-bold ml-auto">{area} km²</span>
            </div>
            <div className="flex items-center gap-2 col-span-2">
              <Home size={12} className="text-gray-500" />
              <span className="text-gray-400 text-[10px]">BUILDINGS</span>
              <span className="text-[#FF354F] font-bold ml-auto">SEVERE (85%)</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PriorityScoreCard;

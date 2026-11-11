import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckSquare, Square, FileText, Send } from 'lucide-react';

const ActionPanel = ({ score = 8.2 }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [urgency, setUrgency] = useState(score);
  const [notes, setNotes] = useState('');
  const [selectedResources, setSelectedResources] = useState(['Medical']);

  const resources = ['Medical', 'Search & Rescue', 'Supplies', 'Engineers', 'Evacuation'];

  const toggleResource = (res) => {
    if (selectedResources.includes(res)) {
      setSelectedResources(selectedResources.filter(r => r !== res));
    } else {
      setSelectedResources([...selectedResources, res]);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-full max-w-3xl hud-panel hud-cut-corner z-50 font-mono flex flex-col"
        >
          <div className="border-b border-[#00D9FF] p-3 flex justify-between items-center bg-[rgba(0,217,255,0.05)]">
            <h3 className="text-[#00D9FF] text-sm font-bold tracking-widest flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#FF354F] hud-blinker"></div>
              DEPLOY RESOURCES TO ZONE
            </h3>
            <button onClick={() => setIsOpen(false)} className="text-[#00D9FF] hover:text-white transition-colors">
              [ CLOSE ]
            </button>
          </div>

          <div className="p-4 grid grid-cols-2 gap-6">
            {/* Left side */}
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] text-gray-400 font-bold tracking-widest mb-2">URGENCY LEVEL: {urgency.toFixed(1)} / 10</label>
                <input 
                  type="range" 
                  min="1" 
                  max="10" 
                  step="0.1" 
                  value={urgency} 
                  onChange={(e) => setUrgency(parseFloat(e.target.value))}
                  className="w-full h-1 bg-gray-800 appearance-none cursor-pointer accent-[#FF354F]"
                />
              </div>

              <div>
                <label className="block text-[10px] text-gray-400 font-bold tracking-widest mb-2">REQUIRED RESOURCES</label>
                <div className="flex flex-wrap gap-2">
                  {resources.map(res => {
                    const isSelected = selectedResources.includes(res);
                    return (
                      <button
                        key={res}
                        onClick={() => toggleResource(res)}
                        className={`px-2 py-1 text-xs border transition-colors flex items-center gap-1 ${
                          isSelected
                            ? 'bg-[rgba(0,217,255,0.2)] border-[#00D9FF] text-[#00D9FF]'
                            : 'bg-transparent border-gray-700 text-gray-400 hover:border-gray-500'
                        }`}
                      >
                        {isSelected ? <CheckSquare size={12} /> : <Square size={12} />}
                        {res}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right side */}
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] text-gray-400 font-bold tracking-widest mb-2">FIELD NOTES</label>
                <textarea 
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="ADD CRITICAL INFO..."
                  className="w-full bg-[rgba(0,0,0,0.4)] border border-gray-700 p-2 text-xs text-[#00D9FF] focus:border-[#00D9FF] outline-none h-16 custom-scrollbar resize-none uppercase"
                ></textarea>
              </div>

              <div className="flex gap-2 pt-2">
                <button className="flex-1 bg-[rgba(255,53,79,0.1)] hover:bg-[rgba(255,53,79,0.3)] border border-[#FF354F] text-white py-2 text-xs font-bold tracking-widest transition-colors flex justify-center items-center gap-2">
                  <Send size={14} className="text-[#FF354F]" />
                  DEPLOY
                </button>
                <button className="flex-1 bg-[rgba(0,217,255,0.1)] hover:bg-[rgba(0,217,255,0.3)] border border-[#00D9FF] text-white py-2 text-xs font-bold tracking-widest transition-colors flex justify-center items-center gap-2">
                  <FileText size={14} className="text-[#00D9FF]" />
                  REPORT
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ActionPanel;

import React, { useState, useRef, useEffect } from 'react';

const ImageSlider = ({ beforeImage, afterImage, beforeDate, afterDate }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef(null);
  const isDragging = useRef(false);

  const handleMove = (clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setSliderPosition((x / rect.width) * 100);
  };

  useEffect(() => {
    const onMove = (e) => { if (isDragging.current) handleMove(e.clientX); };
    const onTouch = (e) => { if (isDragging.current) handleMove(e.touches[0].clientX); };
    const onUp = () => { isDragging.current = false; };
    
    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onTouch);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchend', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchmove', onTouch);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchend', onUp);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden select-none bg-black">
      {/* Before */}
      <div className="absolute inset-0">
        <img src={beforeImage} alt="Before" className="w-full h-full object-cover" draggable={false} />
      </div>

      {/* After (clipped) */}
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}>
        <img src={afterImage} alt="After" className="w-full h-full object-cover" draggable={false} />
      </div>

      {/* Labels */}
      <div className="absolute top-2 left-2 bg-[rgba(2,11,17,0.85)] border border-gray-600 text-gray-300 px-2 py-0.5 text-[9px] font-bold tracking-widest uppercase font-mono z-10">
        PRE: {beforeDate}
      </div>
      <div className="absolute top-2 right-2 bg-[rgba(2,11,17,0.85)] border border-[#FF354F] text-[#FF354F] px-2 py-0.5 text-[9px] font-bold tracking-widest uppercase font-mono z-10">
        POST: {afterDate}
      </div>

      {/* Slider line */}
      <div
        className="absolute top-0 bottom-0 w-[2px] bg-[#00D9FF] cursor-col-resize z-20"
        style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)', boxShadow: '0 0 8px #00D9FF' }}
        onMouseDown={(e) => { e.preventDefault(); isDragging.current = true; }}
        onTouchStart={() => { isDragging.current = true; }}
      >
        {/* Handle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-7 h-7 bg-[rgba(2,11,17,0.9)] border-2 border-[#00D9FF] flex items-center justify-center" style={{boxShadow: '0 0 12px #00D9FF', clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)'}}>
          <div className="flex gap-[2px]">
            <div className="w-[1.5px] h-3 bg-[#00D9FF]"></div>
            <div className="w-[1.5px] h-3 bg-[#00D9FF]"></div>
          </div>
        </div>
      </div>

      {/* Percentage indicator */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-[rgba(2,11,17,0.8)] border border-[rgba(0,217,255,0.3)] px-2 py-0.5 text-[9px] text-[#00D9FF] font-mono z-20">
        ◄ {Math.round(sliderPosition)}% ►
      </div>
    </div>
  );
};

export default ImageSlider;

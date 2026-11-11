import { useEffect, useRef } from 'react';
import * as turf from '@turf/turf';

export const useCircleGesture = (mapRef, onCircleDetected, isEnabled = true, isDrawingMode = false) => {
  const isDrawing = useRef(false);
  const startPoint = useRef(null);
  const startLngLat = useRef(null);
  const canvas = useRef(null);
  const ctx = useRef(null);
  
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isEnabled) {
      if (map) map.boxZoom.enable();
      return;
    }

    map.boxZoom.disable();

    const setupCanvas = () => {
      const mapCanvas = map.getCanvas();
      if (!canvas.current) {
        canvas.current = document.createElement('canvas');
        canvas.current.style.position = 'absolute';
        canvas.current.style.top = '0';
        canvas.current.style.left = '0';
        canvas.current.style.pointerEvents = 'none';
        canvas.current.style.zIndex = '10';
        map.getCanvasContainer().appendChild(canvas.current);
        ctx.current = canvas.current.getContext('2d');
      }
      
      const updateSize = () => {
        canvas.current.width = mapCanvas.clientWidth;
        canvas.current.height = mapCanvas.clientHeight;
      };
      updateSize();
      map.on('resize', updateSize);
      return () => map.off('resize', updateSize);
    };

    const cleanupCanvas = setupCanvas();

    const drawCircle = (cx, cy, radius, currentLngLat) => {
      const c = ctx.current;
      const cv = canvas.current;
      c.clearRect(0, 0, cv.width, cv.height);
      
      if (radius < 5) return;

      // Dim overlay outside the circle
      c.save();
      c.fillStyle = 'rgba(2, 11, 17, 0.4)';
      c.fillRect(0, 0, cv.width, cv.height);
      c.globalCompositeOperation = 'destination-out';
      c.beginPath();
      c.arc(cx, cy, radius, 0, Math.PI * 2);
      c.fill();
      c.restore();

      // Glowing circle border
      c.save();
      c.beginPath();
      c.arc(cx, cy, radius, 0, Math.PI * 2);
      c.strokeStyle = '#00D9FF';
      c.lineWidth = 2;
      c.shadowColor = '#00D9FF';
      c.shadowBlur = 15;
      c.stroke();
      c.restore();

      // Dashed outer ring
      c.save();
      c.beginPath();
      c.arc(cx, cy, radius + 8, 0, Math.PI * 2);
      c.setLineDash([6, 4]);
      c.strokeStyle = 'rgba(0, 217, 255, 0.3)';
      c.lineWidth = 1;
      c.stroke();
      c.restore();
      
      // Inner fill
      c.save();
      c.beginPath();
      c.arc(cx, cy, radius, 0, Math.PI * 2);
      c.fillStyle = 'rgba(0, 217, 255, 0.08)';
      c.fill();
      c.restore();

      // Center crosshair
      c.save();
      c.strokeStyle = 'rgba(0, 217, 255, 0.5)';
      c.lineWidth = 1;
      c.setLineDash([3, 3]);
      c.beginPath();
      c.moveTo(cx - 12, cy);
      c.lineTo(cx + 12, cy);
      c.moveTo(cx, cy - 12);
      c.lineTo(cx, cy + 12);
      c.stroke();
      c.restore();

      // Calculate geo radius for label
      if (startLngLat.current && currentLngLat) {
        const from = turf.point([startLngLat.current.lng, startLngLat.current.lat]);
        const to = turf.point([currentLngLat.lng, currentLngLat.lat]);
        const dist = turf.distance(from, to, { units: 'meters' });
        const areaKm2 = (Math.PI * Math.pow(dist, 2) / 1000000).toFixed(2);

        const labelText = dist >= 1000 ? `${(dist/1000).toFixed(1)} km` : `${Math.round(dist)} m`;
        const areaText = `${areaKm2} km²`;
        
        c.save();
        c.font = 'bold 11px monospace';
        c.textAlign = 'center';
        
        // Radius label above circle
        const labelY = cy - radius - 20;
        const metrics1 = c.measureText(labelText);
        const pillW1 = metrics1.width + 16;
        c.fillStyle = 'rgba(2, 11, 17, 0.85)';
        c.strokeStyle = '#00D9FF';
        c.lineWidth = 1;
        c.setLineDash([]);
        c.beginPath();
        c.roundRect(cx - pillW1/2, labelY - 10, pillW1, 20, 3);
        c.fill();
        c.stroke();
        c.fillStyle = '#00D9FF';
        c.fillText(labelText, cx, labelY + 4);

        // Area label below circle
        c.font = '10px monospace';
        const labelY2 = cy + radius + 24;
        const metrics2 = c.measureText(areaText);
        const pillW2 = metrics2.width + 16;
        c.fillStyle = 'rgba(2, 11, 17, 0.85)';
        c.strokeStyle = 'rgba(0, 217, 255, 0.5)';
        c.beginPath();
        c.roundRect(cx - pillW2/2, labelY2 - 8, pillW2, 16, 3);
        c.fill();
        c.stroke();
        c.fillStyle = 'rgba(0, 217, 255, 0.7)';
        c.fillText(areaText, cx, labelY2 + 4);

        c.restore();
      }
    };

    const onMouseDown = (e) => {
      if (!isEnabled || e.originalEvent.button !== 0) return;
      if (!e.originalEvent.shiftKey && !isDrawingMode) return;
      
      e.preventDefault();
      map.dragPan.disable();
      isDrawing.current = true;
      startPoint.current = { x: e.point.x, y: e.point.y };
      startLngLat.current = e.lngLat;
      
      ctx.current.clearRect(0, 0, canvas.current.width, canvas.current.height);
      window.addEventListener('mouseup', onWindowMouseUp);
    };

    const onMouseMove = (e) => {
      if (!isDrawing.current || !startPoint.current) return;
      const dx = e.point.x - startPoint.current.x;
      const dy = e.point.y - startPoint.current.y;
      const radius = Math.sqrt(dx * dx + dy * dy);
      drawCircle(startPoint.current.x, startPoint.current.y, radius, e.lngLat);
    };

    const onMouseUp = (e) => {
      if (!isDrawing.current || !startPoint.current) return;
      isDrawing.current = false;
      map.dragPan.enable();
      window.removeEventListener('mouseup', onWindowMouseUp);

      if (startLngLat.current && e && e.lngLat) {
        const from = turf.point([startLngLat.current.lng, startLngLat.current.lat]);
        const to = turf.point([e.lngLat.lng, e.lngLat.lat]);
        const geoRadius = turf.distance(from, to, { units: 'meters' });

        if (geoRadius >= 50) {
          onCircleDetected({
            center: { lat: startLngLat.current.lat, lng: startLngLat.current.lng },
            radius: geoRadius
          });
        }
      }
      
      setTimeout(() => {
        if (ctx.current && canvas.current) {
          ctx.current.clearRect(0, 0, canvas.current.width, canvas.current.height);
        }
      }, 600);

      startPoint.current = null;
      startLngLat.current = null;
    };

    const onWindowMouseUp = () => {
      if (!isDrawing.current) return;
      isDrawing.current = false;
      map.dragPan.enable();
      window.removeEventListener('mouseup', onWindowMouseUp);
      setTimeout(() => {
        if (ctx.current && canvas.current) {
          ctx.current.clearRect(0, 0, canvas.current.width, canvas.current.height);
        }
      }, 300);
      startPoint.current = null;
      startLngLat.current = null;
    };

    map.on('mousedown', onMouseDown);
    map.on('mousemove', onMouseMove);
    map.on('mouseup', onMouseUp);

    return () => {
      map.off('mousedown', onMouseDown);
      map.off('mousemove', onMouseMove);
      map.off('mouseup', onMouseUp);
      map.boxZoom.enable();
      window.removeEventListener('mouseup', onWindowMouseUp);
      if (cleanupCanvas) cleanupCanvas();
      if (canvas.current && canvas.current.parentNode) {
        canvas.current.parentNode.removeChild(canvas.current);
        canvas.current = null;
      }
    };
  }, [mapRef, onCircleDetected, isEnabled, isDrawingMode]);

  return null;
};

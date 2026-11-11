import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import * as turf from '@turf/turf';
import useAppStore from '../store/appStore';
import { useCircleGesture } from '../hooks/useCircleGesture';
import AreaIntelligencePanel from './AreaIntelligencePanel';
import axios from 'axios';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const Map = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(73.8567);
  const [lat, setLat] = useState(18.5204);
  const [zoom, setZoom] = useState(9);

  const selectedZone = useAppStore(state => state.selectedZone);
  const setSelectedZone = useAppStore(state => state.setSelectedZone);
  const isAnalyzing = useAppStore(state => state.isAnalyzing);
  const setIsAnalyzing = useAppStore(state => state.setIsAnalyzing);
  const overlays = useAppStore(state => state.overlays);

  const isDrawingMode = useAppStore(state => state.isDrawingMode);
  const setIsDrawingMode = useAppStore(state => state.setIsDrawingMode);

  useEffect(() => {
    if (map.current) return;

    if (!mapboxgl.accessToken || mapboxgl.accessToken.includes('your_mapbox_token_here')) {
      console.error("Mapbox token is missing!");
      return;
    }

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: [lng, lat],
      zoom: zoom,
      dragPan: true
    });

    map.current.on('load', () => {
      console.log('Map loaded successfully');
    });

  });

  // Handle cursor style for drawing mode
  useEffect(() => {
    if (!map.current) return;
    if (isDrawingMode && !selectedZone) {
      map.current.getCanvas().style.cursor = 'crosshair';
    } else {
      map.current.getCanvas().style.cursor = 'grab';
    }
  }, [isDrawingMode, selectedZone]);

  // Effect to handle overlay visibility
  useEffect(() => {
    if (!map.current || !map.current.isStyleLoaded() || !selectedZone) return;

    const m = map.current;
    
    // Check if source exists, if not, generate mock data and add layers
    if (!m.getSource('mock-search-zones')) {
      const center = [selectedZone.center.lng, selectedZone.center.lat];
      const radius = selectedZone.radius; // in meters

      // Generate Concentric Rings for Search Zones
      const rings = turf.featureCollection([
        turf.circle(center, radius / 1000, {steps: 64, properties: { priority: 'low' }}),
        turf.circle(center, (radius * 0.6) / 1000, {steps: 64, properties: { priority: 'med' }}),
        turf.circle(center, (radius * 0.25) / 1000, {steps: 64, properties: { priority: 'high' }})
      ]);

      m.addSource('mock-search-zones', { type: 'geojson', data: rings });
      m.addLayer({
        id: 'layer-search-zones',
        type: 'fill',
        source: 'mock-search-zones',
        paint: {
          'fill-color': [
            'match', ['get', 'priority'],
            'high', '#ef4444', // red
            'med', '#f97316', // orange
            'low', '#eab308', // yellow
            '#ffffff'
          ],
          'fill-opacity': 0.3
        }
      });
      m.addLayer({
        id: 'layer-search-zones-line',
        type: 'line',
        source: 'mock-search-zones',
        paint: { 'line-color': '#ffffff', 'line-width': 1, 'line-opacity': 0.5 }
      });

      // Generate Roads (mock lines)
      const roadFeatures = [];
      for(let i=0; i<5; i++) {
        const p1 = turf.destination(center, Math.random() * radius/1000, Math.random() * 360).geometry.coordinates;
        const p2 = turf.destination(center, Math.random() * radius/1000, Math.random() * 360).geometry.coordinates;
        const p3 = turf.destination(center, Math.random() * radius/1000, Math.random() * 360).geometry.coordinates;
        roadFeatures.push(turf.lineString([p1, p2, p3], { status: Math.random() > 0.3 ? 'clear' : 'blocked' }));
      }
      m.addSource('mock-roads', { type: 'geojson', data: turf.featureCollection(roadFeatures) });
      m.addLayer({
        id: 'layer-roads',
        type: 'line',
        source: 'mock-roads',
        paint: {
          'line-color': ['match', ['get', 'status'], 'clear', '#22c55e', 'blocked', '#ef4444', '#fff'],
          'line-width': 4
        }
      });

      // Generate Buildings (mock polygons)
      const buildingFeatures = [];
      for(let i=0; i<30; i++) {
        const pt = turf.destination(center, Math.random() * radius/1000, Math.random() * 360).geometry.coordinates;
        const b = turf.circle(pt, 0.05, {steps: 4, properties: { damage: Math.random() > 0.6 ? 'destroyed' : 'damaged' }});
        buildingFeatures.push(b);
      }
      m.addSource('mock-buildings', { type: 'geojson', data: turf.featureCollection(buildingFeatures) });
      m.addLayer({
        id: 'layer-buildings',
        type: 'fill',
        source: 'mock-buildings',
        paint: {
          'fill-color': ['match', ['get', 'damage'], 'destroyed', '#dc2626', 'damaged', '#fb923c', '#fff'],
          'fill-opacity': 0.8
        }
      });
      m.addLayer({
        id: 'layer-buildings-line',
        type: 'line',
        source: 'mock-buildings',
        paint: { 'line-color': '#000', 'line-width': 1 }
      });
      
      // Population density mock (we'll just use a large hex grid over the area)
      const bbox = turf.bbox(turf.circle(center, radius / 1000));
      const hexGrid = turf.hexGrid(bbox, (radius/1000)/5, {units: 'kilometers'});
      hexGrid.features.forEach(f => f.properties = { density: Math.random() * 10000 });
      m.addSource('mock-population', { type: 'geojson', data: hexGrid });
      m.addLayer({
        id: 'layer-population',
        type: 'fill',
        source: 'mock-population',
        paint: {
          'fill-color': [
            'interpolate', ['linear'], ['get', 'density'],
            0, '#bfdbfe',
            5000, '#facc15',
            10000, '#dc2626'
          ],
          'fill-opacity': 0.4
        }
      });
    }

    // Toggle visibility based on state
    const setVisibility = (layerIds, isVisible) => {
      layerIds.forEach(id => {
        if (m.getLayer(id)) {
          m.setLayoutProperty(id, 'visibility', isVisible ? 'visible' : 'none');
        }
      });
    };

    setVisibility(['layer-search-zones', 'layer-search-zones-line'], overlays.searchZones);
    setVisibility(['layer-roads'], overlays.roads);
    setVisibility(['layer-buildings', 'layer-buildings-line'], overlays.damage);
    setVisibility(['layer-population'], overlays.population);

  }, [overlays, selectedZone]);

  const handleCircleDetected = async (zoneData) => {
    console.log("Circle detected:", zoneData);
    
    setIsAnalyzing(true);
    setIsDrawingMode(false); // turn off drawing mode once selected
    map.current.flyTo({
      center: [zoneData.center.lng, zoneData.center.lat],
      zoom: 14,
      duration: 1000,
      essential: true
    });

    try {
      const response = await axios.post('http://localhost:8000/api/analyze', {
        center_lat: zoneData.center.lat,
        center_lng: zoneData.center.lng,
        radius_meters: zoneData.radius
      });
      
      setSelectedZone({
        ...zoneData,
        analysis: response.data
      });
    } catch (error) {
      console.error("Failed to fetch analysis:", error);
      setSelectedZone({
        ...zoneData,
        analysis: {
          metrics: { population_affected: 3240, damage_score: 8.5 }
        }
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  useCircleGesture(map, handleCircleDetected, !selectedZone, isDrawingMode);

  // When closing analysis, remove sources
  const handleClose = () => {
    setSelectedZone(null);
    const m = map.current;
    if (!m) return;
    
    const layers = ['layer-search-zones', 'layer-search-zones-line', 'layer-roads', 'layer-buildings', 'layer-buildings-line', 'layer-population'];
    const sources = ['mock-search-zones', 'mock-roads', 'mock-buildings', 'mock-population'];
    
    layers.forEach(l => { if (m.getLayer(l)) m.removeLayer(l); });
    sources.forEach(s => { if (m.getSource(s)) m.removeSource(s); });
  };

  return (
    <div className="w-full h-screen relative overflow-hidden">
      {!mapboxgl.accessToken || mapboxgl.accessToken.includes('your_mapbox_token_here') ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-white z-50">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Mapbox Token Required</h2>
            <p>Please add your VITE_MAPBOX_TOKEN to the .env file.</p>
          </div>
        </div>
      ) : null}
      
      <div 
        ref={mapContainer} 
        className={`w-full h-full transition-all duration-1000 ${selectedZone ? 'brightness-75' : ''}`}
      />
      
      {!selectedZone && !isAnalyzing && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 z-10 pointer-events-none">
          <button 
            onClick={() => setIsDrawingMode(!isDrawingMode)}
            className={`hud-panel px-6 py-2 flex items-center gap-2 pointer-events-auto shadow-[0_0_15px_rgba(0,217,255,0.3)] transition-colors ${isDrawingMode ? 'bg-[rgba(0,217,255,0.3)]' : ''}`}
          >
            <div className={`w-3 h-3 rounded-full border-2 flex items-center justify-center ${isDrawingMode ? 'border-white' : 'border-[#00D9FF]'}`}>
              <div className={`w-1 h-1 rounded-full ${isDrawingMode ? 'bg-white hud-blinker' : 'bg-[#00D9FF]'}`}></div>
            </div>
            <p className={`font-bold text-sm tracking-widest font-mono ${isDrawingMode ? 'text-white' : 'text-[#00D9FF]'}`}>
              {isDrawingMode ? 'DRAW A CIRCLE NOW' : 'ANALYZE AREA'}
            </p>
          </button>
          <p className="font-bold text-[10px] tracking-widest font-mono text-gray-400 bg-[rgba(2,11,17,0.7)] px-2 py-1 border border-gray-800">
            {isDrawingMode ? '[ CLICK AND DRAG ON MAP ]' : '[ SHIFT + DRAG TO DESIGNATE ANALYSIS ZONE ]'}
          </p>
        </div>
      )}

      {isAnalyzing && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-[#A78BFA] border-t-transparent rounded-full animate-spin mb-4 shadow-[0_0_20px_rgba(167,139,250,0.5)]"></div>
          <div className="hud-panel border-[#A78BFA] px-6 py-4 flex flex-col items-center gap-2">
            <h2 className="text-[#A78BFA] font-bold tracking-widest text-lg mb-2">ANALYZING SELECTED AREA</h2>
            <div className="flex flex-col gap-1 text-[10px] text-gray-300 font-mono tracking-widest text-left w-full">
              <div className="flex items-center gap-2"><div className="w-1 h-1 bg-[#24E49B] rounded-full"></div> Acquiring satellite data</div>
              <div className="flex items-center gap-2"><div className="w-1 h-1 bg-[#24E49B] rounded-full"></div> Comparing pre-event imagery</div>
              <div className="flex items-center gap-2"><div className="w-1 h-1 bg-[#00D9FF] rounded-full hud-blinker"></div> Detecting changes & calculating damage</div>
            </div>
          </div>
        </div>
      )}

      {selectedZone && !isAnalyzing && (
        <AreaIntelligencePanel />
      )}
    </div>
  );
};

export default Map;

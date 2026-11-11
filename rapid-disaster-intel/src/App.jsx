import React, { Suspense, lazy } from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import Header from './components/Header';
import LeftPanels from './components/LeftPanels';
import RightPanels from './components/RightPanels';
import MapControls from './components/MapControls';

// Lazy load the Map component to reduce initial bundle size
const Map = lazy(() => import('./components/Map'));

function App() {
  return (
    <ErrorBoundary>
      <div className="App w-full h-screen overflow-hidden bg-[#020B11] text-gray-200 font-mono relative">
        <Header />
        <LeftPanels />
        <RightPanels />
        <MapControls />
        
        <Suspense fallback={
          <div className="w-full h-full flex flex-col items-center justify-center bg-[#020B11] text-[#00D9FF]">
            <div className="w-12 h-12 border-2 border-[#00D9FF] border-t-transparent rounded-full animate-spin mb-4 shadow-[0_0_15px_rgba(0,217,255,0.5)]"></div>
            <p className="text-[#00D9FF] text-xs font-bold tracking-widest animate-pulse">INITIALIZING SATELLITE LINK...</p>
          </div>
        }>
          <div className="absolute inset-0 z-0 pt-14">
            <Map />
          </div>
        </Suspense>
      </div>
    </ErrorBoundary>
  );
}

export default App;

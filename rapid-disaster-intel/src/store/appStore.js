import { create } from 'zustand';

const useAppStore = create((set) => ({
  disaster: null,
  selectedZone: null,
  isAnalyzing: false,
  isDrawingMode: false,
  overlays: {
    population: false,
    searchZones: false,
    roads: false,
    damage: false
  },
  setDisaster: (disaster) => set({ disaster }),
  setSelectedZone: (zone) => set({ selectedZone: zone }),
  setIsAnalyzing: (status) => set({ isAnalyzing: status }),
  setIsDrawingMode: (status) => set({ isDrawingMode: status }),
  toggleOverlay: (type) => set((state) => ({
    overlays: {
      ...state.overlays,
      [type]: !state.overlays[type]
    }
  }))
}));

export default useAppStore;

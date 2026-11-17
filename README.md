# 🌍 RAPID Intelligence

**AI-Assisted Geospatial Intelligence & Disaster Response Platform**

[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=flat&logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Google Earth Engine](https://img.shields.io/badge/Google_Earth_Engine-4285F4?style=flat&logo=google-earth&logoColor=white)](https://earthengine.google.com/)
[![Mapbox](https://img.shields.io/badge/Mapbox_GL-000000?style=flat&logo=mapbox&logoColor=white)](https://www.mapbox.com/)

**RAPID Intelligence** is a disaster response and geospatial intelligence platform that helps emergency teams detect, analyze, and prioritize affected areas after natural disasters. By combining **Sentinel-2 satellite imagery**, **AI-assisted change detection**, and **interactive map overlays**, the platform transforms raw remote-sensing data into actionable insights for rapid rescue and relief planning.

---

## 📋 Table of Contents
- [Overview](#-overview)
- [Problem Statement](#-problem-statement)
- [Solution](#-solution)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Use Cases](#-use-cases)
- [Getting Started](#-getting-started)
- [Roadmap](#-roadmap)
- [Why This Project Matters](#-why-this-project-matters)

---

## 🔍 Overview

Natural disasters create urgent operational demands: identifying impacted regions, estimating population exposure, evaluating structural and environmental damage, and prioritizing rescue operations. Traditional assessment workflows are often slow, fragmented, and reactive.

**RAPID Intelligence** provides a live geospatial dashboard for rapid visual and analytical assessment of disaster zones, helping responders answer critical questions immediately:
- **Where** is the disaster impact most severe?
- **Which** zones require immediate emergency intervention?
- **How much** population is potentially exposed?
- **What** regions exhibit the strongest post-disaster environmental or structural changes?

---

## ⚠️ Problem Statement

In the immediate aftermath of a disaster, emergency response teams must act quickly—yet they frequently lack a unified, real-time view of the affected region. Response planning is hindered by:
- Disconnected and siloed data sources
- Time-consuming manual satellite analysis
- Limited visibility into localized, ground-level impact

These bottlenecks lead to delayed assistance, inefficient resource allocation, and reduced situational awareness when every minute counts.

---

## 💡 Solution

RAPID Intelligence unifies remote sensing and real-time geospatial analytics into a single, intuitive platform:
- **Satellite Imagery Processing:** Automated ingestion and comparison of pre- and post-event Sentinel-2 imagery.
- **Geospatial Analytics:** Spatial calculations, vegetation/damage anomaly scoring, and population exposure modeling.
- **Zone Prioritization:** Automated risk indicators and priority zone recommendations.
- **Interactive Visualization:** Circle-to-Search Area of Interest (AOI) selection, heatmap overlays, and safest-route guidance.

---

## ✨ Key Features

- **Interactive Disaster Map:** Smooth, hardware-accelerated geospatial rendering powered by Mapbox GL.
- **Before-and-After Imagery Comparison:** Side-by-side and overlay comparisons of pre- and post-disaster satellite captures.
- **Circle-to-Search & AOI Selection:** Define custom analysis radii or areas of interest directly on the map.
- **Damage & Vegetation Anomaly Analysis:** Remote-sensing indices to highlight structural disruption and terrain changes.
- **Population & Impact Scoring:** Quantifies exposed populations and generates severity metrics per zone.
- **Priority Zone & Safest-Route Recommendations:** Highlights high-priority rescue zones and assists emergency navigation.
- **API-Driven Intelligence Workflows:** Modular FastAPI backend built for extensible geospatial reports and overlays.

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework & Build:** React, Vite
- **Geospatial & Mapping:** Mapbox GL, Turf.js
- **Styling & Animation:** Tailwind CSS, Framer Motion
- **State Management:** Zustand

### **Backend**
- **Framework:** Python 3.11+, FastAPI, Uvicorn
- **Data Validation:** Pydantic
- **Remote Sensing Engine:** Google Earth Engine (GEE)

### **Data & Geospatial Analysis**
- **Imagery:** Sentinel-2 Multispectral Satellite Data
- **Analytics:** Remote Sensing Change Detection, Spatial Overlays, Risk & Impact Scoring

---

## 🏗️ System Architecture

```text
┌───────────────────────────┐       REST API (JSON / GeoJSON)       ┌───────────────────────────┐
│      React Frontend       │ ◄───────────────────────────────────► │      FastAPI Backend      │
│  (Mapbox GL + Turf.js)    │                                       │   (Python + Pydantic)     │
└───────────────────────────┘                                       └─────────────┬─────────────┘
                                                                                  │
                                                                                  ▼
                                                                    ┌───────────────────────────┐
                                                                    │    Google Earth Engine    │
                                                                    │   (Sentinel-2 & Spatial   │
                                                                    │      Change Analysis)     │
                                                                    └───────────────────────────┘
```

1. **Frontend Dashboard (React):** Captures user-selected coordinates/AOI radii, renders interactive Mapbox layers, heatmaps, and displays real-time risk summaries.
2. **Intelligence API (FastAPI):** Validates spatial queries, orchestrates geospatial computations, and serves risk scores and overlay metadata.
3. **Satellite Processing (Google Earth Engine):** Queries Sentinel-2 archives, computes pre/post-disaster spectral differences, and returns processed geospatial intelligence.

---

## 🎯 Use Cases

- **Flood Response & Damage Assessment:** Rapidly map inundation extents and stranded populations.
- **Cyclone Aftermath Monitoring:** Identify coastal and infrastructure damage corridors.
- **Landslide & Terrain Degradation:** Detect slope failures and blocked transit routes.
- **Wildfire Damage Intelligence:** Track burn scars, vegetation loss, and proximity to settlements.
- **Humanitarian Prioritization:** Guide NGOs and disaster agencies toward the highest-need zones.

---

## 🚀 Getting Started

### **Prerequisites**
- **Node.js** (v18+) and **npm**
- **Python** (3.11+)
- **Mapbox Access Token** (for map rendering)
- **Google Earth Engine Account & Credentials** (for live satellite processing)

### **1. Clone the Repository**
```bash
git clone [https://github.com/Shailesh14u/RAPID-Intelligence.git](https://github.com/Shailesh14u/RAPID-Intelligence.git)
cd RAPID-Intelligence
```

### **2. Backend Setup (FastAPI)**
```bash
cd backend

# Create and activate a virtual environment
python -m venv venv
source venv/bin/activate        # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env            # Add your GEE credentials/project ID

# Start the FastAPI server
uvicorn main:app --reload --port 8000
```

### **3. Frontend Setup (React + Vite)**
```bash
cd frontend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env            # Add VITE_MAPBOX_TOKEN=your_token_here

# Start the development server
npm run dev
```

---

## 🗺️ Roadmap

### **Phase 1: Core Foundation**
- [x] Interactive dashboard and Mapbox GL interface
- [x] Backend health and geospatial analysis endpoints
- [x] AOI radius selection and baseline impact scoring

### **Phase 2: Live Remote Sensing & Overlays**
- [ ] Full live Google Earth Engine pipeline integration
- [ ] Enhanced multi-factor vulnerability and population scoring
- [ ] Additional hazard-specific overlays (flood depth, burn severity)

### **Phase 3: Advanced Decision Support**
- [ ] Historical disaster trend monitoring and time-series playback
- [ ] Automated PDF/GeoJSON situation reports for field teams
- [ ] Multi-region deployment support for agency workflows

---

## 🌟 Why This Project Matters

Disasters do not wait, and emergency response decisions are only as effective as the information behind them. **RAPID Intelligence** bridges the gap between complex satellite remote sensing and fast, intuitive field operations—empowering responders to save time, optimize resources, and protect communities when it matters most.

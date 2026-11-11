export const MOCK_INCIDENT_FEED = [
  { id: 1, text: "Zone A Flood Expansion", time: "06:38 UTC", type: "critical" },
  { id: 2, text: "Road Network Disruption", time: "06:31 UTC", type: "high" },
  { id: 3, text: "Water Level Increased", time: "06:24 UTC", type: "medium" },
];

export const MOCK_PRIORITY_ZONES = [
  { id: "01", name: "ZONE A", reason: "Flood + Hospital", score: 94 },
  { id: "02", name: "ZONE C", reason: "Population Exposure", score: 91 },
  { id: "03", name: "ZONE F", reason: "Road Disruption", score: 82 },
];

export const MOCK_LIVE_CONDITIONS = {
  floodSeverity: "HIGH",
  rainfall: "128 mm",
  waterLevel: "4.8 m",
  roadAccess: "DEGRADED"
};

export const MOCK_AI_RESPONSE = {
  action: "DEPLOY RESCUE TEAM",
  priority: "CRITICAL PRIORITY",
  matrix: {
    floodSeverity: 91,
    populationExposure: 82,
    infrastructure: 88,
    roadAccess: 41,
    hospitalProximity: 93
  }
};

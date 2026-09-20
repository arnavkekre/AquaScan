const API_BASE = '/api';

export async function fetchHealth() {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) throw new Error(`Health check failed: ${res.statusText}`);
  return res.json();
}

export async function fetchSamples() {
  const res = await fetch(`${API_BASE}/samples`);
  if (!res.ok) throw new Error(`Failed to load samples: ${res.statusText}`);
  return res.json();
}

export async function detectSample(filename, params = {}) {
  const searchParams = new URLSearchParams();
  if (params.conf_threshold !== undefined) searchParams.append('conf_threshold', params.conf_threshold);
  if (params.latitude !== undefined) searchParams.append('latitude', params.latitude);
  if (params.longitude !== undefined) searchParams.append('longitude', params.longitude);
  if (params.altitude_m !== undefined) searchParams.append('altitude_m', params.altitude_m);
  if (params.heading_deg !== undefined) searchParams.append('heading_deg', params.heading_deg);
  if (params.swath_width_m !== undefined) searchParams.append('swath_width_m', params.swath_width_m);

  const url = `${API_BASE}/detect/sample/${encodeURIComponent(filename)}?${searchParams.toString()}`;
  const res = await fetch(url, { method: 'POST' });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || `Detection failed: ${res.statusText}`);
  }
  return res.json();
}

export async function detectUpload(formData) {
  const res = await fetch(`${API_BASE}/detect/upload`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || `Upload detection failed: ${res.statusText}`);
  }
  return res.json();
}

export async function fetchSimulatedMission() {
  const res = await fetch(`${API_BASE}/mission/simulate`);
  if (!res.ok) throw new Error(`Simulation failed: ${res.statusText}`);
  return res.json();
}

export function getExportUrl(format = 'geojson') {
  return `${API_BASE}/export/${format}`;
}


import React, { useEffect, useRef } from 'react';
import { MOCK_SITES } from '../constants';
import { MapPin } from 'lucide-react';

declare const L: any; // Leaflet global

export const MapVisualizer: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);

  useEffect(() => {
    if (typeof L === 'undefined' || !mapRef.current) return;

    if (!mapInstance.current) {
      // Initialize Map
      const map = L.map(mapRef.current).setView([39.8283, -98.5795], 4); // Center of USA

      // Add OpenStreetMap Dark Mode Layer (or Standard)
      // Using CartoDB Dark Matter for "High Tech" feel
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
      }).addTo(map);

      // Add Markers
      const usLocations = [
          { lat: 33.7490, lng: -84.3880, name: "Northside Hospital", robots: 8 }, // Atlanta
          { lat: 41.8781, lng: -87.6298, name: "Acme Logistics", robots: 15 }, // Chicago
          { lat: 30.2672, lng: -97.7431, name: "City Hall", robots: 3 }, // Austin
          { lat: 37.7749, lng: -122.4194, name: "Tech StartUp", robots: 5 }, // SF
          { lat: 40.7128, lng: -74.0060, name: "Konica Minolta East", robots: 2 }, // NYC
      ];

      usLocations.forEach(loc => {
          const markerHtml = `
            <div class="relative flex items-center justify-center">
                <div class="w-4 h-4 bg-emerald-500 rounded-full animate-ping absolute opacity-75"></div>
                <div class="w-3 h-3 bg-emerald-400 rounded-full relative border-2 border-white shadow-sm"></div>
            </div>
          `;
          
          const icon = L.divIcon({
              className: 'custom-map-marker',
              html: markerHtml,
              iconSize: [20, 20],
              iconAnchor: [10, 10]
          });

          L.marker([loc.lat, loc.lng], { icon })
           .addTo(map)
           .bindPopup(`
                <div class="font-sans">
                    <h3 class="font-bold text-sm text-slate-800">${loc.name}</h3>
                    <p class="text-xs text-slate-500">Active Robots: <strong>${loc.robots}</strong></p>
                    <span class="text-[10px] text-emerald-600 font-bold uppercase">Online</span>
                </div>
           `);
      });

      mapInstance.current = map;
    }

    return () => {
        if (mapInstance.current) {
            mapInstance.current.remove();
            mapInstance.current = null;
        }
    }
  }, []);

  return (
    <div className="w-full h-full min-h-[400px] bg-slate-900 rounded-xl overflow-hidden border border-slate-200/60 dark:border-slate-700 relative group shadow-inner">
       <div ref={mapRef} className="absolute inset-0 z-0" />
       
       {/* Overlay UI */}
       <div className="absolute top-4 left-4 z-[400] flex flex-col gap-2">
            <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-3 rounded-xl shadow-lg border border-white/50 dark:border-slate-700 pointer-events-auto">
                <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Live Fleet Tracking</h4>
                <div className="space-y-1">
                    {MOCK_SITES.map((site, i) => (
                        <div key={site.id} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer transition-colors">
                            <MapPin size={14} className="text-emerald-500" />
                            <span className="truncate max-w-[120px]">{site.name}</span>
                            <span className="ml-auto text-[10px] font-mono bg-slate-100 dark:bg-slate-800 px-1.5 rounded text-slate-500">{site.robotCount}</span>
                        </div>
                    ))}
                </div>
            </div>
       </div>
    </div>
  );
};

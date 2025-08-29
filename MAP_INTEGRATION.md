# 🗺️ Interactive Map Integration - Implementation Plan

## 📍 **Overview**

This document outlines the implementation plan for adding interactive map functionality to AquaSense, allowing users to visualize fountain locations, real-time status, and optimize technician routing.

---

## 🎯 **Goals & Objectives**

### **Primary Goals**
- **Visual Location Management**: Display all fountains on an interactive map
- **Real-time Status Indicators**: Show fountain health and alerts on map markers
- **Route Optimization**: Help technicians find optimal routes between fountains
- **Geographic Analytics**: Provide location-based insights and reporting

### **Success Metrics**
- 📍 **Map Load Time**: < 2 seconds for initial map render
- 🎯 **Marker Accuracy**: GPS coordinates within 5-meter accuracy
- 🚀 **User Engagement**: 70% of users interact with map features
- 📱 **Mobile Performance**: Smooth interaction on mobile devices

---

## 🏗️ **Technical Architecture**

### **Map Provider Comparison**

| Feature | Google Maps | Mapbox | OpenStreetMap |
|---------|-------------|---------|---------------|
| **Cost** | $7/1000 loads | $5/1000 loads | Free |
| **Customization** | Limited | Extensive | Full control |
| **Performance** | Excellent | Excellent | Good |
| **Mobile Support** | Excellent | Excellent | Good |
| **Offline Support** | Limited | Yes | Yes |
| **Satellite View** | Yes | Yes | Limited |
| **Street View** | Yes | No | No |

**Recommendation**: Start with **Mapbox** for better customization and cost-effectiveness, with fallback to Google Maps if needed.

### **Component Architecture**
```
src/components/map/
├── InteractiveMap.tsx          # Main map component
├── FountainMarker.tsx          # Individual fountain markers
├── MarkerCluster.tsx           # Clustering for dense areas
├── RouteOptimizer.tsx          # Route planning for technicians
├── MapControls.tsx             # Zoom, layers, filters
├── LocationSearch.tsx          # Search and geocoding
└── MapProvider.tsx             # Map context and state management
```

---

## 🚀 **Implementation Phases**

### **Phase 1: Basic Map Integration** (Week 1-2)
**Goal**: Display fountains on an interactive map with basic functionality

#### **Tasks**
1. **Map Provider Setup** (2 days)
   ```bash
   # Install Mapbox dependencies
   npm install mapbox-gl @types/mapbox-gl react-map-gl
   
   # Or for Google Maps
   npm install @googlemaps/react-wrapper @googlemaps/js-api-loader
   ```

2. **Basic Map Component** (2 days)
   ```typescript
   // src/components/map/InteractiveMap.tsx
   import { useState, useEffect } from 'react';
   import Map, { Marker, NavigationControl } from 'react-map-gl';
   import { useFountains } from '@/hooks/useSupabase';
   
   export function InteractiveMap() {
     const { data: fountains } = useFountains();
     const [viewState, setViewState] = useState({
       longitude: -73.9654,
       latitude: 40.7829,
       zoom: 12
     });
   
     return (
       <Map
         {...viewState}
         onMove={evt => setViewState(evt.viewState)}
         mapboxAccessToken={process.env.VITE_MAPBOX_ACCESS_TOKEN}
         style={{ width: '100%', height: '400px' }}
         mapStyle="mapbox://styles/mapbox/streets-v12"
       >
         <NavigationControl position="top-right" />
         {fountains?.map(fountain => (
           <FountainMarker key={fountain.id} fountain={fountain} />
         ))}
       </Map>
     );
   }
   ```

3. **Fountain Markers** (2 days)
   ```typescript
   // src/components/map/FountainMarker.tsx
   import { Marker, Popup } from 'react-map-gl';
   import { useState } from 'react';
   import { Droplets, AlertTriangle, CheckCircle } from 'lucide-react';
   
   interface FountainMarkerProps {
     fountain: Fountain;
   }
   
   export function FountainMarker({ fountain }: FountainMarkerProps) {
     const [showPopup, setShowPopup] = useState(false);
   
     const getMarkerColor = (status: string) => {
       switch (status) {
         case 'active': return '#10b981'; // green
         case 'maintenance': return '#f59e0b'; // yellow
         case 'error': return '#ef4444'; // red
         default: return '#6b7280'; // gray
       }
     };
   
     const getStatusIcon = (status: string) => {
       switch (status) {
         case 'active': return <CheckCircle className="w-4 h-4" />;
         case 'maintenance': return <Droplets className="w-4 h-4" />;
         case 'error': return <AlertTriangle className="w-4 h-4" />;
         default: return <Droplets className="w-4 h-4" />;
       }
     };
   
     return (
       <>
         <Marker
           longitude={fountain.longitude}
           latitude={fountain.latitude}
           onClick={() => setShowPopup(true)}
         >
           <div 
             className="w-8 h-8 rounded-full flex items-center justify-center text-white cursor-pointer hover:scale-110 transition-transform"
             style={{ backgroundColor: getMarkerColor(fountain.status) }}
           >
             {getStatusIcon(fountain.status)}
           </div>
         </Marker>
   
         {showPopup && (
           <Popup
             longitude={fountain.longitude}
             latitude={fountain.latitude}
             onClose={() => setShowPopup(false)}
             closeButton={true}
             closeOnClick={false}
           >
             <div className="p-2">
               <h3 className="font-semibold">{fountain.name}</h3>
               <p className="text-sm text-gray-600">{fountain.location}</p>
               <p className="text-sm">Status: {fountain.status}</p>
             </div>
           </Popup>
         )}
       </>
     );
   }
   ```

4. **Integration with Existing UI** (1 day)
   - Add map to Overview Hub
   - Ensure responsive design
   - Test on mobile devices

#### **Deliverables**
- ✅ Interactive map displaying all fountains
- ✅ Color-coded markers based on fountain status
- ✅ Popup information for each fountain
- ✅ Mobile-responsive design

### **Phase 2: Advanced Features** (Week 3-4)
**Goal**: Add clustering, filtering, and enhanced interactions

#### **Tasks**
1. **Marker Clustering** (2 days)
   ```typescript
   // src/components/map/MarkerCluster.tsx
   import { useMemo } from 'react';
   import { Marker } from 'react-map-gl';
   import Supercluster from 'supercluster';
   
   export function MarkerCluster({ fountains, bounds, zoom }) {
     const clusters = useMemo(() => {
       const supercluster = new Supercluster({
         radius: 75,
         maxZoom: 20,
         minZoom: 0,
         minPoints: 2
       });
   
       const points = fountains.map(fountain => ({
         type: 'Feature',
         properties: { 
           cluster: false, 
           fountainId: fountain.id,
           status: fountain.status 
         },
         geometry: {
           type: 'Point',
           coordinates: [fountain.longitude, fountain.latitude]
         }
       }));
   
       supercluster.load(points);
       return supercluster.getClusters(bounds, zoom);
     }, [fountains, bounds, zoom]);
   
     return (
       <>
         {clusters.map(cluster => {
           const [longitude, latitude] = cluster.geometry.coordinates;
           const { cluster: isCluster, point_count } = cluster.properties;
   
           if (isCluster) {
             return (
               <Marker key={cluster.id} longitude={longitude} latitude={latitude}>
                 <div className="cluster-marker">
                   {point_count}
                 </div>
               </Marker>
             );
           }
   
           return (
             <FountainMarker 
               key={cluster.properties.fountainId}
               fountain={fountains.find(f => f.id === cluster.properties.fountainId)}
             />
           );
         })}
       </>
     );
   }
   ```

2. **Map Filters and Controls** (2 days)
   ```typescript
   // src/components/map/MapControls.tsx
   export function MapControls({ onFilterChange, onLayerChange }) {
     return (
       <div className="absolute top-4 left-4 bg-white p-4 rounded-lg shadow-lg">
         <h3 className="font-semibold mb-2">Filters</h3>
         
         <div className="space-y-2">
           <label className="flex items-center">
             <input type="checkbox" defaultChecked />
             <span className="ml-2">Active Fountains</span>
           </label>
           <label className="flex items-center">
             <input type="checkbox" defaultChecked />
             <span className="ml-2">Maintenance Required</span>
           </label>
           <label className="flex items-center">
             <input type="checkbox" defaultChecked />
             <span className="ml-2">Error Status</span>
           </label>
         </div>
   
         <div className="mt-4">
           <h4 className="font-medium mb-2">Map Style</h4>
           <select className="w-full p-1 border rounded">
             <option value="streets">Streets</option>
             <option value="satellite">Satellite</option>
             <option value="terrain">Terrain</option>
           </select>
         </div>
       </div>
     );
   }
   ```

3. **Location Search** (2 days)
   ```typescript
   // src/components/map/LocationSearch.tsx
   import { useState } from 'react';
   import { Search } from 'lucide-react';
   
   export function LocationSearch({ onLocationSelect }) {
     const [query, setQuery] = useState('');
     const [suggestions, setSuggestions] = useState([]);
   
     const searchLocations = async (searchQuery: string) => {
       // Use Mapbox Geocoding API
       const response = await fetch(
         `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery)}.json?access_token=${process.env.VITE_MAPBOX_ACCESS_TOKEN}`
       );
       const data = await response.json();
       setSuggestions(data.features);
     };
   
     return (
       <div className="absolute top-4 right-4 w-64">
         <div className="relative">
           <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
           <input
             type="text"
             placeholder="Search locations..."
             value={query}
             onChange={(e) => {
               setQuery(e.target.value);
               if (e.target.value.length > 2) {
                 searchLocations(e.target.value);
               }
             }}
             className="w-full pl-10 pr-4 py-2 border rounded-lg"
           />
         </div>
         
         {suggestions.length > 0 && (
           <div className="absolute top-12 left-0 right-0 bg-white border rounded-lg shadow-lg max-h-48 overflow-y-auto">
             {suggestions.map((suggestion, index) => (
               <div
                 key={index}
                 className="p-2 hover:bg-gray-100 cursor-pointer"
                 onClick={() => onLocationSelect(suggestion)}
               >
                 {suggestion.place_name}
               </div>
             ))}
           </div>
         )}
       </div>
     );
   }
   ```

#### **Deliverables**
- ✅ Marker clustering for dense areas
- ✅ Filter controls for fountain status
- ✅ Location search and geocoding
- ✅ Multiple map styles (streets, satellite, terrain)

### **Phase 3: Route Optimization** (Week 5-6)
**Goal**: Add route planning and navigation for technicians

#### **Tasks**
1. **Route Planning Component** (3 days)
   ```typescript
   // src/components/map/RouteOptimizer.tsx
   export function RouteOptimizer({ technician, workOrders }) {
     const [optimizedRoute, setOptimizedRoute] = useState(null);
   
     const calculateOptimalRoute = async () => {
       const coordinates = workOrders.map(order => 
         [order.fountain.longitude, order.fountain.latitude]
       );
   
       // Use Mapbox Optimization API
       const response = await fetch(
         `https://api.mapbox.com/optimized-trips/v1/mapbox/driving/${coordinates.join(';')}?access_token=${process.env.VITE_MAPBOX_ACCESS_TOKEN}`
       );
       
       const data = await response.json();
       setOptimizedRoute(data.trips[0]);
     };
   
     return (
       <div className="route-optimizer">
         <button onClick={calculateOptimalRoute}>
           Optimize Route
         </button>
         {optimizedRoute && (
           <div>
             <p>Total Distance: {optimizedRoute.distance}m</p>
             <p>Estimated Time: {optimizedRoute.duration}s</p>
           </div>
         )}
       </div>
     );
   }
   ```

2. **GPS Integration** (2 days)
   ```typescript
   // src/hooks/useGeolocation.ts
   export function useGeolocation() {
     const [position, setPosition] = useState(null);
     const [error, setError] = useState(null);
   
     useEffect(() => {
       if (!navigator.geolocation) {
         setError('Geolocation is not supported');
         return;
       }
   
       const watchId = navigator.geolocation.watchPosition(
         (pos) => setPosition({
           latitude: pos.coords.latitude,
           longitude: pos.coords.longitude,
           accuracy: pos.coords.accuracy
         }),
         (err) => setError(err.message),
         { enableHighAccuracy: true, maximumAge: 30000, timeout: 27000 }
       );
   
       return () => navigator.geolocation.clearWatch(watchId);
     }, []);
   
     return { position, error };
   }
   ```

3. **Navigation Integration** (2 days)
   - Turn-by-turn directions
   - Real-time location tracking
   - ETA calculations

#### **Deliverables**
- ✅ Route optimization for multiple fountains
- ✅ GPS tracking for technicians
- ✅ Turn-by-turn navigation
- ✅ Real-time ETA updates

---

## 📱 **Mobile Considerations**

### **Performance Optimization**
- **Lazy Loading**: Load map tiles on demand
- **Marker Virtualization**: Only render visible markers
- **Gesture Handling**: Optimize touch interactions
- **Battery Optimization**: Reduce GPS polling frequency

### **Offline Support**
```typescript
// src/utils/mapCache.ts
export class MapCache {
  private cache = new Map();

  async cacheMapTiles(bounds: Bounds, zoomLevels: number[]) {
    // Cache map tiles for offline use
    for (const zoom of zoomLevels) {
      const tiles = this.getTilesInBounds(bounds, zoom);
      for (const tile of tiles) {
        await this.cacheTile(tile);
      }
    }
  }

  async getCachedTile(tileId: string) {
    return this.cache.get(tileId);
  }
}
```

---

## 🔧 **Configuration & Setup**

### **Environment Variables**
```env
# Mapbox Configuration
VITE_MAPBOX_ACCESS_TOKEN=pk.your_mapbox_token_here

# Google Maps Configuration (alternative)
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# Map Settings
VITE_DEFAULT_MAP_CENTER_LAT=40.7829
VITE_DEFAULT_MAP_CENTER_LNG=-73.9654
VITE_DEFAULT_MAP_ZOOM=12
VITE_ENABLE_CLUSTERING=true
VITE_CLUSTER_RADIUS=75
```

### **Database Schema Updates**
```sql
-- Add GPS coordinates to fountains table
ALTER TABLE fountains 
ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8),
ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8),
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS city VARCHAR(100),
ADD COLUMN IF NOT EXISTS country VARCHAR(100);

-- Create index for spatial queries
CREATE INDEX IF NOT EXISTS idx_fountains_location 
ON fountains USING GIST (ST_Point(longitude, latitude));

-- Add technician location tracking
CREATE TABLE IF NOT EXISTS technician_locations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  technician_id UUID REFERENCES users(id),
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  accuracy DECIMAL(8, 2),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 🧪 **Testing Strategy**

### **Unit Tests**
```typescript
// src/components/map/__tests__/FountainMarker.test.tsx
import { render, screen } from '@testing-library/react';
import { FountainMarker } from '../FountainMarker';

describe('FountainMarker', () => {
  it('renders marker with correct status color', () => {
    const fountain = {
      id: '1',
      name: 'Test Fountain',
      status: 'active',
      latitude: 40.7829,
      longitude: -73.9654
    };

    render(<FountainMarker fountain={fountain} />);
    
    const marker = screen.getByRole('button');
    expect(marker).toHaveStyle('background-color: #10b981');
  });
});
```

### **Integration Tests**
- Map rendering performance
- Marker clustering accuracy
- Route optimization correctness
- GPS accuracy validation

### **E2E Tests**
```typescript
// tests/e2e/map.spec.ts
import { test, expect } from '@playwright/test';

test('map displays fountains correctly', async ({ page }) => {
  await page.goto('/');
  
  // Wait for map to load
  await page.waitForSelector('[data-testid="interactive-map"]');
  
  // Check that markers are visible
  const markers = await page.locator('.fountain-marker').count();
  expect(markers).toBeGreaterThan(0);
  
  // Test marker interaction
  await page.click('.fountain-marker:first-child');
  await expect(page.locator('.mapboxgl-popup')).toBeVisible();
});
```

---

## 📊 **Analytics & Monitoring**

### **Map Usage Analytics**
```typescript
// src/utils/mapAnalytics.ts
export class MapAnalytics {
  trackMapInteraction(event: string, data: any) {
    // Track user interactions with the map
    analytics.track('Map Interaction', {
      event,
      ...data,
      timestamp: new Date().toISOString()
    });
  }

  trackRouteOptimization(routeData: any) {
    analytics.track('Route Optimized', {
      distance: routeData.distance,
      duration: routeData.duration,
      waypoints: routeData.waypoints.length
    });
  }
}
```

### **Performance Monitoring**
- Map load times
- Marker rendering performance
- Route calculation speed
- GPS accuracy metrics

---

## 🚀 **Deployment Considerations**

### **API Key Security**
```typescript
// src/utils/mapConfig.ts
export const getMapConfig = () => {
  const token = process.env.VITE_MAPBOX_ACCESS_TOKEN;
  
  if (!token) {
    throw new Error('Mapbox access token is required');
  }

  return {
    accessToken: token,
    style: 'mapbox://styles/mapbox/streets-v12',
    center: [
      parseFloat(process.env.VITE_DEFAULT_MAP_CENTER_LNG || '-73.9654'),
      parseFloat(process.env.VITE_DEFAULT_MAP_CENTER_LAT || '40.7829')
    ],
    zoom: parseInt(process.env.VITE_DEFAULT_MAP_ZOOM || '12')
  };
};
```

### **CDN and Caching**
- Use CDN for map tiles
- Cache static map assets
- Implement service worker for offline maps

---

## 📋 **Future Enhancements**

### **Phase 4: Advanced Analytics** (Future)
- **Heat Maps**: Show fountain usage patterns
- **Predictive Routing**: AI-powered route suggestions
- **Geofencing**: Automatic check-ins for technicians
- **Weather Overlay**: Display weather conditions on map

### **Phase 5: AR Integration** (Future)
- **Augmented Reality**: AR view for on-site maintenance
- **QR Code Integration**: Quick fountain identification
- **3D Visualization**: 3D models of fountain systems

---

## 📞 **Support & Resources**

### **Documentation**
- [Mapbox GL JS Documentation](https://docs.mapbox.com/mapbox-gl-js/)
- [Google Maps JavaScript API](https://developers.google.com/maps/documentation/javascript)
- [React Map GL Documentation](https://visgl.github.io/react-map-gl/)

### **Community**
- [Mapbox Community](https://community.mapbox.com/)
- [Stack Overflow - Mapbox](https://stackoverflow.com/questions/tagged/mapbox)
- [GitHub Issues](https://github.com/visgl/react-map-gl/issues)

---

**Implementation Timeline**: 6 weeks total
**Estimated Effort**: 120-150 hours
**Team Size**: 2-3 developers
**Budget**: $500-1000 (API costs for first year)
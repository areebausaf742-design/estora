import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Compass, ExternalLink, MapPin, X } from 'lucide-react';
import type { Property } from '../types';
import { formatArea, formatINR } from '../utils/format';
import { ImageWithFallback } from './ImageWithFallback';
import { useLanguage } from '../context/LanguageContext';

interface MapViewProps {
  properties: Property[];
  selectedPropertyId?: string | null;
  onSelectProperty?: (property: Property | null) => void;
  className?: string;
}

interface CityBounds {
  name: string;
  lat: number;
  lng: number;
  zoom: number;
}

const CITY_CENTERS: Record<string, CityBounds> = {
  All: { name: 'All India', lat: 20.5937, lng: 78.9629, zoom: 4.5 },
  Mumbai: { name: 'Mumbai', lat: 19.0400, lng: 72.8500, zoom: 12 },
  Bengaluru: { name: 'Bengaluru', lat: 12.9716, lng: 77.5946, zoom: 11.5 },
  'Delhi NCR': { name: 'Delhi NCR', lat: 28.4800, lng: 77.0600, zoom: 11 },
  Pune: { name: 'Pune', lat: 18.5362, lng: 73.8940, zoom: 12.5 },
  Hyderabad: { name: 'Hyderabad', lat: 17.4325, lng: 78.4071, zoom: 12 },
  Goa: { name: 'Goa', lat: 15.5186, lng: 73.7661, zoom: 11 },
};

// Coordinate projection helper for map bounding box
function projectCoordinates(lat: number, lng: number, activeCity: string): { x: number; y: number } {
  // If specific city is selected, zoom into local bounding box
  if (activeCity === 'Mumbai') {
    // Lat: 18.90 to 19.25, Lng: 72.78 to 72.95
    const x = ((lng - 72.78) / (72.95 - 72.78)) * 100;
    const y = ((19.25 - lat) / (19.25 - 18.90)) * 100;
    return { x: Math.max(8, Math.min(92, x)), y: Math.max(8, Math.min(92, y)) };
  }
  if (activeCity === 'Bengaluru') {
    // Lat: 12.85 to 13.08, Lng: 77.52 to 77.78
    const x = ((lng - 77.52) / (77.78 - 77.52)) * 100;
    const y = ((13.08 - lat) / (13.08 - 12.85)) * 100;
    return { x: Math.max(8, Math.min(92, x)), y: Math.max(8, Math.min(92, y)) };
  }
  if (activeCity === 'Delhi NCR') {
    // Lat: 28.38 to 28.58, Lng: 76.98 to 77.16
    const x = ((lng - 76.98) / (77.16 - 76.98)) * 100;
    const y = ((28.58 - lat) / (28.58 - 28.38)) * 100;
    return { x: Math.max(8, Math.min(92, x)), y: Math.max(8, Math.min(92, y)) };
  }
  if (activeCity === 'Pune') {
    const x = ((lng - 73.82) / (73.96 - 73.82)) * 100;
    const y = ((18.58 - lat) / (18.58 - 18.48)) * 100;
    return { x: Math.max(10, Math.min(90, x)), y: Math.max(10, Math.min(90, y)) };
  }
  if (activeCity === 'Hyderabad') {
    const x = ((lng - 78.34) / (78.48 - 78.34)) * 100;
    const y = ((17.48 - lat) / (17.48 - 17.38)) * 100;
    return { x: Math.max(10, Math.min(90, x)), y: Math.max(10, Math.min(90, y)) };
  }

  // All India overview projection
  // Lat: 8 to 32, Lng: 68 to 88
  const x = ((lng - 68) / (88 - 68)) * 100;
  const y = ((32 - lat) / (32 - 8)) * 100;
  return { x: Math.max(8, Math.min(92, x)), y: Math.max(8, Math.min(92, y)) };
}

export function MapView({
  properties,
  selectedPropertyId,
  onSelectProperty,
  className = '',
}: MapViewProps) {
  const { t } = useLanguage();
  const [activeCity, setActiveCity] = useState<string>('All');
  const [activePin, setActivePin] = useState<Property | null>(null);

  const filteredProperties = properties.filter((p) => {
    if (activeCity === 'All') return true;
    return p.city === activeCity;
  });

  const selectedOrActive = activePin || (selectedPropertyId ? properties.find((p) => p.id === selectedPropertyId) : null);

  const handleMarkerClick = (property: Property) => {
    setActivePin(property);
    onSelectProperty?.(property);
  };

  return (
    <div
      className={`map-view-container ${className}`}
      style={{
        position: 'relative',
        borderRadius: '20px',
        overflow: 'hidden',
        border: '1px solid var(--line)',
        backgroundColor: '#FBF8F2',
        minHeight: '520px',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      {/* City Switcher Controls */}
      <div
        className="map-header"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '8px',
          padding: '12px 16px',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid var(--line)',
          zIndex: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Compass className="text-[#2F4A3C]" size={18} />
          <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted)' }}>
            {t('view_map')} &middot; {filteredProperties.length} {t('homes_found')}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflowX: 'auto', padding: '4px 0' }}>
          {Object.keys(CITY_CENTERS).map((cityKey) => {
            const isCurrent = activeCity === cityKey;
            return (
              <button
                key={cityKey}
                type="button"
                onClick={() => {
                  setActiveCity(cityKey);
                  setActivePin(null);
                }}
                style={{
                  fontSize: '0.75rem',
                  padding: '5px 12px',
                  borderRadius: '999px',
                  whiteSpace: 'nowrap',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: isCurrent ? 'var(--forest)' : 'var(--ivory-deep)',
                  color: isCurrent ? 'var(--ivory)' : 'var(--charcoal)',
                  transition: 'all 0.15s ease',
                }}
              >
                {cityKey === 'All' ? t('all_cities') : cityKey}
              </button>
            );
          })}
        </div>
      </div>

      {/* Map Graphic Canvas / Vector Area */}
      <div
        className="map-canvas-area"
        style={{
          position: 'relative',
          flex: 1,
          width: '100%',
          minHeight: '460px',
          backgroundColor: '#f4ece1',
          overflow: 'hidden',
        }}
      >
        {/* Architectural map background grid */}
        <svg
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.35, pointerEvents: 'none' }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="estora-map-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#cfc3ab" strokeWidth="0.8" />
              <circle cx="20" cy="20" r="1" fill="#B08A3E" opacity="0.4" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#estora-map-grid)" />
        </svg>

        {/* Decorative Indian Coastline / Topography outlines */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            opacity: 0.15,
          }}
        >
          <div style={{ userSelect: 'none', color: '#1B1B18' }}>
            <span style={{ fontSize: '4.5rem', fontFamily: 'var(--font-display)', letterSpacing: '0.15em', textTransform: 'uppercase', display: 'block' }}>
              {activeCity === 'All' ? 'BHARAT' : activeCity.toUpperCase()}
            </span>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#B08A3E' }}>
              ESTORA CARTOGRAPHY &middot; METRO PRECINCTS
            </span>
          </div>
        </div>

        {/* Map Pins */}
        <div style={{ position: 'absolute', inset: 0, padding: '32px' }}>
          {filteredProperties.map((prop) => {
            const { x, y } = projectCoordinates(prop.lat, prop.lng, activeCity);
            const isSelected = selectedOrActive?.id === prop.id;

            return (
              <div
                key={prop.id}
                style={{
                  position: 'absolute',
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: 'translate(-50%, -100%)',
                  zIndex: isSelected ? 30 : 15,
                  cursor: 'pointer',
                  transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}
                className={isSelected ? 'scale-110' : 'hover:scale-110'}
                onClick={() => handleMarkerClick(prop)}
              >
                {/* Pin Badge */}
                <div
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full shadow-lg border transition-all ${
                    isSelected
                      ? 'bg-[#1B1B18] text-white border-[#B08A3E] ring-2 ring-[#B08A3E]/50'
                      : 'bg-white text-[#1B1B18] border-[#E6DCC8] hover:border-[#2F4A3C]'
                  }`}
                >
                  <MapPin
                    size={13}
                    className={isSelected ? 'text-[#B08A3E]' : 'text-[#2F4A3C]'}
                    fill={isSelected ? '#B08A3E' : 'none'}
                  />
                  <span className="text-xs font-semibold whitespace-nowrap">
                    {formatINR(prop.price, prop.purpose).split(' ')[0]} {formatINR(prop.price, prop.purpose).split(' ')[1] || ''}
                  </span>
                </div>

                {/* Pin pointer tip */}
                <div
                  style={{
                    width: '6px',
                    height: '6px',
                    margin: '0 auto',
                    transform: 'rotate(45deg) translateY(-2px)',
                    backgroundColor: isSelected ? '#1B1B18' : '#ffffff',
                    borderRight: '1px solid #E6DCC8',
                    borderBottom: '1px solid #E6DCC8',
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* Selected Property Popup Card */}
        {selectedOrActive && (
          <div
            style={{
              position: 'absolute',
              bottom: '16px',
              right: '16px',
              width: 'min(380px, calc(100% - 32px))',
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              boxShadow: 'var(--shadow-lg)',
              border: '1px solid var(--line)',
              padding: '16px',
              zIndex: 40,
            }}
          >
            <button
              type="button"
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                padding: '4px',
                borderRadius: '50%',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                color: 'var(--muted)',
              }}
              onClick={() => setActivePin(null)}
              aria-label="Close preview"
            >
              <X size={16} />
            </button>

            <div style={{ display: 'flex', gap: '14px' }}>
              <div style={{ width: '100px', height: '85px', borderRadius: '12px', overflow: 'hidden', flexShrink: 0, border: '1px solid var(--line)' }}>
                <ImageWithFallback
                  src={selectedOrActive.thumbnail}
                  alt={selectedOrActive.type}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              <div style={{ flex: 1, minWidth: 0, paddingRight: '12px' }}>
                <span style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--brass)' }}>
                  {selectedOrActive.locality}, {selectedOrActive.city}
                </span>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--charcoal)', margin: '2px 0 4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {selectedOrActive.type} {selectedOrActive.bedrooms ? `\u00B7 ${selectedOrActive.bedrooms}` : ''}
                </h4>

                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--forest)' }}>
                  {formatINR(selectedOrActive.price, selectedOrActive.purpose)}
                </div>

                <div style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: '4px' }}>
                  {formatArea(selectedOrActive.area)} &middot; {selectedOrActive.furnished}
                </div>
              </div>
            </div>

            <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
                RERA: <strong style={{ color: 'var(--charcoal)' }}>{selectedOrActive.reraNumber}</strong>
              </span>

              <Link
                to={`/property/${selectedOrActive.id}`}
                className="btn btn--primary btn--sm"
                style={{ fontSize: '0.75rem', padding: '6px 14px', textDecoration: 'none' }}
              >
                <span>{t('view_details')}</span>
                <ExternalLink size={12} style={{ marginLeft: '4px' }} />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import type { Property } from '../types';
import { MAX_COMPARE } from '../constants';
import { formatArea, formatINR, formatPricePerSqFt } from '../utils/format';
import { useSaved } from '../context/SavedContext';

interface CompareProps {
  open: boolean;
  onClose: () => void;
}

function CompareModal({ open, onClose }: CompareProps) {
  const { compareProperties } = useSaved();
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    dialogRef.current?.focus();
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const rows: Array<{ label: string; get: (p: Property) => string }> = [
    { label: 'Asking price', get: (p) => formatINR(p.price, p.purpose) },
    { label: 'Price / sq.ft.', get: (p) => formatPricePerSqFt(p.pricePerSqFt) },
    { label: 'Configuration', get: (p) => `${p.type}${p.bedrooms ? ` - ${p.bedrooms}` : ''}` },
    { label: 'Built area', get: (p) => formatArea(p.area) },
    { label: 'Bathrooms', get: (p) => String(p.bathrooms) },
    { label: 'Parking', get: (p) => String(p.parking) },
    { label: 'Furnishing', get: (p) => p.furnished },
    { label: 'Availability', get: (p) => p.availability },
    { label: 'City', get: (p) => p.city },
    { label: 'Locality', get: (p) => p.locality },
  ];

  return (
    <div
      className="modal-overlay"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="modal" role="dialog" aria-modal="true" aria-label="Property comparison" tabIndex={-1} ref={dialogRef}>
        <button type="button" className="icon-btn modal__close" onClick={onClose} aria-label="Close comparison">
          <X size={18} />
        </button>
        <div className="modal__head">
          <h3>Compare properties</h3>
          <p className="muted small">Up to {MAX_COMPARE} listings can be compared.</p>
        </div>
        <div className="compare-table">
          <div className="compare-row compare-row--head">
            <span className="compare-row__label">Attribute</span>
            {compareProperties.map((property) => (
              <span key={property.id} className="compare-row__value">
                {property.type} - {property.locality}
              </span>
            ))}
          </div>
          {rows.map((row) => (
            <div className="compare-row" key={row.label}>
              <span className="compare-row__label">{row.label}</span>
              {compareProperties.map((property) => (
                <span className="compare-row__value" key={property.id}>{row.get(property)}</span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function CompareTray() {
  const { compareProperties, removeFromCompare, clearCompare } = useSaved();
  const [open, setOpen] = useState(false);

  if (compareProperties.length === 0) return null;

  return (
    <>
      <div className="tray" role="region" aria-label="Property comparison tray">
        <span className="tray__label">Compare</span>
        <div className="tray__items">
          {compareProperties.map((property) => (
            <span className="tray__item" key={property.id}>
              {property.type} - {property.locality}
              <button type="button" onClick={() => removeFromCompare(property.id)} aria-label={`Remove ${property.locality} from comparison`}>
                <X size={14} />
              </button>
            </span>
          ))}
        </div>
        <button type="button" className="btn btn--brass btn--sm tray__cta" onClick={() => setOpen(true)}>
          Compare now
        </button>
        <button type="button" className="btn btn--ghost btn--sm tray__cta" style={{ color: 'var(--ivory)' }} onClick={clearCompare}>
          Clear
        </button>
      </div>
      <CompareModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
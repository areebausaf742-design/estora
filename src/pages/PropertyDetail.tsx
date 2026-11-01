import { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Bath,
  Building,
  Calendar,
  Car,
  CheckCircle2,
  Clock,
  Heart,
  MapPin,
  Phone,
  Ruler,
  Share2,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { PROPERTIES } from '../data/properties';
import { formatArea, formatINR, formatPricePerSqFt } from '../utils/format';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { EnquiryForm } from '../components/EnquiryForm';
import { EmiCalculator } from '../components/EmiCalculator';
import { MapView } from '../components/MapView';
import { MakeLeadCaptureModal } from '../components/MakeLeadCaptureModal';
import { PropertyCard } from '../components/PropertyCard';
import { useSaved } from '../context/SavedContext';
import { useLanguage } from '../context/LanguageContext';
import { WHATSAPP_URL } from '../constants';

export function PropertyDetail() {
  const { id } = useParams<{ id: string }>();
  const { isSaved, toggleSaved } = useSaved();
  const { t } = useLanguage();

  const property = useMemo(() => {
    return PROPERTIES.find((item) => item.id === id) || PROPERTIES[0];
  }, [id]);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [siteVisitModalOpen, setSiteVisitModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const saved = property ? isSaved(property.id) : false;

  const similarProperties = useMemo(() => {
    if (!property) return [];
    return PROPERTIES.filter(
      (p) => p.id !== property.id && (p.city === property.city || p.purpose === property.purpose)
    ).slice(0, 3);
  }, [property]);

  if (!property) {
    return (
      <div className="container py-20 text-center">
        <h2>Property not found</h2>
        <Link to="/buy" className="btn btn--primary mt-4">
          Browse all properties
        </Link>
      </div>
    );
  }

  const galleryImages = property.images && property.images.length > 0
    ? property.images
    : [property.thumbnail];

  const handleShare = async () => {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div className="property-detail-page pb-20">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="bg-white border-b border-[#E6DCC8] py-4">
        <div className="container flex items-center justify-between flex-wrap gap-4">
          <Link
            to={property.purpose === 'Buy' ? '/buy' : property.purpose === 'Rent' ? '/rent' : '/commercial'}
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#6B675E] hover:text-[#1B1B18] transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Back to {property.purpose} listings</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#E6DCC8] text-xs font-semibold text-[#1B1B18] hover:bg-[#F3EBDD] transition-colors"
            >
              <Share2 size={14} />
              <span>{copiedLink ? 'Link copied!' : 'Share'}</span>
            </button>
            <button
              type="button"
              onClick={() => toggleSaved(property.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition-colors ${
                saved
                  ? 'bg-[#1B1B18] text-white border-[#1B1B18]'
                  : 'border-[#E6DCC8] text-[#1B1B18] hover:bg-[#F3EBDD]'
              }`}
            >
              <Heart size={14} fill={saved ? 'currentColor' : 'none'} />
              <span>{saved ? 'Saved' : 'Save'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="container pt-8">
        {/* Gallery Section */}
        <div style={{ marginBottom: '32px' }}>
          <div className="property-detail__gallery">
            <ImageWithFallback
              src={galleryImages[activeImageIndex]}
              alt={`${property.type} in ${property.locality}`}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{ position: 'absolute', top: '16px', left: '16px', display: 'flex', gap: '8px', zIndex: 10 }}>
              <span className={`badge badge--${property.purpose.toLowerCase()}`}>
                {property.purpose}
              </span>
              <span className="badge" style={{ background: 'rgba(27,27,24,0.85)', color: '#fff', border: 'none' }}>
                {property.type}
              </span>
            </div>
            <div style={{ position: 'absolute', bottom: '16px', right: '16px', background: 'rgba(0,0,0,0.65)', color: '#fff', fontSize: '0.75rem', padding: '6px 12px', borderRadius: '999px', fontFamily: 'monospace', zIndex: 10 }}>
              {activeImageIndex + 1} / {galleryImages.length}
            </div>
          </div>

          {/* Thumbnails row */}
          {galleryImages.length > 1 && (
            <div className="property-detail__thumbs">
              {galleryImages.map((img, idx) => (
                <button
                  key={img}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`property-detail__thumb-btn${activeImageIndex === idx ? ' property-detail__thumb-btn--active' : ''}`}
                >
                  <ImageWithFallback src={img} alt="Thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Main Content & Sidebar Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Details, Specifications, EMI Calculator, Map */}
          <div className="lg:col-span-8 space-y-10">
            {/* Header info */}
            <div>
              <span className="eyebrow flex items-center gap-2 mb-1">
                <MapPin size={14} className="text-[#B08A3E]" />
                {property.locality}, {property.city}
              </span>
              <h1 className="text-2xl sm:text-4xl font-serif font-bold text-[#1B1B18] m-0 mb-3">
                {property.type} {property.bedrooms ? `\u00B7 ${property.bedrooms}` : ''}
              </h1>
              <p className="text-sm text-[#6B675E] leading-relaxed">
                {property.address}
              </p>

              <div className="flex items-baseline gap-3 mt-4 pt-4 border-t border-[#E6DCC8]">
                <span className="text-3xl sm:text-4xl font-serif font-bold text-[#2F4A3C]">
                  {formatINR(property.price, property.purpose)}
                </span>
                {property.purpose !== 'Rent' && (
                  <span className="text-xs font-semibold text-[#6B675E]">
                    ({formatPricePerSqFt(property.pricePerSqFt)})
                  </span>
                )}
              </div>
            </div>

            {/* Key Specs Card */}
            <div className="bg-white rounded-3xl border border-[#E6DCC8] p-6 sm:p-8 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#B08A3E] mb-6">
                Property Specifications
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-[#6B675E] mb-1">
                    <Ruler size={14} />
                    <span>Super Built Area</span>
                  </div>
                  <strong className="text-base text-[#1B1B18]">{formatArea(property.area)}</strong>
                </div>

                {property.bedrooms && (
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-[#6B675E] mb-1">
                      <Building size={14} />
                      <span>Bedrooms</span>
                    </div>
                    <strong className="text-base text-[#1B1B18]">{property.bedrooms}</strong>
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-1.5 text-xs text-[#6B675E] mb-1">
                    <Bath size={14} />
                    <span>Bathrooms</span>
                  </div>
                  <strong className="text-base text-[#1B1B18]">{property.bathrooms}</strong>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 text-xs text-[#6B675E] mb-1">
                    <Car size={14} />
                    <span>Car Parking</span>
                  </div>
                  <strong className="text-base text-[#1B1B18]">{property.parking} Bays</strong>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 text-xs text-[#6B675E] mb-1">
                    <Sparkles size={14} />
                    <span>Furnishing</span>
                  </div>
                  <strong className="text-base text-[#1B1B18]">{property.furnished}</strong>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 text-xs text-[#6B675E] mb-1">
                    <Clock size={14} />
                    <span>Possession</span>
                  </div>
                  <strong className="text-base text-[#1B1B18]">{property.possession || property.availability}</strong>
                </div>

                {property.floor && (
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-[#6B675E] mb-1">
                      <Building size={14} />
                      <span>Floor Level</span>
                    </div>
                    <strong className="text-base text-[#1B1B18]">{property.floor}</strong>
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-1.5 text-xs text-[#6B675E] mb-1">
                    <ShieldCheck size={14} />
                    <span>RERA Number</span>
                  </div>
                  <strong className="text-xs font-mono text-[#2F4A3C]">{property.reraNumber}</strong>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-3xl border border-[#E6DCC8] p-6 sm:p-8 shadow-sm">
              <h3 className="text-lg font-serif font-bold text-[#1B1B18] mb-3">
                Architectural Narrative
              </h3>
              <p className="text-sm text-[#1B1B18]/85 leading-relaxed m-0">
                {property.description}
              </p>
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-3xl border border-[#E6DCC8] p-6 sm:p-8 shadow-sm">
              <h3 className="text-lg font-serif font-bold text-[#1B1B18] mb-4">
                {t('prop_amenities')}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {property.features.map((feat) => (
                  <div key={feat} className="flex items-center gap-2.5 text-sm text-[#1B1B18]">
                    <CheckCircle2 size={16} className="text-[#2F4A3C] shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Embedded Interactive EMI Calculator */}
            {property.purpose === 'Buy' && (
              <EmiCalculator
                initialPrice={property.price}
                propertyTitle={`${property.type} (${property.locality})`}
                propertyId={property.id}
                onApplyLoan={() => setSiteVisitModalOpen(true)}
              />
            )}

            {/* Location Map View */}
            <div className="space-y-3">
              <h3 className="text-lg font-serif font-bold text-[#1B1B18] m-0">
                {t('prop_location')}
              </h3>
              <MapView properties={[property]} selectedPropertyId={property.id} />
            </div>

            {/* Similar Homes */}
            {similarProperties.length > 0 && (
              <div className="pt-6 border-t border-[#E6DCC8]">
                <h3 className="text-xl font-serif font-bold text-[#1B1B18] mb-6">
                  {t('prop_similar')}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {similarProperties.map((p) => (
                    <PropertyCard key={p.id} property={p} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Sticky Enquiry & Lead Capture Panel */}
          <div className="lg:col-span-4 sticky top-24 space-y-6">
            {/* Quick Action Buttons */}
            <div className="bg-[#2F4A3C] text-white rounded-3xl p-6 shadow-lg text-center space-y-4">
              <span className="text-xs uppercase tracking-widest text-[#B08A3E] font-bold block">
                VIP Private Access
              </span>
              <h4 className="text-xl font-serif font-bold m-0 text-white">
                Interested in this residence?
              </h4>
              <p className="text-xs text-white/80 leading-relaxed m-0">
                Schedule a confidential walk-through or request the verified title deed and architectural blueprints.
              </p>

              <button
                type="button"
                onClick={() => setSiteVisitModalOpen(true)}
                className="btn btn--brass btn--block w-full py-3.5 text-sm font-semibold flex items-center justify-center gap-2"
              >
                <Calendar size={16} />
                <span>Schedule Private Tour</span>
              </button>

              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--outline btn--block w-full py-3 text-xs font-semibold text-white border-white/40 hover:bg-white/10 flex items-center justify-center gap-2"
              >
                <Phone size={14} />
                <span>Instant WhatsApp Concierge</span>
              </a>
            </div>

            {/* Enquiry Form with Make.com webhook */}
            <EnquiryForm property={property} />
          </div>
        </div>
      </div>

      {/* Make.com Lead Capture Modal for Site Visit / Pre-Approval */}
      <MakeLeadCaptureModal
        isOpen={siteVisitModalOpen}
        onClose={() => setSiteVisitModalOpen(false)}
        leadType="site_visit"
        propertyTitle={`${property.type} at ${property.locality}, ${property.city}`}
        propertyId={property.id}
        propertyPrice={property.price}
        initialMessage={`Hi, I would like to schedule a private viewing of ${property.type} in ${property.locality}.`}
      />
    </div>
  );
}

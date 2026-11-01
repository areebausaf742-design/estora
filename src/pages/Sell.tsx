import { useState } from 'react';
import { CheckCircle2, LoaderCircle, Send, Sparkles } from 'lucide-react';
import { captureLead } from '../utils/makeWebhook';
import { useLanguage } from '../context/LanguageContext';
import { CITIES, PROPERTY_TYPES } from '../constants';

export function Sell() {
  const { language } = useLanguage();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('Mumbai');
  const [locality, setLocality] = useState('');
  const [propertyType, setPropertyType] = useState('Apartment');
  const [expectedPrice, setExpectedPrice] = useState('');
  const [bedrooms, setBedrooms] = useState('3 BHK');
  const [area, setArea] = useState('');
  const [notes, setNotes] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !locality.trim()) {
      setErrorMsg('Please provide your name, phone number, and property locality.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      const res = await captureLead({
        leadType: 'enquiry',
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        city,
        locality: locality.trim(),
        propertyTitle: `Seller Listing: ${propertyType} in ${locality}, ${city} (${bedrooms}, ${area} sq.ft)`,
        message: `Seller Enquiry. Expected Price: ${expectedPrice}. Additional details: ${notes}`,
        language,
      });

      setSubmittedId(res.leadId);
    } catch {
      setErrorMsg('Failed to submit listing. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="section">
      <div className="container max-w-4xl">
        <div className="section-head mb-10 text-center max-w-2xl mx-auto">
          <span className="eyebrow flex items-center justify-center gap-2">
            <Sparkles size={14} className="text-[#B08A3E]" />
            Private Advisory &middot; Sell With Estora
          </span>
          <h1 className="section-title">Discreet representation for distinctive homes.</h1>
          <p className="section-sub">
            We partner with discerning owners and estate trustees across India's premier pin-codes. Full confidentiality, verified buyers, and RERA compliance.
          </p>
        </div>

        {submittedId ? (
          <div className="bg-white rounded-3xl border border-[#E6DCC8] p-10 text-center space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-[#2F4A3C]/10 text-[#2F4A3C] flex items-center justify-center mx-auto">
              <CheckCircle2 size={36} />
            </div>
            <h3 className="text-2xl font-serif font-bold text-[#1B1B18] m-0">
              Listing Consultation Registered
            </h3>
            <div className="inline-block px-4 py-2 rounded-xl bg-[#F3EBDD] font-mono text-sm font-bold text-[#2F4A3C]">
              Reference: {submittedId}
            </div>
            <p className="text-sm text-[#6B675E] max-w-md mx-auto">
              Our Senior Private Client Partner will review your property documentation and arrange a confidential valuation consultation within 24 hours.
            </p>
            <button
              type="button"
              onClick={() => {
                setSubmittedId(null);
                setLocality('');
                setExpectedPrice('');
              }}
              className="btn btn--outline btn--sm mt-4"
            >
              Submit another property
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-[#E6DCC8] p-8 sm:p-12 shadow-sm">
            {errorMsg && (
              <div className="p-4 rounded-xl bg-red-50 text-red-700 text-xs font-semibold mb-6 border border-red-200">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              <h3 className="text-lg font-serif font-bold text-[#1B1B18] pb-3 border-b border-[#E6DCC8] m-0">
                Property &amp; Owner Overview
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1B1B18] mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Anand Piramal"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm border border-[#E6DCC8] rounded-xl focus:border-[#2F4A3C] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1B1B18] mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 98200 54321"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm border border-[#E6DCC8] rounded-xl focus:border-[#2F4A3C] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1B1B18] mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="e.g. anand@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm border border-[#E6DCC8] rounded-xl focus:border-[#2F4A3C] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1B1B18] mb-1">City</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="select text-sm w-full"
                  >
                    {CITIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1B1B18] mb-1">Locality / Address *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bandra West, Carter Road"
                    value={locality}
                    onChange={(e) => setLocality(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm border border-[#E6DCC8] rounded-xl focus:border-[#2F4A3C] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1B1B18] mb-1">Property Type</label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className="select text-sm w-full"
                  >
                    {PROPERTY_TYPES.map((pt) => (
                      <option key={pt} value={pt}>{pt}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1B1B18] mb-1">Configuration</label>
                  <select
                    value={bedrooms}
                    onChange={(e) => setBedrooms(e.target.value)}
                    className="select text-sm w-full"
                  >
                    <option value="2 BHK">2 BHK</option>
                    <option value="3 BHK">3 BHK</option>
                    <option value="4 BHK">4 BHK</option>
                    <option value="5+ BHK">5+ BHK</option>
                    <option value="Commercial">Commercial / Plot</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1B1B18] mb-1">Built-up Area (sq. ft.)</label>
                  <input
                    type="number"
                    placeholder="e.g. 2400"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm border border-[#E6DCC8] rounded-xl focus:border-[#2F4A3C] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1B1B18] mb-1">Expected Price (INR)</label>
                  <input
                    type="text"
                    placeholder="e.g. ₹8.5 Cr"
                    value={expectedPrice}
                    onChange={(e) => setExpectedPrice(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm border border-[#E6DCC8] rounded-xl focus:border-[#2F4A3C] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1B1B18] mb-1">Notes &amp; Features</label>
                <textarea
                  rows={3}
                  placeholder="Tell us about special views, interior architects, terrace, parking, or timeline..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm border border-[#E6DCC8] rounded-xl focus:border-[#2F4A3C] outline-none resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn--primary btn--block w-full py-3.5 text-sm font-semibold flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <LoaderCircle size={16} className="animate-spin" />
                      <span>Submitting to Private Desk...</span>
                    </>
                  ) : (
                    <>
                      <Send size={15} />
                      <span>Submit for Private Curation</span>
                    </>
                  )}
                </button>
                <p className="text-[11px] text-center text-[#6B675E] mt-2 m-0">
                  Transmitted confidentially &bull; Certified RERA brokerage advisory &bull; Synced with Make.com CRM
                </p>
              </div>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}

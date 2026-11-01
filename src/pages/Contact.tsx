import { Mail, MapPin, Phone, Sparkles } from 'lucide-react';
import { EnquiryForm } from '../components/EnquiryForm';
import { DISPLAY_PHONE, WHATSAPP_URL } from '../constants';

export function Contact() {

  const offices = [
    {
      city: 'Mumbai Headquarters',
      address: 'One BKC, 14th Floor, G Block, Bandra Kurla Complex, Mumbai 400051',
      phone: DISPLAY_PHONE,
      email: 'mumbai@estora.example',
    },
    {
      city: 'Bengaluru Advisory Desk',
      address: 'The Collection, UB City, Vittal Mallya Road, Bengaluru 560001',
      phone: DISPLAY_PHONE,
      email: 'bengaluru@estora.example',
    },
    {
      city: 'Delhi NCR Gallery',
      address: 'The Camellias Club, Golf Course Road, Gurugram 122002',
      phone: DISPLAY_PHONE,
      email: 'delhi@estora.example',
    },
  ];

  return (
    <section className="section">
      <div className="container">
        <div className="section-head mb-12">
          <span className="eyebrow flex items-center gap-2">
            <Sparkles size={14} className="text-[#B08A3E]" />
            Private Client Practice
          </span>
          <h1 className="section-title">Connect with Estora Estates.</h1>
          <p className="section-sub">
            Whether you are curating your next residence, disposing of an architectural asset, or seeking commercial advisory, our senior partners are at your service.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Offices & Direct Channels */}
          <div className="lg:col-span-6 space-y-8">
            <div className="grid grid-cols-1 gap-4">
              {offices.map((off) => (
                <div
                  key={off.city}
                  className="p-6 rounded-2xl bg-white border border-[#E6DCC8] shadow-sm hover:border-[#2F4A3C] transition-colors"
                >
                  <h3 className="font-serif text-lg font-bold text-[#1B1B18] m-0 mb-2">
                    {off.city}
                  </h3>
                  <div className="space-y-2 text-xs text-[#6B675E]">
                    <div className="flex items-start gap-2">
                      <MapPin size={14} className="text-[#B08A3E] shrink-0 mt-0.5" />
                      <span>{off.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone size={14} className="text-[#2F4A3C] shrink-0" />
                      <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="text-inherit hover:underline">
                        {off.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail size={14} className="text-[#2F4A3C] shrink-0" />
                      <a href={`mailto:${off.email}`} className="text-inherit hover:underline">
                        {off.email}
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 rounded-2xl bg-[#2F4A3C] text-white flex items-center justify-between gap-4">
              <div>
                <h4 className="font-serif text-lg font-bold text-white m-0 mb-1">
                  Immediate WhatsApp Concierge
                </h4>
                <p className="text-xs text-white/80 m-0">
                  Connect with a senior estates director instantly.
                </p>
              </div>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--brass btn--sm shrink-0"
              >
                Chat Now
              </a>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-6">
            <EnquiryForm />
          </div>
        </div>
      </div>
    </section>
  );
}

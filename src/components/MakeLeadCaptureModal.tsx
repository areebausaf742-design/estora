import { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  CheckCircle2,
  Globe,
  LoaderCircle,
  Phone,
  Send,
  Settings,
  X,
} from 'lucide-react';
import {
  captureLead,
  getMakeWebhookUrl,
  getStoredLeads,
  setMakeWebhookUrl,
} from '../utils/makeWebhook';
import { useLanguage } from '../context/LanguageContext';
import { WHATSAPP_URL } from '../constants';

interface MakeLeadCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  leadType?: 'enquiry' | 'site_visit' | 'brochure' | 'loan_calc' | 'commercial';
  propertyTitle?: string;
  propertyId?: string;
  propertyPrice?: number;
  initialMessage?: string;
  loanDetails?: {
    loanAmount: number;
    downPayment: number;
    tenureYears: number;
    estimatedEmi: number;
  };
}

export function MakeLeadCaptureModal({
  isOpen,
  onClose,
  leadType = 'enquiry',
  propertyTitle,
  propertyId,
  propertyPrice,
  initialMessage = '',
  loanDetails,
}: MakeLeadCaptureModalProps) {
  const { t, language } = useLanguage();

  const [activeTab, setActiveTab] = useState<'form' | 'settings'>('form');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [message, setMessage] = useState(initialMessage);

  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{
    reference: string;
    syncedToMake: boolean;
    statusMsg: string;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Make.com Settings state
  const [webhookUrl, setWebhookUrlInput] = useState(() => getMakeWebhookUrl());
  const [testStatus, setTestStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !email.trim()) {
      setErrorMsg('Please enter your full name, phone number, and email.');
      return;
    }

    const digits = phone.replace(/[^\d]/g, '');
    if (digits.length < 10) {
      setErrorMsg('Please provide a valid 10-digit mobile number.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      const res = await captureLead({
        leadType,
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        preferredDate: preferredDate || undefined,
        message: message.trim() || undefined,
        propertyId,
        propertyTitle,
        propertyPrice,
        language,
        loanDetails,
      });

      setResult({
        reference: res.leadId,
        syncedToMake: res.syncedToMake,
        statusMsg: res.message,
      });
    } catch (err) {
      setErrorMsg('Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveWebhook = () => {
    setMakeWebhookUrl(webhookUrl);
    setTestStatus('Webhook URL saved successfully!');
    setTimeout(() => setTestStatus(null), 3500);
  };

  const handleTestPing = async () => {
    setTestStatus('Testing webhook connection...');
    try {
      const testRes = await captureLead({
        leadType: 'enquiry',
        name: 'Estora Lead Test',
        phone: '+919999999999',
        email: 'test@estora.example',
        message: 'Ping from Estora Real Estate Make.com test suite',
      });
      if (testRes.syncedToMake) {
        setTestStatus('Success! Make.com webhook received test payload.');
      } else {
        setTestStatus(testRes.message);
      }
    } catch {
      setTestStatus('Test ping completed with local fallback.');
    }
  };

  const recentLeads = getStoredLeads();

  return createPortal(
    <div
      className="make-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="make-modal-card">
        {/* Modal Header */}
        <div className="make-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--brass)' }} />
            <h3 style={{ margin: 0, fontSize: '1.2rem', fontFamily: 'var(--font-display)', fontWeight: 600 }}>
              {activeTab === 'settings'
                ? t('make_settings_title')
                : leadType === 'site_visit'
                ? t('lead_schedule_visit')
                : leadType === 'brochure'
                ? t('lead_download_brochure')
                : t('enquiry_title')}
            </h3>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              onClick={() => setActiveTab(activeTab === 'form' ? 'settings' : 'form')}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                color: activeTab === 'settings' ? 'var(--forest)' : 'var(--muted)',
              }}
              title="Make.com Webhook Settings"
              aria-label="Make.com Webhook Settings"
            >
              <Settings size={18} />
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                color: 'var(--muted)',
              }}
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="make-modal-body">
          {activeTab === 'settings' ? (
            /* Make.com Settings & Leads Inspector */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ padding: '16px', borderRadius: '12px', background: 'var(--ivory-deep)', border: '1px solid var(--line)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, fontSize: '0.88rem', color: 'var(--charcoal)', marginBottom: '4px' }}>
                  <Globe size={16} color="var(--forest)" />
                  Make.com (Integromat) Webhook
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--muted)', margin: 0, lineHeight: 1.5 }}>
                  {t('make_webhook_hint')}
                </p>
              </div>

              <div>
                <label className="make-input-label">
                  {t('make_webhook_url')}
                </label>
                <input
                  type="url"
                  placeholder="https://hook.eu1.make.com/your-custom-webhook-id"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrlInput(e.target.value)}
                  className="make-input-field"
                />
              </div>

              {testStatus && (
                <div style={{ fontSize: '0.84rem', padding: '12px', borderRadius: '10px', background: 'var(--forest-tint)', color: 'var(--forest-dark)', fontWeight: 500 }}>
                  {testStatus}
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  onClick={handleSaveWebhook}
                  className="btn btn--primary btn--sm"
                  style={{ flex: 1 }}
                >
                  {t('make_saved_btn')}
                </button>
                <button
                  type="button"
                  onClick={handleTestPing}
                  className="btn btn--outline btn--sm"
                >
                  {t('make_test_btn')}
                </button>
              </div>

              {/* Recent Leads Inspector */}
              <div style={{ paddingTop: '16px', borderTop: '1px solid var(--line)' }}>
                <h4 style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted)', marginBottom: '12px' }}>
                  {t('make_recent_leads')} ({recentLeads.length})
                </h4>
                {recentLeads.length === 0 ? (
                  <p style={{ fontSize: '0.82rem', color: 'var(--muted)', fontStyle: 'italic', margin: 0 }}>No leads captured in this browser session yet.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '180px', overflowY: 'auto' }}>
                    {recentLeads.slice(0, 5).map((l) => (
                      <div
                        key={l.leadId}
                        style={{
                          fontSize: '0.82rem',
                          padding: '10px 14px',
                          borderRadius: '10px',
                          border: '1px solid var(--line)',
                          background: 'var(--ivory)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <div>
                          <strong>{l.name}</strong> ({l.phone})
                          <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
                            {l.leadType} &middot; {l.propertyTitle || 'General'}
                          </div>
                        </div>
                        <span style={{ fontSize: '0.75rem', padding: '4px 8px', borderRadius: '999px', background: 'var(--ivory-deep)', color: 'var(--charcoal)', fontFamily: 'monospace' }}>
                          {l.leadId}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : result ? (
            /* Success confirmation */
            <div style={{ textAlign: 'center', padding: '24px 0', display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--forest-tint)', color: 'var(--forest)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle2 size={36} />
              </div>
              <h3 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-display)', fontWeight: 700, margin: 0 }}>
                {t('lead_success_title')}
              </h3>
              <div style={{ display: 'inline-block', padding: '8px 18px', borderRadius: '12px', background: 'var(--ivory-deep)', fontFamily: 'monospace', fontSize: '0.95rem', fontWeight: 'bold', color: 'var(--forest)' }}>
                {t('lead_success_ref')} {result.reference}
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--muted)', maxWidth: '420px', margin: 0 }}>
                {result.syncedToMake ? t('lead_make_synced') : t('lead_make_local')}
              </p>
              <div style={{ paddingTop: '16px', display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn--outline btn--sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <Phone size={14} />
                  <span>{t('lead_whatsapp')}</span>
                </a>
                <button
                  type="button"
                  onClick={onClose}
                  className="btn btn--primary btn--sm"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            /* Lead Submission Form */
            <form onSubmit={handleSubmit} noValidate>
              {propertyTitle && (
                <div style={{ padding: '12px 16px', borderRadius: '10px', background: 'var(--ivory-deep)', border: '1px solid var(--line)', fontSize: '0.82rem', marginBottom: '16px' }}>
                  <span style={{ fontWeight: 600, color: 'var(--charcoal)', display: 'block' }}>{propertyTitle}</span>
                  <span style={{ color: 'var(--muted)' }}>
                    {leadType === 'site_visit'
                      ? 'Private escorted walk-through with our estate specialist.'
                      : leadType === 'loan_calc'
                      ? 'Pre-approved loan consultation with top Indian banking partners.'
                      : 'Comprehensive RERA certified investment dossier.'}
                  </span>
                </div>
              )}

              {errorMsg && (
                <div style={{ padding: '12px 16px', borderRadius: '10px', background: '#FEF2F2', color: '#991B1B', fontSize: '0.82rem', fontWeight: 500, border: '1px solid #FCA5A5', marginBottom: '16px' }}>
                  {errorMsg}
                </div>
              )}

              <div className="make-input-group">
                <label className="make-input-label">
                  {t('lead_name')} *
                </label>
                <input
                  type="text"
                  required
                  placeholder={t('lead_name_placeholder')}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="make-input-field"
                />
              </div>

              <div className="make-grid-2 make-input-group">
                <div>
                  <label className="make-input-label">
                    {t('lead_phone')} *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder={t('lead_phone_placeholder')}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="make-input-field"
                  />
                </div>
                <div>
                  <label className="make-input-label">
                    {t('lead_email')} *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder={t('lead_email_placeholder')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="make-input-field"
                  />
                </div>
              </div>

              {leadType === 'site_visit' && (
                <div className="make-input-group">
                  <label className="make-input-label">
                    {t('lead_preferred_date')}
                  </label>
                  <input
                    type="date"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="make-input-field"
                  />
                </div>
              )}

              <div className="make-input-group">
                <label className="make-input-label">
                  {t('lead_message')}
                </label>
                <textarea
                  rows={3}
                  placeholder={t('lead_message_placeholder')}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="make-input-field"
                  style={{ resize: 'none' }}
                />
              </div>

              <div style={{ paddingTop: '8px' }}>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn--primary btn--block"
                  style={{ width: '100%', padding: '14px', fontSize: '0.95rem' }}
                >
                  {submitting ? (
                    <>
                      <LoaderCircle size={16} className="animate-spin" />
                      <span>{t('lead_submitting')}</span>
                    </>
                  ) : (
                    <>
                      <Send size={15} />
                      <span>{t('lead_submit')}</span>
                    </>
                  )}
                </button>
                <p style={{ fontSize: '0.75rem', textAlign: 'center', color: 'var(--muted)', marginTop: '10px', marginInline: 0 }}>
                  Data processed securely via Make.com automation &bull; Zero spam guarantee
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

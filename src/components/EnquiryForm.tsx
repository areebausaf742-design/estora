import { useState } from 'react';
import type { FormEvent } from 'react';
import { CheckCircle2, LoaderCircle, Send } from 'lucide-react';
import type { FormErrors, Purpose, Property } from '../types';
import { BRAND } from '../constants';
import { PROPERTIES } from '../data/properties';
import { captureLead } from '../utils/makeWebhook';
import { useLanguage } from '../context/LanguageContext';

interface EnquiryFormProps {
  property?: Property;
  purpose?: Purpose;
}

interface EnquiryValues {
  name: string;
  email: string;
  phone: string;
  message: string;
  propertyId: string;
}

const EMPTY_VALUES: EnquiryValues = { name: '', email: '', phone: '', message: '', propertyId: '' };

function validate(values: EnquiryValues): FormErrors {
  const errors: FormErrors = {};
  if (values.name.trim().length < 2) errors.name = 'Please enter your full name.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) errors.email = 'Please enter a valid email address.';
  const digits = values.phone.replace(/[^\d]/g, '');
  const national = digits.startsWith('91') && digits.length === 12 ? digits.slice(2) : digits;
  if (national.length < 10) {
    errors.phone = 'Please enter a valid 10-digit mobile number.';
  }
  if (values.message.trim().length < 4) errors.message = 'Please add a short note on your requirement.';
  return errors;
}

export function EnquiryForm({ property }: EnquiryFormProps) {
  const { t, language } = useLanguage();
  const [values, setValues] = useState<EnquiryValues>(() => ({
    ...EMPTY_VALUES,
    propertyId: property ? property.id : '',
  }));
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedReference, setSubmittedReference] = useState<string | null>(null);
  const [makeSynced, setMakeSynced] = useState(false);

  const update = (field: keyof EnquiryValues) => (event: { target: { value: string } }) => {
    setValues((current) => ({ ...current, [field]: event.target.value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate(values);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const selectedProperty = property || PROPERTIES.find((p) => p.id === values.propertyId);
      const res = await captureLead({
        leadType: 'enquiry',
        name: values.name.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
        message: values.message.trim(),
        propertyId: selectedProperty?.id,
        propertyTitle: selectedProperty?.type ? `${selectedProperty.type} - ${selectedProperty.locality}` : undefined,
        propertyPrice: selectedProperty?.price,
        city: selectedProperty?.city,
        locality: selectedProperty?.locality,
        language,
      });

      setSubmittedReference(res.leadId);
      setMakeSynced(res.syncedToMake);
    } catch (err) {
      console.error('Lead capture error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappHref = property
    ? `https://wa.me/${BRAND.whatsappNumber}?text=${encodeURIComponent(
        `Hi Estora, I am interested in the ${property.type} at ${property.locality}, ${property.city}.`
      )}`
    : `https://wa.me/${BRAND.whatsappNumber}?text=${encodeURIComponent('Hi Estora, I would like to enquire about your listings.')}`;

  if (submittedReference) {
    return (
      <div className="enquiry-card success-panel" role="status">
        <CheckCircle2 size={44} className="text-[#2F4A3C]" />
        <h3>{t('lead_success_title')}</h3>
        <p className="muted">
          {t('lead_success_ref')} <strong>{submittedReference}</strong>. Thank you, {values.name.split(' ')[0] || 'Friend'}.
        </p>
        <p className="small muted">
          {makeSynced ? t('lead_make_synced') : t('lead_make_local')}
        </p>
        <div style={{ display: 'flex', gap: '10px', marginTop: '16px', flexWrap: 'wrap' }}>
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="btn btn--outline btn--sm">
            {t('lead_whatsapp')}
          </a>
          <button
            type="button"
            className="btn btn--primary btn--sm"
            onClick={() => {
              setValues({ ...EMPTY_VALUES, propertyId: property ? property.id : '' });
              setSubmittedReference(null);
            }}
          >
            Submit another enquiry
          </button>
        </div>
      </div>
    );
  }

  return (
    <form className="enquiry-card" onSubmit={onSubmit} noValidate>
      <h3>{property ? t('enquiry_title') : 'Send an enquiry'}</h3>
      {property ? (
        <p className="small muted" style={{ marginBottom: 18 }}>
          {property.type} &middot; {property.locality}, {property.city}
        </p>
      ) : (
        <div className="field">
          <label className="field__label" htmlFor="enquiry-property">Property of interest</label>
          <select
            id="enquiry-property"
            className="select"
            value={values.propertyId}
            onChange={(e) => update('propertyId')(e)}
          >
            <option value="">General enquiry</option>
            {PROPERTIES.map((entry) => (
              <option key={entry.id} value={entry.id}>
                {entry.type} - {entry.locality}, {entry.city}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="field">
        <label className="field__label" htmlFor="enquiry-name">{t('lead_name')} *</label>
        <input
          id="enquiry-name"
          type="text"
          className={`input${errors.name ? ' input--error' : ''}`}
          placeholder={t('lead_name_placeholder')}
          value={values.name}
          onChange={update('name')}
        />
        {errors.name ? <p className="field__error">{errors.name}</p> : null}
      </div>

      <div className="field">
        <label className="field__label" htmlFor="enquiry-email">{t('lead_email')} *</label>
        <input
          id="enquiry-email"
          type="email"
          className={`input${errors.email ? ' input--error' : ''}`}
          placeholder={t('lead_email_placeholder')}
          value={values.email}
          onChange={update('email')}
        />
        {errors.email ? <p className="field__error">{errors.email}</p> : null}
      </div>

      <div className="field">
        <label className="field__label" htmlFor="enquiry-phone">{t('lead_phone')} *</label>
        <input
          id="enquiry-phone"
          type="tel"
          className={`input${errors.phone ? ' input--error' : ''}`}
          placeholder={t('lead_phone_placeholder')}
          value={values.phone}
          onChange={update('phone')}
        />
        {errors.phone ? <p className="field__error">{errors.phone}</p> : null}
      </div>

      <div className="field">
        <label className="field__label" htmlFor="enquiry-message">{t('lead_message')} *</label>
        <textarea
          id="enquiry-message"
          rows={3}
          className={`input${errors.message ? ' input--error' : ''}`}
          placeholder={t('lead_message_placeholder')}
          value={values.message}
          onChange={update('message')}
        />
        {errors.message ? <p className="field__error">{errors.message}</p> : null}
      </div>

      <button type="submit" disabled={isSubmitting} className="btn btn--primary btn--block">
        {isSubmitting ? (
          <>
            <LoaderCircle size={16} className="animate-spin" />
            <span>{t('lead_submitting')}</span>
          </>
        ) : (
          <>
            <Send size={16} />
            <span>{t('lead_submit')}</span>
          </>
        )}
      </button>

      <div className="enquiry-card__alt">
        <span>or</span>
        <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="btn btn--outline btn--sm btn--block">
          {t('lead_whatsapp')}
        </a>
      </div>
    </form>
  );
}

import { useState } from 'react';
import type { FormEvent } from 'react';
import { CheckCircle2, Send } from 'lucide-react';
import type { FormErrors, Purpose, Property } from '../types';
import { BRAND } from '../constants';
import { PROPERTIES } from '../data/properties';

interface EnquiryFormProps {
  property?: Property;
  purpose?: Purpose;
}

interface EnquiryValues {
  name: string;
  email: string;
  phone: string;
  message: string;
}

const EMPTY_VALUES: EnquiryValues = { name: '', email: '', phone: '', message: '' };

function validate(values: EnquiryValues): FormErrors {
  const errors: FormErrors = {};
  if (values.name.trim().length < 2) errors.name = 'Please enter your full name.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) errors.email = 'Please enter a valid email address.';
  const digits = values.phone.replace(/[^\d]/g, '');
  const national = digits.startsWith('91') && digits.length === 12 ? digits.slice(1) : digits;
  if (national.length !== 10 || !/^[6-9]/.test(national)) {
    errors.phone = 'Please enter a valid Indian mobile number with 10 digits.';
  }
  if (values.message.trim().length < 5) errors.message = 'Please add a short message (5+ characters).';
  return errors;
}

export function EnquiryForm({ property, purpose }: EnquiryFormProps) {
  const [values, setValues] = useState<EnquiryValues>(EMPTY_VALUES);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submittedReference, setSubmittedReference] = useState<string | null>(null);

  const update = (field: keyof EnquiryValues) => (event: { target: { value: string } }) => {
    setValues((current) => ({ ...current, [field]: event.target.value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate(values);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }
    const reference = `EST-${Math.floor(100000 + Math.random() * 900000)}`;
    setSubmittedReference(reference);
  };

  const whatsappHref = property
    ? `https://wa.me/${BRAND.whatsappNumber}?text=${encodeURIComponent(
        `Hi Estora, I am interested in the ${property.type} at ${property.locality}, ${property.city}.`
      )}`
    : `https://wa.me/${BRAND.whatsappNumber}?text=${encodeURIComponent('Hi Estora, I would like to know more about your services.')}`;

  if (submittedReference) {
    return (
      <div className="enquiry-card success-panel" role="status">
        <CheckCircle2 size={44} />
        <h3>Enquiry received</h3>
        <p className="muted">
          Reference <strong>{submittedReference}</strong>. Thank you, {values.name.split(' ')[0] || 'friend'}.
        </p>
        <p className="small muted">
          This demo captures the enquiry in browser state. Connect your CRM or email service before launch.
        </p>
        <button type="button" className="btn btn--outline" onClick={() => { setValues(EMPTY_VALUES); setSubmittedReference(null); }}>
          Submit another enquiry
        </button>
      </div>
    );
  }

  return (
    <form className="enquiry-card" onSubmit={onSubmit} noValidate>
      <h3>{property ? 'Enquire about this home' : 'Send an enquiry'}</h3>
      {property ? (
        <p className="small muted" style={{ marginBottom: 18 }}>
          {property.type} &middot; {property.locality}, {property.city}
        </p>
      ) : (
        <div className="field">
          <label className="field__label" htmlFor="enquiry-property">Property of interest</label>
          <select id="enquiry-property" className="select" defaultValue="">
            <option value="">General enquiry</option>
            {PROPERTIES.map((entry) => (
              <option key={entry.id} value={entry.id}>
                {entry.type} - {entry.locality}, {entry.city}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="form__row">
        <div className="field">
          <label className="field__label" htmlFor="enquiry-name">Full name</label>
          <input
            id="enquiry-name"
            className="input"
            type="text"
            autoComplete="name"
            value={values.name}
            onChange={update('name')}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'enquiry-name-error' : undefined}
          />
          {errors.name ? <span className="field__error" id="enquiry-name-error">{errors.name}</span> : null}
        </div>
        <div className="field">
          <label className="field__label" htmlFor="enquiry-email">Email</label>
          <input
            id="enquiry-email"
            className="input"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={update('email')}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'enquiry-email-error' : undefined}
          />
          {errors.email ? <span className="field__error" id="enquiry-email-error">{errors.email}</span> : null}
        </div>
      </div>

      <div className="field">
        <label className="field__label" htmlFor="enquiry-phone">Mobile number</label>
        <input
          id="enquiry-phone"
          className="input"
          type="tel"
          autoComplete="tel"
          placeholder="+91 90000 00000"
          value={values.phone}
          onChange={update('phone')}
          aria-invalid={Boolean(errors.phone)}
          aria-describedby={errors.phone ? 'enquiry-phone-error' : undefined}
        />
        {errors.phone ? <span className="field__error" id="enquiry-phone-error">{errors.phone}</span> : null}
      </div>

      <div className="field">
        <label className="field__label" htmlFor="enquiry-message">Message</label>
        <textarea
          id="enquiry-message"
          className="textarea"
          value={values.message}
          onChange={update('message')}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? 'enquiry-message-error' : undefined}
        />
        {errors.message ? <span className="field__error" id="enquiry-message-error">{errors.message}</span> : null}
      </div>

      <button type="submit" className="btn btn--primary btn--block">
        <Send size={16} />
        Send enquiry
      </button>
      <a className="btn btn--outline btn--block" style={{ marginTop: 10 }} href={whatsappHref} target="_blank" rel="noreferrer">
        Enquire on WhatsApp
      </a>
    </form>
  );
}
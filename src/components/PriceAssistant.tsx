import { useEffect, useRef, useState } from 'react';
import { Bot, ChevronDown, LoaderCircle, MessageCircle, Send, X } from 'lucide-react';
import { WHATSAPP_URL } from '../constants';

type AssistantResponse = { answer: string; sources: { title: string; url: string }[]; asOf: string };

const quickStarts = ['2 BHK price in Pune', 'Villa price in Lucknow', 'Rent for 3 BHK in Bengaluru'];
const cities = ['Mumbai', 'Delhi NCR', 'Bengaluru', 'Pune', 'Hyderabad', 'Lucknow'];
const bhkOptions = ['1 BHK', '2 BHK', '3 BHK', '4 BHK', '5+ BHK'];

export function PriceAssistant() {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [city, setCity] = useState('');
  const [locality, setLocality] = useState('');
  const [bhk, setBhk] = useState('');
  const [result, setResult] = useState<AssistantResponse | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
      if (event.key === 'Tab' && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll<HTMLElement>('button, input, select, a');
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  async function ask(nextQuestion = question) {
    const trimmed = nextQuestion.trim();
    if (!trimmed || loading) return;
    setQuestion(trimmed);
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const response = await fetch('/api/price-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: trimmed, city, locality, bhk }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Something went wrong.');
      setResult(payload);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const whatsappHref = result ? `https://wa.me/919044996869?text=${encodeURIComponent(`Hello Estora, I have a question about: ${question}`)}` : WHATSAPP_URL;

  return (
    <>
      {open && <div className="assistant-backdrop" aria-hidden="true" onClick={() => setOpen(false)} />}
      <div className={`price-assistant${open ? ' price-assistant--open' : ''}`} ref={panelRef}>
        {open && (
          <section className="price-assistant__panel" role="dialog" aria-modal="true" aria-labelledby="price-assistant-title">
            <header className="price-assistant__head">
              <div className="price-assistant__identity"><span className="price-assistant__icon"><Bot size={18} /></span><div><h2 id="price-assistant-title">Ask Estora AI</h2><p>Property price guidance, grounded in current sources.</p></div></div>
              <button className="price-assistant__close" onClick={() => setOpen(false)} aria-label="Close price assistant"><X size={18} /></button>
            </header>
            <div className="price-assistant__body">
              {!result && !loading && !error && <div className="price-assistant__welcome"><p>What would you like to understand about a property price?</p><div className="price-assistant__chips">{quickStarts.map((item) => <button key={item} className="price-assistant__chip" onClick={() => ask(item)}>{item}</button>)}</div></div>}
              <div className="price-assistant__filters"><label>City<select value={city} onChange={(event) => setCity(event.target.value)}><option value="">Any city</option>{cities.map((item) => <option key={item}>{item}</option>)}</select></label><label>Locality<input value={locality} onChange={(event) => setLocality(event.target.value)} placeholder="Optional" maxLength={80} /></label><label>BHK<select value={bhk} onChange={(event) => setBhk(event.target.value)}><option value="">Any</option>{bhkOptions.map((item) => <option key={item}>{item}</option>)}</select></label></div>
              {loading && <div className="price-assistant__loading" aria-label="Getting an estimate"><LoaderCircle className="spin" size={20} /><span /><span /><span /></div>}
              {error && <p className="price-assistant__error" role="alert">{error}</p>}
              {result && <div className="price-assistant__result" aria-live="polite"><p>{result.answer}</p><p className="price-assistant__date">Information checked {result.asOf}.</p>{result.sources.length > 0 && <div className="price-assistant__sources"><strong>Sources</strong>{result.sources.map((source) => <a key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.title}</a>)}</div>}<a className="btn btn--primary btn--sm price-assistant__whatsapp" href={whatsappHref} target="_blank" rel="noreferrer"><MessageCircle size={15} /> Talk to an expert on WhatsApp</a></div>}
              <p className="price-assistant__note">AI estimates, not a valuation. Confirm with our team.</p>
            </div>
            <form className="price-assistant__form" onSubmit={(event) => { event.preventDefault(); void ask(); }}><input ref={inputRef} value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Ask about a property price..." maxLength={500} aria-label="Your property price question" /><button type="submit" aria-label="Ask Estora AI" disabled={loading || !question.trim()}><Send size={17} /></button></form>
          </section>
        )}
        <button className="price-assistant__trigger" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls="price-assistant-title"><MessageCircle size={18} /><span>Ask Estora AI</span><ChevronDown className={open ? 'rotate' : ''} size={16} /></button>
      </div>
    </>
  );
}

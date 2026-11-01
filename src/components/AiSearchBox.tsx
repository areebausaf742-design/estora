import { useState, type FormEvent } from 'react';
import { ArrowRight, Bot, Loader2, Sparkles, X } from 'lucide-react';
import { parseNaturalLanguageQuery, type ParsedSearchQuery } from '../utils/aiSearch';
import { useLanguage } from '../context/LanguageContext';

interface AiSearchBoxProps {
  onSearch?: (parsed: ParsedSearchQuery) => void;
  placeholder?: string;
  initialQuery?: string;
  className?: string;
}

const SUGGESTIONS = [
  '3 BHK sea view in Mumbai under 15 Cr',
  'Luxury villa with private pool in Bengaluru',
  'Penthouse with golf view in Gurugram',
  'Commercial Grade-A office in BKC',
];

export function AiSearchBox({
  onSearch,
  placeholder,
  initialQuery = '',
  className = '',
}: AiSearchBoxProps) {
  const { t } = useLanguage();
  const [query, setQuery] = useState(initialQuery);
  const [activeParsed, setActiveParsed] = useState<ParsedSearchQuery | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const executeSearch = (rawText: string) => {
    if (!rawText.trim()) return;
    setIsProcessing(true);

    // Parse the query using our deterministic NLP engine
    const parsed = parseNaturalLanguageQuery(rawText);
    setActiveParsed(parsed);
    setIsProcessing(false);
    onSearch?.(parsed);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    executeSearch(query);
  };

  const handleClear = () => {
    setQuery('');
    setActiveParsed(null);
  };

  return (
    <div className={`ai-search-box w-full ${className}`}>
      <form
        onSubmit={handleSubmit}
        className="relative flex items-center bg-white rounded-2xl border-2 border-[#E6DCC8] hover:border-[#2F4A3C] focus-within:border-[#2F4A3C] shadow-sm transition-all overflow-hidden p-1.5"
      >
        <div className="flex items-center gap-2 pl-3.5 pr-2 py-1 text-[#2F4A3C] shrink-0">
          <Sparkles size={18} className="text-[#B08A3E]" />
          <span className="hidden sm:inline-block text-[11px] font-bold uppercase tracking-wider text-[#2F4A3C] bg-[#F3EBDD] px-2 py-0.5 rounded-full">
            {t('ai_search_badge')}
          </span>
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder || t('ai_search_placeholder')}
          className="flex-1 min-w-0 px-2 py-2.5 text-sm sm:text-base bg-transparent text-[#1B1B18] placeholder-[#6B675E] outline-none"
        />

        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="p-2 text-[#6B675E] hover:text-[#1B1B18] transition-colors"
            aria-label="Clear query"
          >
            <X size={16} />
          </button>
        )}

        <button
          type="submit"
          disabled={isProcessing || !query.trim()}
          className="btn btn--primary btn--sm shrink-0 px-4 py-2.5 rounded-xl ml-1 font-semibold flex items-center gap-1.5 text-xs sm:text-sm"
        >
          {isProcessing ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <>
              <span>{t('ai_search_btn')}</span>
              <ArrowRight size={14} />
            </>
          )}
        </button>
      </form>

      {/* Parsed AI Explanation Pill */}
      {activeParsed && (
        <div className="mt-2.5 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#2F4A3C]/10 border border-[#2F4A3C]/20 text-xs text-[#2F4A3C]">
          <Bot size={14} className="shrink-0" />
          <span className="font-medium truncate">{activeParsed.explanation}</span>
          <button
            type="button"
            onClick={handleClear}
            className="ml-auto text-[#6B675E] hover:text-[#1B1B18]"
          >
            <X size={13} />
          </button>
        </div>
      )}

      {/* Quick suggestions pills */}
      <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
        <span className="text-[11px] text-[#6B675E] mr-1 hidden sm:inline">Try:</span>
        {SUGGESTIONS.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => {
              setQuery(suggestion);
              executeSearch(suggestion);
            }}
            className="text-[11px] px-2.5 py-1 rounded-full bg-[#F3EBDD] hover:bg-[#E6DCC8] text-[#1B1B18] transition-colors"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}

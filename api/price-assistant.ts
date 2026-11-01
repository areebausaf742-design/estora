import { GoogleGenAI } from '@google/genai';

type RequestLike = {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  body?: unknown;
};

type ResponseLike = {
  status: (code: number) => ResponseLike;
  json: (body: unknown) => void;
  setHeader: (name: string, value: string) => void;
};

type Source = { title: string; url: string };
type RateRecord = { count: number; resetAt: number };

const requestCounts = new Map<string, RateRecord>();
const WINDOW_MS = 60 * 60 * 1000;
const MAX_REQUESTS = 10;
const MAX_QUESTION_LENGTH = 500;

function getClientIp(request: RequestLike) {
  const forwarded = request.headers['x-forwarded-for'];
  return (Array.isArray(forwarded) ? forwarded[0] : forwarded?.split(',')[0])?.trim() || 'unknown';
}

function isRateLimited(ip: string) {
  const now = Date.now();
  const record = requestCounts.get(ip);
  if (!record || record.resetAt <= now) {
    requestCounts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  record.count += 1;
  return record.count > MAX_REQUESTS;
}

function cleanSources(response: any): Source[] {
  const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [];
  return chunks
    .map((chunk: any) => chunk.web)
    .filter((web: any) => web?.uri && web?.title)
    .map((web: any) => ({ title: String(web.title), url: String(web.uri) }))
    .filter((source: Source, index: number, sources: Source[]) => sources.findIndex((item) => item.url === source.url) === index)
    .slice(0, 5);
}

export default async function handler(request: RequestLike, response: ResponseLike) {
  response.setHeader('Content-Type', 'application/json');
  response.setHeader('Cache-Control', 'no-store');

  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed.' });
  }

  const ip = getClientIp(request);
  if (isRateLimited(ip)) {
    return response.status(429).json({ error: 'Please try again later.' });
  }

  let input: Record<string, unknown>;
  try {
    input = typeof request.body === 'string' ? JSON.parse(request.body) : (request.body as Record<string, unknown>) || {};
  } catch {
    return response.status(400).json({ error: 'Please send valid JSON.' });
  }

  const question = typeof input.question === 'string' ? input.question.trim() : '';
  if (!question || question.length > MAX_QUESTION_LENGTH) {
    return response.status(400).json({ error: 'Ask a question up to 500 characters.' });
  }

  const apiKey = process.env.AI_API_KEY;
  if (!apiKey) {
    return response.status(503).json({ error: 'The assistant is not configured yet.' });
  }

  const context = [
    input.city && `City: ${String(input.city)}`,
    input.locality && `Locality: ${String(input.locality)}`,
    input.propertyType && `Property type: ${String(input.propertyType)}`,
    input.bhk && `Bedrooms: ${String(input.bhk)}`,
  ].filter(Boolean).join('\n');

  const prompt = `${question}${context ? `\n\nOptional context:\n${context}` : ''}`;
  const systemInstruction = `You are a careful Indian real-estate pricing assistant. Use the Google Search tool for current, reputable sources. Always answer with a price RANGE in Indian format (₹ Lakh or ₹ Cr, and ₹ per sq ft), state the date of the information and the sources used. Clearly say figures are estimates, not valuations or offers. If sources are weak or conflicting, say so. Never invent numbers, guarantee appreciation or returns, or give legal advice. Mention checking RERA registration before buying. Keep the answer under 150 words in simple English.`;

  try {
    const ai = new GoogleGenAI({ apiKey });
    const result = await Promise.race([
      ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          systemInstruction,
          tools: [{ googleSearch: {} }],
        },
      }),
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error('timeout')), 25_000)),
    ]);
    const answer = result.text?.trim();
    if (!answer) throw new Error('empty response');

    return response.status(200).json({
      answer,
      sources: cleanSources(result),
      asOf: new Date().toISOString().slice(0, 10),
    });
  } catch (error) {
    console.error('[v0] Price assistant request failed:', error instanceof Error ? error.message : error);
    return response.status(502).json({ error: 'We could not get a reliable estimate right now. Please try again.' });
  }
}

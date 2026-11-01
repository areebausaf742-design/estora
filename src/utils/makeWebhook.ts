export interface LeadPayload {
  leadId: string;
  timestamp: string;
  source: string;
  leadType: 'enquiry' | 'site_visit' | 'brochure' | 'loan_calc' | 'commercial';
  name: string;
  email: string;
  phone: string;
  message?: string;
  propertyId?: string;
  propertyTitle?: string;
  propertyPrice?: number;
  city?: string;
  locality?: string;
  preferredDate?: string;
  language?: string;
  loanDetails?: {
    loanAmount: number;
    downPayment: number;
    tenureYears: number;
    estimatedEmi: number;
  };
}

export interface WebhookSendResult {
  success: boolean;
  leadId: string;
  syncedToMake: boolean;
  message: string;
}

const STORAGE_KEY_WEBHOOK = 'estora_make_webhook_url';
const STORAGE_KEY_LEADS = 'estora_captured_leads';

// Default mock/fallback URL or empty to use local sync mode with live test
export const DEFAULT_MAKE_WEBHOOK_URL = '';

export function getMakeWebhookUrl(): string {
  if (typeof window === 'undefined') return DEFAULT_MAKE_WEBHOOK_URL;
  return localStorage.getItem(STORAGE_KEY_WEBHOOK) || DEFAULT_MAKE_WEBHOOK_URL;
}

export function setMakeWebhookUrl(url: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY_WEBHOOK, url.trim());
}

export function getStoredLeads(): LeadPayload[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_LEADS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveStoredLead(lead: LeadPayload): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getStoredLeads();
    const updated = [lead, ...current].slice(0, 50); // keep last 50 leads
    localStorage.setItem(STORAGE_KEY_LEADS, JSON.stringify(updated));
  } catch (e) {
    console.error('Error saving lead to storage:', e);
  }
}

/**
 * Sends a captured lead to Make.com webhook and stores it locally.
 */
export async function captureLead(
  leadInput: Omit<LeadPayload, 'leadId' | 'timestamp' | 'source'>
): Promise<WebhookSendResult> {
  const leadId = `EST-${Math.floor(100000 + Math.random() * 900000)}`;
  const timestamp = new Date().toISOString();
  const source = typeof window !== 'undefined' ? window.location.href : 'Estora Web';

  const fullPayload: LeadPayload = {
    ...leadInput,
    leadId,
    timestamp,
    source,
  };

  // Always persist locally
  saveStoredLead(fullPayload);

  const webhookUrl = getMakeWebhookUrl();

  if (!webhookUrl) {
    // Local capture success
    return {
      success: true,
      leadId,
      syncedToMake: false,
      message: 'Lead captured successfully in Estora CRM. Make.com webhook is ready to be configured.',
    };
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/plain, */*',
      },
      mode: 'cors',
      body: JSON.stringify(fullPayload),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (response.ok || response.status === 200 || response.status === 204) {
      return {
        success: true,
        leadId,
        syncedToMake: true,
        message: 'Lead successfully dispatched to Make.com scenario!',
      };
    } else {
      return {
        success: true,
        leadId,
        syncedToMake: false,
        message: `Lead saved locally. Make.com returned HTTP ${response.status}`,
      };
    }
  } catch (error) {
    console.warn('Make.com webhook call warning:', error);
    return {
      success: true,
      leadId,
      syncedToMake: false,
      message: 'Lead saved locally. (Make.com webhook may be offline or CORS restricted).',
    };
  }
}

import type { Purpose } from '../types';

export function formatINR(value: number, purpose?: Purpose): string {
  if (!Number.isFinite(value)) return 'N/A';
  const formatted = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(value);
  if (purpose === 'Rent') return `${formatted} / month`;
  if (value >= 10000000) {
    const wholeCr = Math.floor(value / 10000000);
    const remLakh = Math.round((value - wholeCr * 10000000) / 100000);
    if (remLakh > 0) return `\u20B9${wholeCr} Cr ${remLakh} Lakh`;
    return `\u20B9${wholeCr} Cr`;
  }
  if (value >= 100000) {
    const lakh = value / 100000;
    const wholeLakh = Math.floor(lakh);
    const remThousand = Math.round((lakh - wholeLakh) * 1000);
    if (remThousand > 0 && wholeLakh > 0) return `\u20B9${wholeLakh} Lakh ${remThousand} Thousand`;
    return wholeLakh > 0 ? `\u20B9${wholeLakh} Lakh` : `\u20B9${formatted}`;
  }
  return `\u20B9${formatted}`;
}

export function formatPricePerSqFt(value: number): string {
  return `\u20B9${new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(value)} / sq.ft.`;
}

export function formatArea(sqFt: number): string {
  return `${new Intl.NumberFormat('en-IN').format(sqFt)} sq. ft.`;
}

export function formatDate(iso: string): string {
  const date = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
}
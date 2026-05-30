import { GOOGLE_FORM_CONFIG } from './google-form.config';

export interface BookingPayload {
  contactPerson: string;
  propertyName: string;
  email: string;
  phone: string;
  listingUrl: string;
  location: string;
  notes: string;
  period: string;
  packageChoice: string;
}

const ALLOWED_PACKETS = new Set(['Packet1', 'Packet2', 'Packet3']);

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function toMonthDayYear(dateValue: string): { month: string; day: string; year: string } | null {
  const [year, month, day] = dateValue.split('-');
  if (!year || !month || !day) {
    return null;
  }

  return { month, day, year };
}

function validateBookingPayload(data: BookingPayload): void {
  if (!data.contactPerson.trim()) {
    throw new Error('Missing required field: contactPerson');
  }

  if (!data.propertyName.trim()) {
    throw new Error('Missing required field: propertyName');
  }

  if (!data.email.trim() || !isValidEmail(data.email.trim())) {
    throw new Error('Invalid required field: email');
  }

  if (!data.phone.trim()) {
    throw new Error('Missing required field: phone');
  }

  if (!toMonthDayYear(data.period.trim())) {
    throw new Error('Invalid required field: period');
  }

  if (!ALLOWED_PACKETS.has(data.packageChoice.trim())) {
    throw new Error('Invalid required field: packageChoice');
  }
}

export async function submitToGoogleForm(data: BookingPayload): Promise<void> {
  if (GOOGLE_FORM_CONFIG.submissionMode !== 'single-row-per-group' || !GOOGLE_FORM_CONFIG.groupFields) {
    throw new Error('Unsupported Google Form submission mode.');
  }

  validateBookingPayload(data);

  const payload = new URLSearchParams();
  payload.set('fvv', '1');
  payload.set('draftResponse', '[]');
  payload.set('pageHistory', '0');

  for (const [key, value] of Object.entries(data)) {
    const entryId = GOOGLE_FORM_CONFIG.groupFields[key];
    if (!entryId) {
      continue;
    }

    if (key === 'period') {
      const parsed = toMonthDayYear(value.trim());
      if (parsed) {
        payload.set(entryId, `${parsed.month}/${parsed.day}/${parsed.year}`);
        payload.set(`${entryId}_year`, String(parseInt(parsed.year, 10)));
        payload.set(`${entryId}_month`, String(parseInt(parsed.month, 10)));
        payload.set(`${entryId}_day`, String(parseInt(parsed.day, 10)));
      }
      continue;
    }

    payload.set(entryId, value.trim());
  }

  // Google Forms omits CORS headers; no-cors is required and response details are not readable client-side.
  await fetch(GOOGLE_FORM_CONFIG.formUrl, {
    method: 'POST',
    mode: 'no-cors',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: payload.toString(),
  });
}

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

export async function submitToGoogleForm(data: BookingPayload): Promise<void> {
  if (GOOGLE_FORM_CONFIG.submissionMode !== 'single-row-per-group' || !GOOGLE_FORM_CONFIG.groupFields) {
    throw new Error('Unsupported Google Form submission mode.');
  }

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
      const [year, month, day] = value.split('-');
      if (year && month && day) {
        payload.set(`${entryId}_year`, String(parseInt(year, 10)));
        payload.set(`${entryId}_month`, String(parseInt(month, 10)));
        payload.set(`${entryId}_day`, String(parseInt(day, 10)));
      }
      continue;
    }

    payload.set(entryId, value);
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

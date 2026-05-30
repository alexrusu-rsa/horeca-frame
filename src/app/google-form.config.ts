export interface GoogleFormConfig {
  formUrl: string;
  submissionMode: 'single-row-per-guest' | 'single-row-per-group';
  guestFields?: Record<string, string>;
  groupFields?: Record<string, string>;
}

export const GOOGLE_FORM_CONFIG: GoogleFormConfig = {
  formUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSfporG1A2aXr-6L-uCmlJ3u-Rd5Kj1VYgQg4vbdsrJEK3qA8w/formResponse',
  submissionMode: 'single-row-per-group',
  groupFields: {
    contactPerson: 'entry.166040633',
    propertyName: 'entry.2011253831',
    email: 'entry.1553480704',
    phone: 'entry.1540406263',
    listingUrl: 'entry.1563827681',
    location: 'entry.1482001310',
    notes: 'entry.990638640',
    period: 'entry.1162848674',
    packageChoice: 'entry.1088604366',
  },
};

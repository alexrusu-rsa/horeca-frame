import { Component } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import confetti from 'canvas-confetti';

type PackageOffer = {
  nameKey: string;
  price: string;
  deliverableKey: string;
  noteKey: string;
  googlePacketValue: 'Packet1' | 'Packet2' | 'Packet3';
  image: {
    src: string;
    altKey: string;
  };
};

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  imports: [TranslateModule],
})
export class App {
  // Delay to align scroll-to-field with mobile keyboard open animation.
  private readonly keyboardScrollDelayMs = 180;
  // Matches the existing responsive breakpoint used in app.scss.
  private readonly mobileBreakpointPx = 980;
  private readonly bookingFieldSelector = [
    'input:not([readonly]):not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
  ].join(', ');
  private mobileMediaQuery: MediaQueryList | null = null;
  protected readonly year = new Date().getFullYear();
  protected isBookingModalOpen = false;
  protected bookingStep = 1;
  protected readonly totalBookingSteps = 4;
  protected selectedPackage: PackageOffer | null = null;

  protected readonly googleFormBaseUrl =
    'https://docs.google.com/forms/d/e/1FAIpQLSfporG1A2aXr-6L-uCmlJ3u-Rd5Kj1VYgQg4vbdsrJEK3qA8w/viewform';
  protected readonly googleFormResponseUrl =
    'https://docs.google.com/forms/d/e/1FAIpQLSfporG1A2aXr-6L-uCmlJ3u-Rd5Kj1VYgQg4vbdsrJEK3qA8w/formResponse';
  protected readonly googleFormEntries = {
    contactPerson: 'entry.166040633',
    propertyName: 'entry.2011253831',
    email: 'entry.1553480704',
    phone: 'entry.1540406263',
    listingUrl: 'entry.1563827681',
    location: 'entry.1482001310',
    notes: 'entry.990638640',
    period: 'entry.1162848674',
    packageChoice: 'entry.1088604366',
  };

  protected readonly heroImage = {
    src: 'photos/Pensiunea Sophia-34.jpg',
    altKey: 'IMAGES.HERO_MAIN_ALT',
  };

  protected readonly heroShowcaseImages = [
    this.heroImage,
    {
      src: 'photos/Pensiunea Sophia-9.jpg',
      altKey: 'IMAGES.HERO_SECONDARY_ALT',
    },
  ];

  protected readonly galleryImages = [
    {
      src: 'photos/Pensiunea Sophia-13.jpg',
      altKey: 'IMAGES.GALLERY_1_ALT',
    },
    {
      src: 'photos/Pensiunea Sophia-15.jpg',
      altKey: 'IMAGES.GALLERY_2_ALT',
    },
    {
      src: 'photos/Pensiunea Sophia-16.jpg',
      altKey: 'IMAGES.GALLERY_3_ALT',
    },
    {
      src: 'photos/Pensiunea Sophia-17.jpg',
      altKey: 'IMAGES.GALLERY_4_ALT',
    },
    {
      src: 'photos/Pensiunea Sophia-18.jpg',
      altKey: 'IMAGES.GALLERY_5_ALT',
    },
    {
      src: 'photos/Pensiunea Sophia-19.jpg',
      altKey: 'IMAGES.GALLERY_6_ALT',
    },
    {
      src: 'photos/Pensiunea Sophia-20.jpg',
      altKey: 'IMAGES.GALLERY_7_ALT',
    },
    {
      src: 'photos/Pensiunea Sophia-21.jpg',
      altKey: 'IMAGES.GALLERY_8_ALT',
    },
    {
      src: 'photos/Pensiunea Sophia-23.jpg',
      altKey: 'IMAGES.GALLERY_9_ALT',
    },
    {
      src: 'photos/Pensiunea Sophia-24.jpg',
      altKey: 'IMAGES.GALLERY_10_ALT',
    },
    {
      src: 'photos/Pensiunea Sophia-34.jpg',
      altKey: 'IMAGES.GALLERY_11_ALT',
    },
    {
      src: 'photos/Pensiunea Sophia-49.jpg',
      altKey: 'IMAGES.GALLERY_12_ALT',
    },
  ];

  protected readonly servicePoints = [
    'SERVICE_POINTS.ITEM_1',
    'SERVICE_POINTS.ITEM_2',
    'SERVICE_POINTS.ITEM_3',
  ];

  protected readonly workflow = [
    {
      step: '1',
      titleKey: 'WORKFLOW.STEP_1_TITLE',
      textKey: 'WORKFLOW.STEP_1_TEXT',
    },
    {
      step: '2',
      titleKey: 'WORKFLOW.STEP_2_TITLE',
      textKey: 'WORKFLOW.STEP_2_TEXT',
    },
    {
      step: '3',
      titleKey: 'WORKFLOW.STEP_3_TITLE',
      textKey: 'WORKFLOW.STEP_3_TEXT',
    },
  ];

  protected readonly packages: PackageOffer[] = [
    {
      nameKey: 'PACKAGES.STARTER.NAME',
      price: '100 €',
      deliverableKey: 'PACKAGES.STARTER.DELIVERABLE',
      noteKey: 'PACKAGES.STARTER.NOTE',
      googlePacketValue: 'Packet1',
      image: {
        src: 'photos/Pensiunea Sophia-15.jpg',
        altKey: 'PACKAGES.STARTER.IMAGE_ALT',
      },
    },
    {
      nameKey: 'PACKAGES.GROWTH.NAME',
      price: '200 €',
      deliverableKey: 'PACKAGES.GROWTH.DELIVERABLE',
      noteKey: 'PACKAGES.GROWTH.NOTE',
      googlePacketValue: 'Packet2',
      image: {
        src: 'photos/Pensiunea Sophia-34.jpg',
        altKey: 'PACKAGES.GROWTH.IMAGE_ALT',
      },
    },
    {
      nameKey: 'PACKAGES.SIGNATURE.NAME',
      price: '500 €',
      deliverableKey: 'PACKAGES.SIGNATURE.DELIVERABLE',
      noteKey: 'PACKAGES.SIGNATURE.NOTE',
      googlePacketValue: 'Packet3',
      image: {
        src: 'photos/Pensiunea Sophia-49.jpg',
        altKey: 'PACKAGES.SIGNATURE.IMAGE_ALT',
      },
    },
  ];

  constructor(private readonly translate: TranslateService) {
    this.translate.addLangs(['ro', 'en', 'hr']);
    this.translate.setFallbackLang('en');
    const browserLang = this.translate.getBrowserLang();
    const activeLang = ['ro', 'en', 'hr'].includes(browserLang ?? '')
      ? (browserLang ?? 'en')
      : 'en';
    this.translate.use(activeLang);
  }

  protected openBookingModal(pack: PackageOffer): void {
    this.selectedPackage = pack;
    this.isBookingModalOpen = true;
    this.bookingStep = 1;
    this.queueFocusCurrentStepField();
  }

  protected closeBookingModal(): void {
    this.isBookingModalOpen = false;
    this.bookingStep = 1;
    this.selectedPackage = null;
  }

  protected onModalOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('booking-modal-overlay')) {
      this.closeBookingModal();
    }
  }

  protected nextBookingStep(form: HTMLFormElement): void {
    if (this.bookingStep === 1) {
      const isValid = this.validateFormFields(form, ['contactPerson', 'propertyName', 'email', 'phone']);
      if (!isValid) {
        return;
      }
    }

    if (this.bookingStep === 2) {
      const isValid = this.validateFormFields(form, ['listingUrl', 'period']);
      if (!isValid) {
        return;
      }
    }

    this.bookingStep = Math.min(3, this.bookingStep + 1);
    this.queueFocusCurrentStepField();
  }

  protected previousBookingStep(): void {
    this.bookingStep = Math.max(1, this.bookingStep - 1);
    this.queueFocusCurrentStepField();
  }

  protected submitBookingLead(form: HTMLFormElement): void {
    if (this.bookingStep !== 3) {
      return;
    }

    const formData = new FormData(form);

    const payload = {
      contactPerson: String(formData.get('contactPerson') ?? ''),
      propertyName: String(formData.get('propertyName') ?? ''),
      email: String(formData.get('email') ?? ''),
      phone: String(formData.get('phone') ?? ''),
      listingUrl: String(formData.get('listingUrl') ?? ''),
      location: String(formData.get('location') ?? ''),
      period: String(formData.get('period') ?? ''),
      packageChoice: this.selectedPackage?.googlePacketValue ?? '',
      notes: String(formData.get('notes') ?? ''),
    };

    this.submitDirectlyToGoogleForm(payload);
    form.reset();
    this.bookingStep = 4;
    this.launchConfetti();
  }

  protected handleFieldEnter(event: Event, form: HTMLFormElement): void {
    if (!(event instanceof KeyboardEvent)) {
      return;
    }

    const target = event.target as HTMLElement | null;
    if (!target || target.matches('textarea')) {
      return;
    }

    const activeStep = this.getActiveBookingStep(form);
    if (!activeStep) {
      return;
    }

    const fields = Array.from(activeStep.querySelectorAll<HTMLElement>(this.bookingFieldSelector));
    const currentIndex = fields.indexOf(target);
    if (currentIndex === -1) {
      return;
    }

    event.preventDefault();

    const nextField = fields[currentIndex + 1];
    if (nextField) {
      nextField.focus();
      this.scrollFieldIntoView(nextField);
      return;
    }

    if (this.bookingStep < 3) {
      this.nextBookingStep(form);
      return;
    }

    this.submitBookingLead(form);
  }

  protected onBookingFieldFocus(event: FocusEvent): void {
    const field = event.target as HTMLElement | null;
    if (!field || !field.matches(this.bookingFieldSelector)) {
      return;
    }

    this.scrollFieldIntoView(field);
  }

  private validateFormFields(form: HTMLFormElement, fieldNames: string[]): boolean {
    for (const fieldName of fieldNames) {
      const input = form.elements.namedItem(fieldName) as HTMLInputElement | HTMLTextAreaElement | null;
      if (!input) {
        continue;
      }

      if (!input.checkValidity()) {
        input.reportValidity();
        return false;
      }
    }

    return true;
  }

  private buildGoogleFormPayload(payload: Record<string, string>): URLSearchParams {
    const encoded = new URLSearchParams();

    // Google Forms expects these control params for single-page public forms.
    encoded.set('fvv', '1');
    encoded.set('draftResponse', '[]');
    encoded.set('pageHistory', '0');

    for (const [key, value] of Object.entries(payload)) {
      const entryId = this.googleFormEntries[key as keyof typeof this.googleFormEntries];
      if (entryId && value) {
        if (key === 'period') {
          const [year, month, day] = value.split('-');
          if (year && month && day) {
            // Google Forms date fields require separate _year/_month/_day params.
            // Month and day must be numeric strings without leading zeros.
            encoded.set(`${entryId}_year`, String(parseInt(year, 10)));
            encoded.set(`${entryId}_month`, String(parseInt(month, 10)));
            encoded.set(`${entryId}_day`, String(parseInt(day, 10)));
            continue;
          }
        }

        encoded.set(entryId, value);
      }
    }
    return encoded;
  }

  private submitDirectlyToGoogleForm(payload: Record<string, string>): void {
    const encodedPayload = this.buildGoogleFormPayload(payload);
    const body = encodedPayload.toString();

    // sendBeacon is unreliable for cross-origin Google Forms submissions and can
    // silently drop requests. Use fetch with no-cors instead.
    fetch(this.googleFormResponseUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
      keepalive: true,
    }).catch(() => {
      // Swallow network/cors errors: no-cors responses are opaque by design.
    });
  }

  private launchConfetti(): void {
    confetti({
      particleCount: 140,
      spread: 80,
      startVelocity: 45,
      origin: { y: 0.65 },
      colors: ['#2f6f57', '#d9a441', '#f3efe6', '#b44e3e'],
    });
  }

  private queueFocusCurrentStepField(): void {
    requestAnimationFrame(() => {
      const form = document.querySelector<HTMLFormElement>('.booking-form');
      if (!form) {
        return;
      }

      const activeStep = this.getActiveBookingStep(form);
      const firstField = activeStep?.querySelector<HTMLElement>(this.bookingFieldSelector);
      if (!firstField) {
        return;
      }

      firstField.focus();
      this.scrollFieldIntoView(firstField);
    });
  }

  private getActiveBookingStep(form: HTMLFormElement): HTMLElement | null {
    return form.querySelector<HTMLElement>('.booking-step:not([hidden])');
  }

  private scrollFieldIntoView(field: HTMLElement): void {
    if (this.isMobileViewport()) {
      setTimeout(() => {
        field.scrollIntoView({ block: 'center', inline: 'nearest' });
      }, this.keyboardScrollDelayMs);
    }
  }

  private isMobileViewport(): boolean {
    if (!this.mobileMediaQuery) {
      this.mobileMediaQuery = window.matchMedia(`(max-width: ${this.mobileBreakpointPx}px)`);
    }

    return this.mobileMediaQuery.matches;
  }
}

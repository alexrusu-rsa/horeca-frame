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
  }

  protected previousBookingStep(): void {
    this.bookingStep = Math.max(1, this.bookingStep - 1);
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
    for (const [key, value] of Object.entries(payload)) {
      const entryId = this.googleFormEntries[key as keyof typeof this.googleFormEntries];
      if (entryId && value) {
        if (key === 'period') {
          const [year, month, day] = value.split('-');
          if (year && month && day) {
            encoded.set(`${entryId}_year`, year);
            encoded.set(`${entryId}_month`, month);
            encoded.set(`${entryId}_day`, day);
            continue;
          }
        }

        encoded.set(entryId, value);
      }
    }
    return encoded;
  }

  private submitDirectlyToGoogleForm(payload: Record<string, string>): void {
    const frameId = 'google-form-submit-frame';
    let iframe = document.getElementById(frameId) as HTMLIFrameElement | null;

    if (!iframe) {
      iframe = document.createElement('iframe');
      iframe.id = frameId;
      iframe.name = frameId;
      iframe.style.display = 'none';
      document.body.appendChild(iframe);
    }

    const hiddenForm = document.createElement('form');
    hiddenForm.method = 'POST';
    hiddenForm.action = this.googleFormResponseUrl;
    hiddenForm.target = frameId;
    hiddenForm.style.display = 'none';

    const encodedPayload = this.buildGoogleFormPayload(payload);
    encodedPayload.forEach((value, key) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = value;
      hiddenForm.appendChild(input);
    });

    document.body.appendChild(hiddenForm);
    hiddenForm.submit();
    document.body.removeChild(hiddenForm);
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
}

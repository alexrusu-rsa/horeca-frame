import { ChangeDetectionStrategy, Component, inject, input, output, signal } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import confetti from 'canvas-confetti';

import { submitToGoogleForm } from './google-form';
import { PackageOffer } from './booking.types';

@Component({
  selector: 'app-booking-modal',
  templateUrl: './booking-modal.component.html',
  styleUrl: './booking-modal.component.scss',
  imports: [TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookingModalComponent {
  private readonly translate = inject(TranslateService);
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

  readonly selectedPackage = input.required<PackageOffer>();
  readonly closeModal = output<void>();

  protected readonly bookingPlaceholders = {
    contactPerson: 'Nume complet',
    propertyName: 'Nume proprietate',
    email: 'email@exemplu.com',
    phone: '+40 7xx xxx xxx',
    listingUrl: 'https://site-ul-tau.ro',
    location: 'Oras / zona',
    period: 'YYYY-MM-DD',
    notes: 'Detalii suplimentare (acces, program, observatii)',
  };

  protected readonly bookingStep = signal(1);
  protected readonly totalBookingSteps = 4;
  protected readonly isSubmitting = signal(false);
  protected readonly submissionError = signal<string | null>(null);

  protected onModalOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('booking-modal-overlay')) {
      this.requestClose();
    }
  }

  protected requestClose(): void {
    this.bookingStep.set(1);
    this.submissionError.set(null);
    this.isSubmitting.set(false);
    this.closeModal.emit();
  }

  protected nextBookingStep(form: HTMLFormElement): void {
    if (this.bookingStep() === 1) {
      const isValid = this.validateFormFields(form, [
        'contactPerson',
        'propertyName',
        'email',
        'phone',
      ]);
      if (!isValid) {
        return;
      }
    }

    if (this.bookingStep() === 2) {
      const isValid = this.validateFormFields(form, ['period']);
      if (!isValid) {
        return;
      }
    }

    this.bookingStep.update((step) => Math.min(3, step + 1));
    this.queueFocusCurrentStepField();
  }

  protected previousBookingStep(): void {
    this.bookingStep.update((step) => Math.max(1, step - 1));
    this.queueFocusCurrentStepField();
  }

  protected async submitBookingLead(form: HTMLFormElement): Promise<void> {
    if (this.bookingStep() !== 3 || this.isSubmitting()) {
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
      packageChoice: this.selectedPackage().googlePacketValue,
      notes: String(formData.get('notes') ?? ''),
    };

    this.submissionError.set(null);
    this.isSubmitting.set(true);

    try {
      await submitToGoogleForm(payload);
      form.reset();
      this.bookingStep.set(4);
      this.launchConfetti();
    } catch (error) {
      console.error('Google Form submission failed', error);
      this.submissionError.set(this.translate.instant('BOOKING_MODAL.SUBMISSION_ERROR'));
    } finally {
      this.isSubmitting.set(false);
    }
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

    if (this.bookingStep() < 3) {
      this.nextBookingStep(form);
      return;
    }

    void this.submitBookingLead(form);
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
      const input = form.elements.namedItem(fieldName) as
        | HTMLInputElement
        | HTMLTextAreaElement
        | null;
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

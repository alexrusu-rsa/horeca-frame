import { Component, signal } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { BookingModalComponent } from './booking-modal.component';
import { PackageOffer } from './booking.types';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  imports: [TranslateModule, BookingModalComponent],
})
export class App {
  protected readonly year = new Date().getFullYear();
  protected readonly isBookingModalOpen = signal(false);
  protected readonly selectedPackage = signal<PackageOffer | null>(null);
  protected readonly bookingModalPrefetchRequested = signal(false);

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

  protected prepareBookingModal(): void {
    this.bookingModalPrefetchRequested.set(true);
  }

  protected openBookingModal(pack: PackageOffer): void {
    this.prepareBookingModal();
    this.selectedPackage.set(pack);
    this.isBookingModalOpen.set(true);
  }

  protected closeBookingModal(): void {
    this.isBookingModalOpen.set(false);
    this.selectedPackage.set(null);
  }
}

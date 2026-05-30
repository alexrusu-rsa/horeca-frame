import { Component } from '@angular/core';

type PackageOffer = {
  name: string;
  price: string;
  deliverable: string;
  note: string;
  googlePacketValue: 'Packet1' | 'Packet2' | 'Packet3';
  image: {
    src: string;
    alt: string;
  };
};

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly year = new Date().getFullYear();
  protected isBookingModalOpen = false;
  protected selectedPackage: PackageOffer | null = null;

  protected readonly googleFormBaseUrl =
    'https://docs.google.com/forms/d/e/1FAIpQLSfporG1A2aXr-6L-uCmlJ3u-Rd5Kj1VYgQg4vbdsrJEK3qA8w/viewform';
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
    alt: 'Exterior view of the accommodation with warm evening light.',
  };

  protected readonly heroShowcaseImages = [
    this.heroImage,
    {
      src: 'photos/Pensiunea Sophia-9.jpg',
      alt: 'Pensiunea Sophia exterior view with flowers.',
    },
  ];

  protected readonly galleryImages = [
    {
      src: 'photos/Pensiunea Sophia-13.jpg',
      alt: 'Bright guest room styled for Airbnb and Booking conversion.',
    },
    {
      src: 'photos/Pensiunea Sophia-15.jpg',
      alt: 'Clean bedroom framing that improves listing clarity.',
    },
    {
      src: 'photos/Pensiunea Sophia-16.jpg',
      alt: 'Inviting interior angle designed to increase booking trust.',
    },
    {
      src: 'photos/Pensiunea Sophia-17.jpg',
      alt: 'Balanced composition that highlights comfort and space.',
    },
    {
      src: 'photos/Pensiunea Sophia-18.jpg',
      alt: 'Natural-light room photo prepared for high-performing listings.',
    },
    {
      src: 'photos/Pensiunea Sophia-19.jpg',
      alt: 'Bathroom visual that supports guest confidence before booking.',
    },
    {
      src: 'photos/Pensiunea Sophia-20.jpg',
      alt: 'Refined interior details captured for premium presentation.',
    },
    {
      src: 'photos/Pensiunea Sophia-21.jpg',
      alt: 'Guest-ready room styling optimized for booking platforms.',
    },
    {
      src: 'photos/Pensiunea Sophia-23.jpg',
      alt: 'Lifestyle scene that communicates comfort and quality.',
    },
    {
      src: 'photos/Pensiunea Sophia-24.jpg',
      alt: 'Room perspective crafted to attract more customers.',
    },
    {
      src: 'photos/Pensiunea Sophia-34.jpg',
      alt: 'Architectural framing that improves perceived property value.',
    },
    {
      src: 'photos/Pensiunea Sophia-49.jpg',
      alt: 'Finishing showcase shot suitable for Airbnb and Booking covers.',
    },
  ];

  protected readonly servicePoints = [
    'Airbnb and Booking-optimized photo direction that improves listing performance',
    'Composition and styling built to attract more customers and increase conversions',
    'Fast delivery with web-ready exports and thumbnail-friendly crops',
  ];

  protected readonly workflow = [
    {
      step: '1',
      title: 'Brief & Property Goals',
      text: 'We align your audience, room mix, and unique selling points.',
    },
    {
      step: '2',
      title: 'On-site Photo Session',
      text: 'Structured room-by-room coverage with angles that sell experience.',
    },
    {
      step: '3',
      title: 'Editing & Delivery',
      text: 'Color-consistent retouching and optimized files ready for publishing.',
    },
  ];

  protected readonly packages: PackageOffer[] = [
    {
      name: 'Starter',
      price: '100 €',
      deliverable: '15 final photos',
      note: 'Ideal for studios and small guesthouses',
      googlePacketValue: 'Packet1',
      image: {
        src: 'photos/Pensiunea Sophia-15.jpg',
        alt: 'Starter package preview photo for a cozy accommodation room.',
      },
    },
    {
      name: 'Growth',
      price: '200 €',
      deliverable: '30 final photos',
      note: 'Best for medium accommodations and apartment groups',
      googlePacketValue: 'Packet2',
      image: {
        src: 'photos/Pensiunea Sophia-34.jpg',
        alt: 'Growth package preview photo for a full property exterior angle.',
      },
    },
    {
      name: 'Signature',
      price: '500 €',
      deliverable: '50 final photos',
      note: 'Complete visual coverage for premium properties',
      googlePacketValue: 'Packet3',
      image: {
        src: 'photos/Pensiunea Sophia-49.jpg',
        alt: 'Signature package preview photo with premium night ambiance.',
      },
    },
  ];

  protected openBookingModal(pack: PackageOffer): void {
    this.selectedPackage = pack;
    this.isBookingModalOpen = true;
  }

  protected closeBookingModal(): void {
    this.isBookingModalOpen = false;
    this.selectedPackage = null;
  }

  protected onModalOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('booking-modal-overlay')) {
      this.closeBookingModal();
    }
  }

  protected submitBookingLead(event: SubmitEvent): void {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
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

    const prefillUrl = this.buildGoogleFormPrefillUrl(payload);
    window.open(prefillUrl, '_blank', 'noopener,noreferrer');
    form.reset();
    this.closeBookingModal();
  }

  private buildGoogleFormPrefillUrl(payload: Record<string, string>): string {
    const url = new URL(this.googleFormBaseUrl);
    for (const [key, value] of Object.entries(payload)) {
      const entryId = this.googleFormEntries[key as keyof typeof this.googleFormEntries];
      if (entryId && value) {
        url.searchParams.set(entryId, value);
      }
    }
    return url.toString();
  }
}

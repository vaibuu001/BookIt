export interface Experience {
  id: string;
  title: string;
  description: string;
  location: string;
  image_url: string;
  price: number;
  duration: string;
  category: string;
  rating: number;
  created_at: string;
}

export interface Slot {
  id: string;
  experience_id: string;
  date: string;
  time: string;
  available_spots: number;
  total_spots: number;
  created_at: string;
}

export interface ExperienceWithSlots extends Experience {
  slots: Slot[];
}

export interface BookingRequest {
  experienceId: string;
  slotId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  numGuests: number;
  promoCode?: string;
  discountAmount: number;
  totalAmount: number;
}

export interface Booking {
  id: string;
  experience_id: string;
  slot_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  num_guests: number;
  promo_code: string | null;
  discount_amount: number;
  total_amount: number;
  status: string;
  created_at: string;
}

export interface PromoCodeValidation {
  valid: boolean;
  discountType?: string;
  discountValue?: number;
  message: string;
}

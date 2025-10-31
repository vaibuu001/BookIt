import { Experience, ExperienceWithSlots, BookingRequest, Booking, PromoCodeValidation } from '../types';

const API_BASE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;
const API_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const headers = {
  'Authorization': `Bearer ${API_KEY}`,
  'Content-Type': 'application/json',
};

export const api = {
  async getExperiences(): Promise<Experience[]> {
    const response = await fetch(`${API_BASE_URL}/experiences`, { headers });
    if (!response.ok) throw new Error('Failed to fetch experiences');
    return response.json();
  },

  async getExperienceById(id: string): Promise<ExperienceWithSlots> {
    const response = await fetch(`${API_BASE_URL}/experiences/${id}`, { headers });
    if (!response.ok) throw new Error('Failed to fetch experience details');
    return response.json();
  },

  async validatePromoCode(code: string): Promise<PromoCodeValidation> {
    const response = await fetch(`${API_BASE_URL}/promo-validate`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ code }),
    });
    if (!response.ok) throw new Error('Failed to validate promo code');
    return response.json();
  },

  async createBooking(bookingData: BookingRequest): Promise<{ success: boolean; booking: Booking }> {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      method: 'POST',
      headers,
      body: JSON.stringify(bookingData),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create booking');
    }
    return response.json();
  },
};

/*
  # BookIt Schema Setup

  ## Overview
  Creates the complete database schema for the BookIt travel experiences booking platform.

  ## New Tables

  ### 1. experiences
  - `id` (uuid, primary key) - Unique identifier for each experience
  - `title` (text) - Experience name
  - `description` (text) - Detailed description
  - `location` (text) - Experience location
  - `image_url` (text) - URL to experience image
  - `price` (decimal) - Base price per person
  - `duration` (text) - Duration description (e.g., "3 hours")
  - `category` (text) - Experience category
  - `rating` (decimal) - Average rating
  - `created_at` (timestamptz) - Creation timestamp

  ### 2. slots
  - `id` (uuid, primary key) - Unique identifier for each slot
  - `experience_id` (uuid, foreign key) - References experiences
  - `date` (date) - Date of the slot
  - `time` (text) - Time slot (e.g., "10:00 AM")
  - `available_spots` (integer) - Number of available spots
  - `total_spots` (integer) - Total capacity
  - `created_at` (timestamptz) - Creation timestamp

  ### 3. bookings
  - `id` (uuid, primary key) - Unique booking identifier
  - `experience_id` (uuid, foreign key) - References experiences
  - `slot_id` (uuid, foreign key) - References slots
  - `customer_name` (text) - Customer full name
  - `customer_email` (text) - Customer email address
  - `customer_phone` (text) - Customer phone number
  - `num_guests` (integer) - Number of guests
  - `promo_code` (text, nullable) - Applied promo code
  - `discount_amount` (decimal) - Discount applied
  - `total_amount` (decimal) - Final amount paid
  - `status` (text) - Booking status (confirmed, cancelled)
  - `created_at` (timestamptz) - Booking timestamp

  ### 4. promo_codes
  - `id` (uuid, primary key) - Unique promo code identifier
  - `code` (text, unique) - Promo code string
  - `discount_type` (text) - Type of discount (percentage, flat)
  - `discount_value` (decimal) - Discount value
  - `is_active` (boolean) - Whether code is currently active
  - `created_at` (timestamptz) - Creation timestamp

  ## Security
  - Enable RLS on all tables
  - All tables are publicly readable for the booking flow
  - Only authenticated admin users can modify data (future enhancement)

  ## Indexes
  - Index on experience_id in slots table for faster lookups
  - Index on slot_id and experience_id in bookings table
  - Unique index on promo_codes.code
*/

CREATE TABLE IF NOT EXISTS experiences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  location text NOT NULL,
  image_url text NOT NULL,
  price decimal(10,2) NOT NULL,
  duration text NOT NULL,
  category text NOT NULL,
  rating decimal(2,1) DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS slots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  experience_id uuid NOT NULL REFERENCES experiences(id) ON DELETE CASCADE,
  date date NOT NULL,
  time text NOT NULL,
  available_spots integer NOT NULL DEFAULT 0,
  total_spots integer NOT NULL DEFAULT 10,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  experience_id uuid NOT NULL REFERENCES experiences(id),
  slot_id uuid NOT NULL REFERENCES slots(id),
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text NOT NULL,
  num_guests integer NOT NULL DEFAULT 1,
  promo_code text,
  discount_amount decimal(10,2) DEFAULT 0,
  total_amount decimal(10,2) NOT NULL,
  status text DEFAULT 'confirmed',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS promo_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  discount_type text NOT NULL,
  discount_value decimal(10,2) NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_slots_experience_id ON slots(experience_id);
CREATE INDEX IF NOT EXISTS idx_bookings_slot_id ON bookings(slot_id);
CREATE INDEX IF NOT EXISTS idx_bookings_experience_id ON bookings(experience_id);

ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Experiences are publicly readable"
  ON experiences FOR SELECT
  USING (true);

CREATE POLICY "Slots are publicly readable"
  ON slots FOR SELECT
  USING (true);

CREATE POLICY "Bookings can be created by anyone"
  ON bookings FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Bookings are readable by anyone"
  ON bookings FOR SELECT
  USING (true);

CREATE POLICY "Promo codes are publicly readable"
  ON promo_codes FOR SELECT
  USING (true);
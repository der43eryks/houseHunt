/**
 * @file This file contains the TypeScript type definitions that correspond to the
 * database schema. These types should be used throughout the backend and API
 * to ensure data consistency and provide strong typing.
 */

// =================================================================
//  Type for the 'admins' table
// =================================================================
export interface Admin {
  id: number;
  username: string;
  email: string;
  password_hash: string; // Note: This should never be sent to the client.
  role: 'admin' | 'agent';
  phone?: string | null;
  created_at: Date;
  last_login?: Date | null;
}

// =================================================================
//  Types for the 'listings' table and its related data
// =================================================================

export interface Amenity {
  id: number;
  name: string;
}

export interface Tag {
  id: number;
  name: string;
}

export interface ListingImage {
  id: number;
  listing_id: number;
  image_url: string;
  display_order: number;
}

/**
 * Represents a complete house listing object, as it would be returned from the API.
 * This includes joined data from related tables like images, amenities, and tags.
 */
export interface Listing {
  id: number;
  admin_id?: number | null;
  title: string;
  description?: string | null;
  room_type: 'Single' | 'Bedsitter' | 'Two-bedroom';
  can_stay_two_people: boolean;
  price: number;
  payment_frequency: 'per month' | 'per semester';
  location_text: string;
  area_nickname?: string | null;
  is_secure_area: boolean;
  is_available: boolean;
  rating?: number | null;
  created_at: Date;
  updated_at: Date;

  // --- Joined Data ---
  images: ListingImage[];
  amenities: Amenity[];
  tags: Tag[];
}

// =================================================================
//  Type for the 'inquiries' table
// =================================================================
export interface Inquiry {
  id: number;
  listing_id: number;
  user_name: string;
  user_phone: string;
  message?: string | null;
  preferred_visit_time?: string | null;
  status: 'new' | 'contacted' | 'resolved';
  created_at: Date;
}

// =================================================================
//  Types for the 'help_desk' and 'faqs' tables
// =================================================================
export interface HelpDesk {
  id: 1; // This table should only have one row.
  agent_name: string;
  phone: string;
  whatsapp_link?: string | null;
  email?: string | null;
  facebook_url?: string | null;
  available_hours?: string | null;
}

export interface FAQ {
  id: number;
  question: string;
  answer: string;
  display_order: number;
} 
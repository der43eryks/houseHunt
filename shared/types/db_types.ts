// HouseHunt Database Types

export interface Listing {
  id: string;
  title: string;
  description: string;
  roomType: 'Single' | 'Bedsitter' | 'Two-bedroom' | 'Other';
  stayTwoPeople: boolean;
  price: number;
  paymentFrequency: 'Monthly' | 'Semester' | 'Flexible';
  locationText: string;
  areaNickname?: string;
  tags: string[];
  images: string[];
  amenities: string[];
  isSecureArea: boolean;
  agentPhone: string;
  agentWhatsApp?: string;
  agentFacebook?: string;
  available: boolean;
  rating?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Admin {
  id: string;
  username: string;
  passwordHash: string;
  email: string;
  phone: string;
  createdAt: Date;
  lastLogin?: Date;
}

export interface Inquiry {
  id: string;
  houseId: string;
  name: string;
  phone: string;
  message: string;
  preferredVisitTime?: string;
  status: 'pending' | 'responded' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

export interface HelpDesk {
  id: string;
  name: string;
  phone: string;
  whatsappLink: string;
  email: string;
  facebook: string;
  availableHours: string;
  faq: FAQ[];
  contactFormEnabled: boolean;
  updatedAt: Date;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface Feedback {
  id: string;
  listingId?: string;
  name: string;
  email: string;
  rating: number;
  message: string;
  createdAt: Date;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Filter Types
/**
 * Filters for querying listings.
 *
 * @property createdAfter - Only return listings created after this date. Format: 'YYYY-MM-DD' or 'YYYY-MM-DD HH:MM:SS' (MySQL standard).
 */
export interface ListingFilters {
  roomType?: string;
  minPrice?: number;
  maxPrice?: number;
  paymentFrequency?: string;
  location?: string;
  tags?: string[];
  isSecureArea?: boolean;
  available?: boolean;
  search?: string;
  minRating?: number;
  /**
   * Only return listings created after this date.
   * Format: 'YYYY-MM-DD' or 'YYYY-MM-DD HH:MM:SS' (MySQL standard).
   */
  createdAfter?: string;
}

// Form Types
export interface CreateListingRequest {
  title: string;
  description: string;
  roomType: string;
  stayTwoPeople: boolean;
  price: number;
  paymentFrequency: string;
  locationText: string;
  areaNickname?: string;
  tags: string[];
  images?: string[];
  amenities: string[];
  isSecureArea: boolean;
  agentPhone: string;
  agentWhatsApp?: string;
  agentFacebook?: string;
  available: boolean;
  status?: 'published' | 'draft' | 'booked' | 'archived';
}

export interface UpdateListingRequest extends Partial<CreateListingRequest> {
  id: string;
  status?: 'published' | 'draft' | 'booked' | 'archived';
}

export interface CreateInquiryRequest {
  houseId: string;
  name: string;
  phone: string;
  message: string;
  preferredVisitTime?: string;
}

export interface CreateFeedbackRequest {
  listingId?: string;
  name: string;
  email: string;
  rating: number;
  message: string;
}

export interface AdminLoginRequest {
  email: string;
  password: string;
}

export interface AdminLoginResponse {
  token: string;
  admin: Omit<Admin, 'passwordHash'>;
}

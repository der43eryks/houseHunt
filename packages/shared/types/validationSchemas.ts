// @ts-ignore: monorepo import may fail in some tools, but works at runtime
import { z } from "zod";

// Listing Schema
export const ListingSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(10).max(1000),
  price: z.number().int().positive(),
  location: z.string().min(2).max(100),
  bedrooms: z.number().int().min(0).max(20),
  bathrooms: z.number().int().min(0).max(20),
  available: z.boolean().optional().default(true),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

// User Registration Schema
export const RegisterSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  password: z.string().min(8).max(100),
  confirmPassword: z.string().min(8).max(100),
}).refine((data: { password: string; confirmPassword: string }) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

// Login Schema
export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100),
});

// Inquiry Schema
export const InquirySchema = z.object({
  houseId: z.string().min(1),
  name: z.string().min(2).max(100),
  phone: z.string().regex(/^\+254\d{9}$/, 'Phone number must be in Kenyan format: +254XXXXXXXXX'),
  message: z.string().min(10),
  preferredVisitTime: z.string().optional(),
});

// Feedback Schema
export const FeedbackSchema = z.object({
  listingId: z.string().optional(),
  name: z.string().min(2).max(100),
  email: z.string().email(),
  rating: z.number().int().min(1).max(5),
  message: z.string().min(10),
});

// HelpDesk Schema
export const HelpDeskSchema = z.object({
  name: z.string().min(2),
  phone: z.string().regex(/^\+254\d{9}$/, 'Phone number must be in Kenyan format: +254XXXXXXXXX'),
  whatsappLink: z.string().url(),
  email: z.string().email(),
  facebook: z.string().url(),
  availableHours: z.string().min(2),
  contactFormEnabled: z.boolean(),
});

// Admin Registration Schema
export const AdminRegisterSchema = z.object({
  id: z.string().regex(/^[0-9]{8}$/, 'ID must be exactly 8 digits').refine((val: string) => !val.startsWith('00'), { message: 'ID cannot start with 00' }),
  username: z.string().min(2, 'Full name must be at least 2 characters').max(50, 'Full name must be less than 50 characters').regex(/^[a-zA-Z0-9_\s]+$/, 'Full name can only contain letters, numbers, spaces, and underscores'),
  email: z.string().email(),
  phone: z.string().regex(/^\+254\d{9}$/, 'Phone number must be in Kenyan format: +254XXXXXXXXX'),
  password: z.string().min(8, 'Password must be at least 8 characters').max(16, 'Password must be less than 16 characters'),
  confirmPassword: z.string().min(8).max(16),
  agree: z.literal(true, { errorMap: () => ({ message: 'You must agree to the terms and conditions' }) })
}).refine((data: { password: string; confirmPassword: string }) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

// Export types for TypeScript
export type ListingInput = z.infer<typeof ListingSchema>;
export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type InquiryInput = z.infer<typeof InquirySchema>;
export type FeedbackInput = z.infer<typeof FeedbackSchema>;
export type HelpDeskInput = z.infer<typeof HelpDeskSchema>;
export type AdminRegisterInput = z.infer<typeof AdminRegisterSchema>; 
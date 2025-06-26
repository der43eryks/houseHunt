import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const validateRequest = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      });
    }

    req.body = value;
    return next();
  };
};

// Validation schemas
export const listingSchema = Joi.object({
  title: Joi.string().required().min(10).max(255),
  description: Joi.string().required().min(20),
  roomType: Joi.string().valid('Single', 'Bedsitter', 'Two-bedroom', 'Other').required(),
  stayTwoPeople: Joi.boolean().required(),
  price: Joi.number().positive().required(),
  paymentFrequency: Joi.string().valid('Monthly', 'Semester', 'Flexible').required(),
  locationText: Joi.string().required().min(10),
  areaNickname: Joi.string().optional(),
  tags: Joi.array().items(Joi.string()).optional(),
  amenities: Joi.array().items(Joi.string()).required(),
  isSecureArea: Joi.boolean().required(),
  agentPhone: Joi.string().required().pattern(/^\+254\d{9}$/),
  agentWhatsApp: Joi.string().optional().pattern(/^\+254\d{9}$/),
  agentFacebook: Joi.string().optional().uri(),
  available: Joi.boolean().required()
});

export const inquirySchema = Joi.object({
  houseId: Joi.string().required(),
  name: Joi.string().required().min(2).max(100),
  phone: Joi.string().required().pattern(/^\+254\d{9}$/),
  message: Joi.string().required().min(10),
  preferredVisitTime: Joi.string().optional()
});

export const feedbackSchema = Joi.object({
  listingId: Joi.string().optional(),
  name: Joi.string().required().min(2).max(100),
  email: Joi.string().email().required(),
  rating: Joi.number().integer().min(1).max(5).required(),
  message: Joi.string().required().min(10)
});

export const adminLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required().min(6)
});

export const adminRegistrationSchema = Joi.object({
  id: Joi.string().required().pattern(/^[1-9]\d{7}$/).message('ID must be exactly 8 digits and cannot start with 0'),
  username: Joi.string().required().min(2).max(100),
  email: Joi.string().email().required(),
  phone: Joi.string().required().pattern(/^\+254\d{9}$/).message('Phone number must be in Kenyan format: +254XXXXXXXXX'),
  password: Joi.string().required().min(8).max(16).message('Password must be between 8 and 16 characters')
});

export const helpDeskSchema = Joi.object({
  name: Joi.string().required(),
  phone: Joi.string().required().pattern(/^\+254\d{9}$/),
  whatsappLink: Joi.string().required().uri(),
  email: Joi.string().email().required(),
  facebook: Joi.string().required().uri(),
  availableHours: Joi.string().required(),
  contactFormEnabled: Joi.boolean().required()
}); 
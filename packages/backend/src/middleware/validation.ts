import { Request, Response, NextFunction } from 'express';
import { z, ZodSchema } from 'zod';
// @ts-ignore: monorepo import may fail in some tools, but works at runtime
import { ListingSchema, RegisterSchema, LoginSchema, InquirySchema, FeedbackSchema, HelpDeskSchema, AdminRegisterSchema } from '../../shared/types/validationSchemas';

export const validateRequestZod = (schema: ZodSchema<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error.errors.map(e => e.message).join(', ')
      });
    }
    req.body = result.data;
    return next();
  };
};

// Zod schemas for endpoints
export const listingSchema = ListingSchema;
export const adminRegistrationSchema = AdminRegisterSchema;
export const adminLoginSchema = LoginSchema;
export const inquirySchema = InquirySchema;
export const feedbackSchema = FeedbackSchema;
export const helpDeskSchema = HelpDeskSchema;

// TODO: Convert inquirySchema, feedbackSchema, helpDeskSchema to Zod and import here
// export const inquirySchema = ...
// export const feedbackSchema = ...
// export const helpDeskSchema = ... 
import { Router, Request, Response } from 'express';
import { ListingModel } from '../models/ListingModel';
import { AdminModel } from '../models/AdminModel';
import { InquiryModel } from '../models/InquiryModel';
import { HelpDeskModel } from '../models/HelpDeskModel';
import { FeedbackModel } from '../models/FeedbackModel';
import { authenticateToken, requireRole, generateToken } from '../middleware/auth';
import { validateRequestZod, listingSchema, adminLoginSchema, adminRegistrationSchema, helpDeskSchema, inquirySchema, feedbackSchema } from '../middleware/validation';
const multer = require('multer');
const path = require('path');
import { sseManager } from '../middleware/sse';

const router = Router();

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (_req: any, file: any, cb: (arg0: null, arg1: string) => void) => {
    cb(null, 'uploads/');
  },
  filename: (req: any, file: { fieldname: string; originalname: any; }, cb: (arg0: null, arg1: string) => void) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req: any, file: { mimetype: string; }, cb: (arg0: Error | null, arg1: boolean | undefined) => void) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Add at the top of the file
const loginAttempts: Record<string, { count: number, lastAttempt: number, lockUntil?: number }> = {};
const MAX_ATTEMPTS = 5;
const LOCK_TIME = 15 * 60 * 1000; // 15 minutes

// Admin authentication (login)
router.post('/login', validateRequestZod(adminLoginSchema), async (req: Request, res: Response) => {
  const identifier = req.body.email || req.body.id;
  const now = Date.now();
  const attempt = loginAttempts[identifier] || { count: 0, lastAttempt: 0 };

  // Check if locked out
  if (attempt.lockUntil && now < attempt.lockUntil) {
    const waitMinutes = Math.ceil((attempt.lockUntil - now) / 60000);
    return res.status(429).json({
      success: false,
      error: `Too many failed login attempts. Please try again after ${waitMinutes} minute(s).`
    });
  }

  try {
    const admin = await AdminModel.verifyLogin(req.body);
    if (!admin) {
      // Increment failed attempts
      attempt.count += 1;
      attempt.lastAttempt = now;
      if (attempt.count >= MAX_ATTEMPTS) {
        attempt.lockUntil = now + LOCK_TIME;
      }
      loginAttempts[identifier] = attempt;
      return res.status(401).json({ 
        success: false, 
        error: attempt.count >= MAX_ATTEMPTS
          ? `Too many failed login attempts. Please try again after ${Math.ceil(LOCK_TIME / 60000)} minutes.`
          : 'Invalid credentials' 
      });
    }

    // Reset on successful login
    delete loginAttempts[identifier];

    const token = generateToken(admin.id);
    const { passwordHash, ...adminWithoutPassword } = admin;

    // Set JWT as HttpOnly, Secure cookie
    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    return res.json({
      success: true,
      data: {
        admin: adminWithoutPassword
      }
    });
  } catch (error) {
    console.error('Server error in POST /login:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Login failed' 
    });
  }
});

// Admin registration
router.post('/register', validateRequestZod(adminRegistrationSchema), async (req: Request, res: Response) => {
  try {
    // Check if admin with this email already exists
    const existingAdmin = await AdminModel.getByEmail(req.body.email);
    if (existingAdmin) {
      return res.status(400).json({ 
        success: false, 
        error: 'Admin with this email already exists' 
      });
    }

    // Check if admin with this ID already exists
    const existingAdminById = await AdminModel.getById(req.body.id);
    if (existingAdminById) {
      return res.status(400).json({ 
        success: false, 
        error: 'Admin with this ID already exists' 
      });
    }

    const adminData = {
      id: req.body.id,
      username: req.body.username,
      email: req.body.email,
      phone: req.body.phone,
      passwordHash: req.body.password
    };

    const admin = await AdminModel.create(adminData);
    const { passwordHash, ...adminWithoutPassword } = admin;

    return res.status(201).json({
      success: true,
      data: adminWithoutPassword,
      message: 'Admin registered successfully'
    });
  } catch (error) {
    console.error('Server error in POST /register:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Registration failed' 
    });
  }
});

// Get admin profile
router.get('/profile', authenticateToken, async (req: any, res: Response) => {
  try {
    const { passwordHash, ...adminWithoutPassword } = req.admin;
    return res.json({
      success: true,
      data: adminWithoutPassword
    });
  } catch (error) {
    console.error('Server error in GET /profile:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to get profile' 
    });
  }
});

// Update admin profile
router.put('/profile', authenticateToken, async (req: any, res: Response) => {
  try {
    const admin = await AdminModel.updateProfile(req.admin.id, req.body);
    if (!admin) {
      return res.status(404).json({ 
        success: false, 
        error: 'Admin not found' 
      });
    }

    const { passwordHash, ...adminWithoutPassword } = admin;
    return res.json({
      success: true,
      data: adminWithoutPassword
    });
  } catch (error) {
    console.error('Server error in PUT /profile:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to update profile' 
    });
  }
});

// Change password
router.put('/change-password', authenticateToken, async (req: any, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // Verify current password
    const admin = await AdminModel.getById(req.admin.id);
    if (!admin) {
      return res.status(404).json({ 
        success: false, 
        error: 'Admin not found' 
      });
    }

    const isValidPassword = await require('bcryptjs').compare(currentPassword, admin.passwordHash);
    if (!isValidPassword) {
      return res.status(400).json({ 
        success: false, 
        error: 'Current password is incorrect' 
      });
    }

    const success = await AdminModel.changePassword(req.admin.id, newPassword);
    if (!success) {
      return res.status(500).json({ 
        success: false, 
        error: 'Failed to change password' 
      });
    }

    return res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Server error in PUT /change-password:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to change password' 
    });
  }
});

// Get all listings (admin view, can see all)
router.get('/listings', authenticateToken, async (req: Request, res: Response) => {
  try {
    // Robust parameter validation and sanitization
    const page = Number.isFinite(Number(req.query.page)) && Number(req.query.page) > 0 ? Number(req.query.page) : 1;
    const limit = Number.isFinite(Number(req.query.limit)) && Number(req.query.limit) > 0 ? Number(req.query.limit) : 10;
    // Set today's date as default for createdAfter
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const todayStr = `${yyyy}-${mm}-${dd}`;
    const filters = {
      roomType: typeof req.query.roomType === 'string' ? req.query.roomType : '',
      minPrice: req.query.minPrice && !isNaN(Number(req.query.minPrice)) ? Number(req.query.minPrice) : 0,
      maxPrice: req.query.maxPrice && !isNaN(Number(req.query.maxPrice)) ? Number(req.query.maxPrice) : 1000000,
      paymentFrequency: typeof req.query.paymentFrequency === 'string' ? req.query.paymentFrequency : '',
      location: typeof req.query.location === 'string' ? req.query.location : '',
      isSecureArea: req.query.isSecureArea === 'true',
      available: req.query.available === 'true',
      search: typeof req.query.search === 'string' ? req.query.search : '',
      minRating: req.query.minRating && !isNaN(Number(req.query.minRating)) ? Number(req.query.minRating) : 0,
      createdAfter: typeof req.query.createdAfter === 'string' ? req.query.createdAfter : todayStr
    };

    const result = await ListingModel.getAll(filters, page, limit);
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Server error in GET /listings:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch listings' 
    });
  }
});

// Create a new listing
router.post('/listings', authenticateToken, upload.array('images', 5), async (req: any, res: Response) => {
  try {
    // Ensure all booleans are 0/1 and all fields have defaults
    const body = {
      ...req.body,
      stayTwoPeople: req.body.stayTwoPeople === 'true' ? 1 : 0,
      isSecureArea: req.body.isSecureArea === 'true' ? 1 : 0,
      available: req.body.available === 'true' ? 1 : 0,
      price: req.body.price ? Number(req.body.price) : 0,
      tags: Array.isArray(req.body.tags) ? req.body.tags : [],
      images: Array.isArray(req.body.images) ? req.body.images : [],
      amenities: Array.isArray(req.body.amenities) ? req.body.amenities : [],
      status: req.body.status || 'published',
      paymentFrequency: req.body.paymentFrequency || 'monthly',
      locationText: req.body.locationText || '',
      areaNickname: req.body.areaNickname || '',
      agentPhone: req.body.agentPhone || '',
      agentWhatsApp: req.body.agentWhatsApp || '',
      agentFacebook: req.body.agentFacebook || ''
    };
    const listing = await ListingModel.create(body);
    
    // Send notification to all clients about new listing
    sseManager.sendToAll('client', {
      type: 'new_listing',
      data: listing
    });
    
    return res.status(201).json({
      success: true,
      data: listing
    });
  } catch (error) {
    console.error('Server error in POST /listings:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to create listing' 
    });
  }
});

// Update a listing
router.put('/listings/:id', authenticateToken, validateRequestZod(listingSchema), async (req: Request, res: Response) => {
  try {
    // Ensure all booleans are 0/1 and all fields have defaults
    const body = {
      ...req.body,
      stayTwoPeople: req.body.stayTwoPeople === 'true' ? 1 : 0,
      isSecureArea: req.body.isSecureArea === 'true' ? 1 : 0,
      available: req.body.available === 'true' ? 1 : 0,
      price: req.body.price ? Number(req.body.price) : 0,
      tags: Array.isArray(req.body.tags) ? req.body.tags : [],
      images: Array.isArray(req.body.images) ? req.body.images : [],
      amenities: Array.isArray(req.body.amenities) ? req.body.amenities : [],
      status: req.body.status || 'published',
      paymentFrequency: req.body.paymentFrequency || 'monthly',
      locationText: req.body.locationText || '',
      areaNickname: req.body.areaNickname || '',
      agentPhone: req.body.agentPhone || '',
      agentWhatsApp: req.body.agentWhatsApp || '',
      agentFacebook: req.body.agentFacebook || ''
    };
    const listing = await ListingModel.update(req.params.id, body);
    if (!listing) {
      return res.status(404).json({ 
        success: false, 
        error: 'Listing not found' 
      });
    }
    return res.json({
      success: true,
      data: listing
    });
  } catch (error) {
    console.error('Server error in PUT /listings/:id:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to update listing' 
    });
  }
});

// Delete a listing
router.delete('/listings/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const success = await ListingModel.delete(req.params.id);
    if (!success) {
      return res.status(404).json({ 
        success: false, 
        error: 'Listing not found' 
      });
    }

    return res.json({
      success: true,
      message: 'Listing deleted successfully'
    });
  } catch (error) {
    console.error('Server error in DELETE /listings/:id:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to delete listing' 
    });
  }
});

// Upload images for a listing
router.post('/listings/:id/images', authenticateToken, upload.array('images', 5), async (req: Request, res: Response) => {
  try {
    if (!(req as any).files || (req as any).files.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'No images uploaded' 
      });
    }

    const imageUrls = (req as any).files.map((file: { filename: any; }) => `/uploads/${file.filename}`);
    
    for (const imageUrl of imageUrls) {
      await ListingModel.addImage(req.params.id, imageUrl);
    }

    return res.json({
      success: true,
      data: { imageUrls }
    });
  } catch (error) {
    console.error('Server error in POST /listings/:id/images:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to upload images' 
    });
  }
});

// Mark listing as available/unavailable
router.patch('/listings/:id/availability', authenticateToken, async (req: Request, res: Response) => {
  try {
    // Ensure available is always a boolean and convert to 0/1 for MySQL
    const available = req.body.available === true || req.body.available === 'true';
    const success = await ListingModel.updateAvailability(req.params.id, available);
    if (!success) {
      return res.status(404).json({ 
        success: false, 
        error: 'Listing not found' 
      });
    }
    return res.json({
      success: true,
      message: `Listing marked as ${available ? 'available' : 'unavailable'}`
    });
  } catch (error) {
    console.error('Server error in PATCH /listings/:id/availability:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to update availability' 
    });
  }
});

// Get all inquiries
router.get('/inquiries', authenticateToken, async (req: Request, res: Response) => {
  try {
    const page = Number.isFinite(Number(req.query.page)) && Number(req.query.page) > 0 ? Number(req.query.page) : 1;
    const limit = Number.isFinite(Number(req.query.limit)) && Number(req.query.limit) > 0 ? Number(req.query.limit) : 20;
    const result = await InquiryModel.getAll(page, limit);
    return res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Server error in GET /inquiries:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch inquiries' 
    });
  }
});

// Respond to an inquiry
router.post('/inquiries/:id/respond', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const success = await InquiryModel.updateStatus(req.params.id, status);
    
    if (!success) {
      return res.status(404).json({ 
        success: false, 
        error: 'Inquiry not found' 
      });
    }

    return res.json({
      success: true,
      message: 'Inquiry status updated successfully'
    });
  } catch (error) {
    console.error('Server error in POST /inquiries/:id/respond:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to update inquiry status' 
    });
  }
});

// Get help desk info
router.get('/helpdesk', authenticateToken, async (req: Request, res: Response) => {
  try {
    const helpDesk = await HelpDeskModel.get();
    return res.json({
      success: true,
      data: helpDesk
    });
  } catch (error) {
    console.error('Server error in GET /helpdesk:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch help desk info' 
    });
  }
});

// Update help desk info
router.put('/helpdesk', authenticateToken, validateRequestZod(helpDeskSchema), async (req: Request, res: Response) => {
  try {
    const helpDesk = await HelpDeskModel.update(req.body);
    return res.json({
      success: true,
      data: helpDesk
    });
  } catch (error) {
    console.error('Server error in PUT /helpdesk:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to update help desk info' 
    });
  }
});

// Get all feedbacks
router.get('/feedbacks', authenticateToken, async (req: Request, res: Response) => {
  try {
    const page = Number.isFinite(Number(req.query.page)) && Number(req.query.page) > 0 ? Number(req.query.page) : 1;
    const limit = Number.isFinite(Number(req.query.limit)) && Number(req.query.limit) > 0 ? Number(req.query.limit) : 20;
    const result = await FeedbackModel.getAll(page, limit);
    return res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Server error in GET /feedbacks:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch feedbacks' 
    });
  }
});

// Get dashboard stats
router.get('/stats', authenticateToken, async (req: Request, res: Response) => {
  try {
    const [listings, inquiries, feedbacks] = await Promise.all([
      ListingModel.getAll({}, 1, 1000),
      InquiryModel.getAll(1, 1000),
      FeedbackModel.getAll(1, 1000)
    ]);

    const pendingInquiries = await InquiryModel.getPendingCount();
    const feedbackStats = await FeedbackModel.getStats();

    return res.json({
      success: true,
      data: {
        totalListings: listings.total,
        availableListings: listings.data.filter(l => l.available).length,
        totalInquiries: inquiries.total,
        pendingInquiries,
        totalFeedbacks: feedbacks.total,
        averageRating: feedbackStats.averageRating,
        ratingDistribution: feedbackStats.ratingDistribution
      }
    });
  } catch (error) {
    console.error('Server error in GET /stats:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch stats' 
    });
  }
});

// Admin logout
router.post('/logout', (req: Request, res: Response) => {
  res.clearCookie('access_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  });
  return res.json({ success: true, message: 'Logged out' });
});

export default router; 
import { Router, Request, Response } from 'express';
import { ListingModel } from '../models/ListingModel';
import { AdminModel } from '../models/AdminModel';
import { InquiryModel } from '../models/InquiryModel';
import { HelpDeskModel } from '../models/HelpDeskModel';
import { FeedbackModel } from '../models/FeedbackModel';
import { authenticateToken, requireRole, generateToken } from '../middleware/auth';
import { validateRequest, listingSchema, inquirySchema, adminLoginSchema, adminRegistrationSchema, helpDeskSchema } from '../middleware/validation';
import multer from 'multer';
import path from 'path';

const router = Router();

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Admin authentication (login)
router.post('/login', validateRequest(adminLoginSchema), async (req: Request, res: Response) => {
  try {
    const admin = await AdminModel.verifyLogin(req.body);
    if (!admin) {
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid credentials' 
      });
    }

    const token = generateToken(admin.id);
    const { passwordHash, ...adminWithoutPassword } = admin;

    return res.json({
      success: true,
      data: {
        token,
        admin: adminWithoutPassword
      }
    });
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      error: 'Login failed' 
    });
  }
});

// Admin registration
router.post('/register', validateRequest(adminRegistrationSchema), async (req: Request, res: Response) => {
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
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to change password' 
    });
  }
});

// Get all listings (admin view, can see all)
router.get('/listings', authenticateToken, async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const filters = {
      roomType: req.query.roomType as string,
      minPrice: req.query.minPrice ? parseInt(req.query.minPrice as string) : undefined,
      maxPrice: req.query.maxPrice ? parseInt(req.query.maxPrice as string) : undefined,
      paymentFrequency: req.query.paymentFrequency as string,
      location: req.query.location as string,
      isSecureArea: req.query.isSecureArea === 'true',
      available: req.query.available === 'true',
      search: req.query.search as string
    };

    const result = await ListingModel.getAll(filters, page, limit);
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch listings' 
    });
  }
});

// Create a new listing
router.post('/listings', authenticateToken, validateRequest(listingSchema), async (req: Request, res: Response) => {
  try {
    const listing = await ListingModel.create(req.body);
    res.status(201).json({
      success: true,
      data: listing
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to create listing' 
    });
  }
});

// Update a listing
router.put('/listings/:id', authenticateToken, validateRequest(listingSchema), async (req: Request, res: Response) => {
  try {
    const listing = await ListingModel.update(req.params.id, req.body);
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
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to delete listing' 
    });
  }
});

// Upload images for a listing
router.post('/listings/:id/images', authenticateToken, upload.array('images', 5), async (req: Request, res: Response) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'No images uploaded' 
      });
    }

    const imageUrls = (req.files as any[]).map(file => `/uploads/${file.filename}`);
    
    for (const imageUrl of imageUrls) {
      await ListingModel.addImage(req.params.id, imageUrl);
    }

    return res.json({
      success: true,
      data: { imageUrls }
    });
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to upload images' 
    });
  }
});

// Mark listing as available/unavailable
router.patch('/listings/:id/availability', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { available } = req.body;
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
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to update availability' 
    });
  }
});

// Get all inquiries
router.get('/inquiries', authenticateToken, async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const result = await InquiryModel.getAll(page, limit);
    
    return res.json({
      success: true,
      data: result
    });
  } catch (error) {
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
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch help desk info' 
    });
  }
});

// Update help desk info
router.put('/helpdesk', authenticateToken, validateRequest(helpDeskSchema), async (req: Request, res: Response) => {
  try {
    const helpDesk = await HelpDeskModel.update(req.body);
    return res.json({
      success: true,
      data: helpDesk
    });
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to update help desk info' 
    });
  }
});

// Get all feedbacks
router.get('/feedbacks', authenticateToken, async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const result = await FeedbackModel.getAll(page, limit);
    
    return res.json({
      success: true,
      data: result
    });
  } catch (error) {
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
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch stats' 
    });
  }
});

export default router; 
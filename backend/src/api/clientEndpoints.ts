import { Router, Request, Response } from 'express';
import { ListingModel } from '../models/ListingModel';
import { InquiryModel } from '../models/InquiryModel';
import { HelpDeskModel } from '../models/HelpDeskModel';
import { FeedbackModel } from '../models/FeedbackModel';
import { validateRequest, inquirySchema, feedbackSchema } from '../middleware/validation';

const router = Router();

// Get all listings (public view)
router.get('/listings', async (req: Request, res: Response) => {
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
    return res.json({
      success: true,
      data: result
    });
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch listings' 
    });
  }
});

// Get a specific listing
router.get('/listings/:id', async (req: Request, res: Response) => {
  try {
    const listing = await ListingModel.getById(req.params.id);
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
      error: 'Failed to fetch listing' 
    });
  }
});

// Submit inquiry/request visit
router.post('/inquiries', validateRequest(inquirySchema), async (req: Request, res: Response) => {
  try {
    const inquiry = await InquiryModel.create(req.body);
    return res.status(201).json({
      success: true,
      data: inquiry,
      message: 'Inquiry submitted successfully. We will contact you soon!'
    });
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to submit inquiry' 
    });
  }
});

// Get help desk info
router.get('/helpdesk', async (req: Request, res: Response) => {
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

// Submit feedback
router.post('/feedbacks', validateRequest(feedbackSchema), async (req: Request, res: Response) => {
  try {
    const feedback = await FeedbackModel.create(req.body);
    return res.status(201).json({
      success: true,
      data: feedback,
      message: 'Thank you for your feedback!'
    });
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to submit feedback' 
    });
  }
});

// Get featured listings (secure areas first, then by rating)
router.get('/listings/featured', async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 6;
    const filters = {
      available: true,
      isSecureArea: true
    };

    const secureListings = await ListingModel.getAll(filters, 1, limit);
    
    // If we don't have enough secure listings, get more
    if (secureListings.data.length < limit) {
      const remainingLimit = limit - secureListings.data.length;
      const allListings = await ListingModel.getAll({ available: true }, 1, remainingLimit);
      secureListings.data = [...secureListings.data, ...allListings.data];
    }

    return res.json({
      success: true,
      data: secureListings.data.slice(0, limit)
    });
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch featured listings' 
    });
  }
});

// Get search suggestions
router.get('/search/suggestions', async (req: Request, res: Response) => {
  try {
    const query = req.query.q as string;
    if (!query || query.length < 2) {
      return res.json({
        success: true,
        data: []
      });
    }

    // Get listings that match the search query
    const listings = await ListingModel.getAll({ search: query }, 1, 10);
    
    // Extract unique locations and area nicknames
    const suggestions = new Set<string>();
    listings.data.forEach(listing => {
      if (listing.areaNickname) {
        suggestions.add(listing.areaNickname);
      }
      if (listing.locationText) {
        const locationParts = listing.locationText.split(',').map(part => part.trim());
        locationParts.forEach(part => {
          if (part.toLowerCase().includes(query.toLowerCase())) {
            suggestions.add(part);
          }
        });
      }
    });

    return res.json({
      success: true,
      data: Array.from(suggestions).slice(0, 10)
    });
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to get search suggestions' 
    });
  }
});

// Get statistics for homepage
router.get('/stats', async (req: Request, res: Response) => {
  try {
    const [listings, feedbacks] = await Promise.all([
      ListingModel.getAll({ available: true }, 1, 1000),
      FeedbackModel.getStats()
    ]);

    return res.json({
      success: true,
      data: {
        totalListings: listings.total,
        averageRating: feedbacks.averageRating,
        totalFeedbacks: feedbacks.total
      }
    });
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch statistics' 
    });
  }
});

export default router; 
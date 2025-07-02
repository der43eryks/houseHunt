import { Router } from 'express';
import { pool } from '../config/database';

const router = Router();

// Public: Get all published and available listings
router.get('/listings', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT id, title, description, price, images, location_text AS locationText, room_type AS roomType, area_nickname AS areaNickname, tags, amenities
       FROM listings
       WHERE status = 'published' AND available = 1`
    );
    // Parse JSON fields
    const listings = (rows as any[]).map(row => ({
      ...row,
      tags: JSON.parse(row.tags || '[]'),
      images: JSON.parse(row.images || '[]'),
      amenities: JSON.parse(row.amenities || '[]')
    }));
    res.json({ success: true, data: listings });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch listings' });
  }
});

export default router; 
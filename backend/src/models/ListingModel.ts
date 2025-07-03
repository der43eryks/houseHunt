import pool from '../config/database';
import { Listing, CreateListingRequest, UpdateListingRequest, ListingFilters, PaginatedResponse } from '../../../shared/types/db_types';
import { v4 as uuidv4 } from 'uuid';
import { isValid, parse, format } from 'date-fns';

export class ListingModel {
  // Get all listings with filters and pagination
  static async getAll(filters: ListingFilters = {}, page: number = 1, limit: number = 10): Promise<PaginatedResponse<Listing>> {
    // Defensive: ensure limit and offset are valid integers
    const safeLimit = parseInt(limit as any) > 0 ? parseInt(limit as any) : 10;
    const safePage = parseInt(page as any) > 0 ? parseInt(page as any) : 1;
    const offset = (safePage - 1) * safeLimit;
    let whereClause = 'WHERE 1=1';
    const params: any[] = [];

    // Apply filters
    if (filters.roomType) {
      whereClause += ' AND room_type = ?';
      params.push(filters.roomType);
    }

    if (filters.minPrice) {
      whereClause += ' AND price >= ?';
      params.push(filters.minPrice);
    }

    if (filters.maxPrice) {
      whereClause += ' AND price <= ?';
      params.push(filters.maxPrice);
    }

    if (filters.paymentFrequency) {
      whereClause += ' AND payment_frequency = ?';
      params.push(filters.paymentFrequency);
    }

    if (filters.location) {
      whereClause += ' AND (location_text LIKE ? OR area_nickname LIKE ?)';
      params.push(`%${filters.location}%`, `%${filters.location}%`);
    }

    if (filters.isSecureArea !== undefined) {
      whereClause += ' AND is_secure_area = ?';
      params.push(filters.isSecureArea ? 1 : 0);
    }

    if (filters.available !== undefined) {
      whereClause += ' AND available = ?';
      params.push(filters.available ? 1 : 0);
    }

    if (filters.search) {
      whereClause += ' AND (title LIKE ? OR description LIKE ? OR location_text LIKE ?)';
      params.push(`%${filters.search}%`, `%${filters.search}%`, `%${filters.search}%`);
    }

    if (filters.minRating !== undefined) {
      whereClause += ' AND rating >= ?';
      params.push(filters.minRating);
    }

    if (filters.createdAfter) {
      // Strict validation for MySQL date format
      const datePattern = /^\d{4}-\d{2}-\d{2}$/;
      const datetimePattern = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
      let ts = filters.createdAfter;
      if (datePattern.test(ts)) {
        ts = `${ts} 00:00:00`;
      } else if (!datetimePattern.test(ts)) {
        throw new Error("Invalid 'createdAfter' date format. Use 'YYYY-MM-DD' or 'YYYY-MM-DD HH:MM:SS'.");
      }
      // Optionally, check if it's a valid date
      const parsed = parse(ts, 'yyyy-MM-dd HH:mm:ss', new Date());
      if (!isValid(parsed)) {
        throw new Error("'createdAfter' is not a valid date.");
      }
      whereClause += ' AND created_at >= ?';
      params.push(ts);
    }

    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM listings ${whereClause}`;
    const [countResult] = await pool.execute(countQuery, params);
    const total = (countResult as any)[0].total;

    // Add limit and offset at the end
    params.push(safeLimit, offset);
    // Get listings with pagination
    const query = `
      SELECT * FROM listings 
      ${whereClause}
      ORDER BY is_secure_area DESC, rating DESC, created_at DESC
      LIMIT ? OFFSET ?
    `.trim();
    // Log for debugging
    console.log('[ListingModel.getAll] SQL:', query);
    console.log('[ListingModel.getAll] Params:', params);
    console.log('[ListingModel.getAll] Param Types:', params.map(v => typeof v));
    const [rows] = await pool.execute(query, params);
    
    const listings = (rows as any[]).map(row => ({
      ...row,
      tags: JSON.parse(row.tags || '[]'),
      images: JSON.parse(row.images || '[]'),
      amenities: JSON.parse(row.amenities || '[]')
    }));

    return {
      data: listings,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / safeLimit)
    };
  }

  // Get single listing by ID
  static async getById(id: string): Promise<Listing | null> {
    const query = 'SELECT * FROM listings WHERE id = ?';
    const [rows] = await pool.execute(query, [id]);
    
    if ((rows as any[]).length === 0) {
      return null;
    }

    const row = (rows as any[])[0];
    return {
      ...row,
      tags: JSON.parse(row.tags || '[]'),
      images: JSON.parse(row.images || '[]'),
      amenities: JSON.parse(row.amenities || '[]')
    };
  }

  // Create new listing
  static async create(data: CreateListingRequest): Promise<Listing> {
    const id = uuidv4();
    const query = `
      INSERT INTO listings (
        id, title, description, room_type, stay_two_people, price, 
        payment_frequency, location_text, area_nickname, tags, images, 
        amenities, is_secure_area, agent_phone, agent_whatsapp, 
        agent_facebook, available, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      id,
      data.title,
      data.description,
      data.roomType,
      data.stayTwoPeople ? 1 : 0,
      data.price,
      data.paymentFrequency,
      data.locationText,
      data.areaNickname,
      JSON.stringify(data.tags),
      JSON.stringify(data.images || []),
      JSON.stringify(data.amenities),
      data.isSecureArea ? 1 : 0,
      data.agentPhone,
      data.agentWhatsApp,
      data.agentFacebook,
      data.available ? 1 : 0,
      data.status || 'published'
    ];

    await pool.execute(query, params);
    return this.getById(id) as Promise<Listing>;
  }

  // Update listing
  static async update(id: string, data: UpdateListingRequest): Promise<Listing | null> {
    const existing = await this.getById(id);
    if (!existing) {
      return null;
    }

    const updateFields: string[] = [];
    const params: any[] = [];

    if (data.title !== undefined) {
      updateFields.push('title = ?');
      params.push(data.title);
    }

    if (data.description !== undefined) {
      updateFields.push('description = ?');
      params.push(data.description);
    }

    if (data.roomType !== undefined) {
      updateFields.push('room_type = ?');
      params.push(data.roomType);
    }

    if (data.stayTwoPeople !== undefined) {
      updateFields.push('stay_two_people = ?');
      params.push(data.stayTwoPeople ? 1 : 0);
    }

    if (data.price !== undefined) {
      updateFields.push('price = ?');
      params.push(data.price);
    }

    if (data.paymentFrequency !== undefined) {
      updateFields.push('payment_frequency = ?');
      params.push(data.paymentFrequency);
    }

    if (data.locationText !== undefined) {
      updateFields.push('location_text = ?');
      params.push(data.locationText);
    }

    if (data.areaNickname !== undefined) {
      updateFields.push('area_nickname = ?');
      params.push(data.areaNickname);
    }

    if (data.tags !== undefined) {
      updateFields.push('tags = ?');
      params.push(JSON.stringify(data.tags));
    }

    if (data.images !== undefined) {
      updateFields.push('images = ?');
      params.push(JSON.stringify(data.images));
    }

    if (data.amenities !== undefined) {
      updateFields.push('amenities = ?');
      params.push(JSON.stringify(data.amenities));
    }

    if (data.isSecureArea !== undefined) {
      updateFields.push('is_secure_area = ?');
      params.push(data.isSecureArea ? 1 : 0);
    }

    if (data.agentPhone !== undefined) {
      updateFields.push('agent_phone = ?');
      params.push(data.agentPhone);
    }

    if (data.agentWhatsApp !== undefined) {
      updateFields.push('agent_whatsapp = ?');
      params.push(data.agentWhatsApp);
    }

    if (data.agentFacebook !== undefined) {
      updateFields.push('agent_facebook = ?');
      params.push(data.agentFacebook);
    }

    if (data.available !== undefined) {
      updateFields.push('available = ?');
      params.push(data.available ? 1 : 0);
    }

    if (data.status !== undefined) {
      updateFields.push('status = ?');
      params.push(data.status);
    }

    if (updateFields.length === 0) {
      return existing;
    }

    updateFields.push('updated_at = CURRENT_TIMESTAMP');
    params.push(id);

    const query = `UPDATE listings SET ${updateFields.join(', ')} WHERE id = ?`;
    await pool.execute(query, params);

    return this.getById(id);
  }

  // Delete listing
  static async delete(id: string): Promise<boolean> {
    const query = 'DELETE FROM listings WHERE id = ?';
    const [result] = await pool.execute(query, [id]);
    return (result as any).affectedRows > 0;
  }

  // Update availability
  static async updateAvailability(id: string, available: boolean): Promise<boolean> {
    const query = 'UPDATE listings SET available = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
    const [result] = await pool.execute(query, [available ? 1 : 0, id]);
    return (result as any).affectedRows > 0;
  }

  // Add image to listing
  static async addImage(id: string, imageUrl: string): Promise<boolean> {
    const listing = await this.getById(id);
    if (!listing) {
      return false;
    }

    const images = [...listing.images, imageUrl];
    const query = 'UPDATE listings SET images = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
    const [result] = await pool.execute(query, [JSON.stringify(images), id]);
    return (result as any).affectedRows > 0;
  }

  // Remove image from listing
  static async removeImage(id: string, imageUrl: string): Promise<boolean> {
    const listing = await this.getById(id);
    if (!listing) {
      return false;
    }

    const images = listing.images.filter(img => img !== imageUrl);
    const query = 'UPDATE listings SET images = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
    const [result] = await pool.execute(query, [JSON.stringify(images), id]);
    return (result as any).affectedRows > 0;
  }

  // Mark a listing as booked
  static async markAsBooked(id: string): Promise<boolean> {
    const query = 'UPDATE listings SET status = ?, available = 0 WHERE id = ?';
    const [result] = await pool.execute(query, ['booked', id]);
    return (result as any).affectedRows > 0;
  }
} 
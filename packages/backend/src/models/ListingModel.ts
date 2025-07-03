import pool from '../config/database';
import { Listing, CreateListingRequest, UpdateListingRequest, ListingFilters, PaginatedResponse } from '../../../shared/types/db_types';
import { v4 as uuidv4 } from 'uuid';
import { isValid, parse, format, subMonths } from 'date-fns';

export class ListingModel {
  // Utility function to sanitize LIKE search terms
  private static sanitizeLikeInput(input: string): string {
    return input.replace(/[%_]/g, '\\$&');
  }

  // Utility function to safely parse JSON
  private static safeJsonParse(jsonString: string | null, fallback: any = []): any {
    if (!jsonString) return fallback;
    try {
      return JSON.parse(jsonString);
    } catch (error) {
      console.error('[ListingModel] JSON parse error:', error);
      return fallback;
    }
  }

  // Utility function to validate and convert pagination parameters
  private static validatePaginationParams(page: any, limit: any): { page: number; limit: number; offset: number } {
    let safePage = 1;
    let safeLimit = 10;

    if (typeof page === 'number' && page > 0) {
      safePage = Math.floor(page);
    } else if (typeof page === 'string' && !isNaN(Number(page))) {
      const parsed = Number(page);
      if (parsed > 0) safePage = Math.floor(parsed);
    }

    if (typeof limit === 'number' && limit > 0 && limit <= 100) {
      safeLimit = Math.floor(limit);
    } else if (typeof limit === 'string' && !isNaN(Number(limit))) {
      const parsed = Number(limit);
      if (parsed > 0 && parsed <= 100) safeLimit = Math.floor(parsed);
    }

    const offset = (safePage - 1) * safeLimit;
    return { page: safePage, limit: safeLimit, offset };
  }

  // Utility function to validate date format
  private static validateDateFilter(dateStr: string): string {
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    const datetimePattern = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
    
    let timestamp = dateStr;
    if (datePattern.test(timestamp)) {
      timestamp = `${timestamp} 00:00:00`;
    } else if (!datetimePattern.test(timestamp)) {
      throw new Error("Invalid date format. Use 'YYYY-MM-DD' or 'YYYY-MM-DD HH:MM:SS'.");
    }
    
    const parsed = parse(timestamp, 'yyyy-MM-dd HH:mm:ss', new Date());
    if (!isValid(parsed)) {
      throw new Error("Invalid date value.");
    }
    
    return timestamp;
  }

  // Transform database row to Listing object
  private static transformRow(row: any): Listing {
    return {
      ...row,
      tags: this.safeJsonParse(row.tags, []),
      images: this.safeJsonParse(row.images, []),
      amenities: this.safeJsonParse(row.amenities, [])
    };
  }

  // Get all listings with filters and pagination
  static async getAll(filters: ListingFilters = {}, page: number = 1, limit: number = 10): Promise<PaginatedResponse<Listing>> {
    try {
      const { page: safePage, limit: safeLimit, offset } = this.validatePaginationParams(page, limit);

      let whereClause = 'WHERE 1=1';
      const params: any[] = [];

      // Apply filters with proper validation
      if (filters.roomType && typeof filters.roomType === 'string') {
        whereClause += ' AND room_type = ?';
        params.push(filters.roomType);
      }

      if (filters.minPrice !== undefined && typeof filters.minPrice === 'number' && filters.minPrice >= 0) {
        whereClause += ' AND price >= ?';
        params.push(filters.minPrice);
      }

      if (filters.maxPrice !== undefined && typeof filters.maxPrice === 'number' && filters.maxPrice >= 0) {
        whereClause += ' AND price <= ?';
        params.push(filters.maxPrice);
      }

      if (filters.paymentFrequency && typeof filters.paymentFrequency === 'string') {
        whereClause += ' AND payment_frequency = ?';
        params.push(filters.paymentFrequency);
      }

      if (filters.location && typeof filters.location === 'string' && filters.location.trim()) {
        const sanitizedLocation = this.sanitizeLikeInput(filters.location.trim());
        whereClause += ' AND (location_text LIKE ? OR area_nickname LIKE ?)';
        params.push(`%${sanitizedLocation}%`, `%${sanitizedLocation}%`);
      }

      if (filters.isSecureArea !== undefined && typeof filters.isSecureArea === 'boolean') {
        whereClause += ' AND is_secure_area = ?';
        params.push(filters.isSecureArea ? 1 : 0);
      }

      if (filters.available !== undefined && typeof filters.available === 'boolean') {
        whereClause += ' AND available = ?';
        params.push(filters.available ? 1 : 0);
      }

      if (filters.search && typeof filters.search === 'string' && filters.search.trim()) {
        const sanitizedSearch = this.sanitizeLikeInput(filters.search.trim());
        whereClause += ' AND (title LIKE ? OR description LIKE ? OR location_text LIKE ?)';
        params.push(`%${sanitizedSearch}%`, `%${sanitizedSearch}%`, `%${sanitizedSearch}%`);
      }

      if (filters.minRating !== undefined && typeof filters.minRating === 'number' && filters.minRating >= 0) {
        whereClause += ' AND rating >= ?';
        params.push(filters.minRating);
      }

      // Default createdAfter to 1 month ago if not provided
      if (!filters.createdAfter) {
        const defaultDate = subMonths(new Date(), 1);
        filters.createdAfter = format(defaultDate, 'yyyy-MM-dd HH:mm:ss');
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
        const parsed = parse(ts, 'yyyy-MM-dd HH:mm:ss', new Date());
        if (!isValid(parsed)) {
          throw new Error("'createdAfter' is not a valid date.");
        }
        whereClause += ' AND created_at >= ?';
        params.push(ts);
      }

      // Use single query with SQL_CALC_FOUND_ROWS for better performance
      const query = `
        SELECT SQL_CALC_FOUND_ROWS * FROM listings 
        ${whereClause}
        ORDER BY is_secure_area DESC, rating DESC, created_at DESC
        LIMIT ? OFFSET ?
      `.trim();

      const finalParams = [...params, safeLimit, offset];

      // Execute main query
      const [rows] = await pool.execute(query, finalParams);
      
      // Get total count
      const [countResult] = await pool.execute('SELECT FOUND_ROWS() as total');
      const total = (countResult as any)[0].total;

      const listings = (rows as any[]).map(row => this.transformRow(row));

      return {
        data: listings,
        total,
        page: safePage,
        limit: safeLimit,
        totalPages: Math.ceil(total / safeLimit)
      };

    } catch (error) {
      console.error('[ListingModel.getAll] Error:', error);
      throw new Error('Failed to fetch listings');
    }
  }

  // Get single listing by ID
  static async getById(id: string): Promise<Listing | null> {
    try {
      if (!id || typeof id !== 'string') {
        return null;
      }

      const query = 'SELECT * FROM listings WHERE id = ?';
      const [rows] = await pool.execute(query, [id]);
      
      if ((rows as any[]).length === 0) {
        return null;
      }

      return this.transformRow((rows as any[])[0]);

    } catch (error) {
      console.error('[ListingModel.getById] Error:', error);
      throw new Error('Failed to fetch listing');
    }
  }

  // Create new listing
  static async create(data: CreateListingRequest): Promise<Listing> {
    try {
      // Validate required fields
      if (!data.title || !data.description || !data.roomType || data.price === undefined) {
        throw new Error('Missing required fields for listing creation');
      }

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
        data.stayTwoPeople === true ? 1 : 0,
        data.price,
        data.paymentFrequency || 'monthly',
        data.locationText || '',
        data.areaNickname || '',
        JSON.stringify(Array.isArray(data.tags) ? data.tags : []),
        JSON.stringify(Array.isArray(data.images) ? data.images : []),
        JSON.stringify(Array.isArray(data.amenities) ? data.amenities : []),
        data.isSecureArea === true ? 1 : 0,
        data.agentPhone || null,
        data.agentWhatsApp || null,
        data.agentFacebook || null,
        data.available === false ? 0 : 1,
        data.status || 'published'
      ];

      await pool.execute(query, params);
      
      const newListing = await this.getById(id);
      if (!newListing) {
        throw new Error('Failed to retrieve created listing');
      }
      
      return newListing;

    } catch (error) {
      console.error('[ListingModel.create] Error:', error);
      throw new Error('Failed to create listing');
    }
  }

  // Update listing
  static async update(id: string, data: UpdateListingRequest): Promise<Listing | null> {
    try {
      if (!id || typeof id !== 'string') {
        return null;
      }

      const existing = await this.getById(id);
      if (!existing) {
        return null;
      }

      const updateFields: string[] = [];
      const params: any[] = [];

      // Build update query dynamically with proper validation
      if (data.title !== undefined && typeof data.title === 'string') {
        updateFields.push('title = ?');
        params.push(data.title);
      }

      if (data.description !== undefined && typeof data.description === 'string') {
        updateFields.push('description = ?');
        params.push(data.description);
      }

      if (data.roomType !== undefined && typeof data.roomType === 'string') {
        updateFields.push('room_type = ?');
        params.push(data.roomType);
      }

      if (data.stayTwoPeople !== undefined && typeof data.stayTwoPeople === 'boolean') {
        updateFields.push('stay_two_people = ?');
        params.push(data.stayTwoPeople ? 1 : 0);
      }

      if (data.price !== undefined && typeof data.price === 'number' && data.price >= 0) {
        updateFields.push('price = ?');
        params.push(data.price);
      }

      if (data.paymentFrequency !== undefined && typeof data.paymentFrequency === 'string') {
        updateFields.push('payment_frequency = ?');
        params.push(data.paymentFrequency);
      }

      if (data.locationText !== undefined && typeof data.locationText === 'string') {
        updateFields.push('location_text = ?');
        params.push(data.locationText);
      }

      if (data.areaNickname !== undefined && typeof data.areaNickname === 'string') {
        updateFields.push('area_nickname = ?');
        params.push(data.areaNickname);
      }

      if (data.tags !== undefined && Array.isArray(data.tags)) {
        updateFields.push('tags = ?');
        params.push(JSON.stringify(data.tags));
      }

      if (data.images !== undefined && Array.isArray(data.images)) {
        updateFields.push('images = ?');
        params.push(JSON.stringify(data.images));
      }

      if (data.amenities !== undefined && Array.isArray(data.amenities)) {
        updateFields.push('amenities = ?');
        params.push(JSON.stringify(data.amenities));
      }

      if (data.isSecureArea !== undefined && typeof data.isSecureArea === 'boolean') {
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

      if (data.available !== undefined && typeof data.available === 'boolean') {
        updateFields.push('available = ?');
        params.push(data.available ? 1 : 0);
      }

      if (data.status !== undefined && typeof data.status === 'string') {
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

      return await this.getById(id);

    } catch (error) {
      console.error('[ListingModel.update] Error:', error);
      throw new Error('Failed to update listing');
    }
  }

  // Delete listing
  static async delete(id: string): Promise<boolean> {
    try {
      if (!id || typeof id !== 'string') {
        return false;
      }

      const query = 'DELETE FROM listings WHERE id = ?';
      const [result] = await pool.execute(query, [id]);
      return (result as any).affectedRows > 0;

    } catch (error) {
      console.error('[ListingModel.delete] Error:', error);
      throw new Error('Failed to delete listing');
    }
  }

  // Update availability
  static async updateAvailability(id: string, available: boolean): Promise<boolean> {
    try {
      if (!id || typeof id !== 'string' || typeof available !== 'boolean') {
        return false;
      }

      const query = 'UPDATE listings SET available = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
      const [result] = await pool.execute(query, [available ? 1 : 0, id]);
      return (result as any).affectedRows > 0;

    } catch (error) {
      console.error('[ListingModel.updateAvailability] Error:', error);
      throw new Error('Failed to update availability');
    }
  }

  // Add image to listing
  static async addImage(id: string, imageUrl: string): Promise<boolean> {
    try {
      if (!id || typeof id !== 'string' || !imageUrl || typeof imageUrl !== 'string') {
        return false;
      }

      const listing = await this.getById(id);
      if (!listing) {
        return false;
      }

      const currentImages = Array.isArray(listing.images) ? listing.images : [];
      
      // Prevent duplicate images
      if (currentImages.includes(imageUrl)) {
        return true;
      }

      const images = [...currentImages, imageUrl];
      const query = 'UPDATE listings SET images = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
      const [result] = await pool.execute(query, [JSON.stringify(images), id]);
      return (result as any).affectedRows > 0;

    } catch (error) {
      console.error('[ListingModel.addImage] Error:', error);
      throw new Error('Failed to add image');
    }
  }

  // Remove image from listing
  static async removeImage(id: string, imageUrl: string): Promise<boolean> {
    try {
      if (!id || typeof id !== 'string' || !imageUrl || typeof imageUrl !== 'string') {
        return false;
      }

      const listing = await this.getById(id);
      if (!listing) {
        return false;
      }

      const currentImages = Array.isArray(listing.images) ? listing.images : [];
      const images = currentImages.filter(img => img !== imageUrl);
      
      const query = 'UPDATE listings SET images = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
      const [result] = await pool.execute(query, [JSON.stringify(images), id]);
      return (result as any).affectedRows > 0;

    } catch (error) {
      console.error('[ListingModel.removeImage] Error:', error);
      throw new Error('Failed to remove image');
    }
  }

  // Mark a listing as booked
  static async markAsBooked(id: string): Promise<boolean> {
    try {
      if (!id || typeof id !== 'string') {
        return false;
      }

      const query = 'UPDATE listings SET status = ?, available = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
      const [result] = await pool.execute(query, ['booked', id]);
      return (result as any).affectedRows > 0;

    } catch (error) {
      console.error('[ListingModel.markAsBooked] Error:', error);
      throw new Error('Failed to mark listing as booked');
    }
  }
}
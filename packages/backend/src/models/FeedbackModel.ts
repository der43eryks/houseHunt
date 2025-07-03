import pool from '../config/database';
import { Feedback, CreateFeedbackRequest } from '../../../shared/types/db_types';
import { v4 as uuidv4 } from 'uuid';

export class FeedbackModel {
  // Get all feedback with pagination
  static async getAll(page: number = 1, limit: number = 20): Promise<{ data: Feedback[], total: number, page: number, limit: number, totalPages: number }> {
    const safeLimit = Number.isFinite(Number(limit)) && Number(limit) > 0 ? Number(limit) : 20;
    const safePage = Number.isFinite(Number(page)) && Number(page) > 0 ? Number(page) : 1;
    const offset = (safePage - 1) * safeLimit;
    const query = 'SELECT * FROM feedback ORDER BY created_at DESC LIMIT ? OFFSET ?';
    // Log for debugging
    console.log('[FeedbackModel.getAll] SQL:', query);
    console.log('[FeedbackModel.getAll] Params:', [safeLimit, offset]);
    const [rows] = await pool.execute(query, [safeLimit, offset]);
    const countQuery = 'SELECT COUNT(*) as total FROM feedback';
    const [countResult] = await pool.execute(countQuery);
    const total = (countResult as any)[0].total;
    return {
      data: rows as Feedback[],
      total,
      page: safePage,
      limit: safeLimit,
      totalPages: Math.ceil(total / safeLimit)
    };
  }

  // Get feedback by ID
  static async getById(id: string): Promise<Feedback | null> {
    const query = `
      SELECT f.*, l.title as house_title
      FROM feedbacks f
      LEFT JOIN listings l ON f.listing_id = l.id
      WHERE f.id = ?
    `;
    const [rows] = await pool.execute(query, [id]);
    
    if ((rows as any[]).length === 0) {
      return null;
    }

    return (rows as any[])[0];
  }

  // Get feedback by listing ID
  static async getByListingId(listingId: string): Promise<Feedback[]> {
    const query = `
      SELECT f.*, l.title as house_title
      FROM feedbacks f
      LEFT JOIN listings l ON f.listing_id = l.id
      WHERE f.listing_id = ?
      ORDER BY f.created_at DESC
    `;
    const [rows] = await pool.execute(query, [listingId]);
    return rows as Feedback[];
  }

  // Create new feedback
  static async create(data: CreateFeedbackRequest): Promise<Feedback> {
    const id = uuidv4();
    const query = `
      INSERT INTO feedbacks (id, listing_id, name, email, rating, message)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const params = [
      id,
      data.listingId,
      data.name,
      data.email,
      data.rating,
      data.message
    ];

    await pool.execute(query, params);
    return this.getById(id) as Promise<Feedback>;
  }

  // Delete feedback
  static async delete(id: string): Promise<boolean> {
    const query = 'DELETE FROM feedbacks WHERE id = ?';
    const [result] = await pool.execute(query, [id]);
    return (result as any).affectedRows > 0;
  }

  // Get average rating for a listing
  static async getAverageRating(listingId: string): Promise<number> {
    const query = 'SELECT AVG(rating) as avg_rating FROM feedbacks WHERE listing_id = ?';
    const [result] = await pool.execute(query, [listingId]);
    return (result as any)[0].avg_rating || 0;
  }

  // Get feedback statistics
  static async getStats(): Promise<{ total: number, averageRating: number, ratingDistribution: any }> {
    // Total feedback count
    const totalQuery = 'SELECT COUNT(*) as total FROM feedbacks';
    const [totalResult] = await pool.execute(totalQuery);
    const total = (totalResult as any)[0].total;

    // Average rating
    const avgQuery = 'SELECT AVG(rating) as avg_rating FROM feedbacks';
    const [avgResult] = await pool.execute(avgQuery);
    const averageRating = (avgResult as any)[0].avg_rating || 0;

    // Rating distribution
    const distQuery = `
      SELECT rating, COUNT(*) as count 
      FROM feedbacks 
      GROUP BY rating 
      ORDER BY rating DESC
    `;
    const [distResult] = await pool.execute(distQuery);
    const ratingDistribution = (distResult as any[]).reduce((acc, row) => {
      acc[row.rating] = row.count;
      return acc;
    }, {});

    return {
      total,
      averageRating,
      ratingDistribution
    };
  }

  // Get recent feedback
  static async getRecent(limit: number = 5): Promise<Feedback[]> {
    const query = `
      SELECT f.*, l.title as house_title
      FROM feedbacks f
      LEFT JOIN listings l ON f.listing_id = l.id
      ORDER BY f.created_at DESC
      LIMIT ?
    `;
    const [rows] = await pool.execute(query, [limit]);
    return rows as Feedback[];
  }
} 
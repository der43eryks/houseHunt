import pool from '../config/database';
import { Inquiry, CreateInquiryRequest } from '../../../shared/types/db_types';
import { v4 as uuidv4 } from 'uuid';

export class InquiryModel {
  // Get all inquiries with pagination
  static async getAll(page: number = 1, limit: number = 20): Promise<{ data: Inquiry[], total: number, page: number, limit: number, totalPages: number }> {
    const safeLimit = Number.isFinite(Number(limit)) && Number(limit) > 0 ? Number(limit) : 20;
    const safePage = Number.isFinite(Number(page)) && Number(page) > 0 ? Number(page) : 1;
    const offset = (safePage - 1) * safeLimit;
    const query = 'SELECT * FROM inquiries ORDER BY created_at DESC LIMIT ? OFFSET ?';
    // Log for debugging
    console.log('[InquiryModel.getAll] SQL:', query);
    console.log('[InquiryModel.getAll] Params:', [safeLimit, offset]);
    const [rows] = await pool.execute(query, [safeLimit, offset]);
    const countQuery = 'SELECT COUNT(*) as total FROM inquiries';
    const [countResult] = await pool.execute(countQuery);
    const total = (countResult as any)[0].total;
    return {
      data: rows as Inquiry[],
      total,
      page: safePage,
      limit: safeLimit,
      totalPages: Math.ceil(total / safeLimit)
    };
  }

  // Get inquiry by ID
  static async getById(id: string): Promise<Inquiry | null> {
    const query = `
      SELECT i.*, l.title as house_title, l.agent_phone as house_agent_phone
      FROM inquiries i
      LEFT JOIN listings l ON i.house_id = l.id
      WHERE i.id = ?
    `;
    const [rows] = await pool.execute(query, [id]);
    
    if ((rows as any[]).length === 0) {
      return null;
    }

    return (rows as any[])[0];
  }

  // Get inquiries by house ID
  static async getByHouseId(houseId: string): Promise<Inquiry[]> {
    const query = `
      SELECT i.*, l.title as house_title
      FROM inquiries i
      LEFT JOIN listings l ON i.house_id = l.id
      WHERE i.house_id = ?
      ORDER BY i.created_at DESC
    `;
    const [rows] = await pool.execute(query, [houseId]);
    return rows as Inquiry[];
  }

  // Create new inquiry
  static async create(data: CreateInquiryRequest): Promise<Inquiry> {
    const id = uuidv4();
    const query = `
      INSERT INTO inquiries (id, house_id, name, phone, message, preferred_visit_time)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const params = [
      id,
      data.houseId,
      data.name,
      data.phone,
      data.message,
      data.preferredVisitTime
    ];

    await pool.execute(query, params);
    return this.getById(id) as Promise<Inquiry>;
  }

  // Update inquiry status
  static async updateStatus(id: string, status: 'pending' | 'responded' | 'completed'): Promise<boolean> {
    const query = 'UPDATE inquiries SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
    const [result] = await pool.execute(query, [status, id]);
    return (result as any).affectedRows > 0;
  }

  // Delete inquiry
  static async delete(id: string): Promise<boolean> {
    const query = 'DELETE FROM inquiries WHERE id = ?';
    const [result] = await pool.execute(query, [id]);
    return (result as any).affectedRows > 0;
  }

  // Get inquiries by status
  static async getByStatus(status: 'pending' | 'responded' | 'completed'): Promise<Inquiry[]> {
    const query = `
      SELECT i.*, l.title as house_title
      FROM inquiries i
      LEFT JOIN listings l ON i.house_id = l.id
      WHERE i.status = ?
      ORDER BY i.created_at DESC
    `;
    const [rows] = await pool.execute(query, [status]);
    return rows as Inquiry[];
  }

  // Get pending inquiries count
  static async getPendingCount(): Promise<number> {
    const query = 'SELECT COUNT(*) as count FROM inquiries WHERE status = "pending"';
    const [result] = await pool.execute(query);
    return (result as any)[0].count;
  }
} 
import pool from '../config/database';
import { Admin, AdminLoginRequest } from '../../../shared/types/db_types';
import bcrypt from 'bcryptjs';

// Helper function to transform database row to Admin interface
const transformDbRowToAdmin = (row: any): Admin => ({
  id: row.id,
  username: row.username,
  passwordHash: row.password_hash,
  email: row.email,
  phone: row.phone,
  createdAt: row.created_at,
  lastLogin: row.last_login
});

export class AdminModel {
  // Get admin by email
  static async getByEmail(email: string): Promise<Admin | null> {
    const query = 'SELECT * FROM admins WHERE email = ?';
    const [rows] = await pool.execute(query, [email]);
    
    if ((rows as any[]).length === 0) {
      return null;
    }

    return transformDbRowToAdmin((rows as any[])[0]);
  }

  // Get admin by ID
  static async getById(id: string): Promise<Admin | null> {
    const query = 'SELECT * FROM admins WHERE id = ?';
    const [rows] = await pool.execute(query, [id]);
    
    if ((rows as any[]).length === 0) {
      return null;
    }

    return transformDbRowToAdmin((rows as any[])[0]);
  }

  // Create new admin
  static async create(data: Omit<Admin, 'createdAt' | 'lastLogin'>): Promise<Admin> {
    const hashedPassword = await bcrypt.hash(data.passwordHash, 12);
    
    const query = `
      INSERT INTO admins (id, username, password_hash, email, phone)
      VALUES (?, ?, ?, ?, ?)
    `;

    const params = [
      data.id,
      data.username,
      hashedPassword,
      data.email,
      data.phone
    ];

    await pool.execute(query, params);
    return this.getById(data.id) as Promise<Admin>;
  }

  // Verify admin login
  static async verifyLogin(credentials: AdminLoginRequest): Promise<Admin | null> {
    const admin = await this.getByEmail(credentials.email);
    if (!admin) {
      return null;
    }

    const isValidPassword = await bcrypt.compare(credentials.password, admin.passwordHash);
    if (!isValidPassword) {
      return null;
    }

    // Update last login
    await this.updateLastLogin(admin.id);
    return admin;
  }

  // Update last login
  static async updateLastLogin(id: string): Promise<void> {
    const query = 'UPDATE admins SET last_login = CURRENT_TIMESTAMP WHERE id = ?';
    await pool.execute(query, [id]);
  }

  // Update admin profile
  static async updateProfile(id: string, data: Partial<Omit<Admin, 'id' | 'passwordHash' | 'createdAt' | 'lastLogin'>>): Promise<Admin | null> {
    const updateFields: string[] = [];
    const params: any[] = [];

    if (data.username !== undefined) {
      updateFields.push('username = ?');
      params.push(data.username);
    }

    if (data.email !== undefined) {
      updateFields.push('email = ?');
      params.push(data.email);
    }

    if (data.phone !== undefined) {
      updateFields.push('phone = ?');
      params.push(data.phone);
    }

    if (updateFields.length === 0) {
      return this.getById(id);
    }

    params.push(id);
    const query = `UPDATE admins SET ${updateFields.join(', ')} WHERE id = ?`;
    await pool.execute(query, params);

    return this.getById(id);
  }

  // Change password
  static async changePassword(id: string, newPassword: string): Promise<boolean> {
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    const query = 'UPDATE admins SET password_hash = ? WHERE id = ?';
    const [result] = await pool.execute(query, [hashedPassword, id]);
    return (result as any).affectedRows > 0;
  }

  // Get all admins
  static async getAll(): Promise<Omit<Admin, 'passwordHash'>[]> {
    const query = 'SELECT id, username, email, phone, created_at, last_login FROM admins ORDER BY created_at DESC';
    const [rows] = await pool.execute(query);
    return (rows as any[]).map(row => ({
      id: row.id,
      username: row.username,
      email: row.email,
      phone: row.phone,
      createdAt: row.created_at,
      lastLogin: row.last_login
    }));
  }

  // Delete admin
  static async delete(id: string): Promise<boolean> {
    const query = 'DELETE FROM admins WHERE id = ?';
    const [result] = await pool.execute(query, [id]);
    return (result as any).affectedRows > 0;
  }
} 
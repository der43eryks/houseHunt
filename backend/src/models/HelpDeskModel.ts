import pool from '../config/database';
import { HelpDesk, FAQ } from '../../../shared/types/db_types';
import { v4 as uuidv4 } from 'uuid';

export class HelpDeskModel {
  // Get help desk info
  static async get(): Promise<HelpDesk | null> {
    const query = 'SELECT * FROM help_desk ORDER BY updated_at DESC LIMIT 1';
    const [rows] = await pool.execute(query);
    
    if ((rows as any[]).length === 0) {
      return null;
    }

    const row = (rows as any[])[0];
    return {
      ...row,
      faq: JSON.parse(row.faq || '[]')
    };
  }

  // Create help desk info
  static async create(data: Omit<HelpDesk, 'id' | 'updatedAt'>): Promise<HelpDesk> {
    const id = uuidv4();
    const query = `
      INSERT INTO help_desk (id, name, phone, whatsapp_link, email, facebook, available_hours, faq, contact_form_enabled)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      id,
      data.name,
      data.phone,
      data.whatsappLink,
      data.email,
      data.facebook,
      data.availableHours,
      JSON.stringify(data.faq),
      data.contactFormEnabled
    ];

    await pool.execute(query, params);
    return this.get() as Promise<HelpDesk>;
  }

  // Update help desk info
  static async update(data: Partial<Omit<HelpDesk, 'id' | 'updatedAt'>>): Promise<HelpDesk | null> {
    const existing = await this.get();
    if (!existing) {
      return this.create(data as Omit<HelpDesk, 'id' | 'updatedAt'>);
    }

    const updateFields: string[] = [];
    const params: any[] = [];

    if (data.name !== undefined) {
      updateFields.push('name = ?');
      params.push(data.name);
    }

    if (data.phone !== undefined) {
      updateFields.push('phone = ?');
      params.push(data.phone);
    }

    if (data.whatsappLink !== undefined) {
      updateFields.push('whatsapp_link = ?');
      params.push(data.whatsappLink);
    }

    if (data.email !== undefined) {
      updateFields.push('email = ?');
      params.push(data.email);
    }

    if (data.facebook !== undefined) {
      updateFields.push('facebook = ?');
      params.push(data.facebook);
    }

    if (data.availableHours !== undefined) {
      updateFields.push('available_hours = ?');
      params.push(data.availableHours);
    }

    if (data.faq !== undefined) {
      updateFields.push('faq = ?');
      params.push(JSON.stringify(data.faq));
    }

    if (data.contactFormEnabled !== undefined) {
      updateFields.push('contact_form_enabled = ?');
      params.push(data.contactFormEnabled);
    }

    if (updateFields.length === 0) {
      return existing;
    }

    updateFields.push('updated_at = CURRENT_TIMESTAMP');
    params.push(existing.id);

    const query = `UPDATE help_desk SET ${updateFields.join(', ')} WHERE id = ?`;
    await pool.execute(query, params);

    return this.get();
  }

  // Add FAQ
  static async addFAQ(faq: FAQ): Promise<HelpDesk | null> {
    const helpDesk = await this.get();
    if (!helpDesk) {
      return null;
    }

    const updatedFAQ = [...helpDesk.faq, faq];
    return this.update({ faq: updatedFAQ });
  }

  // Update FAQ
  static async updateFAQ(index: number, faq: FAQ): Promise<HelpDesk | null> {
    const helpDesk = await this.get();
    if (!helpDesk || index < 0 || index >= helpDesk.faq.length) {
      return null;
    }

    const updatedFAQ = [...helpDesk.faq];
    updatedFAQ[index] = faq;
    return this.update({ faq: updatedFAQ });
  }

  // Remove FAQ
  static async removeFAQ(index: number): Promise<HelpDesk | null> {
    const helpDesk = await this.get();
    if (!helpDesk || index < 0 || index >= helpDesk.faq.length) {
      return null;
    }

    const updatedFAQ = helpDesk.faq.filter((_, i) => i !== index);
    return this.update({ faq: updatedFAQ });
  }

  // Toggle contact form
  static async toggleContactForm(enabled: boolean): Promise<HelpDesk | null> {
    return this.update({ contactFormEnabled: enabled });
  }
} 
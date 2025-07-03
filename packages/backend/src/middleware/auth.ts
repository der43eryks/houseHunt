import { Request, Response, NextFunction } from 'express';
const jwt = require('jsonwebtoken');
import { AdminModel } from '../models/AdminModel';
import { logger } from '../logger';

interface AuthRequest extends Request {
  admin?: any;
}

export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  // Read token from cookie, not header
  const token = req.cookies?.access_token;

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      error: 'Access token required' 
    });
  }

  try {
    const secret = process.env.JWT_SECRET || '';
    const decoded = jwt.verify(token, secret) as any;
    
    const admin = await AdminModel.getById(decoded.adminId);
    if (!admin) {
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid token' 
      });
    }

    req.admin = admin;
    return next();
  } catch (error) {
    logger.warn('Security Event', {
      event: 'login_failed',
      userId: req.body?.email || req.body?.id,
      ip: req.ip,
      timestamp: new Date().toISOString()
    });
    return res.status(403).json({ 
      success: false, 
      error: 'Invalid or expired token' 
    });
  }
};

export const requireRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.admin) {
      return res.status(401).json({ 
        success: false, 
        error: 'Authentication required' 
      });
    }

    if (!roles.includes(req.admin.role)) {
      return res.status(403).json({ 
        success: false, 
        error: 'Insufficient permissions' 
      });
    }

    return next();
  };
};

export const generateToken = (adminId: string): string => {
  const secret = process.env.JWT_SECRET || '';
  return jwt.sign({ adminId }, secret, { expiresIn: '24h' });
}; 
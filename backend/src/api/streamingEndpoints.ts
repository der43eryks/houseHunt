import { Router, Request, Response } from 'express';
import { sseManager } from '../middleware/sse';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Custom middleware for SSE authentication using query parameter
const authenticateSSE = async (req: any, res: Response, next: any) => {
  const token = req.query.token;
  
  if (!token) {
    return res.status(401).json({ 
      success: false, 
      error: 'Access token required' 
    });
  }

  try {
    const secret = process.env.JWT_SECRET || 'your-secret-key';
    const decoded = require('jsonwebtoken').verify(token, secret) as any;
    
    const { AdminModel } = require('../models/AdminModel');
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
    return res.status(403).json({ 
      success: false, 
      error: 'Invalid or expired token' 
    });
  }
};

// SSE endpoint for admin dashboard - using query parameter auth
router.get('/admin/stream', authenticateSSE, (req: any, res: Response) => {
  const connectionId = sseManager.setupSSE(req, res, 'admin', req.admin.id);
  
  // Send initial admin data
  res.write(`data: ${JSON.stringify({
    type: 'admin_connected',
    adminId: req.admin.id,
    connectionId
  })}\n\n`);
});

// SSE endpoint for client site
router.get('/client/stream', (req: Request, res: Response) => {
  const connectionId = sseManager.setupSSE(req, res, 'client');
  
  // Send initial client data
  res.write(`data: ${JSON.stringify({
    type: 'client_connected',
    connectionId
  })}\n\n`);
});

// Webhook endpoint for sending notifications (internal use)
router.post('/webhook/notify', (req: Request, res: Response) => {
  try {
    const { type, target, data } = req.body;
    
    switch (type) {
      case 'new_listing':
        sseManager.sendToAll('client', {
          type: 'new_listing',
          data
        });
        break;
        
      case 'new_inquiry':
        sseManager.sendToAll('admin', {
          type: 'new_inquiry',
          data
        });
        break;
        
      case 'listing_update':
        sseManager.sendToAll('client', {
          type: 'listing_update',
          data
        });
        break;
        
      case 'admin_notification':
        if (target?.adminId) {
          sseManager.sendToUser(target.adminId, 'admin', {
            type: 'notification',
            data
          });
        }
        break;
        
      default:
        return res.status(400).json({
          success: false,
          error: 'Invalid notification type'
        });
    }
    
    return res.json({ success: true });
  } catch (error) {
    console.error('Webhook notification error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to send notification'
    });
  }
});

export default router; 
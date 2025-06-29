import { Request, Response, NextFunction } from 'express';

export interface SSEConnection {
  id: string;
  res: Response;
  lastActivity: Date;
  userType: 'admin' | 'client';
  userId?: string;
}

class SSEManager {
  private connections: Map<string, SSEConnection> = new Map();

  // Initialize SSE connection
  setupSSE(req: Request, res: Response, userType: 'admin' | 'client', userId?: string): string {
    const connectionId = `${userType}-${userId || Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Set SSE headers
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control'
    });

    // Send initial connection message
    res.write(`data: ${JSON.stringify({ type: 'connection', id: connectionId })}\n\n`);

    // Store connection
    const connection: SSEConnection = {
      id: connectionId,
      res,
      lastActivity: new Date(),
      userType,
      userId
    };

    this.connections.set(connectionId, connection);

    // Handle client disconnect
    req.on('close', () => {
      this.connections.delete(connectionId);
      console.log(`SSE connection closed: ${connectionId}`);
    });

    // Keep connection alive with heartbeat
    const heartbeat = setInterval(() => {
      if (this.connections.has(connectionId)) {
        res.write(`data: ${JSON.stringify({ type: 'heartbeat', timestamp: Date.now() })}\n\n`);
      } else {
        clearInterval(heartbeat);
      }
    }, 30000); // 30 second heartbeat

    return connectionId;
  }

  // Send message to specific user
  sendToUser(userId: string, userType: 'admin' | 'client', data: any): void {
    this.connections.forEach((connection) => {
      if (connection.userId === userId && connection.userType === userType) {
        connection.res.write(`data: ${JSON.stringify(data)}\n\n`);
        connection.lastActivity = new Date();
      }
    });
  }

  // Send message to all users of a specific type
  sendToAll(userType: 'admin' | 'client', data: any): void {
    this.connections.forEach((connection) => {
      if (connection.userType === userType) {
        connection.res.write(`data: ${JSON.stringify(data)}\n\n`);
        connection.lastActivity = new Date();
      }
    });
  }

  // Send message to all connections
  broadcast(data: any): void {
    this.connections.forEach((connection) => {
      connection.res.write(`data: ${JSON.stringify(data)}\n\n`);
      connection.lastActivity = new Date();
    });
  }

  // Get connection count
  getConnectionCount(userType?: 'admin' | 'client'): number {
    if (userType) {
      return Array.from(this.connections.values()).filter(c => c.userType === userType).length;
    }
    return this.connections.size;
  }

  // Clean up inactive connections
  cleanupInactiveConnections(maxInactiveMinutes = 60): void {
    const now = new Date();
    this.connections.forEach((connection, id) => {
      const inactiveMinutes = (now.getTime() - connection.lastActivity.getTime()) / (1000 * 60);
      if (inactiveMinutes > maxInactiveMinutes) {
        this.connections.delete(id);
        console.log(`Cleaned up inactive SSE connection: ${id}`);
      }
    });
  }
}

export const sseManager = new SSEManager();

// Middleware to setup SSE
export const setupSSE = (userType: 'admin' | 'client') => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.headers.accept?.includes('text/event-stream')) {
      const userId = (req as any).user?.id || (req as any).admin?.id;
      const connectionId = sseManager.setupSSE(req, res, userType, userId);
      (req as any).sseConnectionId = connectionId;
    }
    next();
  };
};
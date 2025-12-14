import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    name: string;
  };
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.header('Authorization');
    let token: string | undefined = undefined;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.replace('Bearer ', '');
    } else if (req.headers && typeof req.headers.cookie === 'string') {
      // parse cookie header for token=...
      const cookies = req.headers.cookie.split(';').map(c => c.trim());
      for (const c of cookies) {
        if (c.startsWith('token=')) {
          token = decodeURIComponent(c.split('=')[1] || '');
          break;
        }
      }
    }

    if (!token) {
      res.status(401).json({ 
        success: false,
        error: 'Access denied. No token provided.' 
      });
      return;
    }

    const decoded = jwt.verify(token, config.jwtSecret) as {
      id: string;
      email: string;
      role: string;
      name: string;
    };

    req.user = decoded;
    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      res.status(401).json({ 
        success: false,
        error: 'Token has expired. Please login again.' 
      });
    } else if (error.name === 'JsonWebTokenError') {
      res.status(401).json({ 
        success: false,
        error: 'Invalid token.' 
      });
    } else {
      res.status(401).json({ 
        success: false,
        error: 'Authentication failed.' 
      });
    }
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ 
        success: false,
        error: 'Authentication required.' 
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ 
        success: false,
        error: 'Insufficient permissions. Access denied.' 
      });
      return;
    }

    next();
  };
};
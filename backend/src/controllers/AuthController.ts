import { Request, Response } from 'express';
import { UserService } from '../services/UserService';
import { AuthRequest } from '../middleware/auth';

const userService = new UserService();

export class AuthController {
  /**
   * Register new user
   */
  async register(req: Request, res: Response): Promise<void> {
    try {
      
      const { user, token } = await userService.register(req.body);
      
      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: { user, token }
      });
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      const message = error.message || 'Internal server error';
      
      res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
      });
    }
  }

  /**
   * Login user
   */
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const { user, token } = await userService.login(email, password);
      // Set secure, HttpOnly cookie for session token
      const cookieOptions = {
        httpOnly: true,
        sameSite: 'lax' as const,
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      };

      res.cookie('token', token, cookieOptions).json({
        success: true,
        message: 'Login successful',
        data: { user }
      });
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      const message = error.message || 'Internal server error';
      
      res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
      });
    }
  }

  /**
   * Logout - clear cookie
   */
  async logout(req: Request, res: Response): Promise<void> {
    try {
      const cookieOptions = {
        httpOnly: true,
        sameSite: 'lax' as const
      };
      res.clearCookie('token', cookieOptions).json({ success: true, message: 'Logged out' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: 'Logout failed' });
    }
  }

  /**
   * Get user profile
   */
  async getProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      const user = await userService.getUserById(req.user!.id);
      
      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
        return;
      }
      
      res.json({
        success: true,
        data: { user }
      });
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      const message = error.message || 'Internal server error';
      
      res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
      });
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      const user = await userService.updateUser(req.user!.id, req.body);
      
      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: { user }
      });
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      const message = error.message || 'Internal server error';
      
      res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
      });
    }
  }

  /**
   * Get all users (Admin only)
   */
  async getAllUsers(req: AuthRequest, res: Response): Promise<void> {
    try {
      const users = await userService.getAllUsers();
      
      res.json({
        success: true,
        count: users.length,
        data: { users }
      });
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      const message = error.message || 'Internal server error';
      
      res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
      });
    }
  }

  /**
   * Delete user (Admin only)
   */
  async deleteUser(req: AuthRequest, res: Response): Promise<void> {
    try {
      const result = await userService.deleteUser(req.params.id);
      
      res.json({
        success: result.success,
        message: result.message
      });
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      const message = error.message || 'Internal server error';
      
      res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
      });
    }
  }
}
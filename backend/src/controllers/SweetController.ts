import { Request, Response } from 'express';
import { SweetService } from '../services/SweetService';
import { AuthRequest } from '../middleware/auth';

const sweetService = new SweetService();

export class SweetController {
  /**
   * Create new sweet (Admin only)
   */
  async createSweet(req: AuthRequest, res: Response): Promise<void> {
    try {
      const sweet = await sweetService.createSweet(req.body);
      
      res.status(201).json({
        success: true,
        message: 'Sweet created successfully',
        data: { sweet }
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
   * Get all sweets with pagination and filtering
   */
  async getAllSweets(req: Request, res: Response): Promise<void> {
    try {
      const result = await sweetService.getAllSweets(req.query);
      
      res.json({
        success: true,
        message: 'Sweets retrieved successfully',
        ...result
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
   * Get sweet by ID
   */
  async getSweetById(req: Request, res: Response): Promise<void> {
    try {
      const sweet = await sweetService.getSweetById(req.params.id);
      
      res.json({
        success: true,
        message: 'Sweet retrieved successfully',
        data: { sweet }
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
   * Update sweet (Admin only)
   */
  async updateSweet(req: AuthRequest, res: Response): Promise<void> {
    try {
      const sweet = await sweetService.updateSweet(req.params.id, req.body);
      
      res.json({
        success: true,
        message: 'Sweet updated successfully',
        data: { sweet }
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
   * Delete sweet (Admin only)
   */
  async deleteSweet(req: AuthRequest, res: Response): Promise<void> {
    try {
      const result = await sweetService.deleteSweet(req.params.id);
      
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

  /**
   * Purchase sweet
   */
  async purchaseSweet(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { quantity } = req.body;
      const sweet = await sweetService.purchaseSweet(req.params.id, quantity);
      
      res.json({
        success: true,
        message: 'Purchase successful',
        data: { 
          sweet,
          purchasedQuantity: quantity,
          remainingQuantity: sweet.quantity
        }
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
   * Restock sweet (Admin only)
   */
  async restockSweet(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { quantity } = req.body;
      const sweet = await sweetService.restockSweet(req.params.id, quantity);
      
      res.json({
        success: true,
        message: 'Restock successful',
        data: { 
          sweet,
          addedQuantity: quantity,
          newQuantity: sweet.quantity
        }
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
   * Get sweet categories
   */
  async getCategories(req: Request, res: Response): Promise<void> {
    try {
      const categories = await sweetService.getCategories();
      
      res.json({
        success: true,
        message: 'Categories retrieved successfully',
        data: { categories }
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
   * Get sweet statistics (Admin only)
   */
  async getStatistics(req: AuthRequest, res: Response): Promise<void> {
    try {
      const statistics = await sweetService.getStatistics();
      
      res.json({
        success: true,
        message: 'Statistics retrieved successfully',
        data: { statistics }
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
   * Search sweets
   */
  async searchSweets(req: Request, res: Response): Promise<void> {
    try {
      const result = await sweetService.getAllSweets(req.query);
      
      res.json({
        success: true,
        message: 'Search results retrieved successfully',
        ...result
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
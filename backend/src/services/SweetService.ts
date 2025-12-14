import { 
  ISweet, 
  ISweetInput, 
  ISweetUpdate, 
  ISearchParams, 
  Sweet 
} from '../models/Sweet';
import { AppError } from '../middleware/errorHandler';

export interface IPaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export class SweetService {
  /**
   * Create a new sweet
   */
  async createSweet(sweetInput: ISweetInput): Promise<ISweet> {
    try {
      // Check if sweet with same name already exists
      const existingSweet = await Sweet.findOne({ name: sweetInput.name });
      if (existingSweet) {
        throw new AppError('Sweet with this name already exists', 400);
      }

      const sweet = new Sweet(sweetInput);
      await sweet.save();
      return sweet;
    } catch (error: any) {
      // If it's already an AppError, re-throw it
      if (error instanceof AppError) {
        throw error;
      }
      
      // Handle MongoDB duplicate key error
      if (error.code === 11000 || error.message?.includes('duplicate key')) {
        throw new AppError('Sweet with this name already exists', 400);
      }
      
      // Handle Mongoose validation errors
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map((e: any) => e.message).join(', ');
        throw new AppError(`Validation failed: ${messages}`, 400);
      }
      
      // Handle other errors
      console.error('Error creating sweet:', error);
      throw new AppError('Failed to create sweet', 500);
    }
  }

  /**
   * Get all sweets with pagination and filtering
   */
  async getAllSweets(params: ISearchParams = {}): Promise<IPaginatedResult<ISweet>> {
    try {
      const {
        search,
        category,
        minPrice,
        maxPrice,
        isAvailable,
        page = 1,
        limit = 10
      } = params;

      // Build query
      const query: any = {};

      if (search && search.trim()) {
        query.$or = [
          { name: { $regex: search.trim(), $options: 'i' } },
          { description: { $regex: search.trim(), $options: 'i' } }
        ];
      }

      if (category && category.trim()) {
        query.category = category.trim();
      }

      if (minPrice !== undefined || maxPrice !== undefined) {
        query.price = {};
        if (minPrice !== undefined) query.price.$gte = Number(minPrice);
        if (maxPrice !== undefined) query.price.$lte = Number(maxPrice);
      }

      if (isAvailable !== undefined) {
        query.isAvailable = isAvailable === true;
      }

      // Convert page and limit to numbers
      const pageNum = Number(page) || 1;
      const limitNum = Number(limit) || 10;
      const skip = (pageNum - 1) * limitNum;

      // Execute query with pagination
      const [sweets, total] = await Promise.all([
        Sweet.find(query)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limitNum)
          .lean(),
        Sweet.countDocuments(query)
      ]);

      const totalPages = Math.ceil(total / limitNum);

      return {
        data: sweets as any,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages,
          hasNext: pageNum < totalPages,
          hasPrev: pageNum > 1
        }
      };
    } catch (error: any) {
      console.error('Error getting sweets:', error);
      throw new AppError('Failed to get sweets', 500);
    }
  }

  /**
   * Get sweet by ID
   */
  async getSweetById(sweetId: string): Promise<ISweet> {
    try {
      const sweet = await Sweet.findById(sweetId);
      if (!sweet) {
        throw new AppError('Sweet not found', 404);
      }
      return sweet;
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to get sweet', 500);
    }
  }

  /**
   * Update sweet
   */
  async updateSweet(sweetId: string, updates: ISweetUpdate): Promise<ISweet> {
    try {
      // Check for duplicate name if name is being updated
      if (updates.name) {
        const existingSweet = await Sweet.findOne({ 
          name: updates.name, 
          _id: { $ne: sweetId } 
        });
        if (existingSweet) {
          throw new AppError('Sweet with this name already exists', 400);
        }
      }

      const sweet = await Sweet.findByIdAndUpdate(
        sweetId,
        { $set: updates },
        { 
          new: true, 
          runValidators: true 
        }
      );

      if (!sweet) {
        throw new AppError('Sweet not found', 404);
      }

      return sweet;
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      if (error.code === 11000) {
        throw new AppError('Sweet with this name already exists', 400);
      }
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map((e: any) => e.message).join(', ');
        throw new AppError(`Validation failed: ${messages}`, 400);
      }
      throw new AppError('Failed to update sweet', 500);
    }
  }

  /**
   * Delete sweet
   */
  async deleteSweet(sweetId: string): Promise<{ success: boolean; message: string }> {
    try {
      const result = await Sweet.findByIdAndDelete(sweetId);
      if (!result) {
        throw new AppError('Sweet not found', 404);
      }
      
      return { 
        success: true, 
        message: 'Sweet deleted successfully' 
      };
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to delete sweet', 500);
    }
  }

  /**
   * Purchase sweet (reduce quantity)
   */
  async purchaseSweet(sweetId: string, quantity: number): Promise<ISweet> {
    try {
      // Find the sweet
      const sweet = await Sweet.findById(sweetId);
      
      if (!sweet) {
        throw new AppError('Sweet not found', 404);
      }

      // Check if enough quantity is available
      if (sweet.quantity < quantity) {
        throw new AppError(
          `Insufficient stock. Available: ${sweet.quantity}, Requested: ${quantity}`,
          400
        );
      }

      // Update quantity
      sweet.quantity -= quantity;
      await sweet.save();

      return sweet;
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to purchase sweet', 500);
    }
  }

  /**
   * Restock sweet (increase quantity)
   */
  async restockSweet(sweetId: string, quantity: number): Promise<ISweet> {
    try {
      const sweet = await Sweet.findById(sweetId);

      if (!sweet) {
        throw new AppError('Sweet not found', 404);
      }

      // Update quantity
      sweet.quantity += quantity;
      await sweet.save();

      return sweet;
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to restock sweet', 500);
    }
  }

  /**
   * Get sweet categories
   */
  async getCategories(): Promise<string[]> {
    try {
      const categories = await Sweet.distinct('category');
      return categories.sort();
    } catch (error: any) {
      throw new AppError('Failed to get categories', 500);
    }
  }

  /**
   * Get sweet statistics
   */
  async getStatistics(): Promise<{
    totalSweets: number;
    totalQuantity: number;
    totalValue: number;
    averagePrice: number;
    outOfStock: number;
    inStock: number;
    categories: { [key: string]: number };
  }> {
    try {
      const [stats, categoryStats] = await Promise.all([
        // Main statistics
        Sweet.aggregate([
          {
            $group: {
              _id: null,
              totalSweets: { $sum: 1 },
              totalQuantity: { $sum: '$quantity' },
              totalValue: { $sum: { $multiply: ['$price', '$quantity'] } },
              averagePrice: { $avg: '$price' },
              outOfStock: {
                $sum: { $cond: [{ $lte: ['$quantity', 0] }, 1, 0] }
              }
            }
          },
          {
            $project: {
              _id: 0,
              totalSweets: 1,
              totalQuantity: 1,
              totalValue: { $round: ['$totalValue', 2] },
              averagePrice: { $round: ['$averagePrice', 2] },
              outOfStock: 1,
              inStock: { $subtract: ['$totalSweets', '$outOfStock'] }
            }
          }
        ]),
        // Category statistics
        Sweet.aggregate([
          {
            $group: {
              _id: '$category',
              count: { $sum: 1 }
            }
          },
          {
            $project: {
              _id: 0,
              category: '$_id',
              count: 1
            }
          },
          { $sort: { count: -1 } }
        ])
      ]);

      const defaultStats = {
        totalSweets: 0,
        totalQuantity: 0,
        totalValue: 0,
        averagePrice: 0,
        outOfStock: 0,
        inStock: 0,
        categories: {} as { [key: string]: number }
      };

      if (stats.length === 0) {
        // Convert category stats to object even if no main stats
        categoryStats.forEach((cat: any) => {
          defaultStats.categories[cat.category] = cat.count;
        });
        return defaultStats;
      }

      // Convert category stats to object
      const categoriesObj: { [key: string]: number } = {};
      categoryStats.forEach((cat: any) => {
        categoriesObj[cat.category] = cat.count;
      });

      return { 
        ...stats[0], 
        categories: categoriesObj 
      };
    } catch (error: any) {
      console.error('Error getting statistics:', error);
      throw new AppError('Failed to get statistics', 500);
    }
  }
}
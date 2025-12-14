import { IUser, IUserInput, User } from '../models/User';
import { AppError } from '../middleware/errorHandler';

export interface AuthResponse {
  user: Omit<IUser, 'password'>;
  token: string;
}

export class UserService {
  /**
   * Register a new user
   */
  async register(userInput: IUserInput): Promise<AuthResponse> {
    try {
      // Check if user already exists
      const existingUser = await User.findOne({ email: userInput.email });
      if (existingUser) {
        throw new AppError('User with this email already exists', 400);
      }

      // Create new user
      const user = new User(userInput);
      await user.save();

      // Generate auth token
      const token = user.generateAuthToken();

      // Remove password from response
      const userObject = user.toObject() as any;
      const { password, ...userWithoutPassword } = userObject;

      return { user: userWithoutPassword, token };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to register user', 500);
    }
  }

  /**
   * Login user
   */
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      // Find user by email (including password)
      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        throw new AppError('Invalid credentials', 401);
      }

      // Check password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        throw new AppError('Invalid credentials', 401);
      }

      // Generate auth token
      const token = user.generateAuthToken();

      // Remove password from response
      const userObject = user.toObject() as any;
      if (userObject.password !== undefined) {
        delete userObject.password;
      }

      return { user: userObject, token };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to login', 500);
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<IUser | null> {
    try {
      const user = await User.findById(userId).select('-password');
      return user;
    } catch (error) {
      throw new AppError('Failed to get user', 500);
    }
  }

  /**
   * Get all users (Admin only)
   */
  async getAllUsers(): Promise<IUser[]> {
    try {
      const users = await User.find().select('-password').sort({ createdAt: -1 });
      return users;
    } catch (error) {
      throw new AppError('Failed to get users', 500);
    }
  }

  /**
   * Update user profile
   */
  async updateUser(userId: string, updateData: Partial<IUserInput>): Promise<IUser> {
    try {
      // Don't allow email or role updates through this method
      if (updateData.email) {
        throw new AppError('Email cannot be updated', 400);
      }
      if (updateData.role) {
        throw new AppError('Role cannot be updated', 400);
      }

      // Remove password from update data if present
      if (updateData.password) {
        delete updateData.password;
      }

      const user = await User.findByIdAndUpdate(
        userId,
        { $set: updateData },
        { 
          new: true, 
          runValidators: true,
          select: '-password'
        }
      );

      if (!user) {
        throw new AppError('User not found', 404);
      }

      return user;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to update user', 500);
    }
  }

  /**
   * Delete user (Admin only)
   */
  async deleteUser(userId: string): Promise<{ success: boolean; message: string }> {
    try {
      const result = await User.findByIdAndDelete(userId);
      if (!result) {
        throw new AppError('User not found', 404);
      }
      
      return { 
        success: true, 
        message: 'User deleted successfully' 
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to delete user', 500);
    }
  }
}
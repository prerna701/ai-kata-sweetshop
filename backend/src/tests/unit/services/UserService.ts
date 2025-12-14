import { UserService } from '../../../services/UserService';
import { User } from '../../../models/User';
import { AppError } from '../../../middleware/errorHandler';

describe('UserService', () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const userInput = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
      };

      const result = await userService.register(userInput);

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('token');
      expect(result.user.email).toBe(userInput.email);
      expect(result.user.name).toBe(userInput.name);
      expect(result.user.role).toBe('customer');
      expect(result.user).not.toHaveProperty('password');
    });

    it('should not register user with existing email', async () => {
      const userInput = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
      };

      // First registration
      await userService.register(userInput);

      // Second registration should fail
      await expect(userService.register(userInput))
        .rejects
        .toThrow(AppError);
    });

    it('should allow admin role if specified', async () => {
      const userInput = {
        email: 'admin@example.com',
        password: 'password123',
        name: 'Admin User',
        role: 'admin' as const
      };

      const result = await userService.register(userInput);

      expect(result.user.role).toBe('admin');
    });
  });

  describe('login', () => {
    const userInput = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User'
    };

    beforeEach(async () => {
      await userService.register(userInput);
    });

    it('should login with valid credentials', async () => {
      const result = await userService.login(userInput.email, userInput.password);

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('token');
      expect(result.user.email).toBe(userInput.email);
    });

    it('should not login with invalid password', async () => {
      await expect(userService.login(userInput.email, 'wrongpassword'))
        .rejects
        .toThrow(AppError);
    });

    it('should not login with non-existent user', async () => {
      await expect(userService.login('nonexistent@example.com', userInput.password))
        .rejects
        .toThrow(AppError);
    });
  });

  describe('getUserById', () => {
    it('should get user by ID', async () => {
      const userInput = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
      };

      const { user: createdUser } = await userService.register(userInput);
      const user = await userService.getUserById(createdUser._id.toString());

      expect(user).not.toBeNull();
      expect(user?.email).toBe(userInput.email);
      expect(user).not.toHaveProperty('password');
    });

    it('should return null for non-existent user ID', async () => {
      const user = await userService.getUserById('507f1f77bcf86cd799439011');
      expect(user).toBeNull();
    });
  });
});
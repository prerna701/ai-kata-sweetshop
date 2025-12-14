import { SweetService } from '../../../services/SweetService';
import { Sweet } from '../../../models/Sweet';
import { AppError } from '../../../middleware/errorHandler';

describe('SweetService', () => {
  let sweetService: SweetService;

  beforeEach(() => {
    sweetService = new SweetService();
  });

  describe('createSweet', () => {
    it('should create a new sweet successfully', async () => {
      const sweetInput = {
        name: 'Chocolate Bar',
        category: 'Chocolate',
        price: 2.99,
        quantity: 100,
        description: 'Delicious chocolate bar'
      };

      const sweet = await sweetService.createSweet(sweetInput);

      expect(sweet).toHaveProperty('_id');
      expect(sweet.name).toBe(sweetInput.name);
      expect(sweet.category).toBe(sweetInput.category);
      expect(sweet.price).toBe(sweetInput.price);
      expect(sweet.quantity).toBe(sweetInput.quantity);
      expect(sweet.description).toBe(sweetInput.description);
      expect(sweet.isAvailable).toBe(true);
    });

    it('should not create sweet with duplicate name', async () => {
      const sweetInput = {
        name: 'Duplicate Sweet',
        category: 'Chocolate',
        price: 2.99,
        quantity: 100
      };

      // First creation should succeed
      await sweetService.createSweet(sweetInput);

      // Second creation should fail with AppError
      try {
        await sweetService.createSweet(sweetInput);
        // If we reach here, test should fail
        fail('Expected createSweet to throw AppError');
      } catch (error: any) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.message).toBe('Sweet with this name already exists');
        expect(error.statusCode).toBe(400);
      }
    });
  });

  describe('getSweetById', () => {
    it('should get sweet by ID', async () => {
      const sweetInput = {
        name: 'Test Sweet',
        category: 'Candy',
        price: 1.99,
        quantity: 50
      };

      const createdSweet = await sweetService.createSweet(sweetInput);
      const sweet = await sweetService.getSweetById(createdSweet._id.toString());

      expect(sweet).not.toBeNull();
      expect(sweet?.name).toBe(sweetInput.name);
    });

    it('should throw error for non-existent sweet ID', async () => {
      // Use a valid MongoDB ObjectId format
      const fakeId = '507f1f77bcf86cd799439011';
      
      await expect(sweetService.getSweetById(fakeId))
        .rejects
        .toThrow(AppError);
    });
  });

  describe('purchaseSweet', () => {
    it('should successfully purchase sweet', async () => {
      const sweetInput = {
        name: 'Purchase Test',
        category: 'Chocolate',
        price: 3.99,
        quantity: 10
      };

      const createdSweet = await sweetService.createSweet(sweetInput);
      const sweet = await sweetService.purchaseSweet(createdSweet._id.toString(), 3);

      expect(sweet.quantity).toBe(7);
    });

    it('should throw error for insufficient stock', async () => {
      const sweetInput = {
        name: 'Limited Stock',
        category: 'Candy',
        price: 0.99,
        quantity: 2
      };

      const createdSweet = await sweetService.createSweet(sweetInput);

      await expect(sweetService.purchaseSweet(createdSweet._id.toString(), 5))
        .rejects
        .toThrow(AppError);
    });

    it('should mark sweet as unavailable when stock runs out', async () => {
      const sweetInput = {
        name: 'Last Item',
        category: 'Biscuit',
        price: 1.49,
        quantity: 1
      };

      const createdSweet = await sweetService.createSweet(sweetInput);
      const sweet = await sweetService.purchaseSweet(createdSweet._id.toString(), 1);

      expect(sweet.quantity).toBe(0);
      expect(sweet.isAvailable).toBe(false);
    });
  });

  describe('restockSweet', () => {
    it('should successfully restock sweet', async () => {
      const sweetInput = {
        name: 'Restock Test',
        category: 'Cake',
        price: 12.99,
        quantity: 5
      };

      const createdSweet = await sweetService.createSweet(sweetInput);
      const sweet = await sweetService.restockSweet(createdSweet._id.toString(), 10);

      expect(sweet.quantity).toBe(15);
    });

    it('should mark sweet as available after restocking from zero', async () => {
      const sweetInput = {
        name: 'Out of Stock',
        category: 'Pastry',
        price: 2.49,
        quantity: 0
      };

      const createdSweet = await sweetService.createSweet(sweetInput);
      expect(createdSweet.isAvailable).toBe(false);

      const sweet = await sweetService.restockSweet(createdSweet._id.toString(), 5);
      expect(sweet.quantity).toBe(5);
      expect(sweet.isAvailable).toBe(true);
    });
  });
});
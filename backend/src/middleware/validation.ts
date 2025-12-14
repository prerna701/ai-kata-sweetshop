import { body, param, query, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { Sweet } from '../models/Sweet';

export const validate = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
    return;
  }
  next();
};

// Auth validations
export const registerValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('role')
    .optional()
    .isIn(['customer', 'admin'])
    .withMessage('Role must be either customer or admin'),
  validate
];

export const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  validate
];

// Sweet validations
export const createSweetValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Sweet name is required')
    .custom(async (name: string) => {
      const existingSweet = await Sweet.findOne({ name });
      if (existingSweet) {
        throw new Error('Sweet with this name already exists');
      }
      return true;
    }),
  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required')
    .isIn(['Chocolate', 'Candy', 'Biscuit', 'Cake', 'Pastry', 'Ice Cream', 'Traditional', 'Other'])
    .withMessage('Invalid category'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('quantity')
    .isInt({ min: 0 })
    .withMessage('Quantity must be a non-negative integer'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  validate
];

export const updateSweetValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid sweet ID'),
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Sweet name cannot be empty')
    .custom(async (name: string, { req }) => {
      const sweet = await Sweet.findOne({ name, _id: { $ne: req.params?.id } });
      if (sweet) {
        throw new Error('Sweet with this name already exists');
      }
      return true;
    }),
  body('category')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Category cannot be empty')
    .isIn(['Chocolate', 'Candy', 'Biscuit', 'Cake', 'Pastry', 'Ice Cream', 'Traditional', 'Other'])
    .withMessage('Invalid category'),
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('quantity')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Quantity must be a non-negative integer'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  validate
];

export const purchaseSweetValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid sweet ID'),
  body('quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1'),
  validate
];

export const searchSweetsValidation = [
  query('search')
    .optional()
    .trim(),
  query('category')
    .optional()
    .trim()
    .isIn(['Chocolate', 'Candy', 'Biscuit', 'Cake', 'Pastry', 'Ice Cream', 'Traditional', 'Other', ''])
    .withMessage('Invalid category'),
  query('minPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum price must be a positive number'),
  query('maxPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Maximum price must be a positive number'),
  query('isAvailable')
    .optional()
    .isBoolean()
    .withMessage('isAvailable must be a boolean'),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  validate
];
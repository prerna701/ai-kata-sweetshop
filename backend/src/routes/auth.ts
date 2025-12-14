import { Router } from 'express';
import { AuthController } from '../controllers/AuthController'
import { 
  authenticate, 
  authorize 
} from '../middleware/auth';
import { 
  registerValidation, 
  loginValidation 
} from '../middleware/validation';

const router = Router();
const authController = new AuthController();

// Public routes
router.post('/register', registerValidation, authController.register.bind(authController));
router.post('/login', loginValidation, authController.login.bind(authController));

// Cookie/session endpoints
router.get('/me', authenticate, authController.getProfile.bind(authController));
router.post('/logout', authController.logout.bind(authController));

// Protected routes
router.get('/profile', authenticate, authController.getProfile.bind(authController));
router.put('/profile', authenticate, authController.updateProfile.bind(authController));

// Admin only routes
router.get('/users', authenticate, authorize('admin'), authController.getAllUsers.bind(authController));
router.delete('/users/:id', authenticate, authorize('admin'), authController.deleteUser.bind(authController));

export default router;
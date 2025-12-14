import { Router } from 'express';
import { SweetController } from '../controllers/SweetController';
import { 
  authenticate, 
  authorize 
} from '../middleware/auth';
import {
  createSweetValidation,
  updateSweetValidation,
  purchaseSweetValidation,
  searchSweetsValidation
} from '../middleware/validation';

const router = Router();
const sweetController = new SweetController();

// Public routes
router.get('/', searchSweetsValidation, sweetController.getAllSweets.bind(sweetController));
router.get('/search', searchSweetsValidation, sweetController.searchSweets.bind(sweetController));
router.get('/categories', sweetController.getCategories.bind(sweetController));
router.get('/:id', sweetController.getSweetById.bind(sweetController));

// Protected routes (require authentication)
router.post('/:id/purchase', 
  authenticate, 
  purchaseSweetValidation, 
  sweetController.purchaseSweet.bind(sweetController)
);

// Admin only routes
router.post('/', 
  authenticate, 
  authorize('admin'),
  createSweetValidation, 
  sweetController.createSweet.bind(sweetController)
);

router.put('/:id', 
  authenticate, 
  authorize('admin'),
  updateSweetValidation, 
  sweetController.updateSweet.bind(sweetController)
);

router.delete('/:id', 
  authenticate, 
  authorize('admin'),
  sweetController.deleteSweet.bind(sweetController)
);

router.post('/:id/restock', 
  authenticate, 
  authorize('admin'),
  purchaseSweetValidation, 
  sweetController.restockSweet.bind(sweetController)
);

router.get('/stats/statistics', 
  authenticate, 
  authorize('admin'),
  sweetController.getStatistics.bind(sweetController)
);

export default router;
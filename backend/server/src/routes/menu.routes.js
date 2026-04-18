const router = require('express').Router();
const { body, param } = require('express-validator');
const {
  createMenuItem,
  getMenuItemsByRestaurant,
  updateMenuItem,
  deleteMenuItem
} = require('../controllers/menu.controller');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth.middleware');
const { checkRestaurantOwnership, checkMenuItemOwnership } = require('../middlewares/ownership.middleware');
const validate = require('../middlewares/validate.middleware');

// Public route
router.get(
  '/restaurant/:restaurantId',
  [
    param('restaurantId').isInt().withMessage('Invalid restaurant ID')
  ],
  validate,
  getMenuItemsByRestaurant
);

// Protected routes
router.post(
  '/',
  authenticateToken,
  authorizeRoles('restaurant_owner', 'admin'),
  [
    body('name').trim().notEmpty().withMessage('Menu item name is required').isLength({ max: 100 }),
    body('description').optional().isString(),
    body('price').isFloat({ min: 0.01 }).withMessage('Price must be greater than 0'),
    body('imageUrl').optional().isURL().withMessage('Image URL must be a valid URL'),
    body('available').optional().isBoolean(),
    body('restaurantId').isInt().withMessage('Valid restaurant ID is required'),
    body('categoryId').optional().isInt().withMessage('Category ID must be an integer')
  ],
  validate,
  checkRestaurantOwnership,
  createMenuItem
);

router.put(
  '/:id',
  authenticateToken,
  authorizeRoles('restaurant_owner', 'admin'),
  [
    param('id').isInt().withMessage('Invalid menu item ID'),
    body('name').optional().trim().notEmpty().isLength({ max: 100 }),
    body('description').optional().isString(),
    body('price').optional().isFloat({ min: 0.01 }),
    body('imageUrl').optional().isURL(),
    body('available').optional().isBoolean(),
    body('categoryId').optional().isInt()
  ],
  validate,
  checkMenuItemOwnership,
  updateMenuItem
);

router.delete(
  '/:id',
  authenticateToken,
  authorizeRoles('restaurant_owner', 'admin'),
  [
    param('id').isInt().withMessage('Invalid menu item ID')
  ],
  validate,
  checkMenuItemOwnership,
  deleteMenuItem
);

module.exports = router;
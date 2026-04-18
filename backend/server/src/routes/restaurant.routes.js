const router = require('express').Router();
const { body, param, query } = require('express-validator');
const {
  createRestaurant,
  getRestaurants,
  getRestaurantById,
  updateRestaurantStatus,
  getMyRestaurants
} = require('../controllers/restaurant.controller');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');

// Public routes
router.get(
  '/',
  [
    query('status').optional().isIn(['pending', 'approved', 'suspended']).withMessage('Invalid status filter'),
    query('cuisineType').optional().isString()
  ],
  validate,
  getRestaurants
);

router.get(
  '/:id',
  [
    param('id').isInt().withMessage('Invalid restaurant ID')
  ],
  validate,
  getRestaurantById
);

// Protected routes
router.get(
  '/owner/me',
  authenticateToken,
  authorizeRoles('restaurant_owner', 'admin'),
  getMyRestaurants
);

router.post(
  '/',
  authenticateToken,
  authorizeRoles('restaurant_owner', 'admin'),
  [
    body('name').trim().notEmpty().withMessage('Restaurant name is required').isLength({ max: 100 }),
    body('photoUrl').optional().isURL().withMessage('Photo URL must be a valid URL'),
    body('address').trim().notEmpty().withMessage('Address is required').isLength({ max: 200 }),
    body('cuisineType').trim().notEmpty().withMessage('Cuisine type is required').isLength({ max: 50 })
  ],
  validate,
  createRestaurant
);

router.patch(
  '/:id/status',
  authenticateToken,
  authorizeRoles('admin'),
  [
    param('id').isInt().withMessage('Invalid restaurant ID'),
    body('status')
      .notEmpty().withMessage('Status is required')
      .isIn(['pending', 'approved', 'suspended']).withMessage('Invalid status')
  ],
  validate,
  updateRestaurantStatus
);

module.exports = router;
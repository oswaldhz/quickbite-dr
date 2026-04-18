const router = require('express').Router();
const { body, param, query } = require('express-validator');
const {
  createOrder,
  getMyOrders,
  getRestaurantOrders,
  getOrderById,
  updateOrderStatus
} = require('../controllers/order.controller');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth.middleware');
const { checkRestaurantOwnership, checkOrderAccess } = require('../middlewares/ownership.middleware');
const validate = require('../middlewares/validate.middleware');

// Customer routes
router.post(
  '/',
  authenticateToken,
  authorizeRoles('customer'),
  [
    body('restaurantId').isInt().withMessage('Valid restaurant ID is required'),
    body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
    body('items.*.menuItemId').isInt().withMessage('Each item must have a valid menuItemId'),
    body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1')
  ],
  validate,
  createOrder
);

router.get(
  '/me',
  authenticateToken,
  authorizeRoles('customer'),
  getMyOrders
);

// Restaurant owner routes
router.get(
  '/restaurant/:restaurantId',
  authenticateToken,
  authorizeRoles('restaurant_owner', 'admin'),
  [
    param('restaurantId').isInt().withMessage('Invalid restaurant ID'),
    query('status').optional().isIn([
      'pending', 'confirmed', 'preparing', 'ready',
      'out_for_delivery', 'delivered', 'cancelled'
    ]).withMessage('Invalid status filter')
  ],
  validate,
  checkRestaurantOwnership,
  getRestaurantOrders
);

// Shared routes with access control
router.get(
  '/:id',
  authenticateToken,
  [
    param('id').isInt().withMessage('Invalid order ID')
  ],
  validate,
  checkOrderAccess,
  getOrderById
);

router.patch(
  '/:id/status',
  authenticateToken,
  [
    param('id').isInt().withMessage('Invalid order ID'),
    body('status')
      .notEmpty().withMessage('Status is required')
      .isIn([
        'pending', 'confirmed', 'preparing', 'ready',
        'out_for_delivery', 'delivered', 'cancelled'
      ]).withMessage('Invalid status')
  ],
  validate,
  checkOrderAccess,
  updateOrderStatus
);

module.exports = router;
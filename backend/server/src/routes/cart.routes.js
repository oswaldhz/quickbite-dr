const router = require('express').Router();
const { body, param } = require('express-validator');
const {
  getCart,
  addItem,
  updateItem,
  removeItem,
  clearCart
} = require('../controllers/cart.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');

router.use(authenticateToken);

router.get('/', getCart);

router.post(
  '/items',
  [
    body('menuItemId').isInt().withMessage('Valid menu item ID is required'),
    body('quantity').optional().isInt({ min: 1 }).withMessage('Quantity must be at least 1')
  ],
  validate,
  addItem
);

router.patch(
  '/items/:menuItemId',
  [
    param('menuItemId').isInt().withMessage('Invalid menu item ID'),
    body('quantity').isInt({ min: 0 }).withMessage('Quantity must be 0 or greater')
  ],
  validate,
  updateItem
);

router.delete(
  '/items/:menuItemId',
  [
    param('menuItemId').isInt().withMessage('Invalid menu item ID')
  ],
  validate,
  removeItem
);

router.delete('/', clearCart);

module.exports = router;
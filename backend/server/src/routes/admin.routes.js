const router = require('express').Router();
const { body, param, query } = require('express-validator');
const {
  getDashboardStats,
  getAllRestaurantsAdmin,
  getAllUsersAdmin,
  updateUserRole
} = require('../controllers/admin.controller');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');

// All routes require admin authentication
router.use(authenticateToken, authorizeRoles('admin'));

router.get(
  '/stats',
  getDashboardStats
);

router.get(
  '/restaurants',
  [
    query('status').optional().isIn(['pending', 'approved', 'suspended']).withMessage('Invalid status filter')
  ],
  validate,
  getAllRestaurantsAdmin
);

router.get(
  '/users',
  getAllUsersAdmin
);

router.patch(
  '/users/:userId/role',
  [
    param('userId').isInt().withMessage('Invalid user ID'),
    body('role')
      .notEmpty().withMessage('Role is required')
      .isIn(['customer', 'restaurant_owner', 'admin']).withMessage('Invalid role')
  ],
  validate,
  updateUserRole
);

module.exports = router;
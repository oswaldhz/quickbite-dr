const { Restaurant, MenuItem, Order } = require('../models');
const AppError = require('../utils/AppError');

/**
 * Verify that the authenticated user owns the restaurant being accessed
 */
const checkRestaurantOwnership = async (req, res, next) => {
  try {
    const restaurantId = req.params.restaurantId || req.body.restaurantId;
    if (!restaurantId) {
      throw new AppError('Restaurant ID is required', 400);
    }

    const restaurant = await Restaurant.findByPk(restaurantId);
    if (!restaurant) {
      throw new AppError('Restaurant not found', 404);
    }

    // Admin bypass
    if (req.user.role === 'admin') {
      req.restaurant = restaurant;
      return next();
    }

    if (restaurant.ownerId !== req.user.id) {
      throw new AppError('You do not own this restaurant', 403);
    }

    req.restaurant = restaurant;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Verify that the authenticated user owns the menu item's restaurant
 */
const checkMenuItemOwnership = async (req, res, next) => {
  try {
    const menuItem = await MenuItem.findByPk(req.params.id, {
      include: [{ model: Restaurant, as: 'restaurant', attributes: ['ownerId'] }]
    });

    if (!menuItem) {
      throw new AppError('Menu item not found', 404);
    }

    if (req.user.role === 'admin') {
      req.menuItem = menuItem;
      return next();
    }

    if (menuItem.restaurant.ownerId !== req.user.id) {
      throw new AppError('You do not have permission to modify this menu item', 403);
    }

    req.menuItem = menuItem;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Verify that the authenticated user owns the order's restaurant (for restaurant owners)
 * or is the customer who placed the order (for customers)
 */
const checkOrderAccess = async (req, res, next) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [{ model: Restaurant, as: 'restaurant', attributes: ['ownerId'] }]
    });

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    // Admin bypass
    if (req.user.role === 'admin') {
      req.order = order;
      return next();
    }

    // Restaurant owner: must own the restaurant
    if (req.user.role === 'restaurant_owner') {
      if (order.restaurant.ownerId !== req.user.id) {
        throw new AppError('You do not have access to this order', 403);
      }
      req.order = order;
      return next();
    }

    // Customer: must be the order owner
    if (req.user.role === 'customer') {
      if (order.customerId !== req.user.id) {
        throw new AppError('You do not have access to this order', 403);
      }
      req.order = order;
      return next();
    }

    throw new AppError('Unauthorized', 403);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  checkRestaurantOwnership,
  checkMenuItemOwnership,
  checkOrderAccess
};
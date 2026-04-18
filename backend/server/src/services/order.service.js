const { Order, OrderItem, MenuItem, Restaurant, User } = require('../models');
const AppError = require('../utils/AppError');
const sequelize = require('../config/db');

const createOrder = async (customerId, restaurantId, items) => {
  // Start a transaction
  const transaction = await sequelize.transaction();

  try {
    // Verify restaurant exists and is approved
    const restaurant = await Restaurant.findByPk(restaurantId);
    if (!restaurant) {
      throw new AppError('Restaurant not found', 404);
    }
    if (restaurant.status !== 'approved') {
      throw new AppError('Restaurant is not accepting orders at the moment', 400);
    }

    // Calculate total and prepare order items
    let total = 0;
    const orderItemsData = [];

    for (const item of items) {
      const menuItem = await MenuItem.findByPk(item.menuItemId);
      if (!menuItem) {
        throw new AppError(`Menu item with ID ${item.menuItemId} not found`, 404);
      }
      if (menuItem.restaurantId !== restaurantId) {
        throw new AppError(`Menu item ${menuItem.name} does not belong to this restaurant`, 400);
      }
      if (!menuItem.available) {
        throw new AppError(`Menu item ${menuItem.name} is currently unavailable`, 400);
      }

      const quantity = item.quantity;
      if (quantity < 1) {
        throw new AppError('Quantity must be at least 1', 400);
      }

      const itemTotal = parseFloat(menuItem.price) * quantity;
      total += itemTotal;

      orderItemsData.push({
        menuItemId: menuItem.id,
        quantity,
        price: menuItem.price
      });
    }

    // Create the order
    const order = await Order.create({
      customerId,
      restaurantId,
      total,
      status: 'pending'
    }, { transaction });

    // Create order items
    await OrderItem.bulkCreate(
      orderItemsData.map(item => ({ ...item, orderId: order.id })),
      { transaction }
    );

    await transaction.commit();

    // Fetch the complete order with associations
    const fullOrder = await Order.findByPk(order.id, {
      include: [
        { model: OrderItem, as: 'items', include: [{ model: MenuItem, as: 'menuItem' }] },
        { model: Restaurant, as: 'restaurant', attributes: ['id', 'name'] },
        { model: User, as: 'customer', attributes: ['id', 'name', 'email'] }
      ]
    });

    return fullOrder;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const getOrderById = async (orderId) => {
  const order = await Order.findByPk(orderId, {
    include: [
      { model: OrderItem, as: 'items', include: [{ model: MenuItem, as: 'menuItem' }] },
      { model: Restaurant, as: 'restaurant', attributes: ['id', 'name'] },
      { model: User, as: 'customer', attributes: ['id', 'name', 'email'] }
    ]
  });

  if (!order) {
    throw new AppError('Order not found', 404);
  }
  return order;
};

const getMyOrders = async (customerId) => {
  const orders = await Order.findAll({
    where: { customerId },
    include: [
      { model: OrderItem, as: 'items', include: [{ model: MenuItem, as: 'menuItem' }] },
      { model: Restaurant, as: 'restaurant', attributes: ['id', 'name', 'photoUrl'] }
    ],
    order: [['createdAt', 'DESC']]
  });
  return orders;
};

const getRestaurantOrders = async (restaurantId, filters = {}) => {
  const where = { restaurantId };
  if (filters.status) where.status = filters.status;

  const orders = await Order.findAll({
    where,
    include: [
      { model: OrderItem, as: 'items', include: [{ model: MenuItem, as: 'menuItem' }] },
      { model: User, as: 'customer', attributes: ['id', 'name', 'email'] }
    ],
    order: [['createdAt', 'DESC']]
  });
  return orders;
};

const updateOrderStatus = async (orderId, status, userId, userRole) => {
  const order = await Order.findByPk(orderId, {
    include: [{ model: Restaurant, as: 'restaurant' }]
  });

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  // Validate status transition based on role
  const validStatuses = {
    restaurant_owner: ['pending', 'confirmed', 'preparing', 'ready', 'cancelled'],
    admin: ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'],
    customer: ['cancelled'] // Customers can only cancel their own orders
  };

  if (!validStatuses[userRole]?.includes(status)) {
    throw new AppError('You are not authorized to set this status', 403);
  }

  // Additional check: customers can only cancel their own orders
  if (userRole === 'customer' && order.customerId !== userId) {
    throw new AppError('You can only cancel your own orders', 403);
  }

  // Prevent cancelling already delivered orders
  if (status === 'cancelled' && ['delivered', 'cancelled'].includes(order.status)) {
    throw new AppError(`Cannot cancel order that is already ${order.status}`, 400);
  }

  order.status = status;
  await order.save();

  // Fetch updated order with associations
  const updatedOrder = await Order.findByPk(orderId, {
    include: [
      { model: OrderItem, as: 'items', include: [{ model: MenuItem, as: 'menuItem' }] },
      { model: Restaurant, as: 'restaurant', attributes: ['id', 'name'] },
      { model: User, as: 'customer', attributes: ['id', 'name', 'email'] }
    ]
  });

  return updatedOrder;
};

module.exports = {
  createOrder,
  getOrderById,
  getMyOrders,
  getRestaurantOrders,
  updateOrderStatus
};
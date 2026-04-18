const orderService = require('../services/order.service');

const createOrder = async (req, res, next) => {
  try {
    const { restaurantId, items } = req.body;
    const order = await orderService.createOrder(req.user.id, restaurantId, items);

    // Emit socket event
    const io = req.app.get('io');
    io.to(`restaurant-${restaurantId}`).emit('order:new', order);

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: order
    });
  } catch (error) {
    next(error);
  }
};

const getMyOrders = async (req, res, next) => {
  try {
    const orders = await orderService.getMyOrders(req.user.id);
    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

const getRestaurantOrders = async (req, res, next) => {
  try {
    const orders = await orderService.getRestaurantOrders(req.params.restaurantId, req.query);
    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const order = await orderService.getOrderById(req.params.id);
    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const order = await orderService.updateOrderStatus(
      req.params.id,
      status,
      req.user.id,
      req.user.role
    );

    // Emit socket event
    const io = req.app.get('io');
    io.to(`restaurant-${order.restaurantId}`).emit('order:updated', order);
    io.to(`user-${order.customerId}`).emit('order:updated', order);

    res.json({
      success: true,
      message: 'Order status updated',
      data: order
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getRestaurantOrders,
  getOrderById,
  updateOrderStatus
};
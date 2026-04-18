const { Restaurant, Order, User, sequelize } = require('../models');
const AppError = require('../utils/AppError');

const getDashboardStats = async () => {
  const totalRestaurants = await Restaurant.count();
  const totalUsers = await User.count();
  const totalOrders = await Order.count();

  const orders = await Order.findAll({
    attributes: [[sequelize.fn('SUM', sequelize.col('total')), 'totalRevenue']],
    where: { status: 'delivered' },
    raw: true
  });

  const revenue = parseFloat(orders[0].totalRevenue) || 0;

  const recentOrders = await Order.findAll({
    limit: 5,
    order: [['createdAt', 'DESC']],
    include: [
      { model: User, as: 'customer', attributes: ['id', 'name'] },
      { model: Restaurant, as: 'restaurant', attributes: ['id', 'name'] }
    ]
  });

  const restaurantsByStatus = await Restaurant.findAll({
    attributes: ['status', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
    group: ['status']
  });

  return {
    totalRestaurants,
    totalUsers,
    totalOrders,
    revenue,
    recentOrders,
    restaurantsByStatus
  };
};

const getAllRestaurantsAdmin = async (filters = {}) => {
  const where = {};
  if (filters.status) where.status = filters.status;

  const restaurants = await Restaurant.findAll({
    where,
    include: [{ model: User, as: 'owner', attributes: ['id', 'name', 'email'] }],
    order: [['createdAt', 'DESC']]
  });
  return restaurants;
};

const getAllUsersAdmin = async () => {
  const users = await User.findAll({
    attributes: ['id', 'name', 'email', 'role', 'createdAt'],
    order: [['createdAt', 'DESC']]
  });
  return users;
};

const updateUserRole = async (userId, role) => {
  const user = await User.findByPk(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  if (!['customer', 'restaurant_owner', 'admin'].includes(role)) {
    throw new AppError('Invalid role', 400);
  }

  user.role = role;
  await user.save();
  return user;
};

module.exports = {
  getDashboardStats,
  getAllRestaurantsAdmin,
  getAllUsersAdmin,
  updateUserRole
};
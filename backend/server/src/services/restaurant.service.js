const { Restaurant, User, MenuItem, Category } = require('../models');
const AppError = require('../utils/AppError');

const createRestaurant = async (restaurantData, ownerId) => {
  const restaurant = await Restaurant.create({
    ...restaurantData,
    ownerId
  });
  return restaurant;
};

const getAllRestaurants = async (filters = {}) => {
  const where = {};
  if (filters.status) where.status = filters.status;
  if (filters.cuisineType) where.cuisineType = filters.cuisineType;

  const restaurants = await Restaurant.findAll({
    where,
    include: [
      {
        model: User,
        as: 'owner',
        attributes: ['id', 'name', 'email']
      }
    ],
    order: [['createdAt', 'DESC']]
  });
  return restaurants;
};

const getRestaurantById = async (id) => {
  const restaurant = await Restaurant.findByPk(id, {
    include: [
      {
        model: User,
        as: 'owner',
        attributes: ['id', 'name', 'email']
      },
      {
        model: MenuItem,
        as: 'menuItems',
        include: [{ model: Category, as: 'category' }]
      }
    ]
  });

  if (!restaurant) {
    throw new AppError('Restaurant not found', 404);
  }
  return restaurant;
};

const updateRestaurantStatus = async (id, status) => {
  const restaurant = await Restaurant.findByPk(id);
  if (!restaurant) {
    throw new AppError('Restaurant not found', 404);
  }

  restaurant.status = status;
  await restaurant.save();
  return restaurant;
};

const getRestaurantsByOwner = async (ownerId) => {
  const restaurants = await Restaurant.findAll({
    where: { ownerId },
    include: [{ model: User, as: 'owner', attributes: ['id', 'name', 'email'] }]
  });
  return restaurants;
};

module.exports = {
  createRestaurant,
  getAllRestaurants,
  getRestaurantById,
  updateRestaurantStatus,
  getRestaurantsByOwner
};
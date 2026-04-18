const restaurantService = require('../services/restaurant.service');

const createRestaurant = async (req, res, next) => {
  try {
    const restaurant = await restaurantService.createRestaurant(req.body, req.user.id);
    res.status(201).json({
      success: true,
      message: 'Restaurant created successfully',
      data: restaurant
    });
  } catch (error) {
    next(error);
  }
};

const getRestaurants = async (req, res, next) => {
  try {
    const restaurants = await restaurantService.getAllRestaurants(req.query);
    res.json({
      success: true,
      data: restaurants
    });
  } catch (error) {
    next(error);
  }
};

const getRestaurantById = async (req, res, next) => {
  try {
    const restaurant = await restaurantService.getRestaurantById(req.params.id);
    res.json({
      success: true,
      data: restaurant
    });
  } catch (error) {
    next(error);
  }
};

const updateRestaurantStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const restaurant = await restaurantService.updateRestaurantStatus(req.params.id, status);
    res.json({
      success: true,
      message: 'Restaurant status updated',
      data: restaurant
    });
  } catch (error) {
    next(error);
  }
};

const getMyRestaurants = async (req, res, next) => {
  try {
    const restaurants = await restaurantService.getRestaurantsByOwner(req.user.id);
    res.json({
      success: true,
      data: restaurants
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRestaurant,
  getRestaurants,
  getRestaurantById,
  updateRestaurantStatus,
  getMyRestaurants
};
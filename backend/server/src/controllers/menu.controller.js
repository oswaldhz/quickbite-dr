const menuService = require('../services/menu.service');

const createMenuItem = async (req, res, next) => {
  try {
    const menuItem = await menuService.createMenuItem(req.body);
    res.status(201).json({
      success: true,
      message: 'Menu item created successfully',
      data: menuItem
    });
  } catch (error) {
    next(error);
  }
};

const getMenuItemsByRestaurant = async (req, res, next) => {
  try {
    const items = await menuService.getMenuItemsByRestaurant(req.params.restaurantId);
    res.json({
      success: true,
      data: items
    });
  } catch (error) {
    next(error);
  }
};

const updateMenuItem = async (req, res, next) => {
  try {
    const menuItem = await menuService.updateMenuItem(req.params.id, req.body);
    res.json({
      success: true,
      message: 'Menu item updated successfully',
      data: menuItem
    });
  } catch (error) {
    next(error);
  }
};

const deleteMenuItem = async (req, res, next) => {
  try {
    const result = await menuService.deleteMenuItem(req.params.id);
    res.json({
      success: true,
      message: result.message
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createMenuItem,
  getMenuItemsByRestaurant,
  updateMenuItem,
  deleteMenuItem
};